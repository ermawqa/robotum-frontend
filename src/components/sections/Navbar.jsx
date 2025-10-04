import { useState } from 'react';
import logoWhite from '../../assets/images/robotum-logo-white.svg';

const links = [
  { label: 'Home', href: '#' },
  { label: 'About us', href: '#about' },
  { label: 'Join us', href: '#join' },
  { label: 'Events', href: '#events' },
  { label: 'Projects', href: '#projects' },
  { label: 'Partners', href: '#partners' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-gray-900 text-white fixed top-0 z-50 shadow font-exo">
      <div className="mx-auto max-w-7xl px-4 flex items-center justify-between h-16">
        <a href="#" className="flex items-center">
          <img
            src={logoWhite}
            alt="RoboTUM logo"
            className="w-[145px] h-[45px] object-contain"
          />
        </a>

        <ul className="hidden md:flex items-center gap-0.5">
          {links.map(l => (
            <li key={l.label}>
              <a
                href={l.href}
                className="inline-flex items-center justify-center px-4 py-3 text-text2 tracking-[0.8px] font-normal hover:text-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="cursor-pointer md:hidden inline-flex items-center justify-center w-10 h-10 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          aria-expanded={open}
          aria-label="Toggle navigation menu"
          onClick={() => setOpen(o => !o)}
        >
          <span className="sr-only">Menu</span>
          <div className="space-y-1.5">
            <span className="block h-0.5 w-6 bg-white" />
            <span className="block h-0.5 w-6 bg-white" />
            <span className="block h-0.5 w-6 bg-white" />
          </div>
        </button>
      </div>

      <div className={`md:hidden px-4 pb-4 transition-all duration-500 ${open ? 'opacity-100 max-h-screen' : 'opacity-0 max-h-0 overflow-hidden'}`}>
        <ul className="flex flex-col gap-1">
          {links.map(l => (
            <li key={l.label}>
              <a
                href={l.href}
                className="block w-full px-4 py-3 text-text2 tracking-[0.8px] font-normal rounded bg-gray-800/60 hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 transition-colors"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}