import * as assets from "@assets";
import { Link } from "react-router-dom";

const EXPLORE_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About us" },
  { to: "/projects", label: "Projects" },
  { to: "/events", label: "Events" },
  { to: "/partners", label: "Partners" },
  { to: "/faqs", label: "Q&A" },
  { to: "/join", label: "Join us" },
];

const LEGAL_LINKS = [
  { to: "/impressum", label: "Impressum" },
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/gender-and-diversity", label: "Gender and Diversity" },
];

const SOCIAL_LINKS = [
  {
    href: "https://www.instagram.com/therobotum/",
    label: "Instagram",
    icon: assets.instagramIcon,
    invert: false,
  },
  {
    href: "https://www.linkedin.com/company/therobotum",
    label: "LinkedIn",
    icon: assets.linkedinIcon,
    invert: false,
  },
  {
    href: "https://chat.whatsapp.com/BZVTC6IfYwkFSvRfkJhn5e",
    label: "WhatsApp",
    icon: assets.whatsappIcon,
    invert: true,
  },
  {
    href: "https://t.me/theRoboTUM",
    label: "Telegram",
    icon: assets.telegramIcon,
    invert: true,
  },
];

const linkClass =
  "text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:text-white";

const headingClass =
  "mb-3 text-sm font-semibold uppercase tracking-wider text-white/90";

function FooterColumn({ title, links }) {
  return (
    <div className="min-w-40">
      <h3 className={headingClass}>{title}</h3>
      <ul className="flex flex-col gap-2 text-sm">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className={linkClass}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function FooterSection() {
  return (
    <footer className="section-container border-t border-white/10 bg-secondary pt-16 pb-10 text-white">
      <div className="flex flex-wrap justify-center gap-8 text-left md:justify-between">
        {/* Logo + description */}
        <div className="flex min-w-40 flex-col items-center gap-4 md:items-start">
          <img src={assets.logo} alt="RoboTUM Logo" className="h-10" />
          <p className="max-w-xs text-sm text-white/60">
            RoboTUM - Student Initiative at the Technical University of Munich
          </p>
        </div>

        <FooterColumn title="Explore" links={EXPLORE_LINKS} />
        <FooterColumn title="Legal" links={LEGAL_LINKS} />

        {/* Follow us */}
        <div className="min-w-40">
          <h3 className={headingClass}>Follow us</h3>
          <div className="flex flex-wrap gap-3">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 opacity-90 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
              >
                <img
                  src={s.icon}
                  alt=""
                  aria-hidden="true"
                  className={`h-5 w-5 ${s.invert ? "invert" : ""}`}
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-8 border-white/10" />

      {/* Bottom bar */}
      <div className="flex flex-col items-center justify-between gap-2 text-center text-sm text-white/50 md:flex-row">
        <span>© 2026 RoboTUM. All rights reserved.</span>
        <span>Built with ❤️ by the RoboTUM Team</span>
      </div>
    </footer>
  );
}
