"use client";

import { Spotlight } from "@/components/spotlight";
import { TypewriterEffect } from "@/components/typewriter-effect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {SubmitHandler, useForm} from "react-hook-form";
import {useRouter, useSearchParams} from "next/navigation";
import {
  CLIENT_REGISTER_PASSWORD_API,
  CLIENTS_API,
  SUBSCRIBER_REGISTER_PASSWORD_API,
  SUBSCRIBERS_API
} from "@/utils/apiUtil";
import axios from "axios";
import {toast} from "react-toastify";
import {PASSWORD_REGEX} from "@/utils/regexUtil";
import {PasswordInput} from "@/components/passwordInput";
import React from "react";

type FormValues = {
  password: string;
  confirmPassword: string;
};

const words = [
  {
    text: "Reset",
  },
  {
    text: "Your",
  },
  {
    text: "Password",
  },
];

export default function ResetPasswordPage() {
  const {
    getValues,
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<FormValues>({
    mode: "onChange"
  });
  const params = useSearchParams();
  const router = useRouter();

  const onSubmit: SubmitHandler<FormValues> = async (data, event) => {
    event?.preventDefault();
    if (data.password && data.password === data.confirmPassword) {
      try {
        const token = params?.get("token");
        const isClient = params?.get("client");

        let baseUrl = SUBSCRIBER_REGISTER_PASSWORD_API;

        if (isClient === "true") {
          baseUrl = CLIENT_REGISTER_PASSWORD_API;
        }

        const response = await axios.patch(`${baseUrl}/${token}`, {
          password: data.password,
        });

        if (response.data.success && response.data.code === 1) {
          toast.success("Password Updated successfully!");
          await new Promise((resolve) => setTimeout(()=>{
            router?.push("/login");
          }, 1000));
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
    <div className="grid h-screen w-full grid-cols-1 bg-white lg:grid-cols-2">
      <div className="hidden items-center justify-center lg:flex bg-slate-900 rounded-r-[250px]">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />
        <div className="max-w-md space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-white">
              <TypewriterEffect words={words} />
            </h1>
            <p className="text-md text-white">
              Enter your new password to secure your Usms account.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1 h-2 rounded-full bg-gray-300" />
            <div className="col-span-1 h-2 rounded-full bg-gray-300" />
            <div className="col-span-1 h-2 rounded-full bg-gray-300" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1 h-2 rounded-full bg-gray-300" />
            <div className="col-span-1 h-2 rounded-full bg-gray-300" />
            <div className="col-span-1 h-2 rounded-full bg-gray-300" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1 h-2 rounded-full bg-gray-300" />
            <div className="col-span-1 h-2 rounded-full bg-gray-300" />
            <div className="col-span-1 h-2 rounded-full bg-gray-300" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md space-y-6 px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Reset Password
            </h2>
            <p className="text-gray-700">
              Enter your new password to secure your Usms account.
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <Label className="text-gray-900" htmlFor="password">
                  New Password
                </Label>
                <PasswordInput
                    className="mt-1 bg-gray-100 text-gray-900 placeholder:text-gray-500 focus:border-[#00a8e8] focus:ring-[#00a8e8]"
                    id="password"
                    placeholder="Enter a new password"
                    {...register("password", {
                      required: "this is required",
                      maxLength: 16,
                      pattern: {
                        value: PASSWORD_REGEX,
                        message: "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"
                      }
                    })}
                />
                {errors?.password && (
                    <p className="text-sm text-red-500 mt-2">
                      {errors.password.message}
                    </p>
                )}
              </div>
              <div>
                <Label className="text-gray-900" htmlFor="confirm-password">
                  Confirm Password
                </Label>
                <PasswordInput
                    className="mt-1 bg-gray-100 text-gray-900 placeholder:text-gray-500 focus:border-[#00a8e8] focus:ring-[#00a8e8]"
                    id="confirm-password"
                    placeholder="Confirm your new password"
                    {...register("confirmPassword", {
                      required: "this is required",
                      maxLength: 16,
                      validate: (value) => value === getValues("password") || "Passwords do not match",
                      pattern: {
                        value: PASSWORD_REGEX,
                        message: "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"
                      }
                    })}
                />
                {errors?.confirmPassword && (
                    <p className="text-sm text-red-500 mt-2">
                      {errors.confirmPassword.message}
                    </p>
                )}
              </div>
              <Button
                  className="w-full bg-[#00a8e8] text-white hover:bg-[#0077b6]"
                  type="submit"
              >
                Reset Password
              </Button>
              <div className="text-center text-gray-700">
                Remember your password?
                <Link
                    className="text-[#00a8e8] ml-2 hover:underline"
                    href="/login"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
);
}
