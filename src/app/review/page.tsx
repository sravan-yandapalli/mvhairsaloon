"use client";
import React, { useEffect, useState } from "react";

type Feedback = {
  id: string;
  name: string;
  comment: string;
  rating: number;
  timestamp?: number;
};

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalViews, setTotalViews] = useState<number>(0);

  // Form state
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Fetch feedback and views on mount
  useEffect(() => {
    async function fetchFeedback() {
      try {
        const res = await fetch("/api/feedback");
        if (!res.ok) throw new Error(`Failed to fetch feedback: ${res.status}`);
        const data = await res.json();
        setFeedbacks(data.feedbacks);
        setTotalViews(data.viewCount);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchFeedback();
  }, []);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");
    if (!name.trim() || !comment.trim() || rating < 1) {
      setFormError("Please fill all fields and select a rating.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, comment, rating }),
      });

      if (!res.ok) throw new Error("Failed to submit feedback");

      const newFeedback: Feedback = await res.json();
      setFeedbacks((prev: Feedback[]) => [newFeedback, ...prev]);
      setName("");
      setComment("");
      setRating(0);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message || "Something went wrong.");
      } else {
        setFormError("An unknown error occurred.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Show only top reviews (rating >= 4), sorted by rating desc, timestamp desc, max 10
  const topReviews = feedbacks
    .filter((fb) => fb.rating >= 4)
    .sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return (b.timestamp || 0) - (a.timestamp || 0);
    })
    .slice(0, 10);

  return (
    <section className="max-w-5xl mx-auto p-6 space-y-10 font-sans bg-white my-20">
      <h2 className="text-4xl font-bold text-[#004f73] text-center mb-6">What Our Users Say</h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-300 shadow-md p-6 rounded-lg space-y-5 max-w-xl mx-auto"
      >
        <h3 className="text-2xl font-semibold text-gray-900">Leave a Feedback</h3>
        <input
          type="text"
          placeholder="Your Name"
          className="w-full border border-gray-300 rounded-md p-3 text-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#004f73]"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Your Comment"
          className="w-full border border-gray-300 rounded-md p-3 text-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#004f73]"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="flex items-center space-x-3">
          {[1, 2, 3, 4, 5].map((num) => (
            <svg
              key={num}
              onClick={() => setRating(num)}
              className={`w-8 h-8 cursor-pointer transition-colors duration-200 ${num <= rating ? "text-yellow-400" : "text-gray-300"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.463a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.39-2.463a1 1 0 00-1.175 0l-3.39 2.463c-.784.57-1.838-.197-1.539-1.118l1.286-3.966a1 1 0 00-.364-1.118L2.045 9.393c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.966z" />
            </svg>
          ))}
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="bg-[#004f73] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#003350] transition-colors duration-200 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
        {formError && (
          <p className="text-red-600 font-semibold mt-2">{formError}</p>
        )}
      </form>

      {/* Feedback Summary */}
      <div className="text-center text-gray-700 space-y-2">
        <p className="text-2xl font-semibold text-[#004f73]">
          Total Feedbacks: <span className="text-black">{feedbacks.length}</span>
        </p>
        <p className="text-2xl font-semibold text-[#004f73]">
          Total Page Views: <span className="text-black">{totalViews}</span>
        </p>
      </div>

      {/* Top Reviews with horizontal scroll */}
      <div>
        <h3 className="text-3xl font-semibold text-[#004f73] mb-6">Top Reviews</h3>
        {topReviews.length === 0 && <p className="text-gray-600 text-lg">No top reviews yet.</p>}

        <div className="overflow-x-auto">
          <ul className="flex space-x-6 pb-4 min-w-max">
            {topReviews.map(({ id, name, comment, rating }) => (
              <li
                key={id}
                className="min-w-[280px] border border-gray-300 rounded-lg p-6 bg-white shadow hover:shadow-lg transition-shadow duration-300"
              >
                <p className="font-bold text-[#004f73] text-xl mb-2">{name}</p>
                <p className="italic text-gray-700 mb-4">{comment}</p>
                <p className="text-gray-800 font-medium">
                  Rating: <span className="text-yellow-500">{rating} / 5</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {loading && <p className="text-center text-gray-600 text-lg mt-6">Loading feedback...</p>}
      {error && <p className="text-center text-red-600 font-semibold mt-6">Error: {error}</p>}
    </section>
  );
}
