import React from "react";
import { GraduationCap } from "lucide-react";

const AuthCard = ({ title, subtitle, children }) => {
  return (
    <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
          <GraduationCap className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        <p className="mt-2 text-gray-600">{subtitle}</p>
      </div>
      {children}
    </div>
  );
};

export default AuthCard;
