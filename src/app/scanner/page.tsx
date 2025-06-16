'use client';
// pages/scan.tsx
import React from 'react';

const locations = [
  {
    name: 'Vizag (Visakhapatnam)',
    link: 'https://www.google.com/maps/place/Visakhapatnam,+Andhra+Pradesh',
    image: '/assets/viz.jfif',
    description: 'Coastal city known for its beaches, ports, and scenic hills.',
  },
  {
    name: 'Vijayawada',
    link: 'https://www.google.com/maps/place/Vijayawada,+Andhra+Pradesh',
    image: '/assets/vij.jfif',
    description: 'Bustling city on the Krishna river, famous for the Kanaka Durga temple.',
  },
  {
    name: 'Rajahmundry',
    link: 'https://www.google.com/maps/place/Rajahmundry,+Andhra+Pradesh',
    image: '/assets/raj.jfif',
    description: 'Cultural capital of Andhra, located on the banks of the Godavari River.',
  },
  {
    name: 'Hyderabad',
    link: 'https://www.google.com/maps/place/Hyderabad,+Telangana',
    image: '/assets/hyd.jfif',
    description: 'Metro hub known for tech, biryani, and the historic Charminar.',
  },
];

const LocationPage = () => {
  const openMap = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col items-center px-6 py-12">
      <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-4 text-center">
        📍 Different Place Locations
      </h1>
      <p className="text-lg text-gray-300 mb-10 text-center max-w-xl">
        Explore our services in major cities. Tap below to view directions directly in Google Maps.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl">
        {locations.map((loc) => (
          <div
            key={loc.name}
            className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-yellow-500 transition transform hover:scale-105"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={loc.image}
              alt={loc.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col justify-between h-48">
              <h2 className="text-xl font-semibold text-white mb-2">{loc.name}</h2>
              <p className="text-sm text-gray-300 mb-4 line-clamp-3">{loc.description}</p>
              <button
                onClick={() => openMap(loc.link)}
                className="mt-auto bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-lg transition"
              >
                Open in Maps
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationPage;
