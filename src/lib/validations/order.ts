/**
 * VARENO Order Form Validation Schemas
 *
 * Uses Zod v4 (Standard Schema compatible).
 * Validates on client; re-validated server-side in Edge Function.
 */

import { z } from "zod";

export const customerInfoSchema = z.object({
  name: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Name is too long"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^(\+20|0020|0)?1[0125]\d{8}$/,
      "Please enter a valid Egyptian phone number"
    ),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export const deliveryInfoSchema = z.object({
  city: z.string().min(1, "City is required").max(100, "City is too long"),
  areaDistrict: z
    .string()
    .min(1, "Area / District is required")
    .max(100, "Area is too long"),
  streetAddress: z
    .string()
    .min(1, "Street address is required")
    .max(200, "Address is too long"),
});

export const orderFormSchema = z
  .object({
    customer: customerInfoSchema,
    delivery: deliveryInfoSchema,
    paymentMethod: z.enum(["cod", "instapay"], {
      message: "Please select a payment method",
    }),
    instapaySenderName: z.string().optional(),
    quantity: z
      .number()
      .int()
      .min(1, "Minimum quantity is 1")
      .max(10, "Maximum quantity is 10"),
  })
  .refine(
    (data) => {
      if (data.paymentMethod === "instapay") {
        return !!data.instapaySenderName && data.instapaySenderName.trim().length >= 2;
      }
      return true;
    },
    {
      message: "InstaPay sender name is required for InstaPay payments",
      path: ["instapaySenderName"],
    }
  );

export type CustomerInfoInput = z.infer<typeof customerInfoSchema>;
export type DeliveryInfoInput = z.infer<typeof deliveryInfoSchema>;
export type OrderFormInput = z.infer<typeof orderFormSchema>;
