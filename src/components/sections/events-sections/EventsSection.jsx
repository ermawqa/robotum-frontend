import React, { useState } from 'react';
import * as assets from '../../../assets';

const events = [
  {
    id: 1,
    category: 'Hackathons',
    title: 'Hackathon',
    date: '17.07.2025',
    description:
      'A high-energy, team-based innovation sprint where participants collaboratively develop creative technical solutions to real-world challenges — all within 24 hours.',
    image: assets.event1,
  },
  {
    id: 2,
    category: 'Conferences',
    title: 'Robot Summit',
    date: '24.07.2025',
    description:
      'An interdisciplinary event bringing together experts, researchers, and students to discuss the latest developments in robotics, AI, and automation.',
    image: assets.event2,
  },
  {
    id: 3,
    category: 'Info events',
    title: 'RoboTUM info session',
    date: '28.07.2025',
    description:
      'An introductory session providing insights into RoboTUM’s mission, projects, and how students can get involved in one of the university’s leading robotics clubs.',
    image: assets.event3,
  },
  {
    id: 4,
    category: 'Conferences',
    title: 'RoboCast speaker series #3',
    date: '30.07.2025',
    description:
      'The third edition of our expert talk series, featuring a guest speaker from academia or industry sharing cutting-edge insights into robotics and AI.',
    image: assets.event4,
  },
  {
    id: 5,
    category: 'Conferences',
    title: '1min paper review',
    date: '04.08.2025',
    description:
      'A fast-paced session where recent robotics and AI publications are presented and discussed — each in just one minute. Designed to keep the community informed and inspired.',
    image: assets.event5,
  },
];

const categories = ['All', 'Hackathons', 'Conferences', 'Info events'];

export default function EventsSection() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredEvents =
    activeCategory === 'All'
      ? events
      : events.filter((e) => e.category === activeCategory);

  return (
    <section className="px-4 py-16 md:px-8 bg-[#000c21] text-white">
      <div className="flex justify-center mb-10 flex-wrap gap-4">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-6 py-2 rounded-full border ${
              activeCategory === cat
                ? 'bg-[#3f5ea6] text-white'
                : 'border-[#3f5ea6] text-[#3f5ea6] hover:bg-[#3f5ea6] hover:text-white'
            } transition duration-200 cursor-pointer`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-10 sm:grid-cols-2">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-[#0c1a3a] rounded-lg p-4 flex flex-col items-center text-center"
          >
            <img
              src={event.image}
              alt={event.title}
              className="rounded-lg w-full h-[250px] object-cover mb-4"
            />
            <h3 className="text-xl font-semibold">{event.title}</h3>
            <p className="text-sm opacity-75 mb-2">{event.date}</p>
            <p className="text-sm mb-4">{event.description}</p>
            <button className="px-6 py-2 bg-[#3f5ea6] text-white rounded-full hover:bg-[#577ae0] transition">
              Register
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}