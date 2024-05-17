//login
"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Import useRouter from next/router
import Cookies from "js-cookie";
import {
  EMAIL_VERIFY_API,
  LOGIN_API,
  PLANS_API,
  SUBSCRIBERS_API,
} from "../../utils/apiUtil";
import { verify } from "crypto";
import { usePathname, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

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
          const cookie = Cookies.get("session") || "{}";
          const session: Session = await JSON.parse(cookie);
          const headers = {
            Authorization: `Bearer ${session.access_token}`,
          };
          const response = await axios.get(
            `${EMAIL_VERIFY_API}/${emailToken}`,
            {
              headers,
            }
          );

          if (response.data.success === true && response.data.code === 1) {
            toast.success("Your email has been successfully verified!");
          } else {
            toast.error("Email verification failed. Please try again.");
            router.replace("/login");
          }
        }
      } catch (error) {
        toast.error(
          "An error occurred during email verification. Please try again."
        );
        router.replace("/login");
      }
    };

    // Fetch  from the API when the component mounts
    verifyEmail();
  }, [params]);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password && password === confirmation) {
      const cookie = Cookies.get("session") || "{}";
      const session: Session = await JSON.parse(cookie);
      const headers = {
        Authorization: `Bearer ${session.access_token}`,
      };
      try {
        const response = await axios.patch(
          `${SUBSCRIBERS_API}/${params?.get("email")}/add-password`,
          {
            password: password,
          },
          {
            headers,
          }
        );

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
