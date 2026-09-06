/**
 * Benefits Section
 *
 * 4-column strip of product benefits.
 * Each card: icon + number + title + description.
 */

import { Icon } from "@/components/ui/Icon";

const benefits = [
  {
    icon: "shield",
    number: "01",
    title: "ASH CONTAINMENT",
    description:
      "Keeps ash and stray embers 100% contained within the internal chamber.",
  },
  {
    icon: "forest",
    number: "02",
    title: "PREMIUM FINISH",
    description:
      "A refined wood-inspired finish paired with brass-inspired detailing — designed to look and feel exceptional.",
  },
  {
    icon: "directions_car",
    number: "03",
    title: "TRAVEL READY",
    description:
      "Engineered specifically for automobile cabins, private decks, and everyday carry.",
  },
  {
    icon: "refresh",
    number: "04",
    title: "EASY TO EMPTY",
    description:
      "Quarter-turn removable brass-inspired end cap discharges cleanly in seconds.",
  },
];

export function BenefitsSection() {
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
