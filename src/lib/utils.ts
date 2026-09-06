/**
 * VARENO Utility Functions
 */

import { PRODUCT } from "@/lib/config/product";

/**
 * Format a price in piastres to EGP display string.
 * e.g. 85000 → "850"
 */
export function formatPriceEGP(piastres: number): string {
  return (piastres / 100).toFixed(0);
}

/**
 * Format a price in piastres to full display string.
 * e.g. 85000 → "850 LE"
 */
export function formatPriceFull(piastres: number): string {
  return `${formatPriceEGP(piastres)} ${PRODUCT.currencyDisplay}`;
}

/**
 * Generate a VARENO order reference.
 * Format: VRN-XXXXXX (6 random digits)
 */
export function generateOrderReference(): string {
  const digits = Math.floor(100000 + Math.random() * 900000);
  return `VRN-${digits}`;
}

/**
 * Validate Egyptian phone number format.
 * Accepts: +20XXXXXXXXXX, 01XXXXXXXXX, etc.
 */
export function isValidEgyptianPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, "");
  return /^(\+20|0020|0)?1[0125]\d{8}$/.test(cleaned);
}

/**
 * Validate email format.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
