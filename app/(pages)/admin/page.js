"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import ClientOnly from "@/components/ClientOnly";
export default function AdminDashboard() {
  const [universities, setUniversities] = useState([]);
  const [name, setName] = useState("");
  const [emailDomains, setEmailDomains] = useState("");
  const [editingId, setEditingId] = useState(null);
  const cardStyle = "p-6 border rounded-xl shadow space-y-3 bg-white";

useEffect(() => {
  const admin = JSON.parse(localStorage.getItem("admin"));
  if (!admin?.isAdmin) {
    router.push("/admin/login");
  }
}, []);


  // ✅ Fetch universities directly
useEffect(() => {
  fetch("/api/universities")
    .then((res) => res.json())
    .then((data) => {
      console.log("Fetched universities →", data);
      setUniversities(data); // or data.data if needed
    })
    .catch((err) => console.error("Fetch error →", err));
}, []);

  // Create a university
const handleAddUniversity = async (e) => {
  e.preventDefault();

  const res = await fetch("/api/universities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      emailDomains: emailDomains.split(",").map((d) => d.trim()),
    }),
  });

  let result;
  try {
    result = await res.json();
  } catch (err) {
    return alert("❌ Server error: Could not parse response");
  }

  if (res.ok) {
    setUniversities((prev) => [...prev, result.data || result]); // try both
    setName("");
    setEmailDomains("");
  } else {
    alert("❌ Error: " + (result?.message || "Unknown server error"));
  }
};

const handleUpdateUniversity = async (uni) => {
  const res = await fetch(`/api/universities/${uni._id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: uni.name,
      emailDomains: uni.emailDomains,
    }),
  });

  const result = await res.json();
  if (!res.ok) {
    alert("❌ Update failed: " + result.message);
  } else {
    setEditingId(null); // exit edit mode
  }
};


const handleDeleteUniversity = async (id) => {
  const confirmed = confirm("Are you sure you want to delete this university?");
  if (!confirmed) return;

  const res = await fetch(`/api/universities/${id}`, {
    method: "DELETE",
  });

  if (res.ok) {
    setUniversities((prev) => prev.filter((u) => u._id !== id));
  } else {
    const result = await res.json();
    alert("❌ Delete failed: " + result.message);
  }
};




  return (
    <div className="min-h-screen bg-white p-6 max-w-5xl mx-auto">
      <ClientOnly><Navbar role="admin" showBack /></ClientOnly>
      
      <h1 className="text-3xl font-bold text-indigo-700 mb-8">Universities</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* ➕ Add New University */}<ClientOnly>
        <form
          onSubmit={handleAddUniversity}
          className={cardStyle}
        >
          <h2 className="text-lg font-semibold text-indigo-700 mb-4">Add New University</h2>
          <input
            type="text"
            placeholder="University name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-3 w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Email domains (comma separated)"
            value={emailDomains}
            onChange={(e) => setEmailDomains(e.target.value)}
            className="mb-3 w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            Add
          </button>
        </form></ClientOnly>

        {/* 🏛️ University Cards */}
      {universities.map((uni) => {
  const isEditing = editingId === uni._id;


  return (
    <div
      key={uni._id}
      className={cardStyle}
    >
      {isEditing ? (
        <>
          <input
            type="text"
            value={uni.name}
            onChange={(e) =>
              setUniversities((prev) =>
                prev.map((u) =>
                  u._id === uni._id ? { ...u, name: e.target.value } : u
                )
              )
            }
            className="w-full border p-2 rounded font-semibold text-gray-800"
          />
          <input
            type="text"
            value={uni.emailDomains.join(", ")}
            onChange={(e) =>
              setUniversities((prev) =>
                prev.map((u) =>
                  u._id === uni._id
                    ? { ...u, emailDomains: e.target.value.split(",").map((d) => d.trim()) }
                    : u
                )
              )
            }
            className="w-full border p-2 rounded text-sm"
          />
        </>
      ) : (
        <>
          <h3 className="text-xl font-semibold text-gray-800">{uni.name}</h3>
          <p className="text-sm text-gray-500">
            Domains: {uni.emailDomains?.join(", ") || "-"}
          </p>
        </>
      )}

      <div className="flex justify-between items-center text-sm text-indigo-600">
        <a href={`/admin/universities/${uni._id}`} className="hover:underline">
          View Faculties →
        </a>

        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => handleUpdateUniversity(uni)}
                className="hover:underline"
              >
                Save
              </button>
              <button
                onClick={() => setEditingId(null)}
                className="text-gray-500 hover:underline"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditingId(uni._id)}
              className="hover:underline"
            >
              Edit
            </button>
          )}

          <button
            onClick={() => handleDeleteUniversity(uni._id)}
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
