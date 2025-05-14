"use client";
import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";

const BookAppointment = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "+91",
    date: "",
    timeSlot: "",
    reason: "",
  });

  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (
      !formData.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    )
      newErrors.email = "Valid email is required";
    if (!formData.phone || !/^\+91\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone must be +91XXXXXXXXXX";
    if (!formData.date) {
      newErrors.date = "Date is required";
    } else if (formData.date < getTodayDate()) {
      newErrors.date = "Date cannot be in the past";
    }
    if (!formData.timeSlot) newErrors.timeSlot = "Time slot is required";
    if (!formData.reason) newErrors.reason = "Reason is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Combine date and timeSlot into appointmentDateTime
    const appointmentDateTime = `${formData.date} ${formData.timeSlot}`;

    try {
      const response = await axios.post("/api/bookAppointment", {
        ...formData, 
        appointmentDateTime, // Include appointmentDateTime in the request
      });
      if (response.status === 200) {
        setSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "+91",
          date: "",
          timeSlot: "",
          reason: "",
        });
      }
    } catch {
      alert("Something went wrong. Please try again.");
    }
  };

  const timeSlots = [
    "09:00 AM – 10:00 AM",
    "10:00 AM – 11:00 AM",
    "11:00 AM – 12:00 PM",
    "12:00 PM – 01:00 PM",
    "01:00 PM – 02:00 PM",
    "02:00 PM – 03:00 PM",
    "03:00 PM – 04:00 PM",
    "04:00 PM – 05:00 PM",
    "05:00 PM – 06:00 PM",
    "06:00 PM – 07:00 PM",
    "07:00 PM – 08:00 PM",
  ];

  return (
    <div className="relative w-full min-h-screen bg-cover bg-center bg-[url('/assets/navbar/df.png')] flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-black opacity-60 z-0" />
      <div className="relative z-10 bg-white max-w-md w-full rounded-xl p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="w-20 h-20 relative mx-auto mb-2">
            <Image
              src="/assets/navbar/rectangle.png"
              alt="Logo"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            New Mv Hair Studio
          </h2>
        </div>

        {success && (
          <div className="bg-green-100 text-green-700 text-sm text-center py-2 rounded mb-4 border border-green-400">
            Appointment booked successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 bg-[#B8974F] text-white placeholder-white rounded-md"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 bg-[#B8974F] text-white placeholder-white rounded-md"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 bg-[#B8974F] text-white placeholder-white rounded-md"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone}</p>
          )}

          <input
            type="date"
            name="date"
            min={getTodayDate()}
            value={formData.date}
            onChange={handleChange}
            className="w-full p-3 bg-[#B8974F] text-white placeholder-white rounded-md"
          />
          {errors.date && (
            <p className="text-red-500 text-sm">{errors.date}</p>
          )}

          <select
            name="timeSlot"
            value={formData.timeSlot}
            onChange={handleChange}
            className="w-full p-3 bg-[#B8974F] text-white placeholder-white rounded-md"
          >
            <option value="">Select Time Slot</option>
            {timeSlots.map((slot, index) => (
              <option key={index} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          {errors.timeSlot && (
            <p className="text-red-500 text-sm">{errors.timeSlot}</p>
          )}

          <textarea
            name="reason"
            placeholder="Reason for Visit"
            value={formData.reason}
            onChange={handleChange}
            className="w-full p-3 bg-[#B8974F] text-white placeholder-white rounded-md"
            spellCheck={false}
          />
          {errors.reason && (
            <p className="text-red-500 text-sm">{errors.reason}</p>
          )}

          <button
            type="submit"
            className="w-full p-3 bg-[#B8974F] text-white font-medium rounded-full hover:bg-[#a5823f] transition"
          >
            Book Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
