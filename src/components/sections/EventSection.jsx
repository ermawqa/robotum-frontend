import { useState } from 'react'
import speakerImg from '../../assets/images/marco.jpg' 

const events = [
  {
    date: 'JUL 05',
    category: 'RoboTalk',
    title: 'Speaker Series #1 - Julian Hoffmann',
    description: '19:00 TUM Seminarraum (5532.EG.002)\nBuilding autonomous robots onto construction sites',
    link: '#'
  },
  {
    date: 'JUL 11',
    category: 'RoboTalk',
    title: 'Speaker Series #2 - Pedro Jinjun Dong',
    description: '19:00 TUM Seminarraum (5532.EG.002)\nBuilding autonomous robots onto construction sites',
    link: '#'
  },
  {
    date: 'AUG 08',
    category: 'Competition',
    title: 'Hackathon 2025',
    description: 'Join us for a weekend of coding, collaboration, and competition!',
    link: '#'
  },
  {
    date: 'OCT 23',
    category: 'Club Event',
    title: 'TUM Student Club Fair 2025',
    description: 'Explore various student initiatives and clubs at TUM.',
    link: '#'
  }
]

export default function EventSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section
      id="events"
      className="w-full px-6 py-24 bg-gradient-to-b from-[#000C21] via-[#06142B] to-[#000C21] text-white font-exo"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Left side - image and title */}
        <div className="md:w-5/12 text-left">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Upcoming Events</h2>
          <img
            src={speakerImg}
            alt="Event speaker"
            className="rounded-lg border border-white/20 shadow-lg"
          />
        </div>

        {/* Right side - events */}
        <div className="md:w-7/12 flex flex-col gap-6">
          {events.map((event, index) => {
            const [month, day] = event.date.split(' ')
            const isActive = activeIndex === index
            return (
              <div
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`cursor-pointer p-6 rounded-xl border transition-all duration-300 ${
                  isActive
                    ? 'bg-blue-900/50 border-blue-500'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="text-center">
                      <div className="text-sm font-bold text-slate-300">{month}</div>
                      <div className="text-2xl font-bold text-white leading-none">{day}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-300">{event.category}</div>
                      <div className="text-[15px] font-semibold text-white">
                        {event.title}
                      </div>
                    </div>
                  </div>
                  <div className="text-white text-xl">{isActive ? '▾' : '▸'}</div>
                </div>

                {isActive && event.description && (
                  <div className="mt-4 text-slate-200 whitespace-pre-line">
                    {event.description}
                    {event.link && (
                      <div className="mt-4">
                        <a
                          href={event.link}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-sm rounded-md inline-block"
                        >
                          Register →
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}