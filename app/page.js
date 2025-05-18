"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-700 mb-4">
        Course Review
      </h1>
      <p className="text-lg sm:text-xl text-gray-600 mb-8 text-center max-w-xl">
        Discover the best courses and professors through real student feedback. Rate, review, and find shared resources all in one place.
      </p>

      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-6 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          Log In
        </Link>
        <Link
          href="/signup"
          className="px-6 py-2 rounded border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition"
        >
          Sign Up
        </Link>
      </div>

      <div className="mt-12 text-sm text-gray-400">
        Built for students. Trusted by learners.
      </div>
    </div>
  );
}
