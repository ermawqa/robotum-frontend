import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import Button from "@components/ui/Button";
import * as assets from "@assets";
import { ENUM_TYPES } from "@data";
import { useEnumOptions } from "@hooks/useEnumOptions";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About us", href: "/about" },
  {
    label: "Projects",
    href: "/projects",
    dropdown: true,
  },
  { label: "Events", href: "/events" },
  { label: "Partners", href: "/partners" },
  { label: "Q&A", href: "/faqs" },
  { label: "Join us", href: "/join" },
];

// Robocast is a standalone route, not a projects tab - it is appended after
// the project_category enum values, which are loaded from Supabase.
const ROBOCAST_TAB = {
  label: "Robocast",
  key: "robocast",
  mode: "route",
  href: "/robocast",
};

function ProjectDropdown({
  open,
  tabs,
  onEnter,
  onLeave,
  onItemClick,
  onSelect,
}) {
  if (!open) return null;

  return (
    <div
      role="menu"
      className="absolute left-0 top-full mt-2 min-w-52 rounded-xl bg-elevated-2/90 px-2.5 py-2.5 shadow-card-lg ring-1 ring-white/10 z-50 backdrop-blur-md"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          role="menuitem"
          tabIndex={0}
          className="block w-full rounded-lg px-3 py-2.5 text-left text-[14px] tracking-[0.8px] text-white/90 transition-colors duration-300 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 cursor-pointer"
          onClick={() => {
            onItemClick();
            onSelect?.(tab);
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isProjectsMobileOpen, setIsProjectsMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const hoverTimeoutRef = useRef(null);
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const { hash: currentHash, pathname } = useLocation();
  const navigate = useNavigate();

  // Projects dropdown = live project_category enum + the Robocast route.
  const { options: projectCategories } = useEnumOptions(
    ENUM_TYPES.PROJECT_CATEGORY,
  );
  const projectTabs = useMemo(
    () => [
      ...projectCategories.map(({ value, label }) => ({
        label,
        key: value,
        mode: "tab",
      })),
      ROBOCAST_TAB,
    ],
    [projectCategories],
  );

  /* -----------------------------------------------------------------------
   * Handlers
   * --------------------------------------------------------------------- */

  const openProjectsDropdown = useCallback(() => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsProjectsOpen(true);
  }, []);

  const closeProjectsDropdown = useCallback(() => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => setIsProjectsOpen(false), 150);
  }, []);

  const closeAllMenus = useCallback(() => {
    setIsMobileOpen(false);
    setIsProjectsOpen(false);
    setIsProjectsMobileOpen(false);
  }, []);

  const handleSelectProjects = useCallback(
    (tab) => {
      // Robocast → separate route
      if (tab?.mode === "route" && tab.href) {
        navigate(tab.href);
        closeAllMenus();
        return;
      }

      // Default → projects tabs
      const key = tab?.key || projectTabs[0]?.key;
      navigate(key ? `/projects?type=${key}` : "/projects");
      closeAllMenus();
    },
    [navigate, closeAllMenus, projectTabs],
  );

  const toggleMobileMenu = () => {
    setIsMobileOpen((prev) => !prev);
    setIsProjectsMobileOpen(false);
  };

  /* -----------------------------------------------------------------------
   * Effects
   * --------------------------------------------------------------------- */

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeAllMenus();
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeAllMenus]);

  useEffect(() => {
    const body = document.body;

    if (isMobileOpen) {
      body.style.overflow = "hidden";
      body.classList.add("blurred-overlay", "menu-open");
    } else {
      body.style.overflow = "auto";
      body.classList.remove("blurred-overlay", "menu-open");
    }

    return () => {
      body.style.overflow = "auto";
      body.classList.remove("blurred-overlay", "menu-open");
    };
  }, [isMobileOpen]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (!isMobileOpen) return;
      if (navRef.current && !navRef.current.contains(e.target)) closeAllMenus();
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMobileOpen, closeAllMenus]);

  useEffect(() => {
    if (!isMobileOpen || !mobileMenuRef.current) return;

    const root = mobileMenuRef.current;
    const focusable = root.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (first) first.focus();

    function handleKey(e) {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last && last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first && first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isMobileOpen]);

  /* -----------------------------------------------------------------------
   * Shared styles
   * --------------------------------------------------------------------- */

  const desktopItemBase =
    "relative group inline-flex items-center justify-center whitespace-nowrap px-4 py-3 text-[14px] tracking-[0.8px] font-medium text-white/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 hover:text-white md:px-2.5 md:py-2.5 md:text-[12px] md:tracking-[0.4px] lg:px-4 lg:py-3 lg:text-[14px] lg:tracking-[0.8px]";

  const mobileItemBase =
    "block w-full rounded-xl border border-white/10 bg-elevated-2/95 px-4 py-3.5 text-[14px] tracking-[0.8px] text-white/95 shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-all duration-200 hover:border-white/15 hover:bg-white/10 active:scale-[0.995] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70";

  const mobileSubItemBase =
    "block w-full cursor-pointer rounded-lg px-4 py-2 text-left text-[13px] text-white/90 transition-colors duration-200 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70";

  /* -----------------------------------------------------------------------
   * Render
   * --------------------------------------------------------------------- */

  return (
    <nav
      ref={navRef}
      role="navigation"
      aria-label="Main"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      className={`fixed inset-x-0 top-0 z-60 flex h-14 items-center font-sans md:h-16 border-b border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition-colors duration-500 ${
        scrolled
          ? "bg-elevated-1/80 backdrop-blur-2xl"
          : "bg-elevated-1/60 backdrop-blur-xl"
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="relative z-60 flex w-full items-center justify-between md:gap-4 lg:gap-0">
          {/* Logo */}
          <Link
            to="/"
            className={`flex items-center transition-opacity ${
              isMobileOpen ? "pointer-events-none opacity-80" : "opacity-100"
            }`}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <img
              src={assets.navLogo}
              alt="RoboTUM logo"
              className="h-9 w-[110px] opacity-90 transition-opacity hover:opacity-100 md:h-12 md:w-[145px] lg:w-[135px]"
            />
          </Link>

          {/* Desktop navigation */}
          <ul className="ml-auto hidden items-center gap-4 md:flex md:gap-3 lg:gap-4">
            {NAV_LINKS.map((link) => {
              if (link.dropdown) {
                const isActive =
                  pathname.startsWith("/projects") ||
                  pathname.startsWith("/robocast");

                return (
                  <li
                    key={link.label}
                    className="relative"
                    onMouseEnter={openProjectsDropdown}
                    onMouseLeave={closeProjectsDropdown}
                  >
                    <button
                      type="button"
                      onClick={() => setIsProjectsOpen((prev) => !prev)}
                      aria-haspopup="true"
                      aria-expanded={isProjectsOpen}
                      className={`${desktopItemBase} rounded-md ${
                        isActive ? "text-accent" : ""
                      }`}
                    >
                      {link.label.toUpperCase()}
                      <svg
                        className={`ml-2 h-3 w-3 transition-transform ${
                          isProjectsOpen ? "rotate-180" : ""
                        }`}
                        viewBox="0 0 12 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.5 1.5L6 6L10.5 1.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span
                        aria-hidden
                        className={`pointer-events-none absolute -bottom-0.5 left-3 right-3 h-0.5 origin-left rounded-full bg-accent transition-transform duration-300 ease-out ${
                          isActive
                            ? "scale-x-100"
                            : "scale-x-0 group-hover:scale-x-100"
                        }`}
                      />
                    </button>

                    <ProjectDropdown
                      open={isProjectsOpen}
                      tabs={projectTabs}
                      onEnter={openProjectsDropdown}
                      onLeave={closeProjectsDropdown}
                      onItemClick={() => setIsProjectsOpen(false)}
                      onSelect={handleSelectProjects}
                    />
                  </li>
                );
              }

              if (link.label === "Join us") {
                return (
                  <li key={link.label}>
                    <Button
                      variant="primary"
                      as="link"
                      to="/join"
                      className="ml-2 whitespace-nowrap px-4 py-2 text-sm md:ml-1 md:px-2.5 md:py-1.5 md:text-[11px] lg:ml-2 lg:px-4 lg:py-2 lg:text-sm"
                    >
                      {link.label.toUpperCase()}
                    </Button>
                  </li>
                );
              }

              return (
                <li key={link.label} className="px-0.5">
                  <NavLink
                    to={link.href}
                    className={({ isActive }) =>
                      `${desktopItemBase} rounded-md ${
                        isActive ||
                        currentHash === link.href ||
                        (link.href !== "/" && pathname.startsWith(link.href))
                          ? "text-accent"
                          : ""
                      }`
                    }
                  >
                    {link.label.toUpperCase()}
                    <span
                      aria-hidden
                      className={`pointer-events-none absolute -bottom-0.5 left-3 right-3 h-0.5 origin-left rounded-full bg-accent transition-transform duration-300 ease-out ${
                        pathname === link.href ||
                        (link.href !== "/" && pathname.startsWith(link.href)) ||
                        currentHash === link.href
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </NavLink>
                </li>
              );
            })}
          </ul>

          {/* Mobile burger button */}
          <button
            type="button"
            className="ml-2 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white cursor-pointer shadow-[0_6px_20px_rgba(0,0,0,0.2)] transition-all duration-200 hover:bg-white/10 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 md:hidden"
            aria-expanded={isMobileOpen}
            aria-controls="mobile-menu"
            aria-label={
              isMobileOpen ? "Close navigation menu" : "Open navigation menu"
            }
            onClick={toggleMobileMenu}
          >
            <span className="sr-only">Toggle navigation</span>
            <div className="relative h-6 w-6 transform-gpu transition-transform duration-300 ease-out">
              <svg
                className={`absolute inset-0 h-6 w-6 text-white transform-gpu transition-all duration-300 ease-out ${
                  isMobileOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>

              <div
                className={`absolute inset-0 flex flex-col justify-center space-y-1 transform-gpu transition-all duration-300 ease-out ${
                  isMobileOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                }`}
              >
                <span className="block h-0.5 w-6 rounded bg-white" />
                <span className="block h-0.5 w-6 rounded bg-white" />
                <span className="block h-0.5 w-6 rounded bg-white" />
              </div>
            </div>
          </button>
        </div>
      </div>

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 pointer-events-auto bg-black/65 backdrop-blur-md supports-backdrop-filter:backdrop-blur-md transition-opacity duration-300 ease-out md:hidden"
          onClick={closeAllMenus}
          aria-hidden="true"
        />
      )}

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        ref={mobileMenuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Main navigation"
        className={`fixed left-0 right-0 top-14 z-40 px-4 transform-gpu border-t border-white/10 bg-linear-to-b from-elevated-2/95 to-canvas/95 shadow-[0_24px_45px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all duration-300 ease-out md:hidden ${
          isMobileOpen
            ? "pointer-events-auto max-h-[calc(100vh-56px)] translate-y-0 overflow-y-auto pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] opacity-100"
            : "pointer-events-none max-h-0 -translate-y-3 overflow-hidden opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-2 pt-2">
          {NAV_LINKS.map((link) => {
            if (link.dropdown) {
              return (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => setIsProjectsMobileOpen((prev) => !prev)}
                    className={`${mobileItemBase} flex items-center justify-between`}
                    aria-expanded={isProjectsMobileOpen}
                  >
                    <span className="text-[14px] font-medium tracking-[0.8px]">
                      {link.label.toUpperCase()}
                    </span>
                    <svg
                      className={`ml-2 h-4 w-4 transition-transform ${
                        isProjectsMobileOpen ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 12 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.5 1.5L6 6L10.5 1.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isProjectsMobileOpen
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <ul className="mt-2 rounded-xl border border-white/10 bg-secondary/90 px-2.5 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                      {projectTabs.map((tab) => (
                        <li key={tab.key}>
                          <button
                            type="button"
                            className={mobileSubItemBase}
                            onClick={() => handleSelectProjects(tab)}
                          >
                            {tab.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            }

            if (link.label === "Join us") {
              return (
                <li key={link.label}>
                  <Button
                    variant="primary"
                    as="link"
                    to={link.href}
                    className="block w-full text-center text-[14px] font-semibold tracking-[0.8px]"
                    onClick={closeAllMenus}
                  >
                    {link.label.toUpperCase()}
                  </Button>
                </li>
              );
            }

            return (
              <li key={link.label}>
                <NavLink
                  to={link.href}
                  onClick={closeAllMenus}
                  className={({ isActive }) =>
                    `${mobileItemBase} ${
                      isActive || currentHash === link.href
                        ? "border-accent/60 text-accent"
                        : ""
                    }`
                  }
                >
                  {link.label.toUpperCase()}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
