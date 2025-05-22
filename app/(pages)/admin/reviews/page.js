"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
export default function AdminReviewModeration() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch pending reviews
  useEffect(() => {
    fetch("/api/admin/reviews")
      .then((res) => res.json())
      .then(setReviews)
      .catch((err) => console.error("❌ Failed to fetch reviews:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleModeration = async (id, action) => {
    const res = await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });

    if (res.ok) {
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } else {
      alert("❌ Failed to update review");
    }
  };

  if (loading) return <p className="p-6 text-gray-600">Loading pending reviews...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <Navbar role="admin" showBack />
      <h1 className="text-2xl font-bold text-indigo-700">🛠️ Pending Reviews</h1>

      {reviews.length === 0 ? (
        <p className="text-gray-500">No pending reviews 🎉</p>
      ) : (
        reviews.map((r) => (
          <div key={r._id} className="border p-4 rounded-xl bg-white shadow-sm space-y-2">
            <div className="text-sm text-gray-800">
              <span className="font-semibold">{r.combo.course?.name}</span> — {r.combo.professor?.name}
            </div>
            <p className="text-gray-600 border-l-4 pl-3 border-indigo-400 italic">“{r.comment}”</p>
            <div className="flex gap-4 text-sm">
              <button
                onClick={() => handleModeration(r._id, "approve")}
                className="text-green-600 hover:underline"
              >
                ✅ Approve
              </button>
              <button
                onClick={() => handleModeration(r._id, "reject")}
                className="text-red-600 hover:underline"
              >
                ❌ Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
