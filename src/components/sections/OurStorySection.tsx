/**
 * OurStory Section
 *
 * Ultra-short editorial section with centered content.
 */

import { useLanguage } from "@/lib/i18n";

export function OurStorySection() {
  const { t } = useLanguage();

  return (
    <section id="our-story" className="w-full py-2xl lg:py-3xl bg-surface-container-low relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-gutter-mobile lg:px-gutter-desktop text-center flex flex-col items-center">
        <span className="font-body text-body-lg uppercase tracking-[0.22em] text-primary mt-8 mb-6">
          {t("ourStory.label")}
        </span>

        <h2 className="font-display text-headline-lg-mobile sm:text-headline-lg uppercase text-on-surface mb-6 tracking-[0.03em]">
          {t("ourStory.title")}
        </h2>

        <p className="font-body text-body-lg text-on-surface-variant leading-relaxed max-w-2xl mb-8">
          {t("ourStory.p1")}
        </p>

        <h3 className="font-display text-headline-sm uppercase text-on-surface mb-4 tracking-[0.03em]">
          {t("ourStory.crafted")}
        </h3>

        <p className="font-body text-body-lg text-on-surface-variant leading-relaxed max-w-2xl mb-8">
          {t("ourStory.p2")}
        </p>

        <h3 className="font-display text-headline-sm uppercase text-on-surface mb-4 tracking-[0.03em]">
          {t("ourStory.smarter")}
        </h3>

        <p className="font-body text-body-lg text-on-surface-variant leading-relaxed max-w-2xl mb-8">
          {t("ourStory.p3")}
        </p>
      </div>
    </section>
  );
}
