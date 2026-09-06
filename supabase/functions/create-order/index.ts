/**
 * Supabase Edge Function: create-order
 *
 * Secure server-side order creation.
 * This function:
 * 1. Validates all input fields
 * 2. Fetches product price from the products table
 * 3. Calculates order total server-side (never trusts browser)
 * 4. Generates unique order reference
 * 5. Inserts order + order items
 * 6. Returns confirmation
 *
 * Deploy with: supabase functions deploy create-order
 *
 * Environment variables required in Supabase:
 * - SUPABASE_URL (auto-set)
 * - SUPABASE_ANON_KEY (auto-set)
 * - SUPABASE_SERVICE_ROLE_KEY (auto-set)
 */

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("APP_ORIGIN") || "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderRequest {
  customerName: string;
  phone: string;
  email: string;
  city: string;
  areaDistrict: string;
  streetAddress: string;
  paymentMethod: "cod" | "instapay";
  instapaySenderName?: string;
  quantity: number;
}

function generateOrderReference(): string {
  const digits = Math.floor(100000 + Math.random() * 900000);
  return `VRN-${digits}`;
}

function validateInput(data: OrderRequest): string[] {
  const errors: string[] = [];

  if (!data.customerName || data.customerName.trim().length < 2) {
    errors.push("Valid full name is required");
  }
  if (!data.phone || !/^(\+20|0020|0)?1[0125]\d{8}$/.test(data.phone.replace(/[\s\-()]/g, ""))) {
    errors.push("Valid Egyptian phone number is required");
  }
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Valid email address is required");
  }
  if (!data.city || data.city.trim().length < 2) {
    errors.push("City is required");
  }
  if (!data.areaDistrict || data.areaDistrict.trim().length < 2) {
    errors.push("Area / District is required");
  }
  if (!data.streetAddress || data.streetAddress.trim().length < 5) {
    errors.push("Street address is required");
  }
  if (!["cod", "instapay"].includes(data.paymentMethod)) {
    errors.push("Valid payment method is required");
  }
  if (!data.quantity || data.quantity < 1 || data.quantity > 10) {
    errors.push("Quantity must be between 1 and 10");
  }
  if (
    data.paymentMethod === "instapay" &&
    (!data.instapaySenderName || data.instapaySenderName.trim().length < 2)
  ) {
    errors.push("InstaPay sender name is required for InstaPay payments");
  }

  return errors;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role for DB operations
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const data: OrderRequest = await req.json();

    // Validate input
    const validationErrors = validateInput(data);
    if (validationErrors.length > 0) {
      return new Response(
        JSON.stringify({ success: false, error: validationErrors.join("; ") }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Fetch product price from database (SERVER-SIDE — never trust browser)
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, name, price_piastres")
      .eq("is_active", true)
      .limit(1)
      .single();

    if (productError || !product) {
      return new Response(
        JSON.stringify({ success: false, error: "Product not available" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Calculate total server-side
    const unitPrice = product.price_piastres;
    const totalAmount = unitPrice * data.quantity;

    // Generate order reference
    const orderReference = generateOrderReference();

    // Insert order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_reference: orderReference,
        customer_name: data.customerName.trim(),
        phone: data.phone.trim(),
        email: data.email.trim().toLowerCase(),
        city: data.city.trim(),
        area_district: data.areaDistrict.trim(),
        street_address: data.streetAddress.trim(),
        payment_method: data.paymentMethod,
        payment_status: data.paymentMethod === "cod" ? "pending" : "awaiting_proof",
        order_status: "confirmed",
        quantity: data.quantity,
        unit_price_piastres: unitPrice,
        total_amount_piastres: totalAmount,
        instapay_sender_name:
          data.paymentMethod === "instapay"
            ? (data.instapaySenderName?.trim() ?? null)
            : null,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order insert failed:", orderError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to create order" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Insert order item
    const { error: itemError } = await supabase.from("order_items").insert({
      order_id: order.id,
      product_id: product.id,
      product_name: product.name,
      quantity: data.quantity,
      unit_price_piastres: unitPrice,
      total_price_piastres: totalAmount,
    });

    if (itemError) {
      console.error("Order item insert failed:", itemError);
      // Order was created but item failed — log for manual resolution
    }

    return new Response(
      JSON.stringify({
        success: true,
        orderReference,
        message: "Order created successfully",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
