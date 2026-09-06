/**
 * Supabase Edge Function: get-order
 *
 * Fetches order details with ownership verification.
 * Requires order_reference + email to verify the requester owns the order.
 *
 * Deploy with: supabase functions deploy get-order
 */

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request — can be GET (query params) or POST (body)
    let orderReference: string;
    let email: string;

    if (req.method === "GET") {
      const url = new URL(req.url);
      orderReference = url.searchParams.get("ref") || "";
      email = url.searchParams.get("email") || "";
    } else {
      const body = await req.json();
      orderReference = body.orderReference || "";
      email = body.email || "";
    }

    // Validate inputs
    if (!orderReference || !email) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Order reference and email are required",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate order reference format
    if (!/^VRN-\d{6}$/.test(orderReference)) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid order reference format" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Fetch order — service-role bypasses RLS
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("order_reference", orderReference)
      .single();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ success: false, error: "Order not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // OWNERSHIP VERIFICATION: email must match
    const orderEmail = (order as Record<string, unknown>).email as string;
    if (orderEmail.toLowerCase().trim() !== email.toLowerCase().trim()) {
      // Return generic "not found" to prevent email enumeration
      return new Response(
        JSON.stringify({ success: false, error: "Order not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Fetch order items
    const orderId = (order as Record<string, unknown>).id;
    const { data: items } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

    return new Response(
      JSON.stringify({
        success: true,
        order,
        items: items || [],
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
