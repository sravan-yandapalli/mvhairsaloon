import Image from "next/image";
import React from "react";

const services = [
  {
    title: "Non-Surgical Hair Replacement",
    description:
      "Advanced non-surgical solutions to restore hair volume and natural appearance without pain or downtime.",
    image: "/assets/services/6.jpg",
  },
  {
    title: "Hair Patching",
    description:
      "Custom hair patch systems tailored to blend seamlessly with your existing hair and lifestyle.",
    image: "/assets/services/7.jpg",
  },
  {
    title: "Hair Fixing & Bonding",
    description:
      "Secure hair systems using bonding or clipping techniques for long-lasting results.",
    image: "/assets/services/4.jpg",
  },
  {
    title: "Hair System Maintenance",
    description:
      "Regular cleaning, adjustment, and reapplication services to keep your hair system looking fresh and natural.",
    image: "/assets/services/3.jpg",
  },
  {
    title: "Scalp Treatment & Dandruff Control",
    description:
      "Therapeutic scalp care solutions to promote hair health and control dandruff or dryness.",
    image: "/assets/services/1.jpg",
  },
  {
    title: "Styling & Grooming",
    description:
      "Professional haircut, beard styling, and finishing touches to enhance your new look.",
    image: "/assets/services/2.jpg",
  },
];

const Service = () => {
  return (
    <div className="bg-[#121212] text-white py-16 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
          Our Services
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-[#1e1e1e] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="relative w-full h-52 sm:h-60">
                <Image
                  src={service.image}
                  alt={service.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-2xl"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-300 text-sm">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Service;
