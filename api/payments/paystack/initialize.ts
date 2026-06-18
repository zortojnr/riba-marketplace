import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseAdmin } from '../../_lib/supabaseAdmin';

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// Starts a Paystack transaction for an order that was already inserted by
// the client via direct Supabase access (RLS-scoped insert). This endpoint
// only ever reads the order's amount/currency from Supabase itself - it
// never trusts an amount supplied by the client - and holds the Paystack
// secret key server-side.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return res.status(500).json({ error: 'Payment provider is not configured' });
  }

  const { orderId } = req.body ?? {};
  if (!orderId || typeof orderId !== 'string') {
    return res.status(400).json({ error: 'orderId is required' });
  }

  const appUrl = process.env.APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);
  if (!appUrl) {
    return res.status(500).json({ error: 'APP_URL is not configured' });
  }

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch {
    return res.status(500).json({ error: 'Payment backend is not configured' });
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id, total, currency, customer_email, payment_status')
    .eq('id', orderId)
    .maybeSingle();

  if (orderError) {
    return res.status(500).json({ error: 'Failed to load order' });
  }
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  if (order.payment_status === 'paid') {
    return res.status(409).json({ error: 'Order is already paid' });
  }
  if (!order.customer_email) {
    return res.status(400).json({ error: 'This order has no customer email on file; Paystack requires one' });
  }

  const paystackRes = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: order.customer_email,
      amount: Math.round(Number(order.total) * 100),
      currency: order.currency,
      callback_url: `${appUrl}/checkout?orderId=${order.id}`,
      metadata: { order_id: order.id },
    }),
  });

  const paystackData = await paystackRes.json();

  if (!paystackRes.ok || !paystackData.status) {
    return res.status(502).json({ error: paystackData.message || 'Failed to initialize payment with Paystack' });
  }

  const { authorization_url: authorizationUrl, reference } = paystackData.data;

  const { error: updateError } = await supabase
    .from('orders')
    .update({ payment_reference: reference })
    .eq('id', order.id);

  if (updateError) {
    return res.status(500).json({ error: 'Failed to record payment reference' });
  }

  return res.status(200).json({ authorizationUrl, reference });
}
