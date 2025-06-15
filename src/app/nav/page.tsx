"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoMenu, IoClose } from "react-icons/io5";

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="w-full z-50 fixed top-0 backdrop-blur-md bg-gradient-to-r from-[#1a1a1a]/90 to-[#2c2c2c]/90 text-white shadow-lg">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-[70px]">
          {/* Logo */}
          <div className="flex items-center space-x-3">
                            {/* Logo Icon */}
                            <div className="relative h-8 bottom-1.5 w-13">
                                <Image
                                    src="/assets/navbar/Asset 1.svg"
                                    alt="Logo Icon"
                                    layout="fill"
                                    objectFit="contain"
                                    priority
                                />
                            </div>
                            {/* Logo Text Image */}
                            <div className="relative h-8 w-[160px]">
                                <Image
                                    src="/assets/navbar/Asset 3.svg"
                                    alt="New MV Hair Studio"
                                    layout="fill"
                                    objectFit="contain"
                                    priority
                                />
                            </div>
                        </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {["Home", "Services", "Blogs", "Reviews", "Contact Us"].map((text, index) => (
              <Link
                key={index}
                href={`#${text.toLowerCase().replace(" ", "-")}`}
                className="text-base hover:text-[#FFD700] transition"
              >
                {text}
              </Link>
            ))}
            <Link
              href="#appointments"
              className="bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-black hover:text-white transition"
            >
              Book Appointment
            </Link>
            <Link
              href="#home-services"
              className="bg-[#CC5500] text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-300 hover:text-black transition"
            >
              Home Services
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="text-3xl">
              {isMobileMenuOpen ? <IoClose /> : <IoMenu />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#1a1a1a] text-white px-4 py-6 space-y-4 rounded-b-xl shadow-xl transition-all duration-300">
          {["Home", "Services", "Blogs", "Reviews", "Contact Us"].map((text, index) => (
            <Link
              key={index}
              href={`#${text.toLowerCase().replace(" ", "-")}`}
              className="block text-lg hover:text-[#FFD700] transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              {text}
            </Link>
          ))}
          <Link
            href="#appointments"
            className="block bg-white text-black px-4 py-2 rounded-lg text-center font-semibold hover:bg-[#FFD700] transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            Book Appointment
          </Link>
          <Link
            href="#home-services"
            className="block bg-[#FFD700] text-black px-4 py-2 rounded-lg text-center font-semibold hover:bg-white transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home Services
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
