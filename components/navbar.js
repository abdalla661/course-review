"use client";
import { useRouter } from "next/navigation";
import { ArrowRightOnRectangleIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function Navbar({ role, showBack = false }) {
  const router = useRouter();

  const handleLogout = () => {
    if (role === "admin") {
      localStorage.removeItem("admin");
      router.push("/login");
    } else {
      localStorage.removeItem("student");
      router.push("/login");
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-indigo-600 text-white px-6 py-4 flex items-center justify-between shadow z-50">
      <div className="flex items-center gap-4">
        {showBack && (
          <button
            onClick={() => router.back()}
            title="Go back"
            className="flex items-center gap-1 text-sm hover:text-indigo-200 transition"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="hidden sm:inline"></span>
          </button>
        )}
        <h1 className="text-xl font-bold tracking-wide cursor-pointer" onClick={() => router.push("/admin/home")}>
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
  );
}

