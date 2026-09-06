/**
 * Order Page
 *
 * Two-column layout:
 * Left — Product summary, quantity, inclusions, order ledger, trust badges
 * Right — Customer form, delivery form, payment selection, CTA
 */

import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
  orderFormSchema,
  type OrderFormInput,
} from "@/lib/validations/order";
import { PRODUCT, calculateOrderTotal, formatPriceEGP } from "@/lib/config/product";
import { APP_CONFIG } from "@/lib/config/app";
import { createOrder } from "@/lib/services";
import {
  Button,
  Input,
  QuantitySelector,
  PaymentMethodToggle,
  StepIndicator,
  InclusionList,
  Divider,
  Icon,
} from "@/components/ui";
import { Logo } from "@/components/brand";

export default function OrderPage() {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OrderFormInput>({
    resolver: standardSchemaResolver(orderFormSchema),
    defaultValues: {
      customer: { name: "", phone: "", email: "" },
      delivery: { city: "", areaDistrict: "", streetAddress: "" },
      paymentMethod: "cod",
      instapaySenderName: "",
      quantity: 1,
    },
  });

  const paymentMethod = watch("paymentMethod");
  const totalPiastres = calculateOrderTotal(quantity);

  const handleQuantityChange = useCallback(
    (newQty: number) => {
      setQuantity(newQty);
      setValue("quantity", newQty);
    },
    [setValue]
  );

  const onSubmit = async (data: OrderFormInput) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const result = await createOrder({
        customerName: data.customer.name,
        phone: data.customer.phone,
        email: data.customer.email,
        city: data.delivery.city,
        areaDistrict: data.delivery.areaDistrict,
        streetAddress: data.delivery.streetAddress,
        paymentMethod: data.paymentMethod,
        instapaySenderName: data.instapaySenderName,
        quantity: data.quantity,
      });

      if (result.success && result.orderReference) {
        navigate(`/order/confirmation?ref=${result.orderReference}`);
      } else {
        setSubmitError(result.error || "Failed to create order. Please try again.");
      }
    } catch {
      setSubmitError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const ctaLabel =
    paymentMethod === "cod"
      ? `CONFIRM ORDER — ${formatPriceEGP(totalPiastres)} ${PRODUCT.currencyDisplay}`
      : `SUBMIT PAYMENT (${formatPriceEGP(totalPiastres)} ${PRODUCT.currencyDisplay})`;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8 lg:py-16">
      {/* Header */}
      <div className="flex flex-col items-center justify-center mb-10 text-center">
        <Logo variant="compact" className="mb-3" />
        <h1 className="font-display text-headline-md text-on-surface tracking-[0.02em]">
          Acquisition &amp; Delivery Manifest
        </h1>
        <p className="font-body text-body-sm text-on-surface-variant mt-1">
          Direct single-step reservation bypass. No extraneous verification
          required.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN: Product Summary */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            {/* Product Showcase */}
            <div className="relative bg-surface-container-low p-6 lg:p-8 overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary-container/15 via-transparent to-primary/5 pointer-events-none" />

              <div className="relative mb-6 group">
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  <img
                    alt="VARENO Signature Holder"
                    className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                    src={PRODUCT.images.lifestyle}
                  />
                </div>
              </div>

              {/* Product Title */}
              <div className="space-y-2 mb-6">
                <Logo variant="compact" className="mb-1 opacity-90" />
                <div className="flex items-baseline justify-between">
                  <h2 className="font-display text-headline-sm text-on-surface font-semibold">
                    {PRODUCT.name}
                  </h2>
                  <span className="font-display text-headline-sm text-primary font-medium tracking-tight">
                    {PRODUCT.priceDisplay} {PRODUCT.currencyDisplay}
                  </span>
                </div>
                <p className="font-body text-body-sm text-on-surface-variant leading-relaxed">
                  {PRODUCT.description}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="bg-surface-container-lowest p-4 mb-6 flex items-center justify-between shadow-inner">
                <div className="flex flex-col">
                  <span className="font-body text-label-md uppercase tracking-[0.15em] text-on-surface">
                    Curated Units
                  </span>
                  <span className="font-body text-body-sm text-on-surface-variant">
                    Select reserve allocation
                  </span>
                </div>
                <QuantitySelector value={quantity} onChange={handleQuantityChange} />
              </div>

              {/* Inclusions */}
              <div className="space-y-3 mb-6 bg-surface-container p-4">
                <span className="font-body text-label-sm uppercase tracking-[0.18em] text-primary block mb-1">
                  Sanctuary Ensemble Inclusions
                </span>
                <InclusionList items={PRODUCT.orderInclusions} />
              </div>

              {/* Order Ledger */}
              <div className="bg-surface-container-lowest p-5 space-y-3 shadow-md">
                <div className="flex justify-between items-center font-body text-body-sm text-on-surface-variant">
                  <span>
                    Item Subtotal ({quantity} unit{quantity > 1 ? "s" : ""})
                  </span>
                  <span className="font-medium text-on-surface">
                    {formatPriceEGP(totalPiastres)} {PRODUCT.currencyDisplay}
                  </span>
                </div>
                <div className="flex justify-between items-center font-body text-body-sm text-on-surface-variant">
                  <div className="flex items-center gap-1.5">
                    <span>Courier Dispatch</span>
                    <span className="font-body text-label-sm text-primary uppercase bg-surface-container-high px-1.5 py-0.5">
                      Discreet
                    </span>
                  </div>
                  <span className="font-medium text-primary">Complimentary</span>
                </div>
                <Divider className="my-2" />
                <div className="flex justify-between items-baseline font-display text-headline-sm">
                  <span className="text-on-surface">Total</span>
                  <span className="text-primary font-semibold">
                    {formatPriceEGP(totalPiastres)}{" "}
                    <span className="font-body text-label-sm text-on-surface-variant">
                      {PRODUCT.currencyDisplay}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                {
                  icon: "verified_user",
                  title: "30-Day Guarantee",
                  subtitle: "Complimentary returns",
                },
                {
                  icon: "lock",
                  title: "Atelier Security",
                  subtitle: "256-bit encrypted",
                },
                {
                  icon: "local_shipping",
                  title: "24H Hand-off",
                  subtitle: "Unbranded box",
                },
              ].map((badge) => (
                <div
                  key={badge.title}
                  className="bg-surface-container-low p-2 sm:p-3 text-center flex flex-col items-center justify-center shadow-sm"
                >
                  <Icon name={badge.icon} size="md" className="text-primary mb-1" />
                  <span className="font-body text-[10px] sm:text-label-sm text-on-surface uppercase leading-tight">
                    {badge.title}
                  </span>
                  <span className="font-body text-[9px] sm:text-[11px] text-on-surface-variant mt-0.5">
                    {badge.subtitle}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Form */}
          <div className="lg:col-span-7 bg-surface-container-low p-6 md:p-8 lg:p-10 shadow-2xl">
            <div className="space-y-8">
              {/* Step 1: Customer Identity */}
              <div>
                <StepIndicator number={1} label="Client Identity" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      label="Full Name *"
                      placeholder="e.g. Lord Julian Vance"
                      error={errors.customer?.name?.message}
                      {...register("customer.name")}
                    />
                  </div>
                  <Input
                    label="Phone Number (For Courier SMS) *"
                    placeholder="+20 1XX XXX XXXX"
                    type="tel"
                    error={errors.customer?.phone?.message}
                    {...register("customer.phone")}
                  />
                  <Input
                    label="Email Address (Discreet Receipt) *"
                    placeholder="julian@example.com"
                    type="email"
                    error={errors.customer?.email?.message}
                    {...register("customer.email")}
                  />
                </div>
              </div>

              {/* Step 2: Delivery Sanctuary */}
              <div>
                <StepIndicator number={2} label="Delivery Sanctuary" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="City *"
                    placeholder="e.g. Cairo / Alexandria / Dubai"
                    error={errors.delivery?.city?.message}
                    {...register("delivery.city")}
                  />
                  <Input
                    label="Area / District *"
                    placeholder="e.g. Maadi / Downtown / Heliopolis"
                    error={errors.delivery?.areaDistrict?.message}
                    {...register("delivery.areaDistrict")}
                  />
                  <div className="md:col-span-2">
                    <Input
                      label="Street Address & Suite / Villa *"
                      placeholder="e.g. 42 Nile Street, Apartment 8B"
                      error={errors.delivery?.streetAddress?.message}
                      {...register("delivery.streetAddress")}
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Payment Method */}
              <div>
                <StepIndicator number={3} label="Acquisition Protocol" />
                <PaymentMethodToggle
                  value={paymentMethod}
                  onChange={(method) => setValue("paymentMethod", method)}
                />

                {/* COD Panel */}
                {paymentMethod === "cod" && (
                  <div className="bg-surface-container p-5 mt-4 space-y-2">
                    <div className="flex items-start gap-3">
                      <Icon
                        name="handshake"
                        size="lg"
                        className="text-primary mt-0.5"
                      />
                      <div>
                        <p className="font-body text-label-md text-on-surface uppercase tracking-[0.15em] mb-0.5">
                          White-Glove Courier Hand-off
                        </p>
                        <p className="font-body text-body-sm text-on-surface-variant leading-relaxed">
                          Zero advance payment required today. You will inspect
                          the seal of your VARENO casket before transferring cash
                          directly to the courier agent.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* InstaPay Panel */}
                {paymentMethod === "instapay" && (
                  <div className="bg-surface-container p-5 mt-4 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-lowest p-4">
                      <div>
                        <span className="font-body text-label-sm text-on-surface-variant uppercase tracking-[0.18em] block">
                          Atelier InstaPay Address
                        </span>
                        <span className="font-display text-headline-sm text-primary tracking-[0.1em] font-mono select-all">
                          {APP_CONFIG.instapay.address || "vareno@instapay"}
                        </span>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="font-body text-label-sm text-on-surface-variant uppercase tracking-[0.18em] block">
                          Reference Code
                        </span>
                        <span className="font-body text-label-md text-on-surface font-mono tracking-[0.15em]">
                          VRN-{Math.floor(1000 + Math.random() * 9000)}
                        </span>
                      </div>
                    </div>
                    <p className="font-body text-body-sm text-on-surface-variant">
                      Transfer the exact order total to the InstaPay address
                      above. After transferring, you will be able to upload your
                      payment confirmation on the next step.
                    </p>
                    <Input
                      label="InstaPay Sender Name *"
                      placeholder="e.g. Ahmed Mohamed"
                      helperText="Enter the name registered on the InstaPay account you will use to send the payment."
                      error={errors.instapaySenderName?.message}
                      {...register("instapaySenderName", {
                        setValueAs: (v: string) => v?.trim() ?? "",
                      })}
                    />
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <div className="pt-2">
                {submitError && (
                  <div className="bg-error-container/20 border border-error/30 p-3 mb-4">
                    <p className="font-body text-body-sm text-error">
                      {submitError}
                    </p>
                  </div>
                )}
                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  disabled={isSubmitting}
                  className="group"
                >
                  <span>{isSubmitting ? "PROCESSING..." : ctaLabel}</span>
                  <Icon
                    name="arrow_forward"
                    size="md"
                    className="ml-2 transition-transform group-hover:translate-x-1"
                  />
                </Button>
                <p className="font-body text-[11px] text-center text-on-surface-variant mt-3">
                  By reserving, you agree to discrete courier dispatch terms.
                  100% encrypted and guarded atelier protocol.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
