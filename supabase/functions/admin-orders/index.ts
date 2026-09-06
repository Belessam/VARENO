/**
 * Supabase Edge Function: admin-orders
 *
 * Admin-only order management with authentication.
 * Uses service-role key for DB operations AFTER verifying caller is authenticated admin.
 *
 * All requests use POST with _action in body:
 *   { _action: "list", search?, status?, payment?, method?, sort? }
 *   { _action: "get", id }
 *   { _action: "update", orderId, orderStatus?, paymentStatus? }
 *
 * Deploy with: supabase functions deploy admin-orders
 */

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("APP_ORIGIN") || "*",
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
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // --- Step 1: Verify the caller is authenticated ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    // Create a client with the user's JWT to verify identity
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const {
      data: { user },
      error: authError,
    } = await userClient.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // --- Step 2: Verify the user has admin role ---
    const { data: profile, error: profileError } = await userClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile || profile.role !== "admin") {
      return new Response(
        JSON.stringify({ success: false, error: "Forbidden" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // --- Step 3: Authenticated admin confirmed — use service-role for DB ops ---
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const action = body._action || "list";

    // ---------- LIST ----------
    if (action === "list") {
      const search = body.search || "";
      const statusFilter = body.status || "";
      const paymentFilter = body.payment || "";
      const methodFilter = body.method || "";
      const sort = body.sort || "newest";

      let query = supabase.from("orders").select("*");

      if (search) {
        query = query.or(
          `order_reference.ilike.%${search}%,customer_name.ilike.%${search}%,phone.ilike.%${search}%`
        );
      }
      if (statusFilter) {
        query = query.eq("order_status", statusFilter);
      }
      if (paymentFilter) {
        query = query.eq("payment_status", paymentFilter);
      }
      if (methodFilter) {
        query = query.eq("payment_method", methodFilter);
      }

      query = query.order("created_at", { ascending: sort === "oldest" });

      const { data: orders, error } = await query;

      if (error) {
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data: allOrders } = await supabase
        .from("orders")
        .select("order_status, payment_status");

      const summary = {
        total: allOrders?.length || 0,
        new: allOrders?.filter((o) => o.order_status === "confirmed").length || 0,
        pendingPayment: allOrders?.filter((o) => o.payment_status === "pending" || o.payment_status === "awaiting_proof").length || 0,
        paid: allOrders?.filter((o) => o.payment_status === "verified").length || 0,
        completed: allOrders?.filter((o) => o.order_status === "delivered").length || 0,
      };

      return new Response(
        JSON.stringify({ success: true, orders: orders || [], summary }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ---------- GET SINGLE ----------
    if (action === "get") {
      const orderId = body.id;
      if (!orderId) {
        return new Response(
          JSON.stringify({ success: false, error: "Order ID is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (orderError || !order) {
        return new Response(
          JSON.stringify({ success: false, error: "Order not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data: items } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderId);

      return new Response(
        JSON.stringify({ success: true, order, items: items || [] }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ---------- UPDATE ----------
    if (action === "update") {
      const { orderId, orderStatus, paymentStatus } = body;

      if (!orderId) {
        return new Response(
          JSON.stringify({ success: false, error: "Order ID is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const updates: Record<string, string> = {};
      if (orderStatus) updates.order_status = orderStatus;
      if (paymentStatus) updates.payment_status = paymentStatus;

      if (Object.keys(updates).length === 0) {
        return new Response(
          JSON.stringify({ success: false, error: "No updates provided" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data, error } = await supabase
        .from("orders")
        .update(updates)
        .eq("id", orderId)
        .select()
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, order: data }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: "Unknown action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
