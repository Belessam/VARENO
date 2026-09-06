-- ============================================
-- Add instapay_sender_name to orders table
-- Stores the name on the InstaPay account used for payment.
-- Only populated for instapay payment method orders.
-- ============================================

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS instapay_sender_name TEXT;

COMMENT ON COLUMN orders.instapay_sender_name IS 'Name registered on the InstaPay account used to send payment. Only for instapay orders.';
