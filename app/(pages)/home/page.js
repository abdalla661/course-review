"use client";

import React, { useState } from "react";
import Image from "next/image";
import { UserCircle, LogOut, Star } from "lucide-react";

export default function Home() {
  const [search, setSearch] = useState("");
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("notes");

  const dummyCourses = [
    { name: "Data Structures", professor: "Dr. Smith", rating: 4.2, reviews: 12 },
    { name: "Operating Systems", professor: "Prof. Lee", rating: 4.5, reviews: 8 },
    { name: "Databases", professor: "Dr. Brown", rating: 3.9, reviews: 15 },
  ];

  const dummyResources = {
    notes: ["Midterm Summary.pdf", "Lecture Notes Week 1.docx"],
    exams: ["Final Exam 2023.pdf", "Midterm 2022.docx"],
  };

  const filteredCourses = dummyCourses.filter((course) =>
    course.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <header className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* <Image src="/logo.svg" alt="Course Review Logo" width={40} height={40} /> */}
            <span className="text-2xl font-semibold text-indigo-700">Course Review</span>
          </div>
          <div className="flex items-center gap-4 text-gray-600">
            <UserCircle className="w-6 h-6" />
            <LogOut className="w-6 h-6 cursor-pointer hover:text-red-500 transition" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Department Courses</h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Search for a course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-10 px-5 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm placeholder-gray-400"
        />

        {/* Course Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredCourses.map((course, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all space-y-5"
            >
              <div>
                <h3 className="text-2xl font-semibold text-gray-800">{course.name}</h3>
                <p className="text-sm text-gray-500 mt-1">Prof. {course.professor}</p>
              </div>

              <div className="flex items-center gap-1 text-yellow-500">
                {[...Array(Math.round(course.rating))].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400" />
                ))}
                <span className="text-sm text-gray-500 ml-2">({course.reviews} reviews)</span>
              </div>

              <textarea
                placeholder="Leave a comment..."
                className="w-full p-3 rounded-xl text-sm bg-white shadow-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none resize-none"
                rows={2}
              />

              <div className="flex gap-3">
                <button className="w-1/2 bg-indigo-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition">
                  Submit Review
                </button>
                <button
                  className="w-1/2 bg-white text-indigo-600 py-2 rounded-xl text-sm font-medium shadow-sm hover:bg-indigo-50 transition"
                  onClick={() =>
                    setExpandedCourse(expandedCourse === index ? null : index)
                  }
                >
                  {expandedCourse === index ? "Hide Resources" : "View Resources"}
                </button>
              </div>

              {expandedCourse === index && (
                <div className="mt-6">
                  {/* Tabs */}
                  <div className="flex gap-6 mb-4">
                    {["notes", "exams"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`text-sm font-medium pb-1 transition-all ${
                          activeTab === tab
                            ? "text-indigo-600 border-b-2 border-indigo-600"
                            : "text-gray-400 border-b-2 border-transparent"
                        }`}
                      >
                        {tab === "notes" ? "Notes" : "Past Exams"}
                      </button>
                    ))}
                  </div>

                  {/* Resource List */}
                  <ul className="space-y-3 mb-4">
                    {dummyResources[activeTab].map((file, i) => (
                      <li
                        key={i}
                        className="bg-white rounded-xl px-4 py-3 shadow-sm text-sm text-gray-700"
                      >
                        📄 {file}
                      </li>
                    ))}
                  </ul>

                  {/* Upload */}
                  <div className="bg-white rounded-xl shadow-sm p-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Upload a new {activeTab === "notes" ? "note" : "exam"}:
                    </p>
                    <input
                      type="file"
                      className="w-full bg-gray-50 text-sm p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      accept=".pdf,.doc,.docx"
                    />
                    <button className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition">
                      Submit for Approval
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Course Review. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
