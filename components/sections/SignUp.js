"use client";

import React, { useState, useEffect } from "react";
import { Mail, Lock, User } from "lucide-react";
import InputField from "../atoms/InputField";
import AuthCard from "../atoms/AuthCard";
import { useRouter } from "next/navigation";
import Dropdown from "../atoms/Dropdown";
import { z } from "zod";
import { studentValidationSchema } from "@/lib/validations/studentSchema";

const SignUpSection = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    university: "",
    faculty: "",
    department: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(""); // <-- Success message state

  const [universities, setUniversities] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await fetch("/api/universities");
        const data = await response.json();
        setUniversities(data);
      } catch (error) {
        console.error("Failed to fetch universities", error);
      }
    };
    fetchUniversities();
  }, []);

  useEffect(() => {
    if (formData.university) {
      const fetchFaculties = async () => {
        try {
          const response = await fetch(`/api/faculties?universityId=${formData.university}`);
          const data = await response.json();
          setFaculties(data);
        } catch (error) {
          console.error("Failed to fetch faculties", error);
        }
      };
      fetchFaculties();
    } else {
      setFaculties([]);
      setFormData((prev) => ({ ...prev, faculty: "", department: "" }));
    }
  }, [formData.university]);

  useEffect(() => {
    if (formData.university && formData.faculty) {
      const fetchDepartments = async () => {
        try {
          const response = await fetch(`/api/departments?facultyId=${formData.faculty}`);
          const data = await response.json();
          setDepartments(data);
        } catch (error) {
          console.error("Failed to fetch departments", error);
        }
      };
      fetchDepartments();
    } else {
      setDepartments([]);
      setFormData((prev) => ({ ...prev, department: "" }));
    }
  }, [formData.faculty]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");
    const result = await studentValidationSchema.safeParseAsync(formData);
    if (!result.success) {
      const validationErrors = result.error.errors.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {});
      setErrors(validationErrors);
      return;
    }

    // Call the API to create the student
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        setSuccess("Account created successfully! Redirecting...");
        setTimeout(() => {
          router.push("/");
        }, 1500); // 1.5 seconds before redirect
      } else {
        setErrors({ api: data.message || "An error occurred. Please try again." });
      }
    } catch (err) {
      setErrors({ api: "An error occurred. Please try again." });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <AuthCard title="Create an account" subtitle="Join our community of learners">
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Full Name"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            icon={<User className="h-5 w-5 text-gray-400" />}
            placeholder="John Doe"
          />
          {errors.fullName && <p className="text-red-500">{errors.fullName}</p>}

          <Dropdown
            label="Select University"
            name="university"
            value={formData.university}
            onChange={handleChange}
            options={universities.map((u) => ({ label: u.name, value: u._id }))}
            placeholder="Choose a university"
          />
          {errors.university && <p className="text-red-500">{errors.university}</p>}

          <Dropdown
            label="Select Faculty"
            name="faculty"
            value={formData.faculty}
            onChange={handleChange}
            options={faculties.map((f) => ({ label: f.name, value: f._id }))}
            placeholder="Choose a faculty"
            disabled={!formData.university}
          />
          {errors.faculty && <p className="text-red-500">{errors.faculty}</p>}

          <Dropdown
            label="Select Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            options={departments.map((d) => ({ label: d.name, value: d._id }))}
            placeholder="Choose a department"
            disabled={!formData.university || !formData.faculty}
          />
          {errors.department && <p className="text-red-500">{errors.department}</p>}

          <InputField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            icon={<Mail className="h-5 w-5 text-gray-400" />}
            placeholder="you@your-university-email-domain"
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}

          <InputField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            icon={<Lock className="h-5 w-5 text-gray-400" />}
            placeholder="••••••••"
          />
          {errors.password && <p className="text-red-500">{errors.password}</p>}

          {errors.api && <p className="text-red-500">{errors.api}</p>}
          {success && <p className="text-green-600">{success}</p>}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={!!success}
          >
            Create account
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </button>
        </p>
      </AuthCard>
    </div>
  );
};

export default SignUpSection;