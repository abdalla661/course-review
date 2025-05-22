"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/navbar";
export default function ProfessorsPage() {
  const { id } = useParams();
  const [department, setDepartment] = useState(null);
  const [professors, setProfessors] = useState([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        const depRes = await fetch(`/api/departments/${id}`);
        const depJson = await depRes.json();
        setDepartment(depJson?.data ?? depJson);

        const profRes = await fetch(`/api/professors?departmentId=${id}`);
        const profJson = await profRes.json();
        setProfessors(profJson);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/professors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName,
        department: id,
      }),
    });

    const result = await res.json();
    if (res.ok) {
      setProfessors((prev) => [...prev, result.data]);
      setNewName("");
    } else {
      alert("❌ Error: " + result.message);
    }
  };

  const handleDelete = async (_id) => {
    if (!confirm("Delete this professor?")) return;

    const res = await fetch(`/api/professors/${_id}`, { method: "DELETE" });
    if (res.ok) {
      setProfessors((prev) => prev.filter((p) => p._id !== _id));
    } else {
      const result = await res.json();
      alert("❌ Delete failed: " + result.message);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!department) return <p className="p-6 text-red-500">❌ Department not found.</p>;

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <Navbar role="admin" showBack />
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">
        Professors in {department.name}
      </h1>

      {/* Add form */}
      <form
        onSubmit={handleAdd}
        className="mb-6 p-4 border border-dashed border-indigo-300 bg-indigo-50 rounded-xl"
      >
        <h2 className="text-lg font-semibold text-indigo-700 mb-3">Add Professor</h2>
        <input
          type="text"
          placeholder="Professor name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
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

      {/* Professors list */}
      {professors.length === 0 ? (
        <p className="text-gray-500">No professors yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {professors.map((prof) => (
            <div key={prof._id} className="border rounded-xl p-4 shadow-sm">
              <h3 className="text-gray-800 font-semibold">{prof.name}</h3>
              <button
                onClick={() => handleDelete(prof._id)}
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
