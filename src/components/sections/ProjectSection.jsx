import { useState } from 'react'
import humanoidImg from '../../assets/images/project1.png'
import aiKitchenImg from '../../assets/images/project1.png'

const projects = [
  {
    title: 'Humanoid Project',
    description:
      'Building the fastest and most energy efficient humanoid robot in the world. Pushing the limits of energy-efficient locomotion, combining AI-aided bioinspired control and underactuated mechanical design.',
    image: humanoidImg,
    link: '#humanoid'
  },
  {
    title: 'AI Kitchen Assistant',
    description:
      'Creating a domestic robot capable of performing tasks like cooking, dishwashing, and interacting with humans in kitchen environments using natural language.',
    image: aiKitchenImg,
    link: '#ai-kitchen'
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
        <div className="md:w-1/2">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {projects[current].title}
          </h2>
          <p className="text-lg text-sky-100 mb-8">
            {projects[current].description}
          </p>
          <a
            href={projects[current].link}
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-md text-white text-[15px] transition-colors"
          >
            View more →
          </a>
        </div>

        {/* Right side */}
        <div className="md:w-1/2 relative">
          <img
            src={projects[current].image}
            alt={projects[current].title}
            className="rounded-lg w-full max-w-md mx-auto shadow-lg border border-white/10"
          />
          <button
            onClick={prevProject}
            aria-label="Previous project"
            className="absolute -left-5 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-full"
          >
            ←
          </button>
          <button
            onClick={nextProject}
            aria-label="Next project"
            className="absolute -right-5 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-full"
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