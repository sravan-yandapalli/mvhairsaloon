import BookAppointment from './appointment/page';
import  Navbar  from './nav/page'; 
import Service from './service/page';
import Footer from './fotter/page';
import HeroSection from './hero/page';
import WhyChooseUs from './why/page';
import Image from 'next/image'; // Add this if not already present
import BlogUploader from './blogs/page';
import Feedback from './review/page';
import HomeServices from './hservice/page';

export default function Home() {
  return (
    <>
      <Navbar />
      
      <section id="hero">
        <HeroSection />
      </section>

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

      <section id="contact">
        <Footer />
      </section>

      {/* WhatsApp Floating Icon */}
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
