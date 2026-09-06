/**
 * VARENO Application Type Definitions
 */

import type { APP_CONFIG } from "@/lib/config/app";

/* ---- Order Types ---- */

export interface Order {
  id: number;
  orderReference: string;
  customerName: string;
  phone: string;
  email: string;
  city: string;
  areaDistrict: string;
  streetAddress: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  quantity: number;
  unitPricePiastres: number;
  totalAmountPiastres: number;
  instapayProofPath: string | null;
  instapaySenderName: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: string;
  productName: string;
  quantity: number;
  unitPricePiastres: number;
  totalPricePiastres: number;
}

/* ---- Form Types ---- */

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
}

export interface DeliveryInfo {
  city: string;
  areaDistrict: string;
  streetAddress: string;
}

export interface OrderFormData {
  customer: CustomerInfo;
  delivery: DeliveryInfo;
  paymentMethod: PaymentMethod;
  instapaySenderName?: string;
  quantity: number;
}

/* ---- API Response Types ---- */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface OrderResponse {
  order: Order;
  message: string;
}

/* ---- Re-export config types ---- */

export type PaymentMethod = keyof typeof APP_CONFIG.paymentMethods;
export type OrderStatus = (typeof APP_CONFIG.orderStatuses)[number];
export type PaymentStatus = (typeof APP_CONFIG.paymentStatuses)[number];
