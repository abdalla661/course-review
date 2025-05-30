"use client";

import { useState } from "react";
import { uploadFiles } from "@/utils/uploadthing";





export default function ComboCardWithReview({ combo, student ,refreshCombos}) {
  

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
const [isUploading, setIsUploading] = useState(false);


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
  let data = [];
  try {
    const json = await res.json();
    data = Array.isArray(json) ? json : json.data || [];
  } catch {
    console.error("❌ Failed to parse reviews response");
  }
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
  refreshCombos?.();

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


      {submitted && !combo.hasReviewed && (
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
  {showUpload ? "Cancel Upload →" : "Upload Resource →"}
</button>


{/* View Resources */}
<button
  onClick={fetchApprovedResources}
  className="text-sm text-indigo-600 hover:underline mt-1 block"
>
  {showResources ? "Hide Resources" : "View Resources"}
</button>

{showUpload && (
  <div className="border mt-4 p-4 rounded">
    <h3 className="font-semibold mb-2 text-gray-700">Upload PDF Resource</h3>

    {/* Tag Dropdown */}
    <label className="block mb-1 text-sm text-gray-600">Select Type</label>
    <select
      value={resourceTag}
      onChange={(e) => setResourceTag(e.target.value)}
      className="w-full px-3 py-2 mb-3 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <option value="">Select tag</option>
      <option value="notes">Notes</option>
      <option value="past_exams">Past Exams</option>
    </select>

    {/* File Input */}
    <label className="block mb-1 text-sm text-gray-600">Choose File</label>
    <input
      type="file"
      accept=".pdf"
      onChange={(e) => setResourceFile(e.target.files[0])}
      className="w-full px-3 py-2 border border-gray-300 rounded mb-4 text-sm"
    />

    {/* Upload Button */}
    {/* <button
      onClick={async () => {
        if (!resourceFile || !resourceTag) {
          setUploadStatus("❌ Please select tag and file");
          return;
        }

        try {
          const uploaded = await uploadFiles("resourcePdfUploader", {
            files: [resourceFile],
          });

         const fileUrl = res?.[0]?.url;
         await fetch("/api/resources", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    comboId: combo._id,
    studentId: student._id,
    tag: resourceTag,
    file_url: fileUrl,
  }),
});



          if (response.ok) {
            setUploadStatus("✅ Uploaded!");
            setShowUpload(false);
            fetchApprovedResources();
          } else {
            setUploadStatus("❌ Upload failed");
          }
        } catch (err) {
          console.error("❌ UploadThing failed:", err);
          setUploadStatus("❌ Upload failed");
        }
      }}
      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition text-sm"
    >
      Upload
    </button> */}
    <button
  onClick={async () => {
    if (!resourceFile || !resourceTag) {
      setUploadStatus("❌ Please select tag and file");
      return;
    }

    setIsUploading(true);

    try {
      const uploaded = await uploadFiles("resourcePdfUploader", {
        files: [resourceFile],
      });
      if (!uploaded || uploaded.length === 0) {
  setUploadStatus("❌ Upload failed");
  return;
}
      const fileUrl = uploaded[0]?.url;
      const fileName = uploaded[0]?.name;

      const response = await fetch("/api/resources/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comboId: combo._id,
          studentId: student._id,
          tag: resourceTag,
          file_url: fileUrl,
          title: fileName,
        }),
      });

      if (response.ok) {
        setUploadStatus("✅ Uploaded!");
        //setShowUpload(false);
        //fetchApprovedResources();
      } else {
        setUploadStatus("❌ Upload failed");
      }
    } catch (err) {
      console.error("❌ UploadThing failed:", err);
      setUploadStatus("❌ Upload failed");
    } finally {
      setIsUploading(false);
    }
  }}
  disabled={isUploading}
  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition text-sm disabled:opacity-50"
>
  {isUploading ? "Uploading..." : "Upload"}
</button>




    {/* Upload Status */}
    {uploadStatus && (
      <p className="text-sm mt-2 text-gray-600">{uploadStatus}</p>
    )}
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

    <div>
      {approvedResources.filter((r) => r.tag === selectedTag).length === 0 ? (
        <p className="text-gray-500 italic">
          No {selectedTag.replace("_", " ")} uploaded yet.
        </p>
      ) : (
        approvedResources
          .filter((r) => r.tag === selectedTag)
          .map((res) => (
            <div
              key={res._id}
              className="flex justify-between items-center py-1"
            >
              <p className="truncate max-w-[70%]">{res.title}</p>
              <a
                href={res.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                Download
              </a>
            </div>
          ))
      )}
    </div>
  </div>
)}





    </div>
  );
}
