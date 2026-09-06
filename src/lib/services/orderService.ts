/**
 * VARENO Order Service
 *
 * SECURITY ARCHITECTURE:
 * - All order READS go through Edge Functions (ownership verification)
 * - All order WRITES go through Edge Functions (server-side validation)
 * - The browser NEVER directly reads/writes orders or order_items tables
 * - The anon key can ONLY read the products table (via RLS)
 *
 * This eliminates the risk of:
 * - Reading other customers' orders
 * - Modifying other customers' orders
 * - Injecting fake order items
 * - Manipulating payment/order status
 */

import { supabase } from "@/lib/supabase";

/* ---- Product Operations (direct client read — safe via RLS) ---- */

/**
 * Fetch the active VARENO product.
 * Safe for direct client read — RLS restricts to is_active = true.
 */
export async function getActiveProduct() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .limit(1)
    .single();

  if (error) {
    console.error("Failed to fetch active product:", error.message);
    return null;
  }

  return data;
}

/* ---- Order Operations (via Edge Functions — server-side) ---- */

export interface CreateOrderPayload {
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

export interface CreateOrderResponse {
  success: boolean;
  orderReference?: string;
  error?: string;
}

/**
 * Create an order via Edge Function.
 * Server-side: validates input, fetches price, calculates total, inserts order.
 */
export async function createOrder(
  payload: CreateOrderPayload
): Promise<CreateOrderResponse> {
  const { data, error } = await supabase.functions.invoke("create-order", {
    body: payload,
  });

  if (error) {
    console.error("Order creation failed:", error.message);
    return { success: false, error: error.message };
  }

  return data as CreateOrderResponse;
}

/* ---- Order Read Operations (via Edge Function — ownership verified) ---- */

export interface GetOrderResponse {
  success: boolean;
  order?: Record<string, unknown>;
  items?: Array<Record<string, unknown>>;
  error?: string;
}

/**
 * Fetch an order via Edge Function.
 * Requires order_reference + email for ownership verification.
 * The Edge Function verifies the email matches before returning data.
 */
export async function getOrderByReference(
  orderReference: string,
  email: string
): Promise<GetOrderResponse> {
  const { data, error } = await supabase.functions.invoke("get-order", {
    body: { orderReference, email },
  });

  if (error) {
    console.error("Failed to fetch order:", error.message);
    return { success: false, error: error.message };
  }

  return data as GetOrderResponse;
}

/* ---- Payment Proof Operations (via Edge Function — ownership verified) ---- */

export interface UploadProofResponse {
  success: boolean;
  path?: string;
  error?: string;
}

/**
 * Upload InstaPay payment proof via Edge Function.
 * Server-side: verifies order ownership, validates file, uploads to Storage.
 * The browser never directly accesses Storage or updates the order.
 */
export async function uploadPaymentProof(
  orderReference: string,
  email: string,
  file: File
): Promise<UploadProofResponse> {
  const formData = new FormData();
  formData.append("orderReference", orderReference);
  formData.append("email", email);
  formData.append("file", file);

  const { data, error } = await supabase.functions.invoke("upload-proof", {
    body: formData,
  });

  if (error) {
    console.error("Upload failed:", error.message);
    return { success: false, error: error.message };
  }

  return data as UploadProofResponse;
}
