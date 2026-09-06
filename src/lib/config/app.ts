/**
 * VARENO Application Configuration
 *
 * Centralized config for app-wide settings.
 * Environment variables are read here and type-safe.
 */

export const APP_CONFIG = {
  name: "VARENO",
  tagline: "SMOKE SMARTER.",
  description: "Premium Cigarette Holder — Smoke Smarter with VARENO.",

  /** Base URL for the application */
  baseUrl: import.meta.env.VITE_BASE_URL || "http://localhost:5173",

  /** Order reference prefix */
  orderPrefix: "VRN",

  /** Maximum order quantity per transaction */
  maxQuantity: 10,
  minQuantity: 1,

  /** Payment methods */
  paymentMethods: {
    cod: {
      id: "cod" as const,
      label: "Cash on Delivery",
      description: "Pay upon physical white-glove inspection.",
    },
    instapay: {
      id: "instapay" as const,
      label: "InstaPay",
      description: "Instant direct settlement & verified dispatch.",
    },
  },

  /** InstaPay configuration — loaded from env */
  instapay: {
    address: import.meta.env.VITE_INSTAPAY_ADDRESS || "",
    instructions:
      "Transfer the exact order total to the InstaPay address above.",
  },

  /** Order status values */
  orderStatuses: [
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ] as const,

  /** Payment status values */
  paymentStatuses: [
    "pending",
    "awaiting_proof",
    "verified",
    "failed",
  ] as const,
} as const;

export type PaymentMethod = keyof typeof APP_CONFIG.paymentMethods;
export type OrderStatus = (typeof APP_CONFIG.orderStatuses)[number];
export type PaymentStatus = (typeof APP_CONFIG.paymentStatuses)[number];
