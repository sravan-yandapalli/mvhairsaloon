'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const backgroundImages = [
  "/assets/services/replac.jpg",
  "/assets/services/6.jpg",
  "/assets/services/hero.png",
  "/assets/services/her.png",
]; // Add as many images as needed

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % backgroundImages.length
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
      style={{
        backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#211f26] opacity-75"></div>

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center items-center px-4 sm:px-10 md:px-20 max-w-[1600px] mx-auto space-y-6 text-center">
        
        {/* NEW Icon */}
        <div className="relative mt-40">
          <div className="relative h-18 w-46 mx-auto">
            <Image
              src="/assets/navbar/lo.png"
              alt="Icon"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>

        {/* Heading and Description */}
        <div className="max-w-[528px] space-y-5">
          <h1 className="text-white text-[36px] sm:text-[42px] md:text-[58px] select-none font-black italic playfair-4xl md:tracking-[8.7px] leading-tight">
            HAIR <span className="text-[#eacb8b]">STUDIO</span>
          </h1>
          <p className="text-white text-[22px] sm:text-[28px] md:text-[38px] select-none font-medium italic leading-snug">
            Expert in non-surgical
            <br />
            Hair Transplantation
          </p>

          {/* Call to Action Button */}
          <div className="mt-6">
            <Link
              href="#appointments"
              className="inline-block bg-[#eacb5b] text-black text-xl md:text-2xl select-none font-medium px-8 py-3 rounded-full hover:bg-yellow-300 transition"
            >
              Book Appointments
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
