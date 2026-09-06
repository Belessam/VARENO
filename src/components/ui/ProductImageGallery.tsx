/**
 * ProductImageGallery
 *
 * Reusable product image gallery with a large main image,
 * thumbnail strip, and prev/next navigation controls.
 *
 * Used consistently across all sections that display the product.
 */

import { useState, useCallback } from "react";
import { PRODUCT } from "@/lib/config/product";
import { Icon } from "@/components/ui/Icon";

interface GalleryImage {
  src: string;
  alt: string;
}

interface ProductImageGalleryProps {
  /** Override gallery images — defaults to PRODUCT.gallery */
  images?: readonly GalleryImage[];
  /** Additional classes for the root container */
  className?: string;
  /** Aspect ratio class for the main image container */
  aspectClass?: string;
  /** Max width constraint for the main image */
  maxWidthClass?: string;
  /** Show or hide the edition tag overlay on the main image */
  showEditionTag?: boolean;
}

export function ProductImageGallery({
  images = PRODUCT.gallery,
  className = "",
  aspectClass = "aspect-[4/3]",
  maxWidthClass = "max-w-[540px]",
  showEditionTag = false,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const currentImage = images[selectedIndex];

  const goToPrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  return (
    <div className={`w-full ${maxWidthClass} mx-auto flex flex-col ${className}`}>
      {/* Main Image */}
      <div
        className={`relative w-full ${aspectClass} flex items-center justify-center overflow-hidden group`}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent opacity-80 z-10 pointer-events-none" />

        {/* Main product image */}
        <img
          key={selectedIndex}
          alt={currentImage.alt}
          className="w-full h-full object-contain relative z-0 animate-zoom-out"
          src={currentImage.src}
        />

        {/* Previous arrow */}
        <button
          type="button"
          onClick={goToPrevious}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-surface-container-lowest/80 backdrop-blur-md text-on-surface-variant hover:text-primary hover:bg-surface-container-high/90 transition-all duration-200 cursor-pointer"
          aria-label="Previous image"
        >
          <Icon name="chevron_left" size="md" />
        </button>

        {/* Next arrow */}
        <button
          type="button"
          onClick={goToNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-surface-container-lowest/80 backdrop-blur-md text-on-surface-variant hover:text-primary hover:bg-surface-container-high/90 transition-all duration-200 cursor-pointer"
          aria-label="Next image"
        >
          <Icon name="chevron_right" size="md" />
        </button>

        {/* Image counter */}
        <div className="absolute top-4 right-4 z-20 bg-surface-container-lowest/80 backdrop-blur-md px-3 py-1">
          <span className="font-body text-label-sm text-on-surface-variant">
            {selectedIndex + 1} / {images.length}
          </span>
        </div>

        {/* Edition tag */}
        {showEditionTag && (
          <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 text-on-surface">
            <span className="w-2 h-2 bg-primary" />
            <span className="font-body text-label-sm uppercase tracking-[0.18em] text-primary">
              {PRODUCT.specs.edition}
            </span>
          </div>
        )}
      </div>

      {/* Thumbnail Strip — horizontal row under main image, perfectly aligned */}
      <div className="flex items-center justify-center gap-3 mt-2 w-full overflow-x-auto pb-1">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setSelectedIndex(index)}
            className={`relative flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 bg-surface-container-low overflow-hidden transition-all duration-200 cursor-pointer ${
              index === selectedIndex
                ? "border-2 border-primary"
                : "border-2 border-transparent opacity-60 hover:opacity-100"
            }`}
            aria-label={`View ${image.alt}`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
