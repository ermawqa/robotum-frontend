import clsx from "clsx";

/**
 * ImageFrame - provides consistent, reusable styling for images across the site.
 *
 * Props:
 *  - src, alt: image source and alt text
 *  - aspect: '16/9' | '4/3' | '1/1' | '3/2' | 'auto' (default 'auto')
 *  - fit: 'cover' | 'contain' (default 'cover')
 *  - variant: 'soft' | 'border' | 'glow' (default 'soft')
 *  - vignette: boolean (adds subtle vignette overlay)
 *  - rounded: 'md'|'lg'|'xl'|'2xl' (default 'xl')
 *  - whiteTint: boolean (inverts dark PNGs to white tone)
 *  - loading: 'lazy'|'eager' (default 'lazy')
 *  - className: extra classes for wrapper
 */
export default function ImageFrame({
  src,
  alt,
  aspect = "auto",
  fit = "cover",
  variant = "soft",
  vignette = false,
  rounded = "xl",
  whiteTint = false,
  loading = "lazy",
  className,
  ...props
}) {
  // aspect ratio helper
  const aspectClass =
    aspect === "16/9"
      ? "aspect-[16/9]"
      : aspect === "4/3"
        ? "aspect-[4/3]"
        : aspect === "1/1"
          ? "aspect-square"
          : aspect === "3/2"
            ? "aspect-[3/2]"
            : "";

  // object-fit helper
  const fitClass = fit === "contain" ? "object-contain" : "object-cover";

  // border-radius mapping
  const roundedMap = {
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
  };

  // style variants (modernized)
  const variantClass = clsx({
    "bg-[rgba(255,255,255,0.04)] outline outline-[rgba(255,255,255,0.08)] shadow-[0_6px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.55)] transition-all duration-500":
      variant === "soft",
    "bg-[rgba(255,255,255,0.06)] outline outline-[rgba(99,102,241,0.35)] shadow-[0_8px_26px_rgba(2,0,53,0.45)] transition-all duration-500 hover:shadow-[0_10px_32px_rgba(59,130,246,0.35)]":
      variant === "border",
    "bg-[rgba(12,19,36,0.35)] outline outline-[rgba(59,130,246,0.45)] shadow-[0_0_15px_rgba(59,130,246,.35),0_12px_36px_rgba(59,130,246,.25),0_24px_60px_rgba(124,58,237,.18)] transition-all duration-500":
      variant === "glow",
  });

  // Image color tint for dark PNGs
  const tintClass = whiteTint ? "filter invert brightness-200" : "";

  // vignette overlay
  const vignetteClass = vignette
    ? 'after:content-[""] after:absolute after:inset-0 after:rounded-inherit after:pointer-events-none after:bg-[radial-gradient(120%_70%_at_50%_50%,transparent_55%,rgba(0,0,0,0.5))]'
    : "";

  return (
    <figure
      className={clsx(
        "relative overflow-hidden",
        aspectClass,
        roundedMap[rounded],
        variantClass,
        vignetteClass,
        className,
      )}
    >
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        className={clsx(
          "w-full h-full transition-transform duration-500 ease-out hover:scale-[1.03]",
          fitClass,
          tintClass,
        )}
        {...props}
      />
    </figure>
  );
}
