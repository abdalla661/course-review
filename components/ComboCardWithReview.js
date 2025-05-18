"use client";

import { useState } from "react";

export default function ComboCardWithReview({ combo, student }) {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    gradingFairness: 1,
    organization: 1,
    availability: 1,
    teachingQuality: 1,
    comment: "",
  });
  const [showReviews, setShowReviews] = useState(false);
const [comments, setComments] = useState([]);
  const fetchReviews = async () => {
  if (showReviews) {
    setShowReviews(false);
    return;
  }

  const res = await fetch(`/api/reviews?combo=${combo._id}`);
  const data = await res.json();
  setComments(data);
  setShowReviews(true);
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      gradingFairness: Number(formData.gradingFairness),
      organization: Number(formData.organization),
      availability: Number(formData.availability),
      teachingQuality: Number(formData.teachingQuality),
      student: student._id,
      combo: combo._id,
    };

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
     //const res = await fetch(`/api/professor-courses?departmentId=${student.department}&studentId=${student._id}`);


    
    if (res.ok) {
      setSubmitted(true);
    } else {
      alert("❌ Failed to submit review");
    }
  };

  return (
    <div className="border p-4 rounded-xl shadow-sm bg-white space-y-2">
      <h3 className="font-bold text-gray-800">{combo.course?.name}</h3>
      <p className="text-sm text-gray-600">{combo.course?.code}</p>
      <p className="text-sm text-gray-500">Taught by: {combo.professor?.name}</p>
     
     {combo.reviewCount > 0 ? (
  <p className="text-sm text-yellow-700">
    ⭐ {combo.avgRating} average from {combo.reviewCount} review{combo.reviewCount > 1 ? "s" : ""}
  </p>
) : (
  <p className="text-sm text-gray-400">No reviews yet</p>
)}




 


      {/* {!showForm && !submitted && (
        <button
          onClick={() => setShowForm(true)}
          className="text-sm text-indigo-600 hover:underline mt-2"
        >
          Add Review →
        </button>
      )} */}
      {combo.hasReviewed ? (
  <p className="text-sm text-green-700 font-medium">✅ Already reviewed</p>
) : (
  !showForm && !submitted && (
    <button onClick={() => setShowForm(true)} className="text-sm text-indigo-600 hover:underline mt-2">
      Add Review →
    </button>
  )
)}
<button
  onClick={fetchReviews}
  className="text-sm text-blue-600 hover:underline mt-1 block"
>
  {showReviews ? "Hide Reviews" : "View Reviews"}
</button>

{showReviews && (
  <div className="bg-gray-50 p-2 mt-2 rounded border text-sm space-y-2">
    {comments.length === 0 ? (
      <p className="text-gray-500">No comments yet.</p>
    ) : (
      comments.map((r, i) => (
        <p key={i} className="text-gray-800 border-b pb-1">“{r.comment}”</p>
      ))
    )}
  </div>
)}


      {submitted && (
  <div className="text-sm space-y-1">
    <p className="text-green-600">✅ Review submitted!</p>
    {formData.comment?.trim() && (
      <p className="text-yellow-600">🕒 Your comment is pending moderation.</p>
    )}
  </div>
)}


      {showForm && !submitted && (
        <form onSubmit={handleSubmit} className="space-y-2 pt-2 border-t mt-3">
          {["gradingFairness", "organization", "availability", "teachingQuality"].map((field) => (
            <div key={field} className="flex justify-between items-center text-sm">
              <label className="text-gray-700 capitalize">{field.replace(/([A-Z])/g, " $1")}:</label>
              <select
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="border rounded px-2 py-1 text-sm"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          ))}

          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Optional comment"
            className="w-full p-2 border rounded text-sm"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-1 rounded hover:bg-indigo-700 text-sm"
          >
            Submit Review
          </button>
        </form>
      )}
    </div>
  );
}
