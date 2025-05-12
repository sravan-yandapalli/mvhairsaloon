// components/Footer.tsx

import React from "react";
import { FaFacebookF, FaTwitter, FaGooglePlusG, FaLinkedinIn, FaYoutube, FaPhoneAlt, FaFax, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#121212] text-gray-300 px-4 sm:px-8 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

        {/* SALON ADDRESS */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">STUDIO ADDRESS</h3>
          <ul className="space-y-2">
            <li className="flex items-center"><FaMapMarkerAlt className="mr-3" />VIZAG | VIJAYAWADA | RAJAMANDURY | HYDERABAD</li>
            <li className="flex items-center"><FaPhoneAlt className="mr-3" />+91 954 265 8504</li>
            <li className="flex items-center"><FaEnvelope className="mr-3" />mv@newmvhairstudio.in</li>
          </ul>
        </div>

        {/* SOCIAL FEED */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">SOCIAL FEED</h3>
          <ul className="space-y-2">
            <li className="flex items-center"><FaFacebookF className="mr-3" />Facebook</li>
            <li className="flex items-center"><FaTwitter className="mr-3" />Twitter</li>
            <li className="flex items-center"><FaGooglePlusG className="mr-3" />Google Plus</li>
            <li className="flex items-center"><FaLinkedinIn className="mr-3" />LinkedIn</li>
            <li className="flex items-center"><FaYoutube className="mr-3" />YouTube</li>
          </ul>
        </div>

        {/* NEWSLETTERS */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">NEWSLETTERS</h3>
          <p className="mb-4 text-sm">Enter your email address to receive new patient information and other useful updates.</p>
          <form className="flex bg-[#1e1e1e] rounded-full overflow-hidden">
            <input
              type="email"
              placeholder="Email Address"
              className="bg-transparent text-white px-4 py-2 w-full outline-none"
            />
            <button
              type="submit"
              className="bg-[#aa9144] text-white px-6 text-sm font-semibold hover:bg-[#c0a84c] transition"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm border-t border-gray-700 pt-4">
        © new MV Hair Studio 2025 | ALL RIGHTS RESERVED
      </div>
    </footer>
  );
};

export default Footer;
