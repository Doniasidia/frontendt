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
import {cn} from "@/utils/tailwindUtil";
import {TypewriterEffect} from "@/components/typewriter-effect";
import {Spotlight} from "@/components/spotlight";
import React, {useState} from "react";
import {EMAIL_REGEX, PASSWORD_REGEX} from "@/utils/regexUtil";
import {PasswordInput} from "@/components/passwordInput";

const words = [
    {
        text: "Bienvenue",
    },
    {
        text: "chez",
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
            toast.success("Connexion réussie ! Bienvenue de retour, " + username + " !");

            await new Promise((resolve) => setTimeout(()=>{
                router.push(redirectTo);
            }, 1000));
        } catch (error) {
            console.error("Login failed:", error);
            toast.error(
                "Impossible de se connecter : Veuillez vérifier votre email et votre mot de passe, puis réessayez."

            );
        }
    };

    const handleForgotPasswordSubmit = async (
        e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
        e.preventDefault();

        const email = getValues("email");

        if (!email) {
            toast.error("Veuillez entrer votre adresse email pour réinitialiser votre mot de passe.");

            return;
        }

        try {
            // Send a request to your backend to initiate password reset
            const response = await axios.get(`${FORGOT_PASSWORD_API}/${email}`);
            console.log("Forgot Password Request Sent:", response.data);
            toast.success("Un lien de réinitialisation du mot de passe a été envoyé à votre adresse e-mail.");

        } catch (error) {
            console.error("Forgot Password Request Failed:", error);
            toast.error("Échec de l'initialisation de la réinitialisation du mot de passe. Veuillez réessayer.");

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
                        Rationalisez la gestion de vos abonnements grâce à notre
                             plateforme.
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
                            Se connecter
                        </h2>
                        <p className="text-gray-700">
                        Entrez votre email et votre mot de passe pour accéder à la plateforme Usms.
                        </p>
                    </div>
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <Label className="text-gray-900" htmlFor="email">
                                Email :
                            </Label>
                            <Input
                                className={cn(
                                    "mt-1 bg-gray-100 text-gray-900 placeholder:text-gray-500 focus:border-[#00a8e8] focus:ring-[#00a8e8]",
                                    errors?.email && "border-red-500"
                                )}
                                id="email"
                                placeholder=""
                                type="email"
                                required
                                {...register("email", {
                                    required: "Ce champ est requis",
                                    pattern: {
                                        value: EMAIL_REGEX,
                                        message: "Adresse e-mail invalide"
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
                                    Mot de passe :
                                </Label>
                                <Link
                                    onClick={handleForgotPasswordSubmit}
                                    className="text-sm font-medium text-gray-900 hover:text-gray-700 underline"
                                    href="#"
                                >
                                    Mot de passe oublié?
                                </Link>
                            </div>
                            <PasswordInput
                                id="password"
                                className={cn(
                                    "mt-1 bg-gray-100 text-gray-900 placeholder:text-gray-500 focus:border-[#00a8e8] focus:ring-[#00a8e8]",
                                    errors?.password && "border-red-500"
                                )}
                                {...register("password", {
                                    required: "Ce champ est requis",
                                    maxLength: 16,
                                    pattern: {
                                        value: PASSWORD_REGEX,
                                        message: "Minimum huit caractères, au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial"

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
                           se connecter
                        </Button>
                       <h4>si vous n&#39;avez pas de compte
 <Link
              className=" items-center justify-center px-6 py-3 bg-transparent    hover:text-blue text-blue-500 font-medium rounded-md transition-colors duration-300"
              href="/signup"
            >
             S&#39;inscrire
            </Link> </h4>
                    </form>
                </div>
            </div>
        </div>
    );
}
