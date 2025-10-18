import React from 'react';
import * as assets from '../../../assets';

const HeroSection = () => {
  return (
    <section className="bg-[#000C21] text-white py-20 px-6 md:px-20">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Where ideas <br /> connect and grow!
          </h1>
          <p className="text-lg text-gray-300 font-medium leading-relaxed">
            Join thought-provoking events that bring together students, professionals, and innovators.
            Whether it's inspiring keynotes, interactive workshops, or networking opportunities – each
            event offers space for exchange, reflection, and growth.
          </p>
        </div>
        <div className="flex-1">
          <img
            src={assets.eventsHero}
            alt="Robot and speaker at event"
            className="rounded-[3rem] w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

