"use client";

import { useRouter } from "next/navigation";
// app/admin/home/page.js


import Navbar from "@/components/navbar";

export default function AdminHomePage() {
  const router = useRouter();

  const links = [
    {
      title: "Manage University Hierarchy",
      description: "Universities → Faculties → Departments → Combos",
      path: "/admin",
    },
    {
      title: "Moderate Reviews",
      description: "Approve or reject student reviews for combos",
      path: "/admin/reviews",
    },
    {
      title: "Moderate Shared Resources",
      description: "Approve or reject study resources",
      path: "/admin/resources", // can be a placeholder for now
    },
  ];

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-4xl mx-auto">
      
     <Navbar role="student" />
      
    <br></br><br></br>
      <h1 className="text-3xl font-bold text-indigo-700 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {links.map((link) => (
          <button
            key={link.path}
            onClick={() => router.push(link.path)}
            className="p-6 text-left border rounded-xl shadow-sm hover:shadow-md transition hover:scale-[1.01] bg-gray-50"
          >
            <h2 className="text-lg font-semibold text-indigo-700 mb-1">{link.title}</h2>
            <p className="text-sm text-gray-600">{link.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
