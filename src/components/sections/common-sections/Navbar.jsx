import { useState, useEffect, useRef, useCallback } from 'react'
import * as assets from '../../../assets'

const links = [
  { label: 'Home', href: '#' },
  { label: 'About us', href: '#about' },
  { label: 'Join us', href: '#join' },
  { label: 'Events', href: '#events' },
  {
    label: 'Projects',
    href: '#projects',
    dropdown: true,
    subLinks: ['Humanoid', 'Creative Robotics', 'Website Development', 'ITQ Plastix', 'Reply'],
  },
  { label: 'Partners', href: '#partners' },
]

function ProjectDropdown({ open, onEnter, onLeave, onItemClick }) {
  return (
    open && (
      <div
        className="absolute left-0 top-full min-w-[160px] rounded-md bg-[#06142B]/90 backdrop-blur px-2 py-2 shadow-lg ring-1 ring-white/10"
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        {['Humanoid', 'Creative Robotics', 'Website Development', 'ITQ Plastix', 'Reply'].map(item => (
          <a
            key={item}
            href="#projects"
            role="menuitem"
            tabIndex="0"
            className="block px-3 py-2 text-[14px] tracking-[0.8px] rounded text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            onClick={onItemClick}
          >
            {item}
          </a>
        ))}
      </div>
    )
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [projectsOpen, setProjectsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const hoverTimer = useRef(null)
  const currentHash = window.location.hash

  const handleProjectsEnter = useCallback(() => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    setProjectsOpen(true)
  }, [])

  const handleProjectsLeave = useCallback(() => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    hoverTimer.current = setTimeout(() => setProjectsOpen(false), 150)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)

    const handleKeyDown = e => {
      if (e.key === 'Escape') {
        setOpen(false)
        setProjectsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const itemBase =
    'inline-flex items-center justify-center px-4 py-3 text-[14px] tracking-[0.8px] font-normal text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 hover:text-indigo-300 cursor-pointer'

  return (
    <nav
      className={`bg-gradient-to-b from-[#000C21] via-[#06142B] to-[#000C21] fixed top-0 left-0 right-0 z-50 font-exo transition-opacity ${
        scrolled ? 'opacity-95' : 'opacity-85'
      }`}
    >
      <div className="mx-auto max-w-7xl w-full px-2 sm:px-4 pt-3 pb-1.5">
        <div className="flex w-full justify-between">
          <a
            href="#"
            className="pl-3 pr-3 flex"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img
              src={assets.navLogo}
              alt="RoboTUM logo"
              className="w-[130px] h-[40px] object-contain"
            />
          </a>

          <ul className="hidden md:flex items-start gap-0">
            {links.map(l => {
              if (l.dropdown) {
                return (
                  <li
                    key={l.label}
                    className="relative"
                    onMouseEnter={handleProjectsEnter}
                    onMouseLeave={handleProjectsLeave}
                  >
                    <button
                      type="button"
                      onClick={() => setProjectsOpen(o => !o)}
                      aria-haspopup="true"
                      aria-expanded={projectsOpen}
                      className={`${itemBase} rounded-md`}
                    >
                      {l.label.toUpperCase()}
                      <svg
                        className={`ml-2 h-3 w-3 transition-transform ${
                          projectsOpen ? 'rotate-180' : ''
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
                    <ProjectDropdown
                      open={projectsOpen}
                      onEnter={handleProjectsEnter}
                      onLeave={handleProjectsLeave}
                      onItemClick={() => setProjectsOpen(false)}
                    />
                  </li>
                )
              }
              return (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className={`${itemBase} rounded-md ${
                      currentHash === l.href ? 'text-indigo-400' : ''
                    }`}
                  >
                    {l.label.toUpperCase()}
                  </a>
                </li>
              )
            })}
          </ul>

          <button
            className="md:hidden inline-flex items-center justify-center w-10 h-10 mr-2 rounded-md cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            aria-expanded={open}
            aria-label="Toggle navigation menu"
            onClick={() => setOpen(o => !o)}
          >
            <span className="sr-only">Menu</span>
            <div className="space-y-1">
              <span className="block h-0.5 w-6 bg-white" />
              <span className="block h-0.5 w-6 bg-white" />
              <span className="block h-0.5 w-6 bg-white" />
            </div>
          </button>
        </div>
      </div>

      <div
        className={`md:hidden px-4 bg-[#000C21] transition-all duration-400 ${
          open ? 'opacity-100 max-h-screen pb-3' : 'opacity-0 max-h-0 overflow-hidden'
        }`}
      >
        <ul className="flex flex-col gap-1">
          {links.map(l => (
            <li key={l.label}>
              <a
                href={l.href}
                onClick={() => {
                  setOpen(false)
                  setProjectsOpen(false)
                }}
                className={`block w-full px-4 py-3 text-[14px] tracking-[0.8px] rounded-md bg-[#112238]/60 hover:bg-[#1A2E49]/80 backdrop-blur transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 text-white ${
                  currentHash === l.href ? 'text-indigo-400' : ''
                }`}
              >
                {l.label.toUpperCase()}
              </a>
              {l.subLinks && open && (
                <ul className="ml-4 mt-1">
                  {l.subLinks.map(sub => (
                    <li key={sub}>
                      <a
                        href="#projects"
                        className="block px-4 py-2 text-[13px] text-white hover:text-white"
                        onClick={() => {
                          setOpen(false)
                          setProjectsOpen(false)
                        }}
                      >
                        {sub}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}