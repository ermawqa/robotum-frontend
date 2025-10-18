import * as assets from '../../../assets'

import React from 'react';

const ApplicationSection = () => {
  return (
    <section className="bg-[#000C21] py-20 text-white px-6 md:px-20">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Application Process</h2>
        <p className="text-lg md:text-xl text-gray-300">
          Interested in joining RoboTUM? Great! Here’s how our application process works. <br />
          The next application phase will open soon – stay tuned on our Website or follow us on social media.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto text-center">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-xl bg-[#0F1E3C] text-4xl font-bold flex items-center justify-center mb-4">
            1
          </div>
          <h3 className="font-semibold text-lg mb-2">apply</h3>
          <p className="text-gray-300 max-w-xs">
            Fill out our short application form and tell us about yourself, your interests, and what you’d like to contribute to RoboTUM.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-xl bg-[#0F1E3C] text-4xl font-bold flex items-center justify-center mb-4">
            2
          </div>
          <h3 className="font-semibold text-lg mb-2">Interview</h3>
          <p className="text-gray-300 max-w-xs">
            If your application matches one of our open spots, we’ll invite you to a short interview. It’s a casual conversation – we just want to get to know you better!
          </p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-xl bg-[#0F1E3C] text-4xl font-bold flex items-center justify-center mb-4">
            3
          </div>
          <h3 className="font-semibold text-lg mb-2">Welcome!</h3>
          <p className="text-gray-300 max-w-xs">
            If it’s a fit on both sides – welcome to the RoboTUM team! We’ll onboard you, introduce you to your project group, and get you started.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ApplicationSection;
