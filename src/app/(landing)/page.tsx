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
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  const words = [
    {
      text: "Manage",
    },
    {
      text: "Your",
    },
    {
      text: "Subscriptions",
    },
    {
      text: "with",
    },
    {
      text: "Ease.",
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
                Features
              </Link>
              <Link
                className="text-gray-400 hover:text-white"
                href="#testimonials-id"
              >
                Customer Testimonials
              </Link>
              <Link
                className="text-gray-400 hover:text-white"
                href="#pricing-id"
              >
                Pricing
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
                USMS is the all-in-one platform that helps you effortlessly
                manage your subscriptions, save money, and stay in control.
              </p>
              <div className="flex gap-4">
                <Link
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors duration-300"
                  href="/login"
                >
                  Login
                </Link>
                <Link
                  className="inline-flex items-center justify-center px-6 py-3 bg-transparent border border-blue-500 hover:bg-blue-500 hover:text-white text-blue-500 font-medium rounded-md transition-colors duration-300"
                  href="/signup"
                >
                  Try for Free
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative rounded-xl shadow-lg">
                <Image
                  alt="USMS Hero Image"
                  className="rounded-xl"
                  height={400}
                  width={600}
                  src="/landing-1.jpeg"
                  style={{
                    aspectRatio: "600/400",
                    objectFit: "cover",
                  }}
                />
                <BorderBeam
                  size={250}
                  duration={12}
                  delay={9}
                  borderWidth={3}
                />
              </div>
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
                Streamline Your Subscription Management
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl mb-8">
                USMS helps you stay on top of your subscriptions, so you never
                miss a payment or renewal.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <CalendarIcon className="h-8 w-8 text-blue-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2">
                    Subscription Tracking
                  </h3>
                  <p className="text-gray-600">
                    Keep track of all your subscriptions in one place, with
                    upcoming renewal dates and payment information.
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <WalletIcon className="h-8 w-8 text-blue-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Budgeting Tools</h3>
                  <p className="text-gray-600">
                    {"Easily manage your subscription budget and get alerts when you're approaching your limit."}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <SettingsIcon className="h-8 w-8 text-blue-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Automated Renewals</h3>
                  <p className="text-gray-600">
                    Set up automatic renewals to ensure you never miss a payment
                    and avoid service interruptions.
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <SignalIcon className="h-8 w-8 text-blue-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2">
                    Subscription Alerts
                  </h3>
                  <p className="text-gray-600">
                    Get timely notifications about upcoming renewals, expiring
                    subscriptions, and more.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative rounded-xl shadow-lg">
                <Image
                  alt="USMS About Image"
                  className="rounded-xl"
                  height={400}
                  src="/landing-2.jpeg"
                  style={{
                    aspectRatio: "500/400",
                    objectFit: "cover",
                  }}
                  width={500}
                />
                <BorderBeam
                  size={250}
                  duration={12}
                  delay={9}
                  borderWidth={3}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative rounded-xl shadow-lg">
              <Image
                alt="USMS Interface Image"
                className="rounded-xl"
                height={400}
                width={600}
                src="/landing-3.jpeg"
                style={{
                  aspectRatio: "600/400",
                  objectFit: "cover",
                }}
              />
              <BorderBeam size={250} duration={12} delay={9} borderWidth={3} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                Intuitive Interface, Powerful Features
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl mb-8">
                USMS offers a clean and user-friendly interface, making it easy
                to manage all your subscriptions.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <SearchIcon className="h-8 w-8 text-blue-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Intuitive Search</h3>
                  <p className="text-gray-600">
                    Quickly find and manage your subscriptions with the powerful
                    search functionality.
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <CatIcon className="h-8 w-8 text-blue-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2">
                    Subscription Categorization
                  </h3>
                  <p className="text-gray-600">
                    Organize your subscriptions into custom categories for
                    better visibility and control.
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <InfoIcon className="h-8 w-8 text-blue-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Detailed Insights</h3>
                  <p className="text-gray-600">
                    Get comprehensive reports and analytics to understand your
                    subscription spending and trends.
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <FolderSyncIcon className="h-8 w-8 text-blue-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Seamless Sync</h3>
                  <p className="text-gray-600">
                    Sync your subscriptions across devices and platforms for a
                    consistent user experience.
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
            Take Control of Your Subscriptions
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto">
            USMS is the ultimate solution for managing your subscriptions,
            helping you save time and money.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors duration-300"
              href="/login"
            >
              Login
            </Link>
            <Link
              className="inline-flex items-center justify-center px-6 py-3 bg-transparent border border-blue-500 hover:bg-blue-500 hover:text-white text-blue-500 font-medium rounded-md transition-colors duration-300"
              href="/signup"
            >
              Try for Free
            </Link>
          </div>
        </div>
      </section>
      <section id={"contact-id"} className="w-full py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-4xl">
            <div className="space-y-6 text-center">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Get in Touch
              </h2>
              <p className="text-lg text-gray-600 md:text-xl">
                Have questions or need help? Contact our sales team.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-gray-100 p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-2xl text-white">
                  <PhoneIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-gray-900">Phone</h3>
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
                <h3 className="mt-4 text-xl font-bold text-gray-900">Email</h3>
                <p className="mt-2 text-gray-600">
                  <Link
                    className="hover:underline"
                    href="mailto:sales@usms.com"
                    target="_blank"
                  >
                    sales@usms.com
                  </Link>
                </p>
              </div>
              <div className="rounded-lg bg-gray-100 p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-2xl text-white">
                  <MapPinIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-gray-900">
                  Address
                </h3>
                <Link
                  href={"1 rue palestine, Tunisie"}
                  target="_blank"
                  className="mt-2 text-gray-600"
                >
                  1 rue palestine, Tunisie
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
                What Our Customers Say
              </h2>
              <p className="text-lg text-gray-600  md:text-xl">
                Hear from real people who have used USMS to simplify their
                subscription management.
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
                      Jane Doe
                    </h3>
                    <p className="text-sm text-gray-600 ">CEO, Acme Inc.</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-600 ">
                  { "USMS has been a game-changer for our business. It's helped us stay on top of our subscriptions and save money every month."}
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-sm ">
                <div className="flex items-start">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-2xl text-gray-50">
                    <UserIcon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-gray-900 ">
                      John Smith
                    </h3>
                    <p className="text-sm text-gray-600 ">CTO, Globex Inc.</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-600 ">
                  {"I love how USMS keeps all my subscriptions organized and accessible. It's made managing my personal finances so much easier."}
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-sm ">
                <div className="flex items-start">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-2xl text-gray-50">
                    <UserIcon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-gray-900 ">
                      Sarah Lee
                    </h3>
                    <p className="text-sm text-gray-600 ">Founder, Startup X</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-600 ">
                  {"USMS has been a lifesaver for our small business. It's helped us stay on top of our subscriptions and avoid any unexpected charges."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id={"common-id"} className="w-full py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-4xl">
            <div className="space-y-6 text-center">
              <h2 className="text-3xl font-bold text-gray-900  sm:text-4xl">
                Overcome Subscription Management Challenges
              </h2>
              <p className="text-lg text-gray-600  md:text-xl">
                USMS is designed to address the common pain points of
                subscription management.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-gray-100 p-6 shadow-sm ">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-2xl text-gray-50">
                  <CalendarIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-gray-900 ">
                  Missed Renewals
                </h3>
                <p className="mt-2 text-gray-600 ">
                  USMS helps you stay on top of your subscription renewals, so
                  you never miss a payment again.
                </p>
              </div>
              <div className="rounded-lg bg-gray-100 p-6 shadow-sm ">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-2xl text-gray-50">
                  <WalletIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-gray-900 ">
                  Subscription Creep
                </h3>
                <p className="mt-2 text-gray-600 ">
                  USMS helps you identify and cancel unused subscriptions,
                  saving you money every month.
                </p>
              </div>
              <div className="rounded-lg bg-gray-100 p-6 shadow-sm ">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-2xl text-gray-50">
                  <ChevronDownIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-gray-900 ">
                  Lack of Visibility
                </h3>
                <p className="mt-2 text-gray-600 ">
                  USMS provides a centralized dashboard to view and manage all
                  your subscriptions in one place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        id="pricing-id"
        className="w-full bg-gray-100 py-12 md:py-16 lg:py-20 "
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-4xl">
            <div className="space-y-6 text-center">
              <h2 className="text-3xl font-bold text-gray-900  sm:text-4xl">
                Affordable Pricing for Every Need
              </h2>
              <p className="text-lg text-gray-600  md:text-xl">
                Choose the plan that fits your budget and subscription
                management needs.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-white p-6 shadow-sm ">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900 ">Free</h3>
                  <div className="text-4xl font-bold text-blue-500">$0</div>
                </div>
                <p className="mt-2 text-gray-600 ">per month</p>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckIcon className="h-5 w-5 text-blue-500" />
                    <span>Subscription tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XIcon className="h-5 w-5 text-gray-400" />
                    <span>Subscription scheduling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XIcon className="h-5 w-5 text-gray-400" />
                    <span>Subscription savings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XIcon className="h-5 w-5 text-gray-400" />
                    <span>Advanced analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XIcon className="h-5 w-5 text-gray-400" />
                    <span>Dedicated support</span>
                  </div>
                </div>
                <Link href={"/signup"}>
                  <Button className="mt-6 w-full" variant={"secondary"}>
                    Get Started
                  </Button>
                </Link>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-sm ">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900 ">Basic</h3>
                  <div className="text-4xl font-bold text-blue-500">$9</div>
                </div>
                <p className="mt-2 text-gray-600 ">per month</p>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckIcon className="h-5 w-5 text-blue-500" />
                    <span>Subscription tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckIcon className="h-5 w-5 text-blue-500" />
                    <span>Subscription scheduling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckIcon className="h-5 w-5 text-blue-500" />
                    <span>Subscription savings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XIcon className="h-5 w-5 text-gray-400" />
                    <span>Advanced analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XIcon className="h-5 w-5 text-gray-400" />
                    <span>Dedicated support</span>
                  </div>
                </div>
                <Link href={"/signup"}>
                  <Button className="mt-6 w-full" variant={"secondary"}>
                    Get Started
                  </Button>
                </Link>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-sm ">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900 ">Pro</h3>
                  <div className="text-4xl font-bold text-blue-500">$50</div>
                </div>
                <p className="mt-2 text-gray-600 ">per month</p>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckIcon className="h-5 w-5 text-blue-500" />
                    <span>Subscription tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckIcon className="h-5 w-5 text-blue-500" />
                    <span>Subscription scheduling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckIcon className="h-5 w-5 text-blue-500" />
                    <span>Subscription savings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckIcon className="h-5 w-5 text-blue-500" />
                    <span>Advanced analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckIcon className="h-5 w-5 text-blue-500" />
                    <span>Dedicated support</span>
                  </div>
                </div>
                <Link href={"/signup"}>
                  <Button className="mt-6 w-full" variant={"secondary"}>
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-gray-900 text-white py-8 md:py-10 lg:py-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">USMS</h3>
              <p className="text-gray-400 mb-4">
                Simplify your subscription management with USMS.
              </p>
              <div className="flex gap-4">
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
            <div>
              <h3 className="text-lg font-bold mb-4">Features</h3>
              <ul className="space-y-2">
                <li>
                  <Link className="text-gray-400 hover:text-white" href="#">
                    Subscription Tracking
                  </Link>
                </li>
                <li>
                  <Link className="text-gray-400 hover:text-white" href="#">
                    Budgeting Tools
                  </Link>
                </li>
                <li>
                  <Link className="text-gray-400 hover:text-white" href="#">
                    Automated Renewals
                  </Link>
                </li>
                <li>
                  <Link className="text-gray-400 hover:text-white" href="#">
                    Subscription Alerts
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link className="text-gray-400 hover:text-white" href="#">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link className="text-gray-400 hover:text-white" href="#">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link className="text-gray-400 hover:text-white" href="#">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link className="text-gray-400 hover:text-white" href="#">
                    Webinars
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link className="text-gray-400 hover:text-white" href="#">
                    About
                  </Link>
                </li>
                <li>
                  <Link className="text-gray-400 hover:text-white" href="#">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link className="text-gray-400 hover:text-white" href="#">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link className="text-gray-400 hover:text-white" href="#">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400">
            © 2024 USMS. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
