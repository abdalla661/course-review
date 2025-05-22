"use client";

import { useEffect, useState } from "react";
import ComboCardWithReview from "@/components/ComboCardWithReview";
import { useRouter } from "next/navigation";
//import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import Navbar from "@/components/navbar";
import dynamic from "next/dynamic";


export default function HomePage() {
  const [student, setStudent] = useState(null);
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
const router = useRouter();



<Navbar role="student" />

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

  return (
    <>
  <Navbar />
  <div className="min-h-screen px-6 py-10 max-w-4xl mx-auto">
     <div className="min-h-screen px-6 py-10 max-w-4xl mx-auto">
      
      
  <h1 className="text-3xl font-bold text-indigo-700">
    Welcome{student?.name ? `, ${student.name}` : ""}!
  </h1><br></br>


      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Professor–Course Combos
      </h2>
        
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {combos.map((combo) => (
    <ComboCardWithReview key={combo._id} combo={combo} student={student} />
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

