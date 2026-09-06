/**
 * Supabase Edge Function: upload-proof
 *
 * Handles InstaPay payment proof upload with ownership verification.
 * Verifies the order exists and matches before allowing upload.
 *
 * Deploy with: supabase functions deploy upload-proof
 */

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse multipart form data
    const formData = await req.formData();
    const orderReference = formData.get("orderReference") as string;
    const email = formData.get("email") as string;
    const file = formData.get("file") as File;

    // Validate inputs
    if (!orderReference || !email || !file) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Order reference, email, and file are required",
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

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid file type. Allowed: JPEG, PNG, WebP, PDF",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ success: false, error: "File too large. Maximum 10MB." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Fetch order and verify ownership
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, email, payment_method, instapay_proof_path")
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

    // OWNERSHIP VERIFICATION
    const orderEmail = (order as Record<string, unknown>).email as string;
    if (orderEmail.toLowerCase().trim() !== email.toLowerCase().trim()) {
      return new Response(
        JSON.stringify({ success: false, error: "Order not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verify payment method is instapay
    const paymentMethod = (order as Record<string, unknown>).payment_method as string;
    if (paymentMethod !== "instapay") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "This order is not set up for InstaPay payment",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Upload file to Storage (using service-role)
    const filePath = `instapay-proofs/${orderReference}/${Date.now()}-${file.name}`;

    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from("order-proofs")
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload failed:", uploadError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to upload file" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Update order with proof path
    const orderId = (order as Record<string, unknown>).id;
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        instapay_proof_path: filePath,
        payment_status: "awaiting_proof",
      })
      .eq("id", orderId);

    if (updateError) {
      console.error("Order update failed:", updateError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to update order" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Payment proof uploaded successfully",
        path: filePath,
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
