//login
"use client";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router"; // Import useRouter from next/router
import Cookies from "js-cookie";
import { LOGIN_API } from "../../utils/apiUtil";

const Signup= () => {
    const [confirmation, setConfirmation] = useState(""); // Corrected variable name to setEmail
    const [password, setPassword] = useState("");
    
    const [recoveryInfo, setRecoveryInfo] = useState("");

  
    const [signupError, setSignupError] = useState("");
    const router = useRouter(); // Initialize useRouter hook



    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Add your sign-up logic here
      };
    
      return (
        <div className="flex justify-center items-center h-screen">
          {/* Image Container */}
          <div className="flex-1 hidden md:block h-full">
            <img
              src="/"
              alt="Error Image"
              className="h-full w-full object-cover"
            />
          </div>
    
          {/* Form Container */}
          <div className="flex-1 flex justify-center items-center">
            <form onSubmit={handleSignup} className="w-full max-w-sm">
              
             
              
           
             
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
              <div className="mb-4">
                <label htmlFor="confirmation" className="block text-gray-700 text-sm font-bold mb-2">Confirmation de mot de passe :</label>
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