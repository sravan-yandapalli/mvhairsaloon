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
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "A valid email is required";
    if (!formData.phone || !/^\+91\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone must be +91XXXXXXXXXX";
    if (!formData.date) newErrors.date = "Date is required";
    else if (formData.date < getTodayDate())
      newErrors.date = "Date cannot be in the past";
    if (!formData.timeSlot) newErrors.timeSlot = "Time slot is required";
    if (!formData.reason) newErrors.reason = "Reason is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const appointmentDateTime = `${formData.date} ${formData.timeSlot}`;
    try {
      const response = await axios.post("/api/bookAppointment", {
        ...formData,
        appointmentDateTime,
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
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center py-16 px-4"
      style={{ backgroundImage: "url('/assets/doddle.jpg')" }}
    >
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-[#0C1B33] bg-opacity-70 rounded-xl shadow-xl p-8 gap-10 text-white">
        {/* Left - Form */}
        <div className="flex-1">
          <div className="text-center mb-6">
            <div className="relative w-20 h-20 mx-auto mb-2">
              <Image src="/assets/navbar/Asset 1.svg" alt="Logo" fill className="object-contain" />
            </div>
            <div className="relative w-40 h-10 mx-auto mb-2">
              <Image src="/assets/navbar/Asset 3.svg" alt="Title" fill className="object-contain" />
            </div>
          </div>

          {success && (
            <div className="bg-green-600 text-white text-center py-2 rounded mb-4">
              Appointment booked successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="w-full p-3 bg-transparent border border-[#B8974F] rounded placeholder-[#B8974F] text-white" />
            {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}

            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="w-full p-3 bg-transparent border border-[#B8974F] rounded placeholder-[#B8974F] text-white" />
            {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}

            <input type="tel" name="phone" placeholder="Phone Number (+91XXXXXXXXXX)" value={formData.phone} onChange={handleChange} className="w-full p-3 bg-transparent border border-[#B8974F] rounded placeholder-[#B8974F] text-white" />
            {errors.phone && <p className="text-red-400 text-sm">{errors.phone}</p>}

            <input type="date" name="date" min={getTodayDate()} value={formData.date} onChange={handleChange} className="w-full p-3 bg-transparent border border-[#B8974F] rounded text-white" />
            {errors.date && <p className="text-red-400 text-sm">{errors.date}</p>}

            <select name="timeSlot" value={formData.timeSlot} onChange={handleChange} className="w-full p-3 bg-transparent border border-[#B8974F] rounded text-white">
              <option value="">Select Time Slot</option>
              {timeSlots.map((slot, idx) => (
                <option key={idx} value={slot} className="text-black">
                  {slot}
                </option>
              ))}
            </select>
            {errors.timeSlot && <p className="text-red-400 text-sm">{errors.timeSlot}</p>}

            <textarea name="reason" placeholder="Reason for Visit" value={formData.reason} onChange={handleChange} className="w-full p-3 bg-transparent border border-[#B8974F] rounded placeholder-[#B8974F] text-white" />
            {errors.reason && <p className="text-red-400 text-sm">{errors.reason}</p>}

            <button type="submit" className="w-full p-3 bg-[#B8974F] text-white font-semibold rounded-full hover:bg-[#a5823f] transition">
              Book Appointment
            </button>
          </form>
        </div>

        {/* Right - Image */}
        <div className="hidden md:flex items-center justify-center">
          <Image src="/assets/hs.jpg" alt="Studio" width={450} height={450} className="rounded-lg shadow-lg object-cover" />
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
