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
const [showUpload, setShowUpload] = useState(false);
const [showResources, setShowResources] = useState(false);
const [resourceFile, setResourceFile] = useState(null);
const [resourceTag, setResourceTag] = useState("notes");
const [uploadStatus, setUploadStatus] = useState("");
const [approvedResources, setApprovedResources] = useState([]);
const [selectedTag, setSelectedTag] = useState("notes");

const handleUpload = async () => {
  if (!resourceFile || resourceFile.size > 10 * 1024 * 1024) {
    setUploadStatus("❌ File too large (max 10MB)");
    return;
  }

  const formData = new FormData();
  formData.append("file", resourceFile);
  formData.append("tag", resourceTag);
  formData.append("comboId", combo._id);
  formData.append("studentId", student._id);

  const res = await fetch("/api/resources/upload", {
    method: "POST",
    body: formData,
  });

  if (res.ok) {
    setUploadStatus("✅ Submitted for moderation!");
    setResourceFile(null);
    setShowUpload(false);
  } else {
    setUploadStatus("❌ Upload failed");
  }
};
   
const fetchApprovedResources = async () => {
  if (showResources) {
    setShowResources(false);
    return;
  }

  const res = await fetch(`/api/resources/approved?comboId=${combo._id}`);
  const text = await res.text();
const data = text ? JSON.parse(text) : [];

  
  setApprovedResources(data);
  setShowResources(true);
};


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



      {combo.hasReviewed ? (
  <p className="text-sm text-green-700 font-medium">✅ Already reviewed</p>
) : (
  <button
    onClick={() => setShowForm((prev) => !prev)}
    className="text-sm text-indigo-600 hover:underline mt-2"
  >
    {showForm ? "Cancel Review" : "Add Review →"}
  </button>
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
      {/* Upload Resource */}
<button
  onClick={() => setShowUpload((prev) => !prev)}
  className="text-sm text-indigo-600 hover:underline mt-1 block"
>
  {showUpload ? "Cancel Upload" : "Upload Resource"}
</button>


{/* View Resources */}
<button
  onClick={fetchApprovedResources}
  className="text-sm text-indigo-600 hover:underline mt-1 block"
>
  {showResources ? "Hide Resources" : "View Resources"}
</button>

{/* Upload Modal */}
{/* Upload Resource Form */}
{showUpload && (
  <div className="border p-3 rounded mt-3 bg-gray-50 space-y-2">
    
    <h4 className="text-sm font-medium text-gray-700">Upload PDF Resource</h4>
    <select
      value={resourceTag}
      onChange={(e) => setResourceTag(e.target.value)}
      className="border rounded px-2 py-1 text-sm"
    >
      <option value="notes">Notes</option>
      <option value="past_exams">Past Exams</option>
    </select>
    <label className="block text-sm">
  <span className="block mb-1 text-gray-700">Choose PDF File</span>
  <input
    type="file"
    accept="application/pdf"
    onChange={(e) => setResourceFile(e.target.files[0])}
    className="block w-full text-sm border border-gray-300 rounded px-3 py-2 bg-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
  />
</label>

    

    <button
      onClick={handleUpload}
      className="w-full bg-indigo-600 text-white py-1 rounded hover:bg-indigo-700 text-sm"
    >
      Submit
    </button>

    {uploadStatus && <p className="text-xs text-gray-600">{uploadStatus}</p>}
  </div>
)}


{/* Approved Resources List */}
{showResources && (
  <div className="bg-gray-50 p-3 mt-2 rounded border text-sm">
    <div className="flex gap-3 mb-2">
      {["notes", "past_exams"].map((tag) => (
        <button
          key={tag}
          onClick={() => setSelectedTag(tag)}
          className={`text-sm font-medium px-3 py-1 rounded ${
            selectedTag === tag
              ? "bg-indigo-600 text-white"
              : "bg-white text-indigo-600 border border-indigo-300"
          }`}
        >
          {tag === "notes" ? "Notes" : "Past Exams"}
        </button>
      ))}
    </div>

    {approvedResources.filter((r) => r.tag === selectedTag).length === 0 ? (
      <p className="text-gray-500 italic">No {selectedTag.replace("_", " ")} uploaded yet.</p>
    ) : (
      approvedResources
        .filter((r) => r.tag === selectedTag)
        .map((res) => (
          <div key={res._id} className="flex justify-between items-center py-1">
            {/* <span>{res.title || "Untitled PDF"}</span> */}
            <span>
  {(res.title || res.file_url.split("/").pop())
    ?.replace(/^\d+-/, "")        // remove timestamp prefix
    ?.replace(/\.\w+$/, "")       // remove .pdf
  }
</span>



            <a
              href={res.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline text-xs"
            >
              Download
            </a>
          </div>
        ))
    )}
  </div>
)}


    </div>
  );
}
