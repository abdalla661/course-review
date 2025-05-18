"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function UniversityDetails() {
  const { id } = useParams();
  const [university, setUniversity] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [newFaculty, setNewFaculty] = useState("");
  const [editingFacultyId, setEditingFacultyId] = useState(null);

 
  useEffect(() => {
  if (!id) return;

  fetch(`/api/faculties?universityId=${id}`)
    .then((res) => res.json())
    .then((data) => {
      console.log("Faculties:", data);
      setFaculties(data);
    });
}, [id]);

  // Create new faculty
  const handleAddFaculty = async (e) => {
    e.preventDefault();

    const res = await fetch(`/api/faculties?universityId=${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newFaculty }),
    });

    if (res.ok) {
      const result = await res.json();
      setFaculties((prev) => [...prev, result.data || result]);
      setNewFaculty("");
    } else {
      const error = await res.json();
      alert("❌ Create failed: " + error.message);
    }
  };

  // Update faculty
  const handleUpdateFaculty = async (faculty) => {
    const res = await fetch(`/api/faculties/${faculty._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: faculty.name }),
    });

    const result = await res.json();
    if (!res.ok) {
      alert("❌ Update failed: " + result.message);
    } else {
      setEditingFacultyId(null);
    }
  };

  // Delete faculty
  const handleDeleteFaculty = async (id) => {
    const confirmed = confirm("Are you sure you want to delete this faculty?");
    if (!confirmed) return;

    const res = await fetch(`/api/faculties/${id}`, { method: "DELETE" });

    if (res.ok) {
      setFaculties((prev) => prev.filter((f) => f._id !== id));
    } else {
      const result = await res.json();
      alert("❌ Delete failed: " + result.message);
    }
  };

  if (!university) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-white p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">{university.name}</h1>

      {/* Add Faculty Form */}
      <form
        onSubmit={handleAddFaculty}
        className="mb-6 p-4 border border-dashed border-indigo-300 bg-indigo-50 rounded-xl"
      >
        <h2 className="text-lg font-semibold mb-3 text-indigo-700">Add Faculty</h2>
        <input
          type="text"
          placeholder="Faculty name"
          value={newFaculty}
          onChange={(e) => setNewFaculty(e.target.value)}
          className="mb-3 w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          Add Faculty
        </button>
      </form>

      {/* Faculty Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {faculties.map((faculty) => {
  const isEditing = editingFacultyId === faculty._id;

  return (
    <div
      key={faculty._id}
      className="border rounded-xl p-4 shadow-sm space-y-2"
    >
      {isEditing ? (
        <input
          type="text"
          value={faculty.name}
          onChange={(e) =>
            setFaculties((prev) =>
              prev.map((f) =>
                f._id === faculty._id ? { ...f, name: e.target.value } : f
              )
            )
          }
          className="w-full border p-2 rounded"
        />
      ) : (
        <h3 className="text-gray-800 font-semibold">{faculty.name}</h3>
      )}

      {/* Action buttons */}
      <div className="flex justify-between text-sm text-indigo-600">
        <a
          href={`/admin/faculties/${faculty._id}`}
          className="hover:underline"
        >
          View Departments →
        </a>

        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => handleUpdateFaculty(faculty)}
                className="hover:underline"
              >
                Save
              </button>
              <button
                onClick={() => setEditingFacultyId(null)}
                className="text-gray-500 hover:underline"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditingFacultyId(faculty._id)}
              className="hover:underline"
            >
              Edit
            </button>
          )}
          <button
            onClick={() => handleDeleteFaculty(faculty._id)}
            className="text-red-500 hover:underline"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
})}

</div>



      </div>
    
  );
}
