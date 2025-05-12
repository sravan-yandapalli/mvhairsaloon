"use client";

import React, { useState } from "react";

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
              <img src="/assets/navbar/rectangle.png" alt="Logo" className="h-10 object-cover" />
              <span className="text-2xl font-serif font-bold">New MV Hair Studio</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="/" className="text-lg hover:text-[#eacb5b] transition">Home</a>
              <a href="#services" className="text-lg hover:text-[#eacb5b] transition">Service List</a>
              <a href="#features" className="text-lg hover:text-[#eacb5b] transition">Features</a>
              <a href="#contact" className="text-lg hover:text-[#eacb5b] transition">Contact</a>
              <a
                href="#appointments"
                className="bg-[#eacb5b] text-black px-4 py-2 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition"
              >
                Book Appointments
              </a>
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
            <a href="/" className="block text-lg py-2 hover:text-[#eacb5b]">Home</a>
            <a href="#services" className="block text-lg py-2 hover:text-[#eacb5b]">Service List</a>
            <a href="#features" className="block text-lg py-2 hover:text-[#eacb5b]">Features</a>
            <a href="#contact" className="block text-lg py-2 hover:text-[#eacb5b]">Contact</a>
            <a
              href="#appointments"
              className="block bg-[#eacb5b] text-black px-4 py-2 rounded-lg text-lg font-semibold text-center hover:bg-yellow-300 transition"
            >
              Book Appointments
            </a>
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
              <img src="/assets/navbar/isolation_mode.svg" alt="Icon" className="h-16 ml-2" />
              <div className="absolute bottom-15 left-0text-white text-[21px] font-normal">
                NEW
              </div>
            </div>
          <div className="max-w-[528px] space-y-5">
            <h1 className="text-white text-[42px] md:text-[58px] font-black italic playfair-4xl md:tracking-[8.7px] text-center leading-none">
              HAIR SALOON
            </h1>
            <p className="text-white text-[28px] md:text-[38px] font-medium italic leading-snug">
              Expert in non-surgical<br />
              Hair Transplantation
            </p>

            <div className="mt-6">
              <a
                href="#appointments"
                className="inline-block bg-[#eacb5b] text-black text-xl md:text-2xl font-medium px-8 py-3 rounded-full hover:bg-yellow-300 transition"
              >
                Book Appointments
              </a>
            </div>

          
          </div>
        </div>
      </section>
    </div>
  );
};
