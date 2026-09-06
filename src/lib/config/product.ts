/**
 * VARENO Product Configuration
 *
 * SINGLE SOURCE OF TRUTH for all product data.
 * All prices, names, and details must come from here.
 * Never hardcode product data in UI components.
 *
 * Price: 850 EGP — stored as integer piastres (85000) to avoid float issues.
 */

export const PRODUCT = {
  id: "vareno-signature-holder-001",
  name: "VARENO Signature Holder",
  shortName: "VARENO",
  tagline: "SMOKE SMARTER.",
  description:
    "Refined Wood-Inspired Finish & Brass-Inspired Detailing Ash-Containment Apparatus. Engineered specifically for smoke containment in executive transport and private lounges.",
  longDescription:
    "Premium craftsmanship. A cleaner way to smoke on the road. A refined wood-inspired finish paired with brass-inspired detailing, encasing an airtight, heat-resistant flue.",

  /** Price in EGP (Egyptian Pounds) — integer piastres to avoid float issues */
  pricePiastres: 85000,
  /** Price formatted for display */
  priceDisplay: "850",
  currency: "EGP",
  currencyDisplay: "LE",

  /** Product specifications */
  specs: {
    timber: "Wood-Inspired Finish",
    alloy: "Brass-Inspired Detailing",
    ashRetention: "0% Spillage",
    edition: "Edition 01 / Cigar Lounge Matte",
    finish: "Warm Satin Wood-Inspired",
    storageCapsule: "Included (Velvet)",
  },

  /** What's included in every order — compact list */
  inclusions: [
    "Matte black rigid presentation gift box with gold foil crest",
    "Plush velvet protective travel slipcase with brass-inspired toggle",
    "Dedicated maintenance flue & cleaning stylus",
  ],

  /** Extended inclusions for order page */
  orderInclusions: [
    "1x VARENO Ash-Retention Chamber",
    "1x Rigid Gold-Embossed Presentation Casket",
    "1x Gold-Tasseled Obsidian Velvet Travel Pouch",
    "1x Precision Bore Flue & 3 Adaptive Sizing Grommets",
  ],

  /** Product images — local assets */
  images: {
    main: "/assets/product/product-main.png",
    lifestyle: "/assets/product/product-lifestyle.png",
  },

  /**
   * Full product gallery — ordered array of all images.
   * First image is the default main display.
   * Used by the ProductImageGallery component.
   */
  gallery: [
    { src: "/assets/product/product.png", alt: "VARENO Signature Holder — refined wood-inspired finish with brass-inspired detailing" },
    { src: "/assets/product/screen3.png", alt: "VARENO — Smoke smarter in your car" },
    { src: "/assets/product/screen4.png", alt: "VARENO — Sophisticated and practical for the modern gentleman" },
    { src: "/assets/product/screen2.png", alt: "VARENO — Easy to clean with removable end cap" },
    { src: "/assets/product/screen6.png", alt: "VARENO premium gift box, certificate of authenticity, and velvet travel pouch" },
  ],

  /** Availability */
  inStock: true,
  stockLabel: "In Stock",
  shippingEstimate: "Ships within 24 Hours",

  /** Trust & guarantee text */
  guarantees: {
    returnPolicy: "30-Day Complimentary Return Privilege",
    shipping: "Global Secure Transit",
    warranty: "Lifetime Mechanical Integrity Guarantee",
    warrantyDetail:
      "Each VARENO holder includes our Lifetime Mechanical Integrity Guarantee & serial card.",
  },
} as const;

/**
 * Format piastres to EGP display string.
 * 85000 → "850"
 */
export function formatPriceEGP(piastres: number): string {
  return (piastres / 100).toFixed(0);
}

/**
 * Format piastres to full display string.
 * 85000 → "850 LE"
 */
export function formatPriceFull(piastres: number): string {
  return `${formatPriceEGP(piastres)} ${PRODUCT.currencyDisplay}`;
}

/**
 * Calculate order total — SERVER-SIDE ONLY.
 * Never trust a total sent from the browser.
 */
export function calculateOrderTotal(quantity: number): number {
  return PRODUCT.pricePiastres * quantity;
}
