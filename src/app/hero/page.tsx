'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const backgroundImages = [
  "/assets/hero/10.jpg",
  "/assets/hero/11.jpg",
  "/assets/hero/12.jpg",
  "/assets/hero/3.jpeg",
  
];

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % backgroundImages.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full min-h-screen flex flex-col md:flex-row items-center justify-between bg-[#0C1B33] text-white px-6 sm:px-10 md:px-16 lg:px-24 py-10">
      
      {/* Left - Text Content */}
      <div className="w-full md:w-1/2 space-y-6">
        <div className="w-36 h-16 relative mb-4">
          <Image
            src="/assets/navbar/Asset 1.svg"
            alt="Logo"
            fill
            className="object-contain"
          />
        </div>

        <div className="w-86 h-16 relative mb-4">
          <Image
            src="/assets/navbar/Asset 3.svg"
            alt="Logo"
            fill
            className="object-contain"
          />
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-[#D4AF37]">
          Non-Surgical Hair Restoration
        </h1>

        <p className="text-gray-200 text-lg sm:text-xl font-light">
          Restore your confidence with pain-free, natural-looking hair replacement treatments led by professionals.
        </p>

        <Link
          href="#appointments"
          className="inline-block mt-4 bg-[#D4AF37] hover:bg-[#e1c563] text-black font-semibold text-lg px-8 py-3 rounded-full transition"
        >
          Book Free Consultation
        </Link>
      </div>

      {/* Right - Image Gallery */}
      <div className="w-full md:w-1/2 mt-10 md:mt-0 flex justify-center relative">
        <div className="w-[620px] h-[420px] sm:w-[680px] sm:h-[480px] relative rounded-xl overflow-hidden shadow-xl border border-[#2a2a35]">
          <Image
            src={backgroundImages[currentImageIndex]}
            alt="Hair Service"
            fill
            className="object-cover transition duration-1000 ease-in-out"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
