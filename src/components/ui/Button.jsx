import clsx from "clsx";
import { Link, useNavigate } from "react-router-dom";
import { scrollToSection } from "@utils/scrollToSection";

/**
 * Polymorphic Button
 * - Variants: primary | primary-light | secondary | secondaryStatic
 * - Sizes: sm | md | lg
 * - Supports Link navigation (`to`), external links (`as="a" href`), and in-page scrolling (`scrollTarget`).
 * - Accessible: proper aria-disabled, aria-busy; preserves focus styles from globals.css.
 */
export default function Button({
  as = "button",
  to,
  href,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  scrollTarget, // id on the page to scroll to
  leadingIcon: LeadingIcon,
  trailingIcon: TrailingIcon,
  className,
  children,
  target,
  rel,
  onClick,
  ...props
}) {
  const navigate = useNavigate();

  // Pick the underlying component
  const isRouterLink = Boolean(to);
  const isAnchor = as === "a" || Boolean(href);
  const Comp = isRouterLink ? Link : isAnchor ? "a" : as;

  // Maps for variants and sizes (classes live in globals.css)
  const variantClass =
    {
      primary: "btn-primary",
      "primary-light": "btn-primary-light",
      secondary: "btn-secondary",
      secondaryStatic: "btn-secondary-static", // ✅ NEW VARIANT
      danger: "btn-danger", // destructive actions (delete)
    }[variant] || "btn-primary";

  const sizeClass =
    {
      xs: "btn-xs",
      sm: "btn-sm",
      md: "btn-md",
      lg: "btn-lg",
    }[size] || "btn-md";

  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // In-page scroll without navigation
    if (scrollTarget && !to && !href) {
      e.preventDefault();
      scrollToSection(scrollTarget);
      return;
    }

    // Navigate first, then scroll (e.g., /partners#contact)
    if (to && scrollTarget) {
      e.preventDefault();
      navigate(to);
      // Let the next view mount
      setTimeout(() => scrollToSection(scrollTarget), 350);
      return;
    }

    if (onClick) onClick(e);
  };

  // External link safety
  const isExternal =
    (isAnchor && target === "_blank") ||
    (isAnchor && /^https?:\/\//.test(href || ""));
  const relSafe = isExternal ? clsx("noopener", "noreferrer", rel) : rel;

  // Common props
  const commonProps = {
    onClick: handleClick,
    className: clsx(
      "btn select-none",
      variantClass,
      sizeClass,
      fullWidth && "w-full",
      (disabled || loading) && "opacity-60 cursor-not-allowed",
      className,
    ),
    "aria-disabled": disabled ? true : undefined,
    "aria-busy": loading ? true : undefined,
    tabIndex: disabled ? -1 : undefined,
    ...props,
  };

  // Props per element
  const elementProps = isRouterLink
    ? { to }
    : isAnchor
      ? { href: href || to, target, rel: relSafe }
      : { type: props.type || "button", disabled };

  return (
    <Comp {...commonProps} {...elementProps}>
      {LeadingIcon ? (
        <span className="mr-2 inline-flex items-center">
          {<LeadingIcon aria-hidden="true" />}
        </span>
      ) : null}

      <span className="inline-flex items-center">{children}</span>

      {loading ? (
        <span
          className="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent"
          aria-hidden="true"
        />
      ) : TrailingIcon ? (
        <span className="ml-2 inline-flex items-center">
          {<TrailingIcon aria-hidden="true" />}
        </span>
      ) : null}
    </Comp>
  );
}
