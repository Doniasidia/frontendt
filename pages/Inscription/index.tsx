//signup
"use client";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router"; // Import useRouter from next/router
import Cookies from "js-cookie";
import { LOGIN_API, SUBSCRIBERS_API } from "../../utils/apiUtil";

const Signup= () => {
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
          const response = await axios.post(`${SUBSCRIBERS_API}/register`, {
            email,
            password,
            username,
            firstname,
            telephone,
          });
          console.log("Subscriber created:", response.data);
    
          // Redirect the user to a success page or perform other actions
          router.push("/signup-success");
        } catch (error) {
          console.error("Signup failed:", error);
          setSignupError("Failed to create subscriber. Please try again.");
        }
      };
      return (
        <div className="flex justify-center items-center h-screen">
          {/* Image Container */}
          <div className="flex-1 hidden md:block h-full">
            <img
              src="/photo.jpg"
              alt="Error Image"
              className="h-full w-full object-cover"
            />
          </div>
    
          {/* Form Container */}
          <div className="flex-1 flex justify-center items-center">
          <form onSubmit={handleSubmit} className="w-full max-w-sm">
              
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Nom:</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="firstname" className="block text-gray-700 text-sm font-bold mb-2">Prénom:</label>
                <input
                  type="text"
                  id="firstname"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="telephone" className="block text-gray-700 text-sm font-bold mb-2">Téléphone:</label>
                <input
                  type="tel"
                  id="telephone"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Mot de passe:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="flex items-center justify-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-xl focus:outline-none focus:shadow-outline"
                type="submit"
              >
              S'inscrire
              </button>
            </div>
              {signupError && <div className="text-red-500">{signupError}</div>}
            </form>
          </div>
        </div>
      );
    };
    
    export default Signup;
