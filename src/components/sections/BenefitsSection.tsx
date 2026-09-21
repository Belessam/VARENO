/**
 * Benefits Section
 *
 * 4-column strip of product benefits.
 * Each card: icon + number + title + description.
 */

import { Icon } from "@/components/ui/Icon";
import { useLanguage } from "@/lib/i18n";

export function BenefitsSection() {
  const { t } = useLanguage();

  const benefits = [
    {
      icon: "shield",
      number: "01",
      title: t("benefits.ash.title"),
      description: t("benefits.ash.desc"),
    },
    {
      icon: "forest",
      number: "02",
      title: t("benefits.finish.title"),
      description: t("benefits.finish.desc"),
    },
    {
      icon: "directions_car",
      number: "03",
      title: t("benefits.travel.title"),
      description: t("benefits.travel.desc"),
    },
    {
      icon: "refresh",
      number: "04",
      title: t("benefits.empty.title"),
      description: t("benefits.empty.desc"),
    },
  ];

  return (
    <section className="w-full py-xl">
      <div className="max-w-7xl mx-auto px-gutter-mobile lg:px-gutter-desktop">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {benefits.map((benefit) => (
            <div
              key={benefit.number}
              className="p-6 bg-surface-container flex flex-col justify-between transition-colors duration-200 hover:bg-surface-container-high"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 bg-surface-container-high flex items-center justify-center text-primary">
                  <Icon name={benefit.icon} size="md" />
                </div>
                <span className="font-body text-label-sm text-on-surface-variant/40">
                  {benefit.number}
                </span>
              </div>
              <div>
                <h3 className="font-display text-headline-sm uppercase text-on-surface tracking-[0.01em] mb-2">
                  {benefit.title}
                </h3>
                <p className="font-body text-body-sm text-on-surface-variant leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
