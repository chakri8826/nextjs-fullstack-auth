"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  const verifyResetToken = async () => {
    try {
      await axios.post("/api/users/verify-reset-token", { token });
      setVerified(true);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { error?: string } } };
        setError(axiosError.response?.data?.error || "Invalid or expired token");
      } else {
        setError("Invalid or expired token");
      }
    }
  };

  const resetPassword = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await axios.post("/api/users/reset-password", { token, password });
      toast.success("password reset successfull")
      setResetDone(true);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { error?: string } } };
        setError(axiosError.response?.data?.error || "Something went wrong");
      } else {
        setError("Something went wrong");
      }
    }
  };

  useEffect(() => {
    if (token) {
      verifyResetToken();
    }
  }, [token, verifyResetToken]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
      <hr className="w-full mb-4" />

      {/* Show error */}
      {error && (
        <div className="text-red-500 mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* Token verified but not reset yet */}
      {verified && !resetDone && (
        <div className="flex flex-col gap-2">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="p-2 border rounded"
          />
          <button
            onClick={resetPassword}
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Reset Password
          </button>
        </div>
      )}

      {/* Reset successful */}
      {resetDone && (
        <div className="text-green-600 mt-4">
          <p>Password Reset Successfully 🎉</p>
          <Link href="/login" className="underline text-blue-600">
            Go to Login
          </Link>
        </div>
      )}
    </div>
  );
}
