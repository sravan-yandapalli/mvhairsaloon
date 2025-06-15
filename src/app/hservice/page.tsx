"use client";
import React from "react";

export default function HomeServices() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#b0d4e6] via-[#d3e6f2] to-[#eaf5fb] text-black font-sans my-20">
      <section className="max-w-6xl mx-auto px-6 py-20">
        {/* Header */}
        <header className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-md">
            New MV Hair Studio 
          </h1>
          <p className="text-xl font-semibold max-w-xl mx-auto drop-shadow-sm">
             Expert Non-Surgical Hair Transplantation Services — Delivered Comfortably At Your Home.
          </p>
        </header>

        {/* Highlight Features */}
        <section className="grid md:grid-cols-3 gap-10 mb-20">
          <FeatureCard
            icon="🏠"
            title="Convenient Home Visits"
            description="Our experts come to your doorstep with all the equipment, ensuring a comfortable and private treatment experience."
          />
          <FeatureCard
            icon="⚕️"
            title="Non-Surgical & Safe"
            description="Advanced, minimally invasive hair transplantation techniques with no surgery, no scars, and zero downtime."
          />
          <FeatureCard
            icon="⏰"
            title="Quick & Effective"
            description="Efficient procedures tailored to your hair needs with visible results in just weeks."
          />
        </section>

        {/* Service Explanation */}
        <section className="bg-white rounded-xl p-8 mb-20 max-w-4xl mx-auto shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-[#004f73]">
            Why Choose Our Home Services?
          </h2>
          <p className="text-lg leading-relaxed mb-4">
            At New MV Hair Studio, we bring professional non-surgical hair transplantation to the comfort of your home. Forget the hassle of clinic visits or long waiting times. Our certified specialists use cutting-edge technology to restore your hair safely and effectively without the need for any invasive surgery.
          </p>
          <p className="text-lg leading-relaxed">
            Our home service ensures privacy, comfort, and personalized care. Whether you&#39;re experiencing early hair thinning or more advanced hair loss, we customize each session to fit your unique needs.
          </p>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h3 className="text-3xl font-semibold mb-6">
            Ready to Regain Your Confidence?
          </h3>
          <p className="mb-8 text-lg max-w-xl mx-auto">
            Book your free home consultation today. Our friendly team is just a call away to guide you through the process.
          </p>
          <a
            href="tel:+917075367929"
            className="inline-block bg-yellow-400 text-[#004f73] font-bold text-l px-10 py-3 rounded-full shadow-lg hover:bg-yellow-500 transition-colors duration-300"
          >
            Call Now: +91 954 265 8504
          </a>
        </section>
      </section>
    </main>
  );
}

type FeatureCardProps = {
  icon: string;
  title: string;
  description: string;
};

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <article className="bg-white rounded-xl p-6 shadow-md flex flex-col items-center text-center hover:scale-105 transform transition-transform duration-300 cursor-default">
      <div className="text-6xl mb-4">{icon}</div>
      <h4 className="text-2xl font-semibold mb-2">{title}</h4>
      <p className="text-base max-w-xs">{description}</p>
    </article>
  );
}
