import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { getSupabaseAdmin } from '../../_lib/supabaseAdmin';
import { readRawBody } from '../../_lib/rawBody';

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// Paystack webhook receiver. Verifies the request actually came from
// Paystack (HMAC signature over the raw body), then re-verifies the
// transaction directly against Paystack's API before trusting anything in
// the payload - the webhook body alone is never enough to mark an order
// paid. Always acks with 200 once the signature check passes, so Paystack
// doesn't retry-storm us over conditions we've already logged and given up
// on (missing order, amount mismatch, etc).
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    console.error('PAYSTACK_SECRET_KEY is not configured');
    return res.status(500).end();
  }

  const rawBody = await readRawBody(req);
  const signature = req.headers['x-paystack-signature'];
  const expectedSignature = crypto.createHmac('sha512', secretKey).update(rawBody).digest('hex');

  if (signature !== expectedSignature) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const event = JSON.parse(rawBody.toString('utf8'));

  if (event.event !== 'charge.success') {
    return res.status(200).json({ received: true });
  }

  const reference = event.data?.reference;
  const orderId = event.data?.metadata?.order_id;
  if (!reference) {
    return res.status(200).json({ received: true });
  }

  const verifyRes = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secretKey}` },
  });
  const verifyData = await verifyRes.json();

  if (!verifyRes.ok || !verifyData.status || verifyData.data?.status !== 'success') {
    console.error('Paystack verify failed for reference', reference);
    return res.status(200).json({ received: true });
  }

  const supabase = getSupabaseAdmin();

  const { data: order, error: orderError } = orderId
    ? await supabase.from('orders').select('id, total, currency').eq('id', orderId).maybeSingle()
    : await supabase.from('orders').select('id, total, currency').eq('payment_reference', reference).maybeSingle();

  if (orderError || !order) {
    console.error('Could not find order for Paystack reference', reference);
    return res.status(200).json({ received: true });
  }

  const expectedAmount = Math.round(Number(order.total) * 100);
  if (verifyData.data.amount !== expectedAmount || verifyData.data.currency !== order.currency) {
    console.error('Paystack verify amount/currency mismatch for order', order.id);
    return res.status(200).json({ received: true });
  }

  await supabase
    .from('orders')
    .update({ payment_status: 'paid', payment_reference: reference })
    .eq('id', order.id);

  return res.status(200).json({ received: true });
}
