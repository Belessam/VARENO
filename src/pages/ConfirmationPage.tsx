/**
 * Order Confirmation Page
 *
 * SECURITY: Requires email verification to access order details.
 * Order data is fetched via Edge Function that verifies ownership.
 * Payment proof upload goes through Edge Function with ownership check.
 *
 * Layout: Two-column matching design screen:
 * Left — Product dossier, payment method, fulfillment protocol
 * Right — Delivery dossier, delivery protocol
 */

import { useState, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { PRODUCT, formatPriceEGP } from "@/lib/config/product";
import { getOrderByReference, uploadPaymentProof } from "@/lib/services";
import { Icon } from "@/components/ui/Icon";
import { Divider } from "@/components/ui/Divider";
import { Logo } from "@/components/brand";

interface OrderData {
  order: Record<string, unknown>;
  items: Array<Record<string, unknown>>;
}

export default function ConfirmationPage() {
  const [searchParams] = useSearchParams();
  const orderRef = searchParams.get("ref");

  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofUploading, setProofUploading] = useState(false);
  const [proofUploaded, setProofUploaded] = useState(false);

  // Email verification state
  const [emailInput, setEmailInput] = useState("");
  const [verified, setVerified] = useState(false);

  const handleVerifyAndLoad = useCallback(async () => {
    if (!orderRef || !emailInput) return;

    setLoading(true);
    setError(null);
    try {
      const data = await getOrderByReference(orderRef, emailInput);
      if (!data.success || !data.order) {
        setError(
          "Order not found. Please verify your order reference and email address."
        );
      } else {
        setOrderData({ order: data.order, items: data.items || [] });
        setVerified(true);
      }
    } catch {
      setError("Failed to load order details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [orderRef, emailInput]);

  const handleProofUpload = useCallback(async () => {
    if (!proofFile || !orderRef || !emailInput) return;

    setProofUploading(true);
    setError(null);
    try {
      const result = await uploadPaymentProof(orderRef, emailInput, proofFile);
      if (result.success) {
        setProofUploaded(true);
      } else {
        setError(result.error || "Failed to upload proof.");
      }
    } catch {
      setError("Failed to upload payment proof.");
    } finally {
      setProofUploading(false);
    }
  }, [proofFile, orderRef, emailInput]);

  // No order reference in URL
  if (!orderRef) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-gutter-mobile py-2xl">
        <Icon name="error_outline" size="xl" className="text-error mb-4" />
        <h1 className="font-display text-headline-md text-on-surface mb-2">
          No Order Reference
        </h1>
        <p className="text-on-surface-variant text-body-md mb-6">
          No order reference was found in the URL.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-8 py-4 bg-primary-container text-on-primary font-body text-label-md uppercase tracking-[0.15em] hover:bg-primary transition-all"
        >
          Return to Atelier Home
        </Link>
      </main>
    );
  }

  // Email verification step
  if (!verified) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-gutter-mobile py-2xl">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <Logo variant="full" className="mb-lg" />
            <h1 className="font-display text-headline-md text-on-surface mb-2">
              Verify Your Order
            </h1>
            <p className="text-on-surface-variant text-body-md text-center">
              Enter the email address used when placing order{" "}
              <span className="text-primary font-semibold">#{orderRef}</span> to
              view its details.
            </p>
          </div>

          <div className="bg-surface-container-low p-6 md:p-8 shadow-2xl space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="verify-email"
                className="block font-body text-label-sm uppercase tracking-[0.18em] text-on-surface-variant"
              >
                Email Address Used in Order
              </label>
              <input
                id="verify-email"
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="e.g. julian@example.com"
                className="w-full bg-surface-container-lowest text-on-surface px-4 py-3 font-body text-body-md placeholder:text-outline/60 focus:outline-none focus:ring-1 focus:ring-primary shadow-inner border border-outline-variant/30"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleVerifyAndLoad();
                }}
              />
            </div>

            {error && (
              <div className="bg-error-container/20 border border-error/30 p-3">
                <p className="font-body text-body-sm text-error">{error}</p>
              </div>
            )}

            <button
              onClick={handleVerifyAndLoad}
              disabled={loading || !emailInput}
              className="w-full py-4 bg-primary-container text-on-primary font-body text-label-md uppercase tracking-[0.15em] hover:bg-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "VERIFYING..." : "VIEW ORDER DETAILS"}
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="font-body text-label-sm text-primary uppercase tracking-[0.18em] underline underline-offset-8 decoration-primary/40 hover:decoration-primary transition-colors"
            >
              Return to Atelier Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Loading state
  if (loading) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-gutter-mobile py-2xl">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-on-surface-variant text-body-md">
          Loading order details...
        </p>
      </main>
    );
  }

  // Error state (after verification attempt)
  if (error && !orderData) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-gutter-mobile py-2xl">
        <Icon name="error_outline" size="xl" className="text-error mb-4" />
        <h1 className="font-display text-headline-md text-on-surface mb-2">
          Order Not Found
        </h1>
        <p className="text-on-surface-variant text-body-md mb-6">{error}</p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-8 py-4 bg-primary-container text-on-primary font-body text-label-md uppercase tracking-[0.15em] hover:bg-primary transition-all"
        >
          Return to Atelier Home
        </Link>
      </main>
    );
  }

  const order = orderData!.order;
  const customerName = (order.customer_name as string) || "";
  const phone = (order.phone as string) || "";
  const city = (order.city as string) || "";
  const areaDistrict = (order.area_district as string) || "";
  const streetAddress = (order.street_address as string) || "";
  const paymentMethod = (order.payment_method as string) || "cod";
  const instapaySenderName = (order.instapay_sender_name as string) || null;
  const quantity = (order.quantity as number) || 1;
  const totalPiastres = (order.total_amount_piastres as number) || 0;
  const reference = (order.order_reference as string) || orderRef || "";

  return (
    <div className="relative w-full max-w-5xl mx-auto px-gutter-mobile md:px-gutter-desktop py-xl md:py-3xl flex flex-col items-center">
      {/* Ambient Warm Lounge Glow */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[600px] h-[340px] bg-gradient-to-b from-secondary-container/20 via-primary/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Status Header */}
      <div className="flex flex-col items-center text-center max-w-2xl mb-lg">
        <Logo variant="full" className="mb-lg" />

        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-high text-primary border border-outline-variant/30">
          <Icon name="check_circle" size="sm" filled />
          <span className="font-body text-label-sm uppercase tracking-[0.18em] text-primary">
            Confirmed &amp; Registered
          </span>
        </div>

        <div className="flex items-center gap-3 mt-lg mb-xs">
          <span className="h-[1px] w-6 bg-gradient-to-r from-transparent to-primary" />
          <span className="font-body text-eyebrow text-primary uppercase tracking-[0.25em]">
            Acquisition Registered
          </span>
          <span className="h-[1px] w-6 bg-gradient-to-l from-transparent to-primary" />
        </div>

        <h1 className="font-display text-headline-lg md:text-display-xl text-on-surface tracking-wide mt-1 mb-md font-medium">
          ORDER CONFIRMED
        </h1>

        <p className="font-body text-body-md md:text-body-lg text-on-surface-variant font-light leading-relaxed max-w-xl">
          Thank you for choosing VARENO. Your bespoke order has been registered
          at our atelier and prepared for artisanal inspection.
        </p>

        <div className="mt-lg inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 px-4 sm:px-lg py-2 bg-surface-container shadow-md text-center">
          <div className="flex items-center gap-2">
            <span className="font-body text-label-sm text-outline uppercase tracking-[0.18em]">
              Order Reference
            </span>
            <span className="font-body text-label-md text-primary font-semibold tracking-[0.15em]">
              #{reference}
            </span>
          </div>
          <span className="h-3 w-[1px] bg-outline-variant hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="font-body text-label-sm text-outline uppercase tracking-[0.18em]">
              Atelier Batch
            </span>
            <span className="font-body text-label-md text-on-surface">
              SERIES I · 2025
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="w-full mt-2xl grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
        {/* Left Column */}
        <div className="lg:col-span-7 flex flex-col gap-lg">
          {/* Product Dossier */}
          <div className="bg-surface-container p-lg md:p-xl relative overflow-hidden shadow-xl">
            <div className="flex items-center justify-between pb-md mb-md bg-surface-container-high -mx-4 sm:-mx-lg -mt-lg px-4 sm:px-lg pt-md">
              <span className="font-body text-eyebrow text-primary uppercase tracking-[0.22em]">
                Selected Commission
              </span>
              <span className="font-body text-[10px] sm:text-label-sm text-on-surface-variant uppercase tracking-[0.18em] shrink-0 ml-2">
                Edition 01 / Qty {quantity}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-lg items-center sm:items-start">
              <div className="relative w-32 h-32 flex-shrink-0 bg-surface-container-lowest overflow-hidden border border-outline-variant/30 shadow-inner">
                <img
                  className="w-full h-full object-cover object-center"
                  src={PRODUCT.images.main}
                  alt={PRODUCT.name}
                />
              </div>
              <div className="flex flex-col flex-grow text-center sm:text-left min-w-0">
                <span className="font-body text-eyebrow text-secondary-fixed-dim uppercase tracking-[0.2em] mb-1">
                  Cigarette Preservation Holder
                </span>
                <h3 className="font-display text-headline-sm text-on-surface tracking-wide truncate">
                  {PRODUCT.name}
                </h3>
                <p className="font-body text-body-sm text-on-surface-variant mt-1">
                  Refined Wood-Inspired Finish · Brass-Inspired Detailing ·
                  Self-Contained Retention Chute
                </p>
                <div className="mt-md pt-md bg-surface-container-low p-3 grid grid-cols-2 gap-2 text-left">
                  <div>
                    <span className="block font-body text-label-sm text-outline uppercase">
                      Finish Spec
                    </span>
                    <span className="font-body text-body-sm text-on-surface font-medium">
                      {PRODUCT.specs.finish}
                    </span>
                  </div>
                  <div>
                    <span className="block font-body text-label-sm text-outline uppercase">
                      Storage Capsule
                    </span>
                    <span className="font-body text-body-sm text-on-surface font-medium">
                      {PRODUCT.specs.storageCapsule}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-lg pt-lg bg-surface-container-lowest -mx-4 sm:-mx-lg -mb-lg p-4 sm:p-lg flex flex-col gap-2.5">
              <div className="flex justify-between items-start gap-2 text-on-surface-variant font-body text-body-sm">
                <span className="shrink-0">Bespoke Instrument Commission</span>
                <span className="text-on-surface font-medium">
                  {formatPriceEGP(totalPiastres)} {PRODUCT.currencyDisplay}
                </span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant font-body text-body-sm">
                <span className="flex items-center gap-1.5">
                  White-Glove Courier Transit
                  <Icon name="shield" size="sm" className="text-primary" />
                </span>
                <span className="text-primary font-medium tracking-wide">
                  COMPLIMENTARY
                </span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant font-body text-body-sm">
                <span>Atelier Verification &amp; Certification</span>
                <span className="text-primary font-medium tracking-wide">
                  INCLUDED
                </span>
              </div>
              <Divider className="my-1" />
              <div className="flex justify-between items-baseline pt-1">
                <div className="flex flex-col">
                  <span className="font-body text-label-md text-on-surface uppercase tracking-[0.15em]">
                    Total Commission
                  </span>
                  <span className="font-body text-label-sm text-outline">
                    Pay upon physical handoff
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-display text-headline-md text-primary font-semibold tracking-tight">
                    {formatPriceEGP(totalPiastres)}
                  </span>
                  <span className="font-body text-label-sm text-outline uppercase ml-1">
                    {PRODUCT.currencyDisplay}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Settlement & Logistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            <div className="bg-surface-container-low p-lg shadow-md flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-md">
                <div className="w-9 h-9 bg-surface-container-high flex items-center justify-center text-primary">
                  <Icon name="payments" size="md" />
                </div>
                <div>
                  <span className="block font-body text-label-sm text-outline uppercase tracking-[0.18em]">
                    Method
                  </span>
                  <span className="font-body text-label-md text-on-surface">
                    {paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : "InstaPay"}
                  </span>
                </div>
              </div>
              <p className="font-body text-body-sm text-on-surface-variant leading-relaxed">
                {paymentMethod === "cod"
                  ? "Settle upon courier parcel handoff. Cash and local instant mobile transfer accepted at door."
                  : "Payment proof submitted. Your allocation is verified and flagged for priority packaging."}
              </p>
              {paymentMethod === "instapay" && instapaySenderName && (
                <div className="mt-3 pt-3 border-t border-outline-variant/20">
                  <span className="block font-body text-label-sm text-outline uppercase tracking-[0.18em]">
                    InstaPay Sender Name
                  </span>
                  <span className="font-body text-body-md text-on-surface font-medium">
                    {instapaySenderName}
                  </span>
                </div>
              )}
            </div>

            <div className="bg-surface-container-low p-lg shadow-md flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-md">
                <div className="w-9 h-9 bg-surface-container-high flex items-center justify-center text-primary">
                  <Icon name="flight_takeoff" size="md" />
                </div>
                <div>
                  <span className="block font-body text-label-sm text-outline uppercase tracking-[0.18em]">
                    Courier Schedule
                  </span>
                  <span className="font-body text-label-md text-on-surface">
                    2–3 Business Days
                  </span>
                </div>
              </div>
              <p className="font-body text-body-sm text-on-surface-variant leading-relaxed">
                Hand-dispatched with direct courier telephone confirmation
                prior to physical delivery.
              </p>
            </div>
          </div>

          {/* InstaPay Proof Upload */}
          {paymentMethod === "instapay" && !proofUploaded && (
            <div className="bg-surface-container p-lg shadow-xl">
              <h3 className="font-display text-headline-sm text-on-surface uppercase tracking-[0.01em] mb-4">
                Upload Payment Proof
              </h3>
              <div className="space-y-3">
                <label className="font-body text-label-sm text-on-surface-variant uppercase tracking-[0.18em] block">
                  Transfer Confirmation / Screenshot
                </label>
                <div
                  className="bg-surface-container-lowest p-6 text-center cursor-pointer hover:bg-surface-container-high transition-colors border border-dashed border-outline-variant/40"
                  onClick={() =>
                    document.getElementById("proof-file-input")?.click()
                  }
                >
                  <input
                    id="proof-file-input"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setProofFile(file);
                    }}
                  />
                  <Icon
                    name="cloud_upload"
                    size="xl"
                    className="text-primary mb-1"
                  />
                  <p className="font-body text-body-sm text-on-surface font-medium">
                    {proofFile
                      ? `Selected: ${proofFile.name}`
                      : "Click or drag receipt screenshot here"}
                  </p>
                  <p className="font-body text-[11px] text-on-surface-variant mt-1">
                    JPEG, PNG, or PDF up to 10MB
                  </p>
                </div>
                {proofFile && (
                  <button
                    onClick={handleProofUpload}
                    disabled={proofUploading}
                    className="w-full py-3 bg-primary-container text-on-primary font-body text-label-md uppercase tracking-[0.15em] hover:bg-primary transition-all disabled:opacity-50"
                  >
                    {proofUploading ? "UPLOADING..." : "SUBMIT PROOF"}
                  </button>
                )}
              </div>
            </div>
          )}

          {proofUploaded && (
            <div className="bg-surface-container-high p-lg shadow-xl flex items-center gap-3">
              <Icon
                name="check_circle"
                size="lg"
                className="text-primary"
                filled
              />
              <div>
                <p className="font-body text-label-md text-on-surface uppercase tracking-[0.15em]">
                  Payment Proof Submitted
                </p>
                <p className="font-body text-body-sm text-on-surface-variant">
                  Your proof is under review. We will confirm via SMS/email.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 flex flex-col gap-lg">
          {/* Delivery Dossier */}
          <div className="bg-surface-container p-lg md:p-xl shadow-xl flex flex-col">
            <div className="flex items-center justify-between pb-md mb-lg border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <Icon name="location_on" size="md" className="text-primary" />
                <span className="font-body text-eyebrow text-primary uppercase tracking-[0.22em]">
                  Delivery Dossier
                </span>
              </div>
              <span className="font-body text-label-sm text-outline uppercase">
                Confidential
              </span>
            </div>

            <div className="flex flex-col gap-md">
              <div>
                <span className="block font-body text-label-sm text-outline uppercase tracking-[0.18em]">
                  Recipient Name
                </span>
                <p className="font-display text-headline-sm text-on-surface mt-0.5">
                  {customerName}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2 pt-2">
                <div>
                  <span className="block font-body text-label-sm text-outline uppercase tracking-[0.18em]">
                    Contact Cellular
                  </span>
                  <p className="font-body text-body-md text-on-surface font-medium">
                    {phone}
                  </p>
                </div>
                <div className="mt-2">
                  <span className="block font-body text-label-sm text-outline uppercase tracking-[0.18em]">
                    Consignment Destination
                  </span>
                  <p className="font-body text-body-md text-on-surface font-normal mt-0.5 leading-snug">
                    {streetAddress}
                    <br />
                    {areaDistrict}
                    <br />
                    {city}
                  </p>
                </div>
              </div>
              <div className="mt-2 pt-md bg-surface-container-lowest p-md flex items-center justify-between">
                <span className="font-body text-label-sm text-outline uppercase">
                  Delivery Protocol
                </span>
                <span className="font-body text-label-sm text-secondary-fixed font-medium">
                  Signature Required
                </span>
              </div>
            </div>
          </div>

          {/* Fulfillment Protocol */}
          <div className="bg-surface-container p-lg md:p-xl shadow-xl flex flex-col">
            <div className="flex items-center gap-2 pb-md mb-lg border-b border-outline-variant/30">
              <Icon name="rule" size="md" className="text-primary" />
              <span className="font-body text-eyebrow text-primary uppercase tracking-[0.22em]">
                Fulfillment Protocol
              </span>
            </div>
            <div className="relative flex flex-col gap-lg">
              <div className="absolute top-3 bottom-3 left-[15px] w-[2px] bg-surface-container-highest" />
              {[
                {
                  num: "01",
                  title: "Atelier Preparation",
                  desc: "Individually serialized, hand-tested for vacuum ash retention, and sealed in an unbranded matte obsidian shipping carton.",
                },
                {
                  num: "02",
                  title: "Courier Dispatch SMS",
                  desc: "Real-time GPS tracking reference and courier concierge direct contact delivered to your registered mobile number.",
                },
                {
                  num: "03",
                  title: "White-Glove Handoff",
                  desc: "You are invited to open and inspect the gold-stamped presentation box prior to providing payment settlement to the courier.",
                },
              ].map((step) => (
                <div key={step.num} className="relative flex items-start gap-4">
                  <div className="relative z-10 w-8 h-8 bg-surface-container-highest flex items-center justify-center text-primary font-body text-label-md font-bold shadow-md ring-2 ring-surface-container">
                    {step.num}
                  </div>
                  <div className="flex flex-col pt-0.5">
                    <h4 className="font-display text-headline-sm text-on-surface text-base">
                      {step.title}
                    </h4>
                    <p className="font-body text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Heritage Warranty */}
      <div className="w-full my-2xl py-xl px-lg bg-surface-container-lowest flex flex-col md:flex-row items-center justify-between gap-lg shadow-lg relative overflow-hidden">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-12 h-12 bg-surface-container flex-shrink-0 flex items-center justify-center text-primary">
            <Icon name="verified" size="lg" />
          </div>
          <div>
            <span className="font-body text-eyebrow text-primary uppercase tracking-[0.22em]">
              Heritage Warranty
            </span>
            <p className="font-body text-body-sm text-on-surface-variant">
              {PRODUCT.guarantees.warrantyDetail}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="font-body text-label-sm text-outline uppercase block">
              Manufacture Mark
            </span>
            <span className="font-body text-eyebrow text-on-surface tracking-[0.22em]">
              ATELIER ARCHIVE
            </span>
          </div>
          <span className="w-px h-8 bg-outline-variant/40 hidden sm:block" />
          <Logo variant="compact" />
        </div>
      </div>

      {/* Return Home */}
      <div className="flex flex-col items-center gap-md w-full max-w-md">
        <Link
          to="/"
          className="w-full py-4 px-xl bg-primary text-on-primary font-body text-label-md uppercase tracking-[0.2em] font-semibold text-center hover:bg-primary-fixed hover:shadow-[0_0_24px_rgba(200,164,106,0.35)] active:scale-[0.99] transition-all"
        >
          Return to Atelier Home
        </Link>
      </div>

      {/* Contact */}
      <div className="mt-lg flex flex-col items-center gap-1 text-center">
        <p className="font-body text-body-sm text-on-surface-variant">
          Need assistance or customized dispatch instructions?
        </p>
        <Link
          to="/contact"
          className="font-body text-label-sm text-primary uppercase tracking-[0.18em] underline underline-offset-8 decoration-primary/40 hover:decoration-primary transition-colors"
        >
          Contact Atelier Concierge →
        </Link>
      </div>
    </div>
  );
}
