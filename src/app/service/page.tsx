import Image from "next/image";
import React from "react";

const services = [
  {
    title: "Hair Replacement",
    description:
      "Restore your natural look with our non-surgical hair replacement solutions.",
    image: "/assets/services/hs.jpg",
  },
  {
    title: "Hair Extensions",
    description:
      "Premium hair extensions to instantly add length and volume to your hair.",
    image: "/assets/services/ext.jpeg",
  },
  {
    title: "Hair Build Fibers",
    description:
      "Quick and effective hair fiber application for fuller-looking hair.",
    image: "/assets/services/replac.jpg",
  },
  {
    title: "Hair Wefts",
    description:
      "Top-quality hair wefts for stylish, seamless, and durable hair additions.",
    image: "/assets/services/dd.png",
  },
  {
    title: "Hair Wigs",
    description:
      "Variety of high-quality wigs in different colors and styles to suit your look.",
    image: "/assets/services/wig.jpeg",
  },
  {
    title: "Chemotherapy/Alopecia Wigs",
    description:
      "Comfortable and natural-looking wigs designed for those undergoing hair loss.",
    image: "/assets/services/cwige.jpeg",
  },
  {
    title: "Hair Transplantation",
    description:
      "Permanent hair restoration by expert transplantation professionals.",
    image: "/assets/services/trans.jpeg",
  },
  {
    title: "Human Hair Eyelashes",
    description:
      "Enhance your eyes with our premium natural human hair eyelashes.",
    image: "/assets/services/fg.jpg",
  },
];

const Service = () => {
  return (
    <div className="bg-white text-gray-800 py-16 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-[#0C1B33]">
          Our Services
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative w-full h-64 sm:h-80">
                <Image
                  src={service.image}
                  alt={service.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-3xl"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#004F73] mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Service;
