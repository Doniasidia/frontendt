//login
"use client";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router"; // Import useRouter from next/router
import Cookies from "js-cookie";
import { LOGIN_API } from "../../utils/apiUtil";
import { FORGOT_PASSWORD_API } from "../../utils/apiUtil";

const Login = () => {
  const [email, setEmail] = useState(""); // Corrected variable name to setEmail
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginStatus, setLoginStatus] = useState("login");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [recoveryInfo, setRecoveryInfo] = useState("");
  const router = useRouter(); // Initialize useRouter hook

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(LOGIN_API, {
        email: email,
        password: password,
      });

      const { access_token, role, redirectTo, username, userId } =
        response.data;
      console.log("Response Data:", response.data);

      // Store user ID in cookie if available
      if (userId !== null && userId !== undefined) {
        Cookies.set("userId", userId);
        console.log("User ID stored in cookie:", userId);
      }
      if (username) {
        Cookies.set("username", username);
        console.log("Username stored in cookie:", username);
      }
      Cookies.set(
        "session",
        JSON.stringify({
          access_token: access_token,
          role: role,
          redirectTo: redirectTo,
          username: username,
          userId: userId,
        })
      );

      console.log("Login successful!", response.data);
      router.push(redirectTo);
    } catch (error) {
      console.error("Login failed:", error);
      setError("Email ou mot de passe incorrect");
      setLoginStatus("error");
    }
  };
  const handleForgotPasswordClick = () => {
    setForgotPassword(true);
    setError("");
  };

  const handleRecoverySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulate recovery logic
    console.log("Recovery information submitted:", recoveryInfo);
  };
  const handleForgotPasswordSubmit = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();

    try {
      // Send a request to your backend to initiate password reset
      const response = await axios.get(`${FORGOT_PASSWORD_API}/${email}`);
      console.log("Forgot Password Request Sent:", response.data);

      // Provide feedback to the user (e.g., display a success message)
      // Redirect the user to a confirmation page or display a success message
    } catch (error) {
      console.error("Forgot Password Request Failed:", error);
      setError("Failed to initiate password reset. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-cyan-500 to-sky-700  bg-opacity-50">
    <div className="absolute max-w-md w-full bg-white shadow-lg rounded-lg p-8 ">
       
       
      </div>
      {/* Login Form Container */}
      <div className="absolute max-w-md w-full bg-white shadow-lg rounded-lg p-8 ">

        {!forgotPassword && (
          <form
            onSubmit={handleSubmit }
            noValidate
          >
            <h2
              className={`text-center text-2xl mb-6 font-bold ${
                loginStatus === "error" && "text-red-500"
              }`}
            >
              {loginStatus === "login"
                ? "Connexion"
                : loginStatus === "error"
                ? "Erreur"
                : "Connexion réussie"}
            </h2>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                {" "}
                {/* Changed htmlFor to email */}
                Email  :
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  error && "border-red-500"
                }`}
                id="email" // Changed id to email
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Corrected function name to setEmail
                placeholder="Entrez votre email"
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Mot de passe:
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${
                  error && "border-red-500"
                }`}
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                required
              />
              {loginStatus === "error" && (
                <p className="text-red-500 text-xs italic mb-4">{error}</p>
              )}
            </div>
            <div className="flex items-center justify-center">
              <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-900 to-sky-700  text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Valider
            </button>
            </div>
            {loginStatus === "login" && (
              <p className="text-center mt-4">
                Vous n'avez pas un compte ?{" "}
                <a href="/signup" className="text-cyan-700 hover:text-cyan-600">
                  S'inscrire
                </a>
              </p>
            )}
            {loginStatus === "error" && (
              <p className="text-center mt-4">
                <a
                  href="#"
                  onClick={handleForgotPasswordSubmit}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Mot de passe oublié ?
                </a>
              </p>
            )}
          </form>
        )}
        {forgotPassword && (
          <form
            onSubmit={handleRecoverySubmit}
            className="px-4 pb-14 mb-14"
            noValidate
          >
            <h2 className="text-center text-2xl mb-14 font-bold">
              Mot de passe oublié
            </h2>
            <div className="mb-10">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="recoveryInfo"
              >
                Email ou numéro de téléphone:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="recoveryInfo"
                type="text"
                value={recoveryInfo}
                onChange={(e) => setRecoveryInfo(e.target.value)}
                placeholder="Email ou num de téléphone"
                required
              />
            </div>
            <div className="flex items-center justify-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-xl focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Envoyer
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
