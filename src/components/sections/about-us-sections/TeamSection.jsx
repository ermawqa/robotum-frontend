import React, { useState } from 'react';
import * as assets from '../../../assets';

const teamData = [
  {
    name: 'Loren Ipsum',
    position: 'Founder',
    category: 'Founders',
    image: assets.member,
    linkedin: '#'
  },
  {
    name: 'Loren Ipsum',
    position: 'Lead',
    category: 'Departments Leads',
    image: assets.member,
    linkedin: '#'
  },
  {
    name: 'Loren Ipsum',
    position: 'Project Manager',
    category: 'Projects',
    image: assets.member,
    linkedin: '#'
  },
  {
    name: 'Loren Ipsum',
    position: 'Project Manager',
    category: 'Projects',
    image: assets.member,
    linkedin: '#'
  },
  {
    name: 'Loren Ipsum',
    position: 'Project Manager',
    category: 'Projects',
    image: assets.member,
    linkedin: '#'
  },
  {
    name: 'Loren Ipsum',
    position: 'Project Manager',
    category: 'Projects',
    image: assets.member,
    linkedin: '#'
  },
  {
    name: 'Loren Ipsum',
    position: 'Project Manager',
    category: 'Projects',
    image: assets.member,
    linkedin: '#'
  },
  {
    name: 'Loren Ipsum',
    position: 'Project Manager',
    category: 'Projects',
    image: assets.member,
    linkedin: '#'
  },
  {
    name: 'Loren Ipsum',
    position: 'Project Manager',
    category: 'Projects',
    image: assets.member,
    linkedin: '#'
  },
  {
    name: 'Loren Ipsum',
    position: 'Project Manager',
    category: 'Projects',
    image: assets.member,
    linkedin: '#'
  },
  // Add more team members with appropriate categories
];

const categories = ['All', 'Founders', 'Departments Leads', 'Projects'];

export default function TeamSection() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTeam = selectedCategory === 'All'
    ? teamData
    : teamData.filter(member => member.category === selectedCategory);

  return (
    <section className="py-16 px-6 lg:px-20 bg-gradient-to-b from-[#000C21] to-[#000c21d3]">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Meet Our Team</h2>

      <div className="flex flex-wrap gap-4 mb-12">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2 rounded-full border transition cursor-pointer ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'border-blue-500 text-blue-300 hover:bg-blue-500 hover:text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredTeam.map((member, index) => (
          <div key={index} className="text-center text-white max-w-[140px] mx-auto">
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-[140px] object-cover rounded-xl mb-4"
            />
            <h3 className="font-semibold">{member.name}</h3>
            <p className="text-sm text-gray-300">{member.position}</p>
            <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
              <img src={assets.linkedinIcon} alt="LinkedIn" className="w-5 h-5 mx-auto mt-2" />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
