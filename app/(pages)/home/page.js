"use client";

import { useEffect, useState } from "react";
import ComboCardWithReview from "@/components/ComboCardWithReview";
import { useRouter } from "next/navigation";
//import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import Navbar from "@/components/navbar";
import dynamic from "next/dynamic";
import { ArrowRightOnRectangleIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function HomePage() {
  const [student, setStudent] = useState(null);
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
const router = useRouter();
const [search, setSearch] = useState("");





  // 1️⃣ Load student from localStorage
useEffect(() => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("student");
    if (stored) {
      const parsed = JSON.parse(stored);
      setStudent(parsed);
    } else {
      console.warn("⚠️ No student found in localStorage");
    }
    setLoading(false); // ✅ Always exit loading state after localStorage check
  }
}, []);

  // 2️⃣ Fetch combos for student's department
  useEffect(() => {
    if (!student?.department) return;

    fetch(`/api/professor-courses?departmentId=${student.department}&studentId=${student._id}`)

      .then((res) => res.json())
      .then((data) => {
        setCombos(data);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch combos:", err);
      })
      .finally(() => setLoading(false));
  }, [student?.department]);

  // 3️⃣ Page loading state
  if (loading) {
    return (
      <div className="min-h-screen p-6 text-center text-gray-600">
        Loading combos...
      </div>
    );
  }
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
const fetchCombos = () => {
  if (!student?.department) return;
  fetch(`/api/professor-courses?departmentId=${student.department}&studentId=${student._id}`)
    .then((res) => res.json())
    .then((data) => setCombos(data))
    .catch((err) => console.error("❌ Failed to fetch combos:", err));
};

  return (
    <>
  {/* <Navbar /> */}
  <nav className="fixed top-0 left-0 w-full bg-indigo-600 text-white px-6 py-4 flex items-center justify-between shadow z-50">
      <div className="flex items-center gap-4">
        
        <h1 className="text-xl font-bold tracking-wide cursor-pointer" onClick={() => router.push("#")}>
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
  <div className="min-h-screen px-6 py-10 max-w-4xl mx-auto">
     <div className="min-h-screen px-6 py-10 max-w-4xl mx-auto">
      
      
  <h1 className="text-3xl font-bold text-indigo-700">
    Welcome{student?.name ? `, ${student.name}` : ""}!
  </h1><br></br>

<div className="flex  gap-4 my-4">
  
  <button
    onClick={() => router.push('/my-resources')}
    className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
  >
    View My Uploaded Resources
  </button>
  <button
    onClick={() => router.push('/my-reviews')}
    className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
  >
    View My Reviews
  </button>
</div>


      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Professor–Course Combos
      </h2>
        <input
  type="text"
  placeholder="Search by course or professor"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
/>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
{combos
  .filter((combo) => {
    const courseName = combo.course?.name?.toLowerCase() || "";
    const courseCode = combo.course?.code?.toLowerCase() || "";
    const profName = combo.professor?.name?.toLowerCase() || "";
    const query = search.toLowerCase();

    return (
      courseName.includes(query) ||
      courseCode.includes(query) ||
      profName.includes(query)
    );
  })
  .map((combo) => (
    <ComboCardWithReview key={combo._id} combo={combo} student={student} refreshCombos={fetchCombos} />
))}


</div>

    </div>
<footer className="text-center py-4 text-gray-400 text-sm">
  © {new Date().getFullYear()} EduPulse. All rights reserved.
</footer>

  </div>
</>

   
  );
}

