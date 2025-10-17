import navLogo from '../../assets/images/robotum-logo-blue-white.svg'

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative w-full min-h-screen bg-gradient-to-b from-[#000C21] via-[#06142B] to-[#000C21] text-white overflow-hidden font-exo"
    >

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>

      {/* Content */}
      <div className="relative z-20 flex flex-col justify-center items-center text-center px-6 py-24 min-h-screen max-w-4xl mx-auto font-exo">
        {/* Logo */}
        <img
          src={navLogo}
          alt="RoboTUM logo"
          className="w-[220px] h-auto mb-8 drop-shadow-md"
        />
        <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight text-sky-50 drop-shadow-lg">
          Shaping the Future of Robotics
        </h1>
        <p className="mt-6 text-lg md:text-xl text-sky-100 max-w-2xl">
          We are a student initiative formed of robotic enthusiasts.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6">
          <a
            href="#join"
            className="px-8 py-4 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-[15px] tracking-wide font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            Become a Member
          </a>
          <a
            href="#partners"
            className="px-8 py-4 rounded-md bg-white/10 hover:bg-white/20 text-white text-[15px] tracking-wide font-medium backdrop-blur transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/60"
          >
            Become a Partner
          </a>
        </div>
      </div>
    </section>
  )
}