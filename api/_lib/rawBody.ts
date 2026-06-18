import type { IncomingMessage } from 'http';

// Paystack's webhook signature is computed over the exact raw request
// bytes they sent. Vercel's req.body getter re-parses/re-serializes JSON,
// which can produce different bytes (key order, whitespace) and break the
// signature check - so we read the stream ourselves before anything else
// touches req.body.
export function readRawBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}
