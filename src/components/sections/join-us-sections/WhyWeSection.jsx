import React from 'react';
import * as assets from '../../../assets'


const WhyWeSection = () => {
  return (
    <section className="py-24 px-6 sm:px-10 md:px-20 bg-gradient-to-b from-[#091E3E] to-[#000C21] text-white">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold mb-16">Why RoboTUM?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-24">
          <div className="bg-[#0B1E3B] rounded-3xl px-6 py-12 text-center flex flex-col items-center">
            <img src={assets.handsOnIcon} alt="hands-on experience" className="w-20 h-20 mb-4" />
            <p className="text-lg font-semibold">hands-on experience</p>
          </div>
          <div className="bg-[#0B1E3B] rounded-3xl px-6 py-12 text-center flex flex-col items-center">
            <img src={assets.teamsIcon} alt="interdisciplinary teams" className="w-20 h-20 mb-4" />
            <p className="text-lg font-semibold">interdisciplinary teams</p>
          </div>
          <div className="bg-[#0B1E3B] rounded-3xl px-6 py-12 text-center flex flex-col items-center">
            <img src={assets.eventsIcon} alt="competition & events" className="w-20 h-20 mb-4" />
            <p className="text-lg font-semibold">competition & events</p>
          </div>
        </div>

        <div className="max-w-4xl">
          <h3 className="text-2xl font-bold mb-6">What are we looking for?</h3>
          <p className="text-lg mb-4 leading-relaxed">
            We’re looking for curious, motivated students from all disciplines who have a real interest in robots
            or want to turn ideas into real robots. No matter your background – if you’re excited about robotics
            and ready to learn, you’re in the right place.
          </p>
          <p className="text-lg leading-relaxed">
            You don’t need to be an expert – just bring motivation and willingness to learn. We’ll support you
            from day one.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyWeSection;