

import memberImg from '../../assets/images/foundations-team.jpg' 
import partnerImg from '../../assets/images/foundations-team.jpg' 

export default function JoinUsSection() {
  return (
    <section
      id="join"
      className="w-full px-6 py-24 bg-gradient-to-b from-[#000C21] via-[#06142B] to-[#000C21] text-white font-exo"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        {/* Become a Member */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          <img
            src={memberImg}
            alt="Join as Member"
            className="md:w-1/2 w-full rounded-xl shadow-lg border border-white/10"
          />
          <div className="md:w-1/2 w-full space-y-6">
            <h2 className="text-4xl font-bold">Become a Member</h2>
            <p className="text-slate-300">
              Join RoboTUM and shape the future of robotics with us. Attend our events,
              participate in projects, and grow your skills alongside passionate innovators.
            </p>
            <div className="flex gap-4">
              <a
                href="#apply"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-md text-white font-medium"
              >
                Apply Now
              </a>
              <a
                href="#learn-more"
                className="px-6 py-3 border border-white/30 hover:border-white/60 rounded-md text-white font-medium"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>

        {/* Become a Partner */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-8">
          <img
            src={partnerImg}
            alt="Join as Partner"
            className="md:w-1/2 w-full rounded-xl shadow-lg border border-white/10"
          />
          <div className="md:w-1/2 w-full space-y-6">
            <h2 className="text-4xl font-bold">Become a Partner</h2>
            <p className="text-slate-300">
              Collaborate with RoboTUM to sponsor innovation, support future engineers,
              and gain visibility in our events and projects.
            </p>
            <div className="flex gap-4">
              <a
                href="#partner"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-md text-white font-medium"
              >
                Become a Partner
              </a>
              <a
                href="#view-partners"
                className="px-6 py-3 border border-white/30 hover:border-white/60 rounded-md text-white font-medium"
              >
                View Partners
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}