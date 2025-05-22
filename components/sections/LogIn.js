"use client";

import React, { useEffect, useState } from "react";
import { Mail, Lock } from "lucide-react";
import InputField from "../atoms/InputField";
import AuthCard from "../atoms/AuthCard";
import { useRouter } from "next/navigation";
import { loginValidationSchema } from "../../lib/validations/loginSchema";

const LogInSection = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginRedirectData, setLoginRedirectData] = useState(null);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const validated = loginValidationSchema.safeParse({ email, password });
    if (!validated.success) {
      setErrors(validated.error.flatten().fieldErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ general: data.message || "Login failed" });
        return;
      }

      // ✅ Defer client-side redirects
      setLoginRedirectData(data.user);
    } catch (err) {
      console.error("❌ Login error:", err);
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && loginRedirectData) {
      if (loginRedirectData.isAdmin === true) {
        localStorage.setItem("admin", JSON.stringify(loginRedirectData));
        router.push("/admin/home");
      } else {
        localStorage.setItem("student", JSON.stringify(loginRedirectData));
        router.push("/home");
      }
    }
  }, [loginRedirectData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <AuthCard title="Welcome back" subtitle="Sign in to your account to continue">
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            name="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="h-5 w-5 text-gray-400" />}
            placeholder="you@example.com"
            error={errors.email}
          />

          <InputField
            name="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="h-5 w-5 text-gray-400" />}
            placeholder="••••••••"
            error={errors.password}
          />

          {errors.general && (
            <p className="text-sm text-red-500 text-center">{errors.general}</p>
          )}

          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-700">
              <input
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-2"
              />
              Remember me
            </label>
            <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
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
