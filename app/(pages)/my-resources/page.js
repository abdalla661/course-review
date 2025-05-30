"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightOnRectangleIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
export default function MyResourcesPage() {
  const [resources, setResources] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
const handleLogout = () => {
  const role = localStorage.getItem("role"); // 🔥 Fetch from localStorage
  if (role === "admin") {
    localStorage.removeItem("admin");
    router.push("/login");
  } else {
    localStorage.removeItem("student");
    router.push("/login");
  }
};
  const fetchResources = async (studentId) => {
    const res = await fetch(`/api/resources?studentId=${studentId}`);
    const data = await res.json();
    setResources(Array.isArray(data) ? data : data.data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("student");
      if (stored) {
        const parsedStudent = JSON.parse(stored);
        setStudent(parsedStudent);
        fetchResources(parsedStudent._id);
      } else {
        router.push("/login");
      }
    }
  }, []);

  if (!student) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
        <nav className="fixed top-0 left-0 w-full bg-indigo-600 text-white px-6 py-4 flex items-center justify-between shadow z-50">
      <div className="flex items-center gap-4">
        
        <h1 className="text-xl font-bold tracking-wide cursor-pointer" onClick={() => router.push("/home")}>
          EduPulse
        </h1>
      </div>

      <button
        onClick={handleLogout}
        title="Logout"
        className="flex items-center gap-1 text-sm hover:text-red-200 transition"
      >
        <ArrowRightOnRectangleIcon className="w-5 h-5" />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </nav>
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">My Uploaded Resources</h1>
      {loading ? (
        <p>Loading your resources...</p>
      ) : resources.length === 0 ? (
        <p>No resources found.</p>
      ) : (
        resources.map((res) => (
          <div key={res._id} className="border rounded p-4 mb-4">
            <p><strong>Title:</strong> {res.title}</p>
            <p><strong>Status:</strong> {res.status}</p>
            <a href={res.file_url} target="_blank" rel="noopener noreferrer">View File</a>
            <button onClick={async () => {
              const delRes = await fetch(`/api/resources/${res._id}`, { method: "DELETE" });
              if (delRes.ok) {
                setResources((prev) => prev.filter((r) => r._id !== res._id));
              } else {
                alert("Delete failed");
              }
            }} className="text-red-600 ml-4">Delete</button>
          </div>
        ))
      )}
    </div>
  );
}
