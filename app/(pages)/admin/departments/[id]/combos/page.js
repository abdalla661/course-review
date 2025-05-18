"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CombosPage() {
  const { id } = useParams();
  const [department, setDepartment] = useState(null);
  const [professors, setProfessors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [combos, setCombos] = useState([]);
  const [selectedProf, setSelectedProf] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        const depRes = await fetch(`/api/departments/${id}`);
        const depJson = await depRes.json();
        setDepartment(depJson?.data ?? depJson);

        const profRes = await fetch(`/api/professors?departmentId=${id}`);
        const courseRes = await fetch(`/api/courses?departmentId=${id}`);
        const comboRes = await fetch(`/api/professor-courses?departmentId=${id}`);

        const [profJson, courseJson, comboJson] = await Promise.all([
          profRes.json(),
          courseRes.json(),
          comboRes.json(),
        ]);

        setProfessors(Array.isArray(profJson) ? profJson : []);
        setCourses(Array.isArray(courseJson) ? courseJson : []);
        setCombos(Array.isArray(comboJson) ? comboJson : []);
      } catch (err) {
        console.error("❌ Error loading combos page:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/professor-courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        professor: selectedProf,
        course: selectedCourse,
        department: id,
      }),
    });

    const result = await res.json();
    if (res.ok) {
      setCombos((prev) => [...prev, result.data]);
      setSelectedProf("");
      setSelectedCourse("");
    } else {
      alert("❌ Error: " + result.message);
    }
  };

  const handleDelete = async (_id) => {
    if (!confirm("Delete this combo?")) return;
    const res = await fetch(`/api/professor-courses/${_id}`, { method: "DELETE" });
    if (res.ok) {
      setCombos((prev) => prev.filter((c) => c._id !== _id));
    } else {
      const result = await res.json();
      alert("❌ Delete failed: " + result.message);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!department) return <p className="p-6 text-red-500">❌ Department not found</p>;

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">
        Professor-Course Combos in {department.name}
      </h1>

      {/* Add form */}
      <form
        onSubmit={handleAdd}
        className="mb-6 p-4 border border-dashed border-indigo-300 bg-indigo-50 rounded-xl"
      >
        <h2 className="text-lg font-semibold text-indigo-700 mb-3">Add Combo</h2>

        <select
          value={selectedProf}
          onChange={(e) => setSelectedProf(e.target.value)}
          className="mb-3 w-full p-2 border rounded"
          required
        >
          <option value="">Select Professor</option>
          {professors.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="mb-3 w-full p-2 border rounded"
          required
        >
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name} ({c.code})
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          Add Combo
        </button>
      </form>

      {/* Combos list */}
      {combos.length === 0 ? (
        <p className="text-gray-500">No combos yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {combos.map((combo) => (
            <div key={combo._id} className="border rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-800">
                {combo.course?.name} ({combo.course?.code})
              </h3>
              <p className="text-sm text-gray-600">Taught by: {combo.professor?.name}</p>
              <button
                onClick={() => handleDelete(combo._id)}
                className="text-red-500 text-sm mt-2"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
