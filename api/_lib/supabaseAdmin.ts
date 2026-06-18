import { createClient } from '@supabase/supabase-js';

// Service-role client for serverless functions only. SUPABASE_SERVICE_ROLE_KEY
// has no VITE_ prefix on purpose - Vite only inlines VITE_-prefixed vars into
// the client bundle, so this name can never accidentally ship to the browser.
// Reuses VITE_SUPABASE_URL for the project URL since that value isn't secret.
export function getSupabaseAdmin() {
  const url = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
