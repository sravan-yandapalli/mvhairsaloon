'use client';
<<<<<<< HEAD
=======
<<<<<<< HEAD

import { useEffect, useState } from 'react';
import Image from 'next/image';
import BookAppointment from './appointment/page';
import Navbar from './nav/page';
import Service from './service/page';
// Make sure the path below matches the actual location of your Footer component
import Footer from './fotter/page';
import HeroSection from './hero/page';
import WhyChooseUs from './why/page';
=======
>>>>>>> 221b09b5a0654a8fc648059d0ebb91d8b53bb28a
import { useEffect, useState } from 'react';

import BookAppointment from './appointment/page';
import Navbar from './nav/page'; 
import Service from './service/page';
import Footer from './fotter/page';
import HeroSection from './hero/page';
import WhyChooseUs from './why/page';
import Image from 'next/image';
<<<<<<< HEAD
=======
>>>>>>> 343f451fae4b866886b17a8e6e4492a505d9c4b7
>>>>>>> 221b09b5a0654a8fc648059d0ebb91d8b53bb28a
import BlogUploader from './blogs/page';
import Feedback from './review/page';
import HomeServices from './hservice/page';
import ScrollingLabels from './scroll/page';
<<<<<<< HEAD
=======
<<<<<<< HEAD
import HairTransplantFAQ from './faq/page';
=======
>>>>>>> 343f451fae4b866886b17a8e6e4492a505d9c4b7
>>>>>>> 221b09b5a0654a8fc648059d0ebb91d8b53bb28a

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
<<<<<<< HEAD
    // Simulate loading duration (e.g., 2 seconds)
=======
<<<<<<< HEAD
=======
    // Simulate loading duration (e.g., 2 seconds)
>>>>>>> 343f451fae4b866886b17a8e6e4492a505d9c4b7
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

>>>>>>> 221b09b5a0654a8fc648059d0ebb91d8b53bb28a
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <Image
<<<<<<< HEAD
          src="/assets/studio-loader.gif" // your loading logo or animation
=======
<<<<<<< HEAD
          src="/assets/studio-loader.gif"
=======
          src="/assets/studio-loader.gif" // your loading logo or animation
>>>>>>> 343f451fae4b866886b17a8e6e4492a505d9c4b7
>>>>>>> 221b09b5a0654a8fc648059d0ebb91d8b53bb28a
          alt="Loading"
          width={150}
          height={150}
          className="animate-pulse"
        />
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <section id="hero">
        <HeroSection />
      </section>

<<<<<<< HEAD
      <ScrollingLabels/>
=======
<<<<<<< HEAD
      <ScrollingLabels />
=======
      <ScrollingLabels/>
>>>>>>> 343f451fae4b866886b17a8e6e4492a505d9c4b7
>>>>>>> 221b09b5a0654a8fc648059d0ebb91d8b53bb28a

      <section id="why">
        <WhyChooseUs />
      </section>

      <section id="home-services">
        <HomeServices />
      </section>

      <section id="service">
        <Service />
      </section>

      <section id="blogs">
        <BlogUploader />
      </section>

<<<<<<< HEAD
      <section id="reviews">
        <Feedback />
      </section>

=======
<<<<<<< HEAD
>>>>>>> 221b09b5a0654a8fc648059d0ebb91d8b53bb28a
      <section id="appointments">
        <BookAppointment />
      </section>

<<<<<<< HEAD
=======
      <HairTransplantFAQ />

=======
>>>>>>> 343f451fae4b866886b17a8e6e4492a505d9c4b7
      <section id="reviews">
        <Feedback />
      </section>

<<<<<<< HEAD
=======
      <section id="appointments">
        <BookAppointment />
      </section>

>>>>>>> 343f451fae4b866886b17a8e6e4492a505d9c4b7
>>>>>>> 221b09b5a0654a8fc648059d0ebb91d8b53bb28a
      <section id="contact">
        <Footer />
      </section>

<<<<<<< HEAD
      {/* WhatsApp Floating Icon */}
=======
<<<<<<< HEAD
      {/* Phone Icon */}
      <a
        href="tel:+919876543210"
        className="fixed bottom-24 right-4 z-50"
      >
        <Image
          src="/assets/telephone.png" // Add this icon image to your public/assets folder
          alt="Call Us"
          width={55}
          height={55}
          className="rounded-full shadow-xl hover:scale-110 transition-transform duration-300"
        />
      </a>

      {/* WhatsApp Icon */}
=======
      {/* WhatsApp Floating Icon */}
>>>>>>> 343f451fae4b866886b17a8e6e4492a505d9c4b7
>>>>>>> 221b09b5a0654a8fc648059d0ebb91d8b53bb28a
      <a
        href="https://wa.me/919876543210?text=Hi%2C%20I%20am%20interested%20in%20your%20non-surgical%20hair%20replacement%20services"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 z-50"
      >
        <Image
          src="/assets/what.png"
          alt="Chat on WhatsApp"
          width={55}
          height={55}
          className="rounded-full shadow-xl hover:scale-110 transition-transform duration-300"
        />
      </a>
    </>
  );
}
