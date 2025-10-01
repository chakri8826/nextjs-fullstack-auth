"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (email.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
      setError("");
    }
  }, [email]);

  const handleEmailValidation = async () => {
    if (!email) {
      setError("Please enter an email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/users/check-email", { email });

      if (response.data.exists) {
        toast.success("If an account exists for the email provided, a message has been sent with further instructions.");
        // trigger server to send reset email without importing server-only code in client
        await axios.post("/api/users/request-password-reset", { email });
      }
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 404) {
          setError("No account found with this email address. Please check your email or sign up for a new account.");
          toast.error("No account found with this email address");
        } else {
          setError("An error occurred while checking your email. Please try again.");
          toast.error("Error checking email");
        }
      } else {
        setError("An error occurred while checking your email. Please try again.");
        toast.error("Error checking email");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h2 className="text-2xl font-bold mb-6">Reset Your Password</h2>
      <p className="text-gray-600 mb-6">
        Enter your email address to receive password reset instructions
      </p>

      <div className="w-full max-w-md">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email
        </label>
        <input
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-blue-500 text-white"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          disabled={loading}
        />

        {error && (
          <div className="text-red-600 text-sm mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={handleEmailValidation}
            disabled={buttonDisabled || loading}
            className={`w-full py-3 px-4 rounded-lg font-medium ${buttonDisabled || loading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
          >
            {loading ? "Checking Email..." : "Verify Email"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-blue-600 hover:text-blue-800">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
