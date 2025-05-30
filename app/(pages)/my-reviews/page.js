"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightOnRectangleIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchReviews = async (studentId) => {
    const res = await fetch(`/api/reviews?studentId=${studentId}`);
    let data = [];
    try {
      if (res.ok) {
        const json = await res.json();
        data = Array.isArray(json) ? json : json.data || [];
      } else {
        console.error("❌ Server responded with error:", res.status);
      }
    } catch (error) {
      console.error("❌ Failed to parse reviews response:", error);
    }
    setReviews(data);
    setLoading(false);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem("student");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed._id) {
          setStudent(parsed);
          fetchReviews(parsed._id);
        } else {
          console.error("❌ Invalid student object");
          router.push("/login");
        }
      } else {
        router.push("/login");
      }
    }
  }, []);

  const handleDelete = async (id) => {
    if (!student) return;
    if (!confirm("Delete this review?")) return;
    const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchReviews(student._id);
    } else {
      const result = await res.json();
      alert("❌ Delete failed: " + result.message);
    }
  };

  const handleSave = async (id, editedReview) => {
    if (!student) return;
    const res = await fetch(`/api/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedReview),
    });

    if (res.ok) {
      alert("✅ Review updated!");
      fetchReviews(student._id);
    } else {
      let result = {};
      try {
        result = await res.json();
      } catch {
        result.message = "Unknown error";
      }
      alert("❌ Update failed: " + result.message);
    }
  };

  if (loading) return <p>Loading your reviews...</p>;

  const handleLogout = () => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      localStorage.removeItem("admin");
      router.push("/login");
    } else {
      localStorage.removeItem("student");
      router.push("/login");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <nav className="fixed top-0 left-0 w-full bg-indigo-600 text-white px-6 py-4 flex items-center justify-between shadow z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}  // 🔥 Back Button
            className="flex items-center gap-1 text-sm hover:text-indigo-200 transition"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="hidden sm:inline"></span>
          </button>
          <h1 className="text-xl font-bold cursor-pointer" onClick={() => router.push("/home")}>
            EduPulse
          </h1>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-1">
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </nav>

      <h1 className="text-3xl font-bold text-indigo-700 mb-6 mt-16">My Reviews</h1>

      {reviews.length === 0 ? (
        <p>No reviews found.</p>
      ) : (
        reviews.map((rev) => (
          <ReviewCard key={rev._id} review={rev} onDelete={handleDelete} onSave={handleSave} />
        ))
      )}
    </div>
  );
}

function ReviewCard({ review, onDelete, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedReview, setEditedReview] = useState({
    gradingFairness: review.gradingFairness,
    organization: review.organization,
    availability: review.availability,
    teachingQuality: review.teachingQuality,
    comment: review.comment || "",
  });

  const renderDropdown = (label, field) => (
    <div className="mb-1">
      <label>{label}:</label>
      <select
        value={editedReview[field]}
        onChange={(e) => setEditedReview({ ...editedReview, [field]: e.target.value })}
        className="border p-1 w-full"
      >
        {[1, 2, 3, 4, 5].map((num) => (
          <option key={num} value={num}>{num}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="border p-4 rounded mb-4">
      <p><strong>Course:</strong> {review.combo?.course?.name || "Unknown"}</p>
      <p><strong>Professor:</strong> {review.combo?.professor?.name || "Unknown"}</p>
      {isEditing ? (
        <>
          {renderDropdown("Grading Fairness", "gradingFairness")}
          {renderDropdown("Organization", "organization")}
          {renderDropdown("Availability", "availability")}
          {renderDropdown("Teaching Quality", "teachingQuality")}
          <label>Comment:</label>
          <textarea
            value={editedReview.comment}
            onChange={(e) => setEditedReview({ ...editedReview, comment: e.target.value })}
            className="border p-1 w-full mb-1"
          />
          <button onClick={() => onSave(review._id, editedReview)} className="text-green-600 mr-2">Save</button>
          <button onClick={() => setIsEditing(false)} className="text-gray-600">Cancel</button>
        </>
      ) : (
        <>
          <p><strong>Grading Fairness:</strong> {review.gradingFairness ?? "N/A"}</p>
          <p><strong>Organization:</strong> {review.organization ?? "N/A"}</p>
          <p><strong>Availability:</strong> {review.availability ?? "N/A"}</p>
          <p><strong>Teaching Quality:</strong> {review.teachingQuality ?? "N/A"}</p>
          <p><strong>Comment:</strong> {review.comment?.trim() ? review.comment : "No comment"}</p>
          <p><strong>Comment Status:</strong> {review.comment?.trim() ? review.commentStatus : "No comment"}</p>
          <button onClick={() => setIsEditing(true)} className="text-blue-600 mr-2">Edit</button>
        </>
      )}
      <button onClick={() => onDelete(review._id)} className="text-red-600">Delete</button>
    </div>
  );
}

