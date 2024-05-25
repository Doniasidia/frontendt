//reset_password
"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Import useRouter from next/router
import {
  CLIENT_REGISTER_PASSWORD_API,
  SUBSCRIBER_REGISTER_PASSWORD_API,
} from "@/utils/apiUtil";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";

const Signup = () => {
  const [confirmation, setConfirmation] = useState(""); // Corrected variable name to setEmail
  const [password, setPassword] = useState("");
  const params = useSearchParams();
  const router = useRouter();
  const [signupError, setSignupError] = useState("");

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password && password === confirmation) {
      try {
        const token = params?.get("token");
        const isClient = params?.get("client");

        let baseUrl = SUBSCRIBER_REGISTER_PASSWORD_API;

        if (isClient === "true") {
          baseUrl = CLIENT_REGISTER_PASSWORD_API;
        }

        const response = await axios.patch(`${baseUrl}/${token}`, {
          password: password,
        });

        if (response.data.success && response.data.code === 1) {
          toast.success("Password Updated successfully!");
          router.replace("/login");
        } else {
          toast.error("Failed to update password. Please try again later.");
        }
      } catch (error) {
        toast.error("Failed to update password. Please try again later.");
      }
    } else {
      toast.error("Passwords do not match. Please re-enter your password.");
    }
  };

  return (
    <div className="overflow-hidden bg-gradient-to-r from-cyan-600 to-sky-600 lg:px-16 min-h-screen flex items-start justify-center pt-20 relative">
    {/* Background Image */}
    <img
      src="/MDPTTT.jpg"
      alt=""
      className="absolute inset-0 w-full h-full object-cover blur-sm opacity-50 z-0"
    />

      {/* Form Container */}
      <div className="relative z-10 bg-white p-16 rounded-lg shadow-lg max-w-lg w-full mx-auto mt-20">
        <form onSubmit={handleSignup} className="w-full max-w-sm">
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Mot de passe:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirmation"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Confirmation de mot de passe :
            </label>
            <input
              type="confirmation"
              id="confirmation"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex items-center justify-center">
          <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-900 to-sky-700  text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Valider
            </button>
          </div>
          {signupError && <div className="text-red-500">{signupError}</div>}
        </form>
      </div>
    </div>
  );
};

export default Signup;
