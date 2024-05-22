//signup
"use client";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router"; // Import useRouter from next/router
import Cookies from "js-cookie";
import {
  LOGIN_API,
  REGISTER_SUBSCRIBER_API,
  SUBSCRIBERS_API,
} from "../../utils/apiUtil";
import { EMAIL_VERIFI_API } from "../../utils/apiUtil";
import { toast } from "react-toastify";

const Signup = () => {
  const [email, setEmail] = useState(""); // Corrected variable name to setEmail
  const [password, setPassword] = useState("");

  const [recoveryInfo, setRecoveryInfo] = useState("");
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [telephone, setTelephone] = useState("");
  const [signupError, setSignupError] = useState("");
  const router = useRouter(); // Initialize useRouter hook

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Send a POST request to create a new subscriber
      const response = await axios.post(`${REGISTER_SUBSCRIBER_API}`, {
        email,
        username,
        firstname,
        telephone,
      });
      console.log("Subscriber created:", response.data);
      if (response.data.success && response.data.code === 1) {
        toast.success(
          "A verification link has been sent to your email address. Please check your email to complete the registration."
        );
        router.push("/");
      } else {
        toast.error(response.data.error.message);
      }
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error("An error occurred during registration. Please try again.");
      setSignupError("Failed to create subscriber. Please try again.");
    }
  };
  return (

    <div className="flex justify-center items-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/signup.jpg')" }}>
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full ">
        <h2 className="text-2xl font-semibold text-center text-sky-950 mb-6">
          Créer un compte
        </h2>
        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <label htmlFor="username" className="block text-gray-700 text-sm font-medium">
              Nom :
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="firstname" className="block text-gray-700 text-sm font-medium">
              Prénom :
            </label>
            <input
              type="text"
              id="firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium">
              Email :
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="telephone" className="block text-gray-700 text-sm font-medium">
              Téléphone :
            </label>
            <input
              type="tel"
              id="telephone"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-cyan-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              S'inscrire
            </button>
          </div>
          {signupError && (
            <div className="text-red-500 text-center mt-4">{signupError}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signup;
