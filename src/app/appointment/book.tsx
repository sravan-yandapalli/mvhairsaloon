"use client";
import React, { useState } from "react";
import axios from "axios";

const BookAppointment = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "+91",
    reason: "",
    date: "",
    time: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.phone || !/^\+91\d{10}$/.test(formData.phone)) newErrors.phone = "Phone must be +91XXXXXXXXXX";
    if (!formData.reason) newErrors.reason = "Reason is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time) newErrors.time = "Time is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post("/api/bookAppointment", formData);
      if (response.status === 200) {
        setSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "+91",
          reason: "",
          date: "",
          time: "",
        });
      }
    } catch (error) {
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <div className="bg-white w-full flex justify-center">
      <div className="w-full max-w-[auto]">
        <div className="relative bg-[url('/assets/navbar/df.png')] bg-cover bg-center min-h-screen flex items-center">
          <div className="absolute inset-0 bg-black opacity-60"></div>
          <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 py-16">
            <div className="bg-white bg-opacity-90 shadow-lg rounded-2xl max-w-xl w-full p-8">
              <img
                src="/assets/navbar/rectangle.png"
                alt="Rectangle"
                className="mx-auto mb-4 w-24 h-auto"
              />
              <h2 className="text-3xl font-bold text-center mb-6 text-black">New MV Hair Studio</h2>

              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 p-3 rounded mb-4">
                  Appointment booked successfully! We will contact you shortly.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {["name", "email", "phone", "reason"].map((field) => (
                  <div key={field}>
                    <input
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      value={formData[field as keyof typeof formData]}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none"
                      placeholder={`Your ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                    />
                    {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
                  </div>
                ))}

                <input
                  type="date"
                  name="date"
                  min={today}
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-gray-300"
                />
                {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}

                <select
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-gray-300"
                >
                  <option value="">Select Time</option>
                  <option value="Everyday - 10:00 AM - 8:00 PM">Everyday - 10:00 AM - 8:00 PM</option>
                  <option value="Friday - 10:00 AM - 1:30 PM">Friday - 10:00 AM - 1:30 PM</option>
                </select>
                {errors.time && <p className="text-red-500 text-sm">{errors.time}</p>}

                <button
                  type="submit"
                  className="w-full p-3 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  Book Appointment
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
