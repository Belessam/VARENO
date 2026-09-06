-- ============================================
-- VARENO Security Fix Migration
-- ============================================
-- This migration replaces the overly permissive RLS policies
-- from 001_initial_schema.sql with secure policies.
--
-- SECURITY AUDIT FINDINGS ADDRESSED:
-- Finding 1: orders SELECT exposed all customer PII → REMOVED
-- Finding 2: orders UPDATE allowed modifying any order → REMOVED
-- Finding 3: order_items INSERT allowed injection → REMOVED
-- Finding 4: order_items SELECT exposed all items → REMOVED
-- Finding 5: Client-side upload without ownership → FIXED (Edge Function only)
-- Finding 6: No Storage policies → ADDED (private bucket)
-- Finding 8: No ownership verification → FIXED (email verification in get-order)
--
-- ARCHITECTURE:
-- The anon client CANNOT directly read, write, or upload to orders,
-- order_items, or Storage. All order operations go through Edge Functions
-- which use the service-role key (bypasses RLS).
-- ============================================

-- ============================================
-- 1. DROP DANGEROUS POLICIES
-- ============================================

-- Orders table
DROP POLICY IF EXISTS "orders_select_own" ON orders;
DROP POLICY IF EXISTS "orders_update_proof" ON orders;
DROP POLICY IF EXISTS "orders_insert_public" ON orders;

-- Order items table
DROP POLICY IF EXISTS "order_items_insert" ON order_items;
DROP POLICY IF EXISTS "order_items_select" ON order_items;

-- ============================================
-- 2. TABLE RLS — DENY ALL CLIENT ACCESS
-- ============================================

-- ORDERS: No policies = all client access denied by default.
-- All operations go through Edge Functions (service-role bypasses RLS).

-- ORDER ITEMS: No policies = all client access denied by default.
-- Same as orders.

-- PRODUCTS: Keep the existing read-only policy from 001_initial_schema.sql.
-- products_select_active allows reading active products only. This is safe.

-- ============================================
-- 3. STORAGE POLICIES — order-proofs BUCKET
-- ============================================
-- The bucket must be created as PRIVATE in Supabase dashboard.
--
-- SECURITY: The anon client must NOT be able to upload directly.
-- All uploads go through the upload-proof Edge Function which uses
-- service-role (bypasses RLS) and verifies order ownership.
--
-- If no INSERT policy exists for anon/authenticated, Supabase
-- denies the upload by default.

-- NO INSERT policies for anon or authenticated.
-- This means: anon client CANNOT upload files directly.
-- The upload-proof Edge Function (service-role) bypasses RLS and can upload.

-- NO SELECT policies for anon or authenticated.
-- This means: anon client CANNOT read/download payment proofs.
-- Only service-role (Edge Functions / admin) can read.

-- Allow service-role to read (for admin panel / Edge Functions)
CREATE POLICY "order_proofs_select_service"
  ON storage.objects
  FOR SELECT
  TO service_role
  USING (bucket_id = 'order-proofs');

-- Allow service-role to delete (for admin cleanup)
CREATE POLICY "order_proofs_delete_service"
  ON storage.objects
  FOR DELETE
  TO service_role
  USING (bucket_id = 'order-proofs');
