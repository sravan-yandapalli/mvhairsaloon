// components/Service.tsx

import React from "react";

const Service = () => {
  return (
    <div className="bg-[#121212] text-white py-16 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Our Services</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#1e1e1e] rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Haircut & Styling</h3>
            <p className="text-gray-300">Professional haircuts, styling, and grooming tailored to your look.</p>
          </div>

          <div className="bg-[#1e1e1e] rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Beard Trimming</h3>
            <p className="text-gray-300">Clean, sharp beard styles and maintenance for every face shape.</p>
          </div>

          <div className="bg-[#1e1e1e] rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Hair Color</h3>
            <p className="text-gray-300">Modern hair coloring using safe and stylish products.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Service;
