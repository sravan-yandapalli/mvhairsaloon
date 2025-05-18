"use client";

import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";

type FeedbackType = {
    name: string;
    comment: string;
    rating: number;
};

const Feedback = () => {
    const [name, setName] = useState("");
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !comment || rating === 0) return alert("Please fill all fields.");

        const res = await fetch("/api/feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, comment, rating }),
        });

        if (res.ok) {
            setSubmitted(true);
            setName("");
            setComment("");
            setRating(0);
            fetchFeedbacks(); // refresh list
        }
    };

    const fetchFeedbacks = async () => {
        const res = await fetch("/api/feedback");
        const data = await res.json();
        setFeedbacks(Array.isArray(data) ? data : []);
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    return (
        <section id="feedback" className="bg-gray-100 py-16 px-4 sm:px-8 lg:px-16">
            <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 text-black">Share Your Feedback</h2>
                <p className="text-gray-600">Your feedback helps us improve and serve you better.</p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-4">
                <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border text-gray-800 border-gray-300 px-4 py-2 rounded-lg"
                />
                <textarea
                    placeholder="Write your feedback here..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="w-full border text-gray-800 border-gray-300 px-4 py-2 rounded-lg"
                />
                <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                        <Star
                            key={num}
                            className={`w-6 h-6 cursor-pointer ${
                                rating >= num ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
                            }`}
                            onClick={() => setRating(num)}
                        />
                    ))}
                </div>
                <button
                    type="submit"
                    className="w-full bg-[#eacb5b] text-black font-bold py-2 rounded-lg hover:bg-yellow-300 transition"
                >
                    Submit Feedback
                </button>
                {submitted && <p className="text-green-600 text-center">Thank you for your feedback!</p>}
            </form>

            <div className="max-w-4xl mx-auto mt-16">
                <h3 className="text-2xl font-semibold text-black text-center mb-6">What Others Say</h3>
                <div className="grid sm:grid-cols-2 gap-6">
                    {feedbacks.map((fb, index) => (
                        <div key={index} className="bg-white p-4 rounded-xl shadow text-left">
                            <div className="flex justify-between mb-2">
                                <span className="font-semibold text-black">{fb.name}</span>
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((n) => (
                                        <Star
                                            key={n}
                                            className={`w-4 h-4 ${
                                                fb.rating >= n ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-700">{fb.comment}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Feedback;
