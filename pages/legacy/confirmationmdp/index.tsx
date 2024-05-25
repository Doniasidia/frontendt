//confirmationmdp
"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Import useRouter from next/router
import Cookies from "js-cookie";
import {
  CLIENTS_API,
  CLIENT_VERIFY_API,
  SUBSCRIBERS_API,
  SUBSCRIBER_VERIFY_API,
} from "@/utils/apiUtil";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";

const Signup = () => {
  const [confirmation, setConfirmation] = useState(""); // Corrected variable name to setEmail
  const [password, setPassword] = useState("");
  const params = useSearchParams();
  const router = useRouter();
  const [signupError, setSignupError] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const emailToken = params?.get("token");
        if (emailToken) {
          const isClient = params?.get("client");

          let basePath = SUBSCRIBER_VERIFY_API;
          if (isClient === "true") {
            basePath = CLIENT_VERIFY_API;
          }

          const response = await axios.get(`${basePath}/${emailToken}`);

          if (response.data.success === true && response.data.code === 1) {
            toast.success("Your email has been successfully verified!");
          } else {
            toast.error("Email verification failed. Please try again.");
            await new Promise((resolve) => setTimeout(()=>{
              router.replace("/login");
            }, 1000));
          }
        }
      } catch (error) {
        toast.error(
          "An error occurred during email verification. Please try again."
        );
        await new Promise((resolve) => setTimeout(()=>{
          router.replace("/login");
        }, 1000));
      }
    };

    // Fetch  from the API when the component mounts
    verifyEmail();
  }, [params]);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password && password === confirmation) {
      try {
        const isClient = params?.get("client");
        const email = params?.get("email");

        let baseApi = SUBSCRIBERS_API;
        if (isClient === "true") {
          baseApi = CLIENTS_API;
        }
        const response = await axios.patch(`${baseApi}/${email}/add-password`, {
          password: password,
        });

        if (
          response.status === 200 &&
          response.data.email === params?.get("email")
        ) {
          toast.success("Password added successfully!");
          router.replace("/login");
        } else {
          toast.error("Failed to add password. Please try again later.");
        }
      } catch (error) {
        toast.error("Failed to add password. Please try again later.");
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
        <form onSubmit={handleSignup} className="w-full">
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
              Confirmation de mot de passe:
            </label>
            <input
              type="password"
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
