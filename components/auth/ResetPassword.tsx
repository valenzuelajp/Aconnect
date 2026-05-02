"use client";
import React from "react";

export default function ResetPassword() {
  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
        <i className="fas fa-exclamation-triangle text-amber-600 text-3xl mb-4"></i>
        <h2 className="text-lg font-bold text-slate-800 mb-2">Feature Unavailable</h2>
        <p className="text-sm text-slate-600 mb-6">
          Self-service password reset is currently unavailable. Please contact the SDCA Administrator or visit the Information Technology Center for assistance.
        </p>
        <button
          disabled
          className="w-full px-4 py-3 bg-slate-200 text-slate-500 rounded-xl font-bold text-sm cursor-not-allowed"
        >
          Reset Unavailable
        </button>
      </div>
    </div>
  );
}
