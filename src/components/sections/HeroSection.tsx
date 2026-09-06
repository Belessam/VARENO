/**
 * Hero Section
 *
 * Split 12-column grid: editorial text left, product showcase right.
 * Ambient radial gold glow, micro spec strip, dual CTAs.
 */

import { Link } from "react-router-dom";
import { PRODUCT } from "@/lib/config/product";
import { Icon } from "@/components/ui/Icon";
import { ProductImageGallery } from "@/components/ui/ProductImageGallery";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Ambient Lounge Radial Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(200,164,106,0.12),transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-gutter-mobile lg:px-gutter-desktop py-2xl lg:py-4xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Editorial Spec Column */}
          <div className="lg:col-span-6 flex flex-col items-start space-y-6">
            {/* Headline */}
            <div className="space-y-4">
              <h1 className="font-display text-display-xl-mobile lg:text-display-xl text-on-surface uppercase tracking-[0.02em]">
                SMOKE
                <br />
                <span className="text-primary italic font-normal">
                  SMARTER.
                </span>
              </h1>
              <p className="font-body text-body-lg text-on-surface-variant max-w-lg leading-relaxed">
                {PRODUCT.longDescription}
              </p>
            </div>

            {/* Price & Badge */}
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 pt-2">
              <span className="font-display text-headline-lg text-primary">
                {PRODUCT.priceDisplay} {PRODUCT.currencyDisplay}
              </span>
              <span className="font-body text-label-sm uppercase tracking-[0.18em] text-on-surface-variant/80 bg-surface-container-low px-3 py-1.5 hidden sm:inline">
                Complimentary White-Glove Dispatch
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 pt-4 w-full sm:w-auto">
              <Link
                to="/order"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary-container text-on-primary font-body text-label-md uppercase tracking-[0.15em] hover:bg-primary transition-all duration-300 shadow-xl"
              >
                GET VARENO
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 font-body text-label-md uppercase tracking-[0.15em] text-on-surface-variant hover:text-primary transition-colors py-2 group"
              >
                <span>HOW IT WORKS</span>
                <Icon
                  name="arrow_forward"
                  size="sm"
                  className="group-hover:translate-x-1 transition-transform"
                />
              </a>
            </div>

            {/* Micro Spec Strip */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-8 w-full max-w-md">
              {[
                { label: "TIMBER", value: PRODUCT.specs.timber },
                { label: "ALLOY", value: PRODUCT.specs.alloy },
                { label: "ASH SPILL", value: PRODUCT.specs.ashRetention },
              ].map((spec) => (
                <div key={spec.label}>
                  <span className="block font-body text-label-sm text-primary uppercase tracking-[0.18em]">
                    {spec.label}
                  </span>
                  <span className="block font-body text-body-sm text-on-surface-variant mt-1">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Product Showcase */}
          <div className="lg:col-span-6 relative">
            <ProductImageGallery />
          </div>
        </div>
      </div>
    </section>
  );
}
