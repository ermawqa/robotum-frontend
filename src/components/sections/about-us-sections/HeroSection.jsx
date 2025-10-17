import * as assets from '../../../assets'

import React, { useEffect, useState } from 'react';

const Counter = ({ target }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2500;
    const increment = Math.ceil(target / (duration / 16)); // ~60fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target]);

  return <span>{count}</span>;
};

export default function About() {
  return (
    <section className="text-white pt-28 pb-16 px-6 bg-gradient-to-b from-[#000C21] to-[#00142F] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-16">
          <div className="md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              More than a<br /> student club!
            </h2>
            <p className="text-lg font-medium text-gray-300">
              We bring together students from all disciplines to turn ideas into real robots – hands on and driven by passion.
            </p>
          </div>
          <div className="md:w-1/2">
            <img
              src={assets.auditoryImg}
              alt="About"
              className="rounded-xl w-full"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="rounded-xl p-6 bg-[#0B1B37] shadow-md">
            <p className="text-5xl font-semibold text-blue-100">
              <Counter target={100} />
            </p>
            <p className="mt-2 text-sm font-light text-gray-300">active members</p>
          </div>
          <div className="rounded-xl p-6 bg-[#0B1B37] shadow-md">
            <p className="text-5xl font-semibold text-blue-100">
              <Counter target={21} />
            </p>
            <p className="mt-2 text-sm font-light text-gray-300">partners &amp; sponsors</p>
          </div>
          <div className="rounded-xl p-6 bg-[#0B1B37] shadow-md">
            <p className="text-5xl font-semibold text-blue-100">
              <Counter target={3} />
            </p>
            <p className="mt-2 text-sm font-light text-gray-300">projects in development</p>
          </div>
        </div>
      </div>
    </section>
  );
}