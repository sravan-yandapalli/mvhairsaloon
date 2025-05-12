"use client";

import React, { useState } from "react";
import Image from "next/image"; // Importing Image component from next/image
import Link from "next/link"; // Importing Link component from next/link

export const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="w-full">
      {/* NAVBAR */}
      <header className="w-full bg-white text-black shadow-md">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <nav className="max-w-[1600px] mx-auto flex items-center justify-between py-3">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="relative h-10 w-10">
                <Image
                  src="/assets/navbar/rectangle.png"
                  alt="Logo"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <span className="text-2xl font-serif font-bold">New MV Hair Studio</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-lg hover:text-[#eacb5b] transition">
                Home
              </Link>
              <Link href="#services" className="text-lg hover:text-[#eacb5b] transition">
                Service List
              </Link>
              <Link href="#features" className="text-lg hover:text-[#eacb5b] transition">
                Features
              </Link>
              <Link href="#contact" className="text-lg hover:text-[#eacb5b] transition">
                Contact
              </Link>
              <Link
                href="#appointments"
                className="bg-[#eacb5b] text-black px-4 py-2 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition"
              >
                Book Appointments
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={toggleMobileMenu} className="text-3xl focus:outline-none">
                ☰
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden px-4 py-2 space-y-2 bg-white">
            <Link href="/" className="block text-lg py-2 hover:text-[#eacb5b]">
              Home
            </Link>
            <Link href="#services" className="block text-lg py-2 hover:text-[#eacb5b]">
              Service List
            </Link>
            <Link href="#features" className="block text-lg py-2 hover:text-[#eacb5b]">
              Features
            </Link>
            <Link href="#contact" className="block text-lg py-2 hover:text-[#eacb5b]">
              Contact
            </Link>
            <Link
              href="#appointments"
              className="block bg-[#eacb5b] text-black px-4 py-2 rounded-lg text-lg font-semibold text-center hover:bg-yellow-300 transition"
            >
              Book Appointments
            </Link>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section
        className="relative w-full h-[824px] bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/navbar/image 1.png')" }}
      >
        <div className="absolute inset-0 bg-[#211f26] opacity-65"></div>

        <div className="relative z-10 w-full h-full flex flex-col justify-center px-4 sm:px-10 md:px-20 max-w-[1600px] mx-auto space-y-4">
          <div className="relative mt-10">
            <div className="relative h-16 w-16">
              <Image
                src="/assets/navbar/isolation_mode.svg"
                alt="Icon"
                layout="fill"
                objectFit="contain"
              />
            </div>
            <div className="absolute bottom-15 left-0 text-white text-[21px] font-normal">
              NEW
            </div>
          </div>

          <div className="max-w-[528px] space-y-5">
            <h1 className="text-white text-[42px] md:text-[58px] font-black italic playfair-4xl md:tracking-[8.7px] text-center leading-none">
              HAIR SALOON
            </h1>
            <p className="text-white text-[28px] md:text-[38px] font-medium italic leading-snug">
              Expert in non-surgical
              <br />
              Hair Transplantation
            </p>

            <div className="mt-6">
              <Link
                href="#appointments"
                className="inline-block bg-[#eacb5b] text-black text-xl md:text-2xl font-medium px-8 py-3 rounded-full hover:bg-yellow-300 transition"
              >
                Book Appointments
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
