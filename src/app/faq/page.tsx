'use client';

import React from 'react';

export default function HairTransplantFAQ() {
  const faqs = [
    {
      question: 'What is non-surgical hair transplantation?',
      answer:
        'It is a pain-free method of restoring hair using advanced, non-invasive technologies like hair systems or cosmetic applications without surgery.',
    },
    {
      question: 'How is this different from surgical hair transplant?',
      answer:
        'Surgical transplants involve cuts and recovery time, while non-surgical is scar-free, painless, and gives instant results.',
    },
    {
      question: 'Do you offer home services?',
      answer:
        'Yes! Our experts visit your home with all equipment for private and convenient treatments.',
    },
    {
      question: 'How long does the procedure take?',
      answer: 'Most sessions take 1 to 2 hours depending on customization.',
    },
    {
      question: 'Is the result permanent?',
      answer:
        'The result is semi-permanent and can last several months. Hair systems are reusable with proper care.',
    },
    {
      question: 'Will the hair look natural?',
      answer:
        'Yes. We use premium natural human hair matched to your texture and color for a seamless blend.',
    },
    {
      question: 'What types of hair services do you offer?',
      answer:
        'Hair replacement, extensions, wigs, build fibers, wefts, chemotherapy wigs, and more.',
    },
    {
      question: 'Is it safe?',
      answer:
        'Absolutely. All materials are dermatologically tested and treatments are hygienic and safe.',
    },
    {
      question: 'How can I book a free consultation?',
      answer:
        'Call +91 954 265 8504 or use the appointment form on our site or chat via WhatsApp.',
    },
    {
      question: 'In which cities is your service available?',
      answer: 'Vizag, Vijayawada, Rajahmundry, and Hyderabad.',
    },
    {
      question: 'What are the payment options?',
      answer:
        'We accept UPI, GPay, PhonePe, Paytm, credit/debit cards, and more.',
    },
    {
      question: 'Can I customize the hair system?',
      answer:
        'Yes, we provide fully customized systems based on your head size, color, and style.',
    },
  ];

  return (
    <div className="min-h-screen bg-white px-4 py-12 sm:px-8">
      <div className="max-w-5xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-600 text-lg">
          Everything you need to know about our non-surgical hair restoration services.
        </p>
      </div>

      <div className="max-w-4xl mx-auto divide-y divide-gray-200">
        {faqs.map((faq, idx) => (
          <details
            key={idx}
            className="group py-5 transition-all ease-in-out duration-200 hover:bg-gray-50 rounded-lg"
          >
            <summary className="flex justify-between items-center text-left cursor-pointer">
              <h2 className="text-lg font-semibold text-gray-800">
                {faq.question}
              </h2>
              <span className="text-xl text-gray-500 group-open:rotate-180 transition-transform duration-200">
                ▾
              </span>
            </summary>
            <p className="mt-3 text-gray-600 text-base leading-relaxed">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-gray-700 text-lg mb-2">Still have questions?</p>
        <a
          href="https://wa.me/919542658504"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-black text-white px-6 py-3 rounded-full font-semibold shadow hover:shadow-lg hover:bg-gray-800 transition"
        >
          Chat with Us on WhatsApp
        </a>
      </div>
    </div>
  );
}