
export default function MissionSection() {
  return (
    <section className="bg-[#000C21] text-white font-exo px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold leading-tight mb-16">
          We are a student initiative <br />
          formed of robotic <br />
          enthusiasts.
        </h2>

        <div className="bg-[#E5F0FF] text-[#000C21] rounded-xl p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vision */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold">Vision</h3>
            <p className="text-base">
              To establish Munich as a global robotics hub, comparable to Boston or Switzerland
            </p>
          </div>

          {/* Mission */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold">Mission</h3>
            <p className="text-base">
              To bridge the gap between robotic industry and academia, driving innovation and entrepreneurship
            </p>
            <a
              href="/about"
              className="self-start mt-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition"
            >
              About Us →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}