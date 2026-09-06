/**
 * VARENO Admin Service
 *
 * Client-side functions for the admin dashboard.
 * All calls go through the admin-orders Edge Function (service-role key).
 */

import { supabase } from "@/lib/supabase";

export interface AdminOrder {
  id: number;
  order_reference: string;
  customer_name: string;
  phone: string;
  email: string;
  city: string;
  area_district: string;
  street_address: string;
  payment_method: string;
  payment_status: string;
  order_status: string;
  quantity: number;
  unit_price_piastres: number;
  total_amount_piastres: number;
  instapay_proof_path: string | null;
  instapay_sender_name: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminOrderItem {
  id: number;
  order_id: number;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price_piastres: number;
  total_price_piastres: number;
}

export interface AdminSummary {
  total: number;
  new: number;
  pendingPayment: number;
  paid: number;
  completed: number;
}

export interface AdminListResponse {
  success: boolean;
  orders?: AdminOrder[];
  summary?: AdminSummary;
  error?: string;
}

export interface AdminDetailResponse {
  success: boolean;
  order?: AdminOrder;
  items?: AdminOrderItem[];
  error?: string;
}

export interface AdminUpdateResponse {
  success: boolean;
  order?: AdminOrder;
  error?: string;
}

export async function adminListOrders(params?: {
  search?: string;
  status?: string;
  payment?: string;
  method?: string;
  sort?: string;
}): Promise<AdminListResponse> {
  const { data, error } = await supabase.functions.invoke("admin-orders", {
    body: { _action: "list", ...params },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return data as AdminListResponse;
}

export async function adminGetOrder(
  orderId: number
): Promise<AdminDetailResponse> {
  const { data, error } = await supabase.functions.invoke("admin-orders", {
    body: { _action: "get", id: orderId },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return data as AdminDetailResponse;
}

export async function adminUpdateOrder(params: {
  orderId: number;
  orderStatus?: string;
  paymentStatus?: string;
}): Promise<AdminUpdateResponse> {
  const { data, error } = await supabase.functions.invoke("admin-orders", {
    body: { _action: "update", ...params },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return data as AdminUpdateResponse;
}
