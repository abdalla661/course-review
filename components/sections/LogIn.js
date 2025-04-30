"use client";

import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import InputField from "../atoms/InputField";
import AuthCard from "../atoms/AuthCard";
import { useRouter } from "next/navigation"; // Updated import for Next.js 13+

const LogInSection = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <AuthCard title="Welcome back" subtitle="Sign in to your account to continue">
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="h-5 w-5 text-gray-400" />}
            placeholder="you@example.com"
          />

          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="h-5 w-5 text-gray-400" />}
            placeholder="••••••••"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">Remember me</label>
            </div>
            <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign in
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={() => router.push("/signup")}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </button>
        </p>
      </AuthCard>
    </div>
  );
};

export default LogInSection;
