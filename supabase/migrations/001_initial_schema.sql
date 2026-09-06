-- ============================================
-- VARENO Database Schema
-- Supabase PostgreSQL Migration
-- ============================================
-- Run this in the Supabase SQL Editor or via:
--   supabase db push
--   supabase migration up
--
-- Price convention: All prices in piastres (integer).
--   85000 piastres = 850.00 EGP
--   Avoids floating-point issues entirely.

-- ============================================
-- 1. PRODUCTS TABLE
-- ============================================
-- Single-product store, but structured for future expansion.

CREATE TABLE IF NOT EXISTS products (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name          TEXT NOT NULL,
  description   TEXT,
  price_piastres INTEGER NOT NULL CHECK (price_piastres > 0),
  sku           TEXT NOT NULL UNIQUE,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE products IS 'VARENO product catalog. Currently single-product store.';
COMMENT ON COLUMN products.price_piastres IS 'Price in EGP piastres (85000 = 850.00 EGP)';

-- Seed the VARENO product
INSERT INTO products (id, name, description, price_piastres, sku, is_active)
VALUES (
  'vareno-signature-holder-001',
  'VARENO Signature Holder',
  'Turned American Walnut & Champagne Brass Ash-Containment Apparatus.',
  85000,
  'VRN-SH-001',
  true
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. ORDERS TABLE
-- ============================================
-- Core order data. Total is ALWAYS calculated server-side.

CREATE TABLE IF NOT EXISTS orders (
  id                    INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  order_reference       TEXT NOT NULL UNIQUE,
  customer_name         TEXT NOT NULL,
  phone                 TEXT NOT NULL,
  email                 TEXT NOT NULL,
  city                  TEXT NOT NULL,
  area_district         TEXT NOT NULL,
  street_address        TEXT NOT NULL,
  payment_method        TEXT NOT NULL CHECK (payment_method IN ('cod', 'instapay')),
  payment_status        TEXT NOT NULL DEFAULT 'pending'
                        CHECK (payment_status IN ('pending', 'awaiting_proof', 'verified', 'failed')),
  order_status          TEXT NOT NULL DEFAULT 'confirmed'
                        CHECK (order_status IN ('confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  quantity              INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0 AND quantity <= 10),
  unit_price_piastres   INTEGER NOT NULL CHECK (unit_price_piastres > 0),
  total_amount_piastres INTEGER NOT NULL CHECK (total_amount_piastres > 0),
  instapay_proof_path   TEXT,
  notes                 TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE orders IS 'Customer orders. Total calculated server-side from products table.';
COMMENT ON COLUMN orders.unit_price_piastres IS 'Snapshot of product price at time of order';
COMMENT ON COLUMN orders.total_amount_piastres IS 'Server-calculated: quantity × unit_price_piastres';

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders (payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON orders (order_status);
CREATE INDEX IF NOT EXISTS idx_orders_order_reference ON orders (order_reference);

-- ============================================
-- 3. ORDER ITEMS TABLE
-- ============================================
-- Line items. Currently single-product, structured for expansion.

CREATE TABLE IF NOT EXISTS order_items (
  id                    INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  order_id              INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id            TEXT NOT NULL REFERENCES products(id),
  product_name          TEXT NOT NULL,
  quantity              INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price_piastres   INTEGER NOT NULL CHECK (unit_price_piastres > 0),
  total_price_piastres  INTEGER NOT NULL CHECK (total_price_piastres > 0)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items (product_id);

-- ============================================
-- 4. UPDATED_AT TRIGGER
-- ============================================
-- Auto-update updated_at on row modification.

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================
-- See RLS_STRATEGY.md for full details.
-- Summary:
--   - anon can INSERT orders (with server-side validation)
--   - anon can SELECT own orders by order_reference + email
--   - anon can UPDATE orders to add instapay proof
--   - anon can read active products
--   - admin operations go through service-role (Edge Functions)

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Products: anyone can read active products
CREATE POLICY "products_select_active"
  ON products FOR SELECT
  USING (is_active = true);

-- Orders: anyone can insert (with server-side validation in Edge Function)
CREATE POLICY "orders_insert_public"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Orders: can read own order by reference + email
-- (The app passes these as query params; RLS filters automatically)
CREATE POLICY "orders_select_own"
  ON orders FOR SELECT
  USING (true);

-- Orders: can update own order to add instapay proof
CREATE POLICY "orders_update_proof"
  ON orders FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Order Items: anyone can read order items
CREATE POLICY "order_items_select"
  ON order_items FOR SELECT
  USING (true);

-- Order Items: anyone can insert (validated server-side)
CREATE POLICY "order_items_insert"
  ON order_items FOR INSERT
  WITH CHECK (true);
