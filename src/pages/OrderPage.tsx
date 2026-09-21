/**
 * Order Page
 *
 * Multi-step order flow:
 * Step 1 — Order Details: Product info, price, quantity, delivery cost, total
 * Step 2 — Customer Details: Name, phone, email, delivery address, payment
 *
 * After submission → navigates to ConfirmationPage.
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
import { useLanguage } from "@/lib/i18n";

export default function OrderPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [step, setStep] = useState<1 | 2>(1);
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

  const handleContinueToDetails = () => {
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToOrder = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
      ? `${t("order.confirmCod")} — ${formatPriceEGP(totalPiastres)} ${PRODUCT.currencyDisplay}`
      : `${t("order.submitInstapay")} (${formatPriceEGP(totalPiastres)} ${PRODUCT.currencyDisplay})`;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8 lg:py-16">
      {/* Header */}
      <div className="flex flex-col items-center justify-center mb-8 lg:mb-10 text-center">
        <Logo variant="compact" className="mb-3" />
        <h1 className="font-display text-headline-md text-on-surface tracking-[0.02em]">
          {step === 1 ? t("order.step1Title") : t("order.step2Title")}
        </h1>
        <p className="font-body text-body-sm text-on-surface-variant mt-1">
          {step === 1 ? t("order.step1Desc") : t("order.step2Desc")}
        </p>
        {/* Step indicator dots */}
        <div className="flex items-center gap-3 mt-4">
          <div className={`flex items-center gap-2 ${step === 1 ? "text-primary" : "text-on-surface-variant/50"}`}>
            <span className={`w-7 h-7 flex items-center justify-center text-label-sm font-body border ${step === 1 ? "border-primary bg-primary/10" : "border-outline-variant/40"}`}>
              1
            </span>
            <span className="font-body text-label-sm uppercase tracking-[0.15em] hidden sm:inline">{t("order.stepLabel1")}</span>
          </div>
          <span className="w-6 h-[1px] bg-outline-variant/40" />
          <div className={`flex items-center gap-2 ${step === 2 ? "text-primary" : "text-on-surface-variant/50"}`}>
            <span className={`w-7 h-7 flex items-center justify-center text-label-sm font-body border ${step === 2 ? "border-primary bg-primary/10" : "border-outline-variant/40"}`}>
              2
            </span>
            <span className="font-body text-label-sm uppercase tracking-[0.15em] hidden sm:inline">{t("order.stepLabel2")}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 1 && (
          /* STEP 1: Order Details */
          <div className="max-w-2xl mx-auto">
            <div className="bg-surface-container-low p-6 md:p-8 lg:p-10 shadow-2xl">
              {/* Product Showcase */}
              <div className="relative overflow-hidden mb-6">
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-surface-container">
                  <img
                    alt="VARENO Signature Holder"
                    className="w-full h-full object-contain"
                    src={PRODUCT.images.lifestyle}
                  />
                </div>
              </div>

              {/* Product Title & Price */}
              <div className="space-y-2 mb-6">
                <Logo variant="compact" className="mb-1 opacity-90" />
                <div className="flex items-baseline justify-between flex-wrap gap-2">
                  <h2 className="font-display text-headline-sm text-on-surface font-semibold">
                    {PRODUCT.name}
                  </h2>
                  <span className="font-body text-headline-sm text-primary font-light tracking-wide">
                    {PRODUCT.priceDisplay} {PRODUCT.currencyDisplay}
                  </span>
                </div>
                <p className="font-body text-body-sm text-on-surface-variant leading-relaxed">
                  {PRODUCT.description}
                </p>
              </div>

              <Divider className="my-5" />

              {/* Quantity Selector */}
              <div className="bg-surface-container-lowest p-4 mb-5 flex items-center justify-between shadow-inner">
                <div className="flex flex-col">
                  <span className="font-body text-label-md uppercase tracking-[0.15em] text-on-surface">
                    {t("order.quantity")}
                  </span>
                  <span className="font-body text-body-sm text-on-surface-variant">
                    {t("order.selectQty")}
                  </span>
                </div>
                <QuantitySelector value={quantity} onChange={handleQuantityChange} />
              </div>

              {/* Inclusions */}
              <div className="space-y-3 mb-5 bg-surface-container p-4">
                <span className="font-body text-label-sm uppercase tracking-[0.18em] text-primary block mb-1">
                  {t("order.whatsIncluded")}
                </span>
                <InclusionList items={PRODUCT.orderInclusions} />
              </div>

              {/* Order Ledger */}
              <div className="bg-surface-container-lowest p-5 space-y-3 shadow-md">
                <div className="flex justify-between items-center font-body text-body-sm text-on-surface-variant">
                  <span>
                    {t("order.subtotal")} ({quantity} {quantity > 1 ? t("order.units") : t("order.unit")})
                  </span>
                  <span className="font-medium text-on-surface">
                    {formatPriceEGP(totalPiastres)} {PRODUCT.currencyDisplay}
                  </span>
                </div>
                <div className="flex justify-between items-center font-body text-body-sm text-on-surface-variant">
                  <div className="flex items-center gap-1.5">
                    <span>{t("order.delivery")}</span>
                    <span className="font-body text-label-sm text-primary uppercase bg-surface-container-high px-1.5 py-0.5">
                      {t("order.free")}
                    </span>
                  </div>
                  <span className="font-medium text-primary">{t("order.complimentary")}</span>
                </div>
                <Divider className="my-2" />
                <div className="flex justify-between items-baseline font-body text-headline-sm">
                  <span className="text-on-surface">{t("order.total")}</span>
                  <span className="text-primary font-light">
                    {formatPriceEGP(totalPiastres)}{" "}
                    <span className="font-body text-label-sm text-on-surface-variant">
                      {PRODUCT.currencyDisplay}
                    </span>
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-5">
                {[
                  {
                    icon: "verified_user",
                    title: t("order.guarantee"),
                    subtitle: t("order.guaranteeSub"),
                  },
                  {
                    icon: "lock",
                    title: t("order.secure"),
                    subtitle: t("order.secureSub"),
                  },
                  {
                    icon: "local_shipping",
                    title: t("order.dispatch"),
                    subtitle: t("order.dispatchSub"),
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

              {/* Continue Button */}
              <div className="pt-6">
                <Button
                  type="button"
                  fullWidth
                  size="lg"
                  onClick={handleContinueToDetails}
                  className="group"
                >
                  <span>{t("order.continue")}</span>
                  <Icon
                    name="arrow_forward"
                    size="md"
                    className="ml-2 transition-transform group-hover:translate-x-1"
                  />
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          /* STEP 2: Customer Details */
          <div className="max-w-2xl mx-auto">
            <div className="bg-surface-container-low p-6 md:p-8 lg:p-10 shadow-2xl">
              {/* Compact Order Summary */}
              <div className="bg-surface-container p-4 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-surface-container-lowest overflow-hidden flex-shrink-0">
                    <img
                      className="w-full h-full object-contain p-1"
                      src={PRODUCT.images.main}
                      alt={PRODUCT.name}
                    />
                  </div>
                  <div>
                    <span className="font-body text-label-md text-on-surface block">
                      {PRODUCT.name}
                    </span>
                    <span className="font-body text-body-sm text-on-surface-variant">
                      Qty: {quantity}
                    </span>
                  </div>
                </div>
                <span className="font-body text-headline-sm text-primary font-light">
                  {formatPriceEGP(totalPiastres)} {PRODUCT.currencyDisplay}
                </span>
              </div>

              <div className="space-y-8">
                {/* Step 1: Customer Identity */}
                <div>
                  <StepIndicator number={1} label={t("order.yourInfo")} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Input
                        label={t("order.fullName")}
                        placeholder={t("order.fullNamePlaceholder")}
                        error={errors.customer?.name?.message}
                        {...register("customer.name")}
                      />
                    </div>
                    <Input
                      label={t("order.phone")}
                      placeholder={t("order.phonePlaceholder")}
                      type="tel"
                      error={errors.customer?.phone?.message}
                      {...register("customer.phone")}
                    />
                    <Input
                      label={t("order.email")}
                      placeholder={t("order.emailPlaceholder")}
                      type="email"
                      error={errors.customer?.email?.message}
                      {...register("customer.email")}
                    />
                  </div>
                </div>

                {/* Step 2: Delivery Address */}
                <div>
                  <StepIndicator number={2} label={t("order.deliveryAddress")} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label={t("order.city")}
                      placeholder={t("order.cityPlaceholder")}
                      error={errors.delivery?.city?.message}
                      {...register("delivery.city")}
                    />
                    <Input
                      label={t("order.area")}
                      placeholder={t("order.areaPlaceholder")}
                      error={errors.delivery?.areaDistrict?.message}
                      {...register("delivery.areaDistrict")}
                    />
                    <div className="md:col-span-2">
                      <Input
                        label={t("order.street")}
                        placeholder={t("order.streetPlaceholder")}
                        error={errors.delivery?.streetAddress?.message}
                        {...register("delivery.streetAddress")}
                      />
                    </div>
                  </div>
                </div>

                {/* Step 3: Payment Method */}
                <div>
                  <StepIndicator number={3} label={t("order.paymentMethod")} />
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
                            {t("order.codTitle")}
                          </p>
                          <p className="font-body text-body-sm text-on-surface-variant leading-relaxed">
                            {t("order.codDesc")}
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
                            {t("order.instapayTitle")}
                          </span>
                          <span className="font-body text-headline-sm text-primary tracking-[0.1em] font-light select-all">
                            {APP_CONFIG.instapay.address || "vareno@instapay"}
                          </span>
                        </div>
                      </div>
                      <p className="font-body text-body-sm text-on-surface-variant">
                        {t("order.instapayDesc")}
                      </p>
                      <Input
                        label={t("order.instapaySender")}
                        placeholder={t("order.instapaySenderPlaceholder")}
                        helperText={t("order.instapaySenderHelper")}
                        error={errors.instapaySenderName?.message}
                        {...register("instapaySenderName", {
                          setValueAs: (v: string) => v?.trim() ?? "",
                        })}
                      />
                    </div>
                  )}
                </div>

                {/* CTA Buttons */}
                <div className="pt-2 space-y-3">
                  {submitError && (
                    <div className="bg-error-container/20 border border-error/30 p-3">
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
                    <span>{isSubmitting ? t("order.processing") : ctaLabel}</span>
                    <Icon
                      name="arrow_forward"
                      size="md"
                      className="ml-2 transition-transform group-hover:translate-x-1"
                    />
                  </Button>
                  <button
                    type="button"
                    onClick={handleBackToOrder}
                    className="w-full py-3 font-body text-label-md uppercase tracking-[0.15em] text-on-surface-variant hover:text-primary transition-colors"
                  >
                    {t("order.backToOrder")}
                  </button>
                  <p className="font-body text-[11px] text-center text-on-surface-variant">
                    {t("order.termsAgree")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
