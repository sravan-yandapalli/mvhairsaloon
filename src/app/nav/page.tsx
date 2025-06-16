"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const Navbar: React.FC = () => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div className="w-full">
            <header className="w-full bg-black text-white shadow-md">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <nav className="max-w-[1600px] mx-auto flex items-center justify-between py-3">
                        {/* Logo (icon + text image) */}
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
                            <Link href="/" className="text-lg hover:text-[#eacb5b] transition">
                                Home
                            </Link>
                            <Link href="#service" className="text-lg hover:text-[#eacb5b] transition">
                                Services
                            </Link>
                            <Link href="#blogs" className="text-lg hover:text-[#eacb5b] transition">
                                Blogs
                            </Link>
                            <Link href="#reviews" className="text-lg hover:text-[#eacb5b] transition">
                                Reviews
                            </Link>
                            <Link href="#contact" className="text-lg hover:text-[#eacb5b] transition">
                                Contact Us
                            </Link>
                            <Link
                                href="#appointments"
                                className="bg-[#eacb5b] text-black px-4 py-2 rounded-lg text-lg font-bold hover:bg-yellow-300 transition"
                            >
                                Book Appointments
                            </Link>
                            <Link
                                href="#home-services"
                                className="bg-[#24A0ED] text-white px-4 py-2 rounded-lg text-lg font-bold hover:bg-blue-300 transition"
                            >
                                Home Services
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
                    <div className="md:hidden px-4 py-2 space-y-2 bg-white text-black">
                        <Link href="/" className="block text-lg hover:text-[#eacb5b] transition">
                            Home
                        </Link>
                        <Link href="#service" className="block text-lg hover:text-[#eacb5b] transition">
                            Services
                        </Link>
                        <Link href="#blogs" className="block text-lg hover:text-[#eacb5b] transition">
                            Blogs
                        </Link>
                        <Link href="#service" className="block text-lg hover:text-[#eacb5b] transition">
                            Reviews
                        </Link>
                        <Link href="#contact" className="block text-lg hover:text-[#eacb5b] transition">
                            Contact Us
                        </Link>
                        <Link
                            href="#appointments"
                            className="block bg-[#eacb5b] text-black px-4 py-2 rounded-lg text-lg font-semibold text-center hover:bg-yellow-300 transition"
                        >
                            Book Appointments
                        </Link>
                        <Link
                                href="#home-services"
                                className="bg-[#24A0ED] text-white px-34 py-2 rounded-lg text-lg font-bold hover:bg-blue-300 transition"
                            >
                                Home Services
                            </Link>
                    </div>
                )}
            </header>
        </div>
    );
};

export default Navbar;
