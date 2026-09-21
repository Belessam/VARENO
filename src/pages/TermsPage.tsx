/**
 * Terms & Privacy Page
 *
 * Real content covering product/order terms, delivery, returns,
 * privacy, and usage — specific to VARENO.
 */

import { useLanguage } from "@/lib/i18n";

export function TermsPage() {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-4xl mx-auto px-gutter-mobile lg:px-gutter-desktop py-xl lg:py-3xl">
      <div className="mb-10">
        <h1 className="font-display text-headline-lg lg:text-headline-xl text-on-surface tracking-[0.03em] mb-3">
          {t("terms.title")}
        </h1>
        <p className="font-body text-body-sm text-on-surface-variant">
          Last updated: {new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div className="space-y-10">
        <section>
          <h2 className="font-display text-headline-sm text-on-surface uppercase tracking-[0.02em] mb-4">
            {t("terms.productOrders")}
          </h2>
          <div className="space-y-3 font-body text-body-md text-on-surface-variant leading-relaxed">
            <p>{t("terms.productOrdersContent1")}</p>
            <p>{t("terms.productOrdersContent2")}</p>
            <p>{t("terms.productOrdersContent3")}</p>
          </div>
        </section>

        <section>
          <h2 className="font-display text-headline-sm text-on-surface uppercase tracking-[0.02em] mb-4">
            {t("terms.orderingPayment")}
          </h2>
          <div className="space-y-3 font-body text-body-md text-on-surface-variant leading-relaxed">
            <p>{t("terms.orderingPaymentContent")}</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-on-surface">{t("terms.cod")}:</strong> {t("terms.codDesc")}
              </li>
              <li>
                <strong className="text-on-surface">{t("terms.instapay")}:</strong> {t("terms.instapayDesc")}
              </li>
            </ul>
            <p>{t("terms.orderingPaymentNote")}</p>
          </div>
        </section>

        <section>
          <h2 className="font-display text-headline-sm text-on-surface uppercase tracking-[0.02em] mb-4">
            {t("terms.deliveryShipping")}
          </h2>
          <div className="space-y-3 font-body text-body-md text-on-surface-variant leading-relaxed">
            <p>{t("terms.deliveryShippingContent1")}</p>
            <p>{t("terms.deliveryShippingContent2")}</p>
            <p>{t("terms.deliveryShippingContent3")}</p>
            <p>{t("terms.deliveryShippingContent4")}</p>
          </div>
        </section>

        <section>
          <h2 className="font-display text-headline-sm text-on-surface uppercase tracking-[0.02em] mb-4">
            {t("terms.returns")}
          </h2>
          <div className="space-y-3 font-body text-body-md text-on-surface-variant leading-relaxed">
            <p>{t("terms.returnsContent1")}</p>
            <p>{t("terms.returnsContent2")}</p>
            <p>{t("terms.returnsContent3")}</p>
            <p>{t("terms.returnsContent4")}</p>
          </div>
        </section>

        <section>
          <h2 className="font-display text-headline-sm text-on-surface uppercase tracking-[0.02em] mb-4">
            {t("terms.privacy")}
          </h2>
          <div className="space-y-3 font-body text-body-md text-on-surface-variant leading-relaxed">
            <p>{t("terms.privacyContent1")}</p>
            <p>{t("terms.privacyContent2")}</p>
            <p>{t("terms.privacyContent3")}</p>
            <p>{t("terms.privacyContent4")}</p>
            <p>{t("terms.privacyContent5")}</p>
          </div>
        </section>

        <section>
          <h2 className="font-display text-headline-sm text-on-surface uppercase tracking-[0.02em] mb-4">
            {t("terms.general")}
          </h2>
          <div className="space-y-3 font-body text-body-md text-on-surface-variant leading-relaxed">
            <p>{t("terms.generalContent1")}</p>
            <p>{t("terms.generalContent2")}</p>
            <p>{t("terms.generalContent3")}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
