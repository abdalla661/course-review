"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";

export default function ResourceModerationPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  useEffect(() => {
  const fetchPending = async () => {
    try {
      const res = await fetch("/api/resources/moderate");
      const data = await res.json();
      console.log("✅ MODERATE DATA:", data);
      setResources(data);
    } catch (err) {
      console.error("❌ Failed to load moderation data", err);
    } finally {
      setLoading(false);
    }
  };

  fetchPending();
}, []);

  // useEffect(() => {
  //   fetchResources();
  // }, []);

  // const fetchResources = async () => {
  //   setLoading(true);
  //   const res = await fetch("/api/resources/moderate");
  //   const data = await res.json();
  //   setResources(data);
  //   setLoading(false);
  // };

  const handleAction = async (id, status) => {
    const res = await fetch(`/api/resources/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      setStatusMessage(`✅ Resource ${status}`);
      fetchResources(); // Refresh list
    } else {
      setStatusMessage("❌ Action failed");
    }
  };

  return (
    
    <div className="min-h-screen bg-white px-6 py-10 max-w-4xl mx-auto">
      <Navbar role="admin" showBack />
      <br /><br />
      <h1 className="text-2xl font-bold text-indigo-700 mb-6">Moderate Study Resources</h1>

      {loading ? (
        <p className="text-gray-600">Loading resources...</p>
      ) : resources.length === 0 ? (
        <p className="text-gray-500">No pending resources to moderate.</p>
      ) : (
        <div className="space-y-4">
          {resources.map((res) => (
            // <div key={res._id} className="border rounded p-4 bg-gray-50 shadow-sm">
            //   <div className="flex justify-between items-center">
            //     <div>
            //       <h2 className="font-semibold text-gray-800 text-sm">{res.tag.toUpperCase()}</h2>
                  
            //       <a
            //         href={res.file_url}
            //         target="_blank"
            //         rel="noopener noreferrer"
            //         className="text-indigo-600 underline text-sm mt-2 inline-block"
            //       >
            //         View PDF
            //       </a>
            //     </div>
            //     <div className="flex gap-2">
            //       <button
            //         onClick={() => handleAction(res._id, "approved")}
            //         className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
            //       >
            //         Approve
            //       </button>
            //       <button
            //         onClick={() => handleAction(res._id, "rejected")}
            //         className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
            //       >
            //         Reject
            //       </button>
            //     </div>
            //   </div>
            // </div>
            <div className="flex justify-between items-center">
  <div>
    <h2 className="font-semibold text-gray-800 text-sm">
      {res.tag.toUpperCase()}
    </h2>

    {res.combo?.course && res.combo?.professor ? (
      <p className="text-sm text-gray-600 mt-1">
        Course: {res.combo.course.name} — Taught by: {res.combo.professor.name}
      </p>
    ) : (
      <p className="text-sm text-gray-600 mt-1 italic text-red-400">
        Combo data missing
      </p>
    )}

    <a
      href={res.file_url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-indigo-600 underline text-sm mt-2 inline-block"
    >
      View PDF
    </a>
  </div>
  <div className="flex gap-2">
    <button
      onClick={() => handleAction(res._id, "approved")}
      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
    >
      Approve
    </button>
    <button
      onClick={() => handleAction(res._id, "rejected")}
      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
    >
      Reject
    </button>
  </div>
</div>

          ))}
        </div>
      )}

      {statusMessage && (
        <p className="text-sm text-gray-700 mt-6">{statusMessage}</p>
      )}
    </div>
  );
}
