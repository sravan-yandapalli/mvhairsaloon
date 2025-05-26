'use client';

import React from 'react';

const services = [
  'Hair Replacement',
  'Hair Extensions',
  'Hair Build Fibers',
  'Hair Wefts',
  'Hair Wigs',
  'Chemotherapy/Alopecia Wigs',
  'Hair Transplantation',
  'Human Hair Eyelashes',
];

export default function ScrollingLabels() {
  return (
    <div className="w-full overflow-hidden border-y-2 border-yellow-400 bg-black py-4">
      <div className="flex animate-scroll whitespace-nowrap">
        {[...services, ...services].map((service, index) => (
          <span
            key={index}
            className="mx-8 text-yellow-400 text-sm sm:text-base md:text-lg font-semibold uppercase"
          >
            {service}
          </span>
        ))}
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 25s linear infinite;
        }
      `}</style>
    </div>
  );
}
