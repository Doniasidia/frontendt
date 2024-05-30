"use client";

import {Spotlight} from "@/components/spotlight";
import {TypewriterEffect} from "@/components/typewriter-effect";
import {Button} from "@/components/ui/button";
import {Label} from "@radix-ui/react-label";
import Link from "next/link";
import React from "react";
import {CLIENT_VERIFY_API, CLIENTS_API, SUBSCRIBER_VERIFY_API, SUBSCRIBERS_API} from "@/utils/apiUtil";
import axios from "axios";
import {toast} from "react-toastify";
import {useRouter, useSearchParams} from "next/navigation";
import {PasswordInput} from "@/components/passwordInput";
import {SubmitHandler, useForm} from "react-hook-form";
import {PASSWORD_REGEX} from "@/utils/regexUtil";
import {useOnceCall} from "@/hooks/useOnceCall";


const words = [
    {
        text: "Définir",
    },
    {
        text: "un",
    },
    {
        text: "mot",
    },
    {
        text: "de",
    },
    {
        text: "passe",
    },
];


type FormValues = {
    password: string;
    confirmPassword: string;
};

export default function ConfirmPasswordPage() {
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

    useOnceCall(() => {
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
                        await new Promise((_) => setTimeout(() => {
                            router.replace("/login");
                        }, 1000));
                    }
                }
            } catch (error) {
                toast.error(
                    "An error occurred during email verification. Please try again."
                );
                await new Promise((_) => setTimeout(() => {
                    router.replace("/login");
                }, 1000));
            }
        };

        verifyEmail().then(()=> console.log("verification process completed"));
    });

    const onSubmit: SubmitHandler<FormValues> = async (data, event) => {
        event?.preventDefault();
        if (data.password && data.password === data.confirmPassword) {
            try {
                const isClient = params?.get("client");
                const email = params?.get("email");

                let baseApi = SUBSCRIBERS_API;
                if (isClient === "true") {
                    baseApi = CLIENTS_API;
                }
                const response = await axios.patch(`${baseApi}/${email}/add-password`, {
                    password: data.password,
                });

                if (
                    response.status === 200 &&
                    response.data.email === params?.get("email")
                ) {
                    toast.success("Password added successfully!");
                    await new Promise((resolve) => setTimeout(()=>{
                        router?.push("/login");
                    }, 1000));
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
        <div className="grid h-screen w-full grid-cols-1 bg-white lg:grid-cols-2">
            <div className="hidden items-center justify-center lg:flex bg-slate-900 rounded-r-[250px]">
                <Spotlight
                    className="-top-40 left-0 md:left-60 md:-top-20"
                    fill="white"
                />
                <div className="max-w-md space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                            <TypewriterEffect words={words}/>
                        </h1>
                        <p className="text-md text-white">
                        Saisissez votre  mot de passe pour sécuriser votre compte Usms.
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
                        Définir un mot de passe
                        </h2>
                        <p className="text-gray-700">
                        Saisissez votre  mot de passe pour sécuriser votre compte Usms.
                        </p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            <div>
                                <Label className="text-gray-900" htmlFor="password">
                                Mot de passe :
                                </Label>
                                <PasswordInput
                                    className="mt-1 bg-gray-100 text-gray-900 placeholder:text-gray-500 focus:border-[#00a8e8] focus:ring-[#00a8e8]"
                                    id="password"
                                    placeholder=""
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
                                Confirmer mot de passe : 
                                </Label>
                                <PasswordInput
                                    className="mt-1 bg-gray-100 text-gray-900 placeholder:text-gray-500 focus:border-[#00a8e8] focus:ring-[#00a8e8]"
                                    id="confirmPassword"
                                    placeholder=""
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
                                Confirmer
                            </Button>
                            
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
