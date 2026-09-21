/**
 * HowItWorks Section
 *
 * 3-step process with editorial layout.
 * Step numbers, icons, titles, descriptions, and technical specs.
 */

import { Icon } from "@/components/ui/Icon";
import { useLanguage } from "@/lib/i18n";

export function HowItWorksSection() {
  const { t } = useLanguage();

  const steps = [
    {
      number: "01",
      icon: "login",
      title: t("howItWorks.step1"),
      description: t("howItWorks.step1Desc"),
      spec: "TOLERANCE: ±0.05MM",
    },
    {
      number: "02",
      icon: "air",
      title: t("howItWorks.step2"),
      description: t("howItWorks.step2Desc"),
      spec: "AIRFLOW: DUAL LINEAR SLOTS",
    },
    {
      number: "03",
      icon: "delete_sweep",
      title: t("howItWorks.step3"),
      description: t("howItWorks.step3Desc"),
      spec: "MECHANISM: 90° THREADLESS LOCK",
    },
  ];

  return (
    <section
      className="w-full py-2xl lg:py-4xl bg-surface-container-lowest relative"
      id="how-it-works"
    >
      <div className="max-w-7xl mx-auto px-gutter-mobile lg:px-gutter-desktop">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 mt-16">
          <div>
            <h2 className="font-display text-headline-lg uppercase text-on-surface tracking-[0.03em]">
              {t("howItWorks.title")}
            </h2>
          </div>
          <p className="font-body text-body-md text-on-surface-variant max-w-sm">
            {t("howItWorks.subtitle")}
          </p>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative bg-surface-container p-6 sm:p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-8">
                  <span className="font-display text-headline-lg text-primary/40">
                    {step.number}
                  </span>
                  <Icon name={step.icon} size="xl" className="text-primary" />
                </div>
                <h3 className="font-display text-headline-md uppercase text-on-surface mb-3 tracking-[0.02em]">
                  {step.title}
                </h3>
                <p className="font-body text-body-md text-on-surface-variant leading-relaxed">
                  {step.description}
                </p>
              </div>
              <div className="mt-8 pt-4">
                <span className="font-body text-label-sm text-primary uppercase tracking-[0.18em] break-words">
                  {step.spec}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
