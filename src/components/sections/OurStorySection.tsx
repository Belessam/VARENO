/**
 * OurStory Section
 *
 * Ultra-short editorial section with centered content.
 */

export function OurStorySection() {
  return (
    <section id="our-story" className="w-full py-2xl lg:py-3xl bg-surface-container-low relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-gutter-mobile lg:px-gutter-desktop text-center flex flex-col items-center">
        <span className="font-body text-body-lg uppercase tracking-[0.22em] text-primary mt-8 mb-6">
          OUR STORY
        </span>

        <h2 className="font-display text-headline-lg-mobile sm:text-headline-lg uppercase text-on-surface mb-6 tracking-[0.03em]">
          MADE FOR THE MOMENT.
        </h2>

        <p className="font-body text-body-lg text-on-surface-variant leading-relaxed max-w-2xl mb-8">
          VARENO started with a simple idea: smoking should feel more considered.
          We wanted to create something that belongs in the same world as a fine
          watch, a well-made instrument, or the interior of a great car —
          purposeful, refined, and built to last.
        </p>

        <h3 className="font-display text-headline-sm uppercase text-on-surface mb-4 tracking-[0.03em]">
          CRAFTED WITH INTENT.
        </h3>

        <p className="font-body text-body-lg text-on-surface-variant leading-relaxed max-w-2xl mb-8">
          Each VARENO holder combines a refined wood-inspired finish with
          brass-inspired detailing, creating a timeless piece designed to be
          carried, used, and kept. Every detail has a purpose. Nothing is added
          without reason.
        </p>

        <h3 className="font-display text-headline-sm uppercase text-on-surface mb-4 tracking-[0.03em]">
          SMOKE SMARTER.
        </h3>

        <p className="font-body text-body-lg text-on-surface-variant leading-relaxed max-w-2xl mb-8">
          VARENO isn't about changing the ritual. It's about refining it.
        </p>
      </div>
    </section>
  );
}
