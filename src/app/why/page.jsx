'use client';

import React from 'react';

const WhyChooseUs = () => {
  return (
    <section className="bg-[#211f26] text-white py-20 px-4 sm:px-10 md:px-20 max-w-[1600px] mx-auto mt-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left Side: Video */}
        <div className="w-full md:w-1/2 rounded-xl overflow-hidden shadow-lg">
          <video
            className="w-full h-full object-cover rounded-xl"
            controls
            poster="/assets/why/image.png" // optional fallback image
          >
            <source src="/assets/why/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Right Side: Text Content */}
        <div className="w-full md:w-1/2 space-y-6">
          <h2 className="text-[32px] md:text-[42px] select-none font-bold italic text-[#eacb5b] tracking-wide">
            Why MV Hair Studio is Best of Others
          </h2>

          <ul className="space-y-4 text-lg md:text-xl select-none font-medium leading-relaxed">
            <li>
              ✅ Our entire crew is well-trained with an average of <strong>10 years of experience</strong>.
            </li>
            <li>
              ✅ We never compromise on quality — we use <strong>100% natural, high-grade hair systems</strong>.
            </li>
            <li>
              ✅ Only <strong>top branded hair systems</strong> are used for every application.
            </li>
            <li>
              ✅ Our products have the <strong>longest life span</strong> and offer excellent value for money.
            </li>
            <li>
              ✅ We offer <strong>transparent pricing</strong> — no hidden costs, and more reasonable than industry standards.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
