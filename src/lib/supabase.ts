/**
 * VARENO Supabase Client Configuration
 *
 * Uses the PUBLIC anon key only — never the service-role key.
 * Security is enforced through Supabase Row Level Security (RLS).
 *
 * NOTE: Database types will be auto-generated when connected to a real
 * Supabase project via: supabase gen types typescript --local
 * For now, we use the hand-crafted types as a reference.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local"
  );
}

/**
 * Supabase client — public anon key only.
 * Used for all client-side reads and writes.
 * RLS policies control what this client can access.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
