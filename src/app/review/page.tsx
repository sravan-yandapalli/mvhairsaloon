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

  useEffect(() => {
    async function fetchFeedback() {
      try {
        const res = await fetch("/api/feedback");
        if (!res.ok) throw new Error(`Failed to fetch feedback: ${res.status}`);
        const data = await res.json();
        setFeedbacks(data.feedbacks);
        setTotalViews(data.viewCount);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    }
    fetchFeedback();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!name || !comment || rating === 0) {
      setFormError("Please fill out all fields and select a rating.");
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
      setFeedbacks((prev) => [newFeedback, ...prev]);
      setName("");
      setComment("");
      setRating(0);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const topReviews = feedbacks
    .filter((fb) => fb.rating >= 4)
    .sort((a, b) => b.rating - a.rating || (b.timestamp || 0) - (a.timestamp || 0))
    .slice(0, 10);

  return (
    <section className="w-full min-h-screen bg-[#fdfdfd] text-gray-900 py-20 px-4 md:px-10 lg:px-20 font-sans">
      <div className="max-w-7xl mx-auto space-y-16">
        <h2 className="text-5xl font-bold text-center text-[#004f73]">
          What Our Users Say
        </h2>

        {/* Feedback Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-2xl mx-auto space-y-6"
        >
          <h3 className="text-3xl font-semibold text-center">Leave a Feedback</h3>

          <input
            type="text"
            placeholder="Your Name"
            className="w-full border border-gray-300 rounded-md p-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#004f73]"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <textarea
            placeholder="Your Comment"
            className="w-full border border-gray-300 rounded-md p-4 text-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#004f73]"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <div className="flex items-center justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <svg
                key={num}
                onClick={() => setRating(num)}
                className={`w-9 h-9 cursor-pointer transition-all duration-200 ${
                  num <= rating ? "text-yellow-400" : "text-gray-300"
                }`}
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
            className="w-full bg-[#004f73] text-white py-3 rounded-md text-lg font-semibold hover:bg-[#003350] transition duration-200 disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>

          {formError && (
            <p className="text-center text-red-600 font-medium">{formError}</p>
          )}
        </form>

        {/* Summary */}
        <div className="text-center space-y-2">
          <p className="text-2xl font-medium">
            Total Feedbacks:{" "}
            <span className="text-[#004f73] font-bold">{feedbacks.length}</span>
          </p>
          <p className="text-2xl font-medium">
            Total Page Views:{" "}
            <span className="text-[#004f73] font-bold">{totalViews}</span>
          </p>
        </div>

        {/* Top Reviews */}
        <div className="space-y-6">
          <h3 className="text-4xl font-bold text-[#004f73] text-center">Top Reviews</h3>

          {topReviews.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">No top reviews yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <ul className="flex space-x-6 pb-4 min-w-max">
                {topReviews.map(({ id, name, comment, rating }) => (
                  <li
                    key={id}
                    className="min-w-[280px] max-w-sm flex-shrink-0 bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300"
                  >
                    <p className="text-xl font-semibold text-[#004f73] mb-1">{name}</p>
                    <p className="text-gray-700 italic mb-3">{comment}</p>
                    <p className="text-gray-800">
                      Rating:{" "}
                      <span className="text-yellow-500 font-semibold">{rating} / 5</span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {loading && (
          <p className="text-center text-gray-600 text-lg mt-6">Loading feedback...</p>
        )}
        {error && (
          <p className="text-center text-red-600 font-semibold mt-6">Error: {error}</p>
        )}
      </div>
    </section>
  );
}
