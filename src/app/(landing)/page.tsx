//landing
import { BorderBeam } from "@/components/border-beam";
import {
  CalendarIcon,
  CatIcon,
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  FacebookIcon,
  FolderSyncIcon,
  InfoIcon,
  LinkedinIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  SearchIcon,
  SettingsIcon,
  ShieldCheckIcon,
  SignalIcon,
  TwitterIcon,
  UserIcon,
  UsersIcon,
  WalletIcon,
  XIcon,
} from "@/components/icons";

import { Spotlight } from "@/components/spotlight";
import { TypewriterEffect } from "@/components/typewriter-effect";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  const words = [
    {
      text: "Gérez",
    },
    {
      text: "votre",
    },
    {
      text: "abonnement",
    },
    {
      text: "en",
    },
    {
      text: "toute",
    },
    {
      text: "simplicité.",
    },
  ];
  return (
    <>
      <header className="relative bg-slate-900 text-white py-6 md:py-8 lg:py-10 ">
        <div className="z-10 container mx-auto px-4 md:px-6 lg:px-8">
          <nav className="flex items-center justify-between mb-8">
            <Link
              className="text-lg md:text-xl lg:text-2xl font-bold cursor-pointer"
              href="/public"
            >
              USMS
            </Link>
            <div className="flex items-center gap-4">
              <Link
                className="text-gray-400 hover:text-white"
                href="#features-id"
              >
              Caractéristiques
              </Link>
              <Link
                className="text-gray-400 hover:text-white"
                href="#testimonials-id"
              >
                Témoignages de clients
              </Link>
             
              <Link
                className="text-gray-400 hover:text-white"
                href="#contact-id"
              >
                Contact
              </Link>
            </div>
          </nav>
          <div className=" grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <Spotlight
              className="-top-40 left-0 md:left-60 md:-top-20"
              fill="white"
            />
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                <TypewriterEffect words={words} />
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl mb-8">
              USMS est la plateforme tout-en-un qui vous aide à gérer vos abonnements sans effort et à rester en contrôle.
              </p>
              <div className="flex gap-4">
                <Link
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors duration-300"
                  href="/login"
                >
                  Se connecter
                </Link>
                <Link
              className="inline-flex items-center justify-center px-6 py-3 bg-transparent border border-blue-500 hover:bg-blue-500 hover:text-white text-blue-500 font-medium rounded-md transition-colors duration-300"
              href="/signup"
            >
             S&#39;inscrire
            </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <Image
                  alt="USMS Hero Image"
                  className="rounded-xl shadow-xl"
                  height={400}
                  width={600}
                  src="/landing-1.jpeg"
                  style={{
                    aspectRatio: "600/400",
                    objectFit: "cover",
                  }}
              />
            </div>
          </div>
        </div>
      </header>
      <section
  id={"features-id"}
  className="py-16 md:py-20 lg:py-24 bg-gray-100"
>
  <div className="container mx-auto px-4 md:px-6 lg:px-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
          Rationalisez la gestion de vos abonnements
        </h2>
        <p className="text-lg md:text-xl lg:text-2xl mb-8">
          USMS vous aide à rester au fait de vos abonnements, afin que vous ne ratiez jamais un paiement ou un renouvellement.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <CalendarIcon className="h-8 w-8 text-blue-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">
              Suivi des abonnements
            </h3>
            <p className="text-gray-600">
              Gardez une trace de tous vos abonnements en un seul endroit, avec dates de renouvellement à venir et informations de paiement.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <WalletIcon className="h-8 w-8 text-blue-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Factures</h3>
            <p className="text-gray-600">
              Facilitez la gestion de vos paiements d&#39;abonnement et recevez des alertes lorsque vous approchez de votre limite.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <SettingsIcon className="h-8 w-8 text-blue-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Renouvellements automatisés</h3>
            <p className="text-gray-600">
              Configurez des renouvellements automatiques pour vous assurer de ne jamais manquer un paiement et évitez les interruptions de service.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <SignalIcon className="h-8 w-8 text-blue-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">
              Alertes d&#39;abonnements
            </h3>
            <p className="text-gray-600">
              Recevez des notifications en temps opportun sur les renouvellements à venir, abonnements expirant, et plus encore.
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-start justify-center mt-72">
        <Image
          alt="USMS About Image"
          className="rounded-xl shadow-xl"
          height={400}
          src="/landing-2.jpeg"
          style={{
            aspectRatio: "500/400",
            objectFit: "cover",
          }}
          width={500}
        />
      </div>
    </div>
  </div>
</section>

      <section className="py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <Image
                alt="USMS Interface Image"
                className="rounded-xl shadow-xl"
                height={400}
                width={600}
                src="/landing-3.jpeg"
                style={{
                  aspectRatio: "600/400",
                  objectFit: "cover",
                }}
            />
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Interface intuitive    ,      Fonctionnalités puissantes 
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl mb-8">
              USMS offre une interface conviviale, facilitant la gestion de tous vos abonnements.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <SearchIcon className="h-8 w-8 text-blue-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Recherche intuitive</h3>
                  <p className="text-gray-600">
                  Trouvez et gérez rapidement vos abonnements grâce à la puissante fonction de recherche.
                  </p>
                </div>
                <div className="rounded-lg bg-gray-100 p-6 shadow-sm ">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-2xl text-gray-50">
                  <ChevronDownIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-gray-900 ">
                 Tableau de bord
                </h3>
                <p className="mt-2 text-gray-600 ">
                USMS fournit un tableau de bord centralisé pour afficher 
                   vos statistiques.
                </p>
              </div>
               
               
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 md:py-20 lg:py-24 bg-gray-100">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
          Si vous êtes un abonné, vous pouvez créer un compte.
          </h2>
         
          <div className="flex justify-center gap-4">
          <Link
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors duration-300"
                  href="/login"
                >
                  Se connecter
                </Link>
            <Link
              className="inline-flex items-center justify-center px-6 py-3 bg-transparent border border-blue-500 hover:bg-blue-500 hover:text-white text-blue-500 font-medium rounded-md transition-colors duration-300"
              href="/signup"
            >
              S&#39;inscrire
            </Link>
          </div>
        </div>
      </section>
      <section id={"contact-id"} className="w-full py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-4xl">
            <div className="space-y-6 text-center">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Si vous êtes un propriétaire d&#39;établissement et que vous souhaitez créer un compte, veuillez nous contacter.
              </h2>
             
            </div>
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-gray-100 p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-2xl text-white">
                  <PhoneIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-gray-900">Numéro de téléphone</h3>
                <p className="mt-2 text-gray-600">
                  <a className="hover:underline" href="#" target="_blank">
                    (+216) 22 222 111
                  </a>
                </p>
              </div>
              <div className="rounded-lg bg-gray-100 p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-2xl text-white">
                  <MailIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-gray-900">Adresse e-mail</h3>
                <p className="mt-2 text-gray-600">
                  <Link
                    className="hover:underline"
                    href="mailto:usmsusms17@usms.com"
                    target="_blank"
                  >
                    usmsusms17@gmail.com
                  </Link>
                </p>
              </div>
              <div className="rounded-lg bg-gray-100 p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-2xl text-white">
                  <MapPinIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-gray-900">
                  Adresse
                </h3>
                <Link
                  href={"1 rue palestine, Tunisie"}
                  target="_blank"
                  className="mt-2 text-gray-600"
                >
                  1 Rue de Palestine, Tunis 1002, Tunisie
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        id={"testimonials-id"}
        className="w-full bg-gray-100 py-12 md:py-16 lg:py-20 "
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-4xl">
            <div className="space-y-6 text-center">
              <h2 className="text-3xl font-bold text-gray-900  sm:text-4xl">
              Ce que disent nos clients
              </h2>
              <p className="text-lg text-gray-600  md:text-xl">
              Écoutez de personnes qui ont utilisé USMS pour simplifier leurs
                 gestion des abonnements.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-white p-6 shadow-sm ">
                <div className="flex items-start">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-2xl text-gray-50">
                    <UserIcon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-gray-900 ">
                     Zayati Moncef
                    </h3>
                    <p className="text-sm text-gray-600 ">Directeur de la salle de sport</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-600 ">
                {"USMS a révolutionné notre entreprise. Il nous a aidés à gérer nos abonnements efficacement et à améliorer la satisfaction de nos membres."}
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-sm ">
                <div className="flex items-start">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-2xl text-gray-50">
                    <UserIcon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-gray-900 ">
                      Miladi Farah 
                    </h3>
                    <p className="text-sm text-gray-600 ">Directrice de l&#39;école privée</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-600 ">
                {"USMS a simplifié la gestion de nos abonnements et nous permet de nous concentrer davantage sur la qualité de l&#39;éducation que nous offrons."}
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-sm ">
                <div className="flex items-start">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-2xl text-gray-50">
                    <UserIcon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-gray-900 ">
                    Sidia Donia
                    </h3>
                    <p className="text-sm text-gray-600 ">Abonnée fidèle</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-600 ">
                {"En tant qu&#39;abonnée fidèle, j&#39;apprécie la façon dont USMS me permet de suivre facilement mes abonnements et de ne jamais manquer une échéance."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
     <footer className="bg-gray-900 text-white py-8 md:py-10 lg:py-12">
  <div className="container mx-auto px-4 md:px-6 lg:px-8 flex flex-col items-center justify-center text-center ">
    <h3 className="text-lg font-bold mb-4">USMS</h3>
    <p className="text-gray-400 mb-4">
      Simplifiez la gestion de vos abonnements avec USMS.
    </p>
    <div className="flex justify-center gap-4">
      <Link className="text-gray-400 hover:text-white" href="#">
        <TwitterIcon className="h-6 w-6" />
      </Link>
      <Link className="text-gray-400 hover:text-white" href="#">
        <FacebookIcon className="h-6 w-6" />
      </Link>
      <Link className="text-gray-400 hover:text-white" href="#">
        <LinkedinIcon className="h-6 w-6" />
      </Link>
    </div>
  </div>
</footer>



    </>
  );
}
