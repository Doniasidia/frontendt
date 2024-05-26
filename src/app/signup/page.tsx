"use client";

import {Spotlight} from "@/components/spotlight";
import {TypewriterEffect} from "@/components/typewriter-effect";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@radix-ui/react-label";
import Link from "next/link";
import {SubmitHandler, useForm} from "react-hook-form";
import {EMAIL_REGEX, PHONE_REGEX} from "@/utils/regexUtil";
import axios from "axios";
import {REGISTER_SUBSCRIBER_API} from "@/utils/apiUtil";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";

type FormValues = {
    email: string;
    lastname: string;
    firstname: string;
    tel: string;
};

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

export default function SignUpPage() {
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
            // Send a POST request to create a new subscriber
            const response = await axios.post(`${REGISTER_SUBSCRIBER_API}`, {
                email: data.email,
                firstname: data.firstname,
                username: data.lastname,
                telephone: data.tel,
            });
            console.log("Subscriber created:", response.data);
            if (response.data.success && response.data.code === 1) {
                toast.success(
                    "A verification link has been sent to your email address. Please check your email to complete the registration."
                );
                await new Promise((resolve) => setTimeout(()=>{
                    router?.push("/");
                }, 1000));
            } else {
                toast.error(response.data.error.message);
            }
        } catch (error) {
            console.error("Signup failed:", error);
            toast.error("An error occurred during registration. Please try again.");
        }
    };

    return (
        <div className="grid h-screen w-full grid-cols-1 bg-white lg:grid-cols-2">
            <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="white"
            />
            <div className="hidden items-center justify-center lg:flex bg-slate-900 rounded-r-[250px]">
                <div className="max-w-md space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight text-white">
                            <TypewriterEffect words={words}/>
                        </h1>
                        <p className="text-lg text-white">
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
                        Créer un compte
                        </h2>
                        <p className="text-gray-700">
                        Démarrez avec Usms en créant un compte.
                        </p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-gray-900" htmlFor="firstname">
                                    Prénom :
                                    </Label>
                                    <Input
                                        className="mt-1 bg-gray-100 text-gray-900 placeholder:text-gray-500 focus:border-[#00a8e8] focus:ring-[#00a8e8]"
                                        id="firstname"
                                        placeholder="Entrez votre prénom"
                                        type="text"
                                        {...register("firstname", {
                                            required: "this is a required",
                                            minLength: {
                                                value: 2,
                                                message: "Min length is 2"
                                            }
                                        })}
                                    />
                                    {errors.firstname &&
                                        <p className={"mt-2 text-sm text-red-500"}>{errors.firstname.message}</p>}
                                </div>
                                <div>
                                    <Label className="text-gray-900" htmlFor="lastname">
                                        Nom :
                                    </Label>
                                    <Input
                                        className="mt-1 bg-gray-100 text-gray-900 placeholder:text-gray-500 focus:border-[#00a8e8] focus:ring-[#00a8e8]"
                                        id="lastname"
                                        placeholder="Entrez votre nom"
                                        type="text"
                                        {...register("lastname", {
                                            required: "this is required",
                                            minLength: {
                                                value: 2,
                                                message: "Min length is 2"
                                            }
                                        })}
                                    />
                                    {errors.lastname &&
                                        <p className={"mt-2 text-sm text-red-500"}>{errors.lastname.message}</p>}
                                </div>
                            </div>
                            <div>
                                <Label className="text-gray-900" htmlFor="email">
                                    Email:
                                </Label>
                                <Input
                                    className="mt-1 bg-gray-100 text-gray-900 placeholder:text-gray-500 focus:border-[#00a8e8] focus:ring-[#00a8e8]"
                                    id="email"
                                    placeholder="Enter your email"
                                    type="email"
                                    {...register("email", {
                                        required: "this is required",
                                        pattern: {
                                            value: EMAIL_REGEX,
                                            message: "Invalid email address"
                                        }
                                    })}
                                />
                                {errors.email && <p className={"mt-2 text-sm text-red-500"}>{errors.email.message}</p>}
                            </div>
                            <div>
                                <Label className="text-gray-900" htmlFor="tel">
                                    Téléphone :
                                </Label>
                                <Input
                                    className="mt-1 bg-gray-100 text-gray-900 placeholder:text-gray-500 focus:border-[#00a8e8] focus:ring-[#00a8e8]"
                                    id="tel"
                                    placeholder="Entrez votre téléphone"
                                    type="tel"
                                    {...register("tel", {
                                        required: "this is required",
                                        minLength: 8,
                                        maxLength: 12,
                                        pattern: {
                                            value: PHONE_REGEX,
                                            message: "Invalid telephone number"
                                        }
                                    })}
                                />
                                {errors.tel && <p className={"mt-2 text-sm text-red-500"}>{errors.tel.message}</p>}
                            </div>
                            <Button
                                className="w-full bg-[#00a8e8] text-white hover:bg-[#0077b6]"
                                type="submit"
                            >
                                S'inscrire
                            </Button>
                            <div className="text-center text-gray-700">
                            Vous avez déjà un compte?
                                <Link
                                    className="text-[#00a8e8] ml-2 hover:underline"
                                    href="/login"
                                >
                                 Se connecter
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
