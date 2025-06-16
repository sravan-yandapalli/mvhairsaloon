'use client';


import { useEffect, useState } from 'react';
import Image from 'next/image';
import BookAppointment from './appointment/page';
import Navbar from './nav/page';
import Service from './service/page';
import Footer from './fotter/page';
import HeroSection from './hero/page';
import WhyChooseUs from './why/page';
import BlogUploader from './blogs/page';
import Feedback from './review/page';
import HomeServices from './hservice/page';
import ScrollingLabels from './scroll/page';
import HairTransplantFAQ from './faq/page';


export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    // Simulate loading duration (e.g., 2 seconds)

    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <Image
          src="/assets/studio-loader.gif" // your loading logo or animation
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


      <ScrollingLabels/>


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


      <section id="reviews">
        <Feedback />
      </section>


      <section id="appointments">
        <BookAppointment />
      </section>


      <HairTransplantFAQ />


      <section id="reviews">
        <Feedback />
      </section>


      <section id="appointments">
        <BookAppointment />
      </section>

      <section id="contact">
        <Footer />
      </section>

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
