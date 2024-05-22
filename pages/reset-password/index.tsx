//reset_password
"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Import useRouter from next/router
import {
  BASE_URL,
  CLIENTS_API,
  CLIENT_REGISTER_PASSWORD_API,
  SUBSCRIBERS_API,
  SUBSCRIBER_REGISTER_PASSWORD_API,
} from "../../utils/apiUtil";
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
    <div className="flex justify-center items-center h-screen">
      {/* Image Container */}
      <div className="flex-1 hidden md:block h-full">
        <img src="/" alt="Error Image" className="h-full w-full object-cover" />
      </div>

      {/* Form Container */}
      <div className="flex-1 flex justify-center items-center">
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
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-xl focus:outline-none focus:shadow-outline"
              type="submit"
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
