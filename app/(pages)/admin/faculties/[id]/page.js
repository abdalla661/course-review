"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function FacultyPage() {
  const { id } = useParams();
  const [faculty, setFaculty] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState("");
  const [editingDepartmentId, setEditingDepartmentId] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/faculties/${id}`)
      .then((res) => res.json())
      .then((data) => setFaculty(data.data || data));

    fetch(`/api/departments?facultyId=${id}`)
      .then((res) => res.json())
      .then(setDepartments);
  }, [id]);

  const handleAddDepartment = async (e) => {
    e.preventDefault();

    const res = await fetch(`/api/departments?facultyId=${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newDepartment }),
    });

    const result = await res.json();
    if (res.ok) {
      setDepartments((prev) => [...prev, result.data]);
      setNewDepartment("");
    } else {
      alert("❌ Error: " + result.message);
    }
  };

  const handleUpdateDepartment = async (department) => {
    const res = await fetch(`/api/departments/${department._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: department.name }),
    });

    const result = await res.json();
    if (res.ok) {
      setEditingDepartmentId(null);
    } else {
      alert("❌ Error: " + result.message);
    }
  };

  const handleDeleteDepartment = async (_id) => {
    const confirmed = confirm("Delete this department?");
    if (!confirmed) return;

    const res = await fetch(`/api/departments/${_id}`, { method: "DELETE" });
    if (res.ok) {
      setDepartments((prev) => prev.filter((d) => d._id !== _id));
    } else {
      const result = await res.json();
      alert("❌ Delete failed: " + result.message);
    }
  };

  if (!faculty) return <p className="p-6">Loading faculty...</p>;

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">{faculty.name}</h1>

      {/* Add department */}
      <form
        onSubmit={handleAddDepartment}
        className="mb-6 p-4 border border-dashed border-indigo-300 bg-indigo-50 rounded-xl"
      >
        <h2 className="text-lg font-semibold text-indigo-700 mb-3">Add Department</h2>
        <input
          type="text"
          placeholder="Department name"
          value={newDepartment}
          onChange={(e) => setNewDepartment(e.target.value)}
          className="mb-3 w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          Add
        </button>
      </form>

      {/* Departments list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {departments.map((department) => {
          const isEditing = editingDepartmentId === department._id;

          return (
            <div key={department._id} className="border rounded-xl p-4 shadow-sm space-y-2">
              {isEditing ? (
                <input
                  type="text"
                  value={department.name}
                  onChange={(e) =>
                    setDepartments((prev) =>
                      prev.map((d) =>
                        d._id === department._id
                          ? { ...d, name: e.target.value }
                          : d
                      )
                    )
                  }
                  className="w-full border p-2 rounded"
                />
              ) : (
                <h3 className="text-gray-800 font-semibold">{department.name}</h3>
              )}

              {/* View links */}
              <div className="flex gap-4 text-sm text-indigo-600">
                <a href={`/admin/departments/${department._id}/professors`} className="hover:underline">View Professors →</a>
                <a href={`/admin/departments/${department._id}/courses`} className="hover:underline">View Courses →</a>
                <a href={`/admin/departments/${department._id}/combos`} className="hover:underline">View Combos →</a>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-2 text-sm">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => handleUpdateDepartment(department)}
                      className="text-indigo-600 hover:underline"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingDepartmentId(null)}
                      className="text-gray-500 hover:underline"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditingDepartmentId(department._id)}
                    className="text-indigo-600 hover:underline"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDeleteDepartment(department._id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
