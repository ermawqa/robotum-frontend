import robotBg from '../../assets/images/robot_background.svg';

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#000C21]">
      {/* Background image (stronger visibility) */}
      <img
        src={robotBg}
        alt="Robot Background"
        className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent z-10"
      />

      {/* Softer gradient (reduced darkness) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#000C21]/20 via-[#000C21]/25 to-[#000C21]/45 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <h1 className="font-extrabold font-[Exo] text-4xl md:text-6xl tracking-wide text-sky-50">
          Shaping the Future of Robotics
        </h1>
        <p className="mt-6 text-sky-200 text-base md:text-lg max-w-2xl mx-auto">
          Building, researching, and innovating together.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#join"
            className="px-8 py-3 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
          >
            Join Us
          </a>
          <a
            href="#projects"
            className="px-8 py-3 rounded-md bg-white/10 hover:bg-white/20 text-sky-50 text-sm font-medium backdrop-blur transition-colors"
          >
            Our Projects
          </a>
        </div>
      </div>
    </section>
  );
}