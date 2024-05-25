"use client";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@radix-ui/react-label";
import Link from "next/link";
import {EyeIcon, EyeOffIcon} from "lucide-react"
import {useRouter} from "next/navigation";
import {SubmitHandler, useForm} from "react-hook-form";
import axios from "axios";
import {FORGOT_PASSWORD_API, LOGIN_API} from "@/utils/apiUtil";
import Cookies from "js-cookie";
import {toast} from "react-toastify";
import {cn} from "@/lib/utils";
import {TypewriterEffect} from "@/components/typewriter-effect";
import {Spotlight} from "@/components/spotlight";
import React, {useState} from "react";
import {EMAIL_REGEX, PASSWORD_REGEX} from "@/utils/regexUtil";
import {PasswordInput} from "@/components/passwordInput";

const words = [
    {
        text: "Welcome",
    },
    {
        text: "to",
    },
    {
        text: "Usms",
    },
];

type FormValues = {
    email: string;
    password: string;
};


export default function LoginPage() {
    const {
        getValues,
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<FormValues>({
        mode: "onChange"
    });

    const router = useRouter();

    const onSubmit: SubmitHandler<FormValues> = async (data, event) => {
       event?.preventDefault();
        try {
            const response = await axios.post(LOGIN_API, {
                email: data.email,
                password: data.password,
            });

            const {access_token, role, redirectTo, username, userId} =
                response.data;

            // Store user ID in cookie if available
            if (userId !== null && userId !== undefined) {
                Cookies.set("userId", userId);
            }
            if (username) {
                Cookies.set("username", username);
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
            toast.success("Login successful! Welcome back, " + username + "!");
            await new Promise((resolve) => setTimeout(()=>{
                router.push(redirectTo);
            }, 1000));
        } catch (error) {
            console.error("Login failed:", error);
            toast.error(
                "Unable to login: Please check your email and password and try again."
            );
        }
    };

    const handleForgotPasswordSubmit = async (
        e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
        e.preventDefault();

        const email = getValues("email");

        if (!email) {
            toast.error("Please enter your email address to reset your password.");
            return;
        }

        try {
            // Send a request to your backend to initiate password reset
            const response = await axios.get(`${FORGOT_PASSWORD_API}/${email}`);
            console.log("Forgot Password Request Sent:", response.data);
            toast.success("A password reset link has been sent to your email.");
        } catch (error) {
            console.error("Forgot Password Request Failed:", error);
            toast.error("Failed to initiate password reset. Please try again.");
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
                            <TypewriterEffect words={words}/>
                        </h1>
                        <p className="text-md text-white">
                            Streamline your subscription management with our innovative
                            platform.
                        </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1 h-2 rounded-full bg-gray-300"/>
                        <div className="col-span-1 h-2 rounded-full bg-gray-300"/>
                        <div className="col-span-1 h-2 rounded-full bg-gray-300"/>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1 h-2 rounded-full bg-gray-300"/>
                        <div className="col-span-1 h-2 rounded-full bg-gray-300"/>
                        <div className="col-span-1 h-2 rounded-full bg-gray-300"/>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1 h-2 rounded-full bg-gray-300"/>
                        <div className="col-span-1 h-2 rounded-full bg-gray-300"/>
                        <div className="col-span-1 h-2 rounded-full bg-gray-300"/>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center">
                <div className="w-full max-w-md space-y-6 px-4 py-12 sm:px-6 lg:px-8">
                    <div className="space-y-2 text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            Sign in to your account
                        </h2>
                        <p className="text-gray-700">
                            Enter your email and password to access the Usms platform.
                        </p>
                    </div>
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <Label className="text-gray-900" htmlFor="email">
                                Email address
                            </Label>
                            <Input
                                className={cn(
                                    "mt-1 bg-gray-100 text-gray-900 placeholder:text-gray-500 focus:border-[#00a8e8] focus:ring-[#00a8e8]",
                                    errors?.email && "border-red-500"
                                )}
                                id="email"
                                placeholder="name@example.com"
                                type="email"
                                required
                                {...register("email", {
                                    required: "this is required",
                                    pattern: {
                                        value: EMAIL_REGEX,
                                        message: "Invalid email address"
                                    }
                                })}
                            />
                            {errors?.email && (
                                <p className="text-sm text-red-500 mt-2">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <Label className="text-gray-900" htmlFor="password">
                                    Password
                                </Label>
                                <Link
                                    onClick={handleForgotPasswordSubmit}
                                    className="text-sm font-medium text-gray-900 hover:text-gray-700 underline"
                                    href="#"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <PasswordInput
                                id="password"
                                className={cn(
                                    "mt-1 bg-gray-100 text-gray-900 placeholder:text-gray-500 focus:border-[#00a8e8] focus:ring-[#00a8e8]",
                                    errors?.password && "border-red-500"
                                )}
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
                        <Button
                            className="w-full bg-[#00a8e8] text-white hover:bg-[#0077b6]"
                            type="submit"
                        >
                            Sign in
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
