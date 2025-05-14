"use client";

import React, { useState } from "react";
import Image from "next/image"; // Importing Image component from next/image
import Link from "next/link";


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
              <Link href="#why" className="text-lg hover:text-[#eacb5b] transition">
                About Us
              </Link>
              <Link href="#service" className="text-lg hover:text-[#eacb5b] transition">
                Services
              </Link>
              <Link href="#contact" className="text-lg hover:text-[#eacb5b] transition">
                Contact Us
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
            <Link href="" className="block text-lg py-2 hover:text-[#eacb5b]">
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
    </div>
  );
};
