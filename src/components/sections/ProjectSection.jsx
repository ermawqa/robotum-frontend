import { useState } from 'react'
import * as assets from '../../assets'

const projects = [
  {
    title: 'Humanoid Project',
    description:
      'Building the world\'s fastest and most energy-efficient Bipedal Robot. Design, Test, and iterate on hardware systems, work on our RL learning in Simulation, or come up with business proposals for its use cases. The Humanoid project needs every kind of background, from Tech to Marketing and Business! Help push the main technical Project of RoboTUM and revolutionize Humanoids!',
    image: assets.humanoidImg,
    link: '#humanoid'
  },
  {
    title: 'Creative Robotics',
    description:
      'Building awesome robotics stuff with the abundance of resources we have gathered over the past year. Build cocktail mixing robots, self-positioning trash bins, or anything else that comes to your mind. The end goal for every project should be to present at some event somewhere, in order to create value for RoboTUM.',
    image: assets.creativeRobotics,
    link: '#creative-robotics'
  },
  {
    title: 'Website Development',
    description:
      'From our Partnership with TU Design last Semester, we have an amazing website design waiting to be implemented. Help to shape RoboTUM\'s online presence and work on your web development skills!',
    image: assets.websiteDevelopment,
    link: '#website-development'
  },
  {
    title: 'ITQ Plastix Project',
    description:
      'Together with our Partner ITQ, we are starting the PlastiX Project to clean our Beaches of Trash! Work closely together under our Partners supervision to develop an autonomous Robotic system consisting of drones and wheeled robots, to scan and clear beaches from Plastic. This project needs both Hardware and Software support. If you want to build robots and help our Planet while doing so, this is the place for you!',
    image: assets.itqPlastix,
    link: '#itq-plastix-project'
  },
  {
    title: 'Reply',
    description:
      'Together with our sponsor, Reply, we\'re developing a cutting-edge software stack that expands on the autonomous capabilities of the PUMA Quadruped robot. This project is right for you if your focus is on software in autonomous systems!',
    image: assets.replyProject,
    link: '#reply'
  }
]

export default function ProjectSection() {
  const [current, setCurrent] = useState(0)

  const nextProject = () => {
    setCurrent((prev) => (prev + 1) % projects.length)
  }

  const prevProject = () => {
    setCurrent((prev) => (prev - 1 + projects.length) % projects.length)
  }

  return (
    <section
      id="projects"
      className="w-full px-6 py-24 bg-gradient-to-b from-[#000C21] via-[#06142B] to-[#000C21] text-white font-exo"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left side */}
        <div className="md:w-1/2 relative min-h-[320px]">
          <div key={current} className="absolute inset-0 transition-opacity duration-500 ease-in-out opacity-100">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {projects[current].title}
            </h2>
            <p className="text-lg text-sky-100 mb-8">
              {projects[current].description}
            </p>
            <a
              href={projects[current].link}
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-md text-white text-[15px]"
            >
              View more →
            </a>
          </div>
        </div>

        {/* Right side */}
        <div className="md:w-1/2 relative">
          <div className="transition-all duration-500 ease-in-out">
            <img
              src={projects[current].image}
              alt={projects[current].title}
              className="rounded-lg w-full max-w-md mx-auto shadow-lg border border-white/10"
            />
          </div>
          <button
            onClick={prevProject}
            aria-label="Previous project"
            className="cursor-pointer absolute -left-5 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-full transition-all"
          >
            ←
          </button>
          <button
            onClick={nextProject}
            aria-label="Next project"
            className="cursor-pointer absolute -right-5 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-full transition-all"
          >
            →
          </button>
        </div>
      </div>

      {/* Dots indicator */}
      <div className="mt-10 flex justify-center gap-2">
        {projects.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === current ? 'bg-white' : 'bg-gray-400/40'
            }`}
          />
        ))}
      </div>
    </section>
  )
}