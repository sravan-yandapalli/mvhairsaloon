"use client";
import React from "react";
import Image from "next/image";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaInstagram,
  FaWhatsapp,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#121212] text-gray-300 px-4 sm:px-8 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

        {/* STUDIO ADDRESS */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">STUDIO ADDRESS</h3>
          <ul className="space-y-2">
            <li className="flex items-center">
              <FaMapMarkerAlt className="mr-3" />
              VIZAG | VIJAYAWADA | RAJAHMUNDRY | HYDERABAD
            </li>
            <li className="flex items-center">
              <FaPhoneAlt className="mr-3" />
              <a href="tel:+919542658504" className="hover:underline">
                +91 954 265 8504
              </a>
            </li>
            <li className="flex items-center">
              <FaEnvelope className="mr-3" />
              <a href="mailto:mv@newmvhairstudio.in" className="hover:underline">
                mv@newmvhairstudio.in
              </a>
            </li>
          </ul>
        </div>

        {/* SOCIAL LINKS */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">CONNECT WITH US</h3>
          <ul className="space-y-2">
            <li className="flex items-center">
              <FaFacebookF className="mr-3" />
              <a
                href="https://www.facebook.com/profile.php?id=61576604253552"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Facebook
              </a>
            </li>
            <li className="flex items-center">
              <FaInstagram className="mr-3" />
              <a
                href="https://www.instagram.com/newmv.hairstudio?igsh=dmthMG1tNnp6enBx&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Instagram
              </a>
            </li>
            <li className="flex items-center">
              <FaLinkedinIn className="mr-3" />
              <a
                href="http://linkedin.com/in/new-mv-hair-studio-388578367"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                LinkedIn
              </a>
            </li>
            <li className="flex items-center">
              <FaYoutube className="mr-3" />
              <a
                href="https://www.youtube.com/channel/UCz20m3XryBZN0gBaH0a1KLw"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                YouTube
              </a>
            </li>
            <li className="flex items-center">
              <FaWhatsapp className="mr-3" />
              <a
                href="https://wa.me/919542658504"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                WhatsApp
              </a>
            </li>
          </ul>
        </div>

        {/* SUBSCRIBE + QR IMAGE */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">SUBSCRIBE</h3>
          <p className="mb-4 text-sm">
            Click below to send us an email and receive updates & offers.
          </p>
          <a
            href="mailto:mv@newmvhairstudio.in?subject=Subscribe%20Me&body=Please%20subscribe%20me%20to%20your%20newsletter."
            className="inline-block bg-[#aa9144] text-white px-6 py-2 text-sm font-semibold rounded-full hover:bg-[#c0a84c] transition"
          >
            SUBSCRIBE VIA EMAIL
          </a>

          {/* QR Code Image */}
          <div className="mt-6">
            <h4 className="text-white font-semibold mb-2 text-sm">Scan For Locations :</h4>
            <Image
              src="/assets/qr.png"
              alt="QR Code"
              width={120}
              height={120}
              className="rounded-lg border border-gray-500"
            />
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="text-center text-sm border-t border-gray-700 pt-4">
        © new MV Hair Studio 2025 | ALL RIGHTS RESERVED
      </div>
    </footer>
  );
};

export default Footer;
