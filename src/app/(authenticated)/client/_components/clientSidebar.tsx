"use client";

import {
  Grid3x3Icon,
  UsersIcon,
  ClipboardListIcon,
  CreditCardIcon,
  ContactIcon,
  PowerIcon,
  UserRound,
  UserCog,
  
} from "lucide-react";
import Cookies from "js-cookie";
import Link from "next/link";
import React from "react";
import UsmsLogo from "@/components/usms-logo";
import NavLinks, {NavItem} from "@/components/nav-links";

const links: NavItem[] = [
  {
    name: "Mon profil",
    href: "/client/profile",
    icon: UserCog,
  },
  { name: "tableau de bord", href: "/client/dashboard", icon: Grid3x3Icon },
  {
    name: "Abonnés",
    href: "/client/subscribers",
    icon: UsersIcon,
  },
  {
    name: "Plans d'abonnements",
    href: "/client/plans",
    icon: ClipboardListIcon,
  },
  {
    name: "Paiement",
    href: "/client/paiements",
    icon: CreditCardIcon,
  },
  {
    name: "Groupes",
    href: "/client/groupes",
    icon: UserRound,
  },
  {
    name: "Chat",
    href: "/client/chat",
    icon: ContactIcon,
  },
];

export default function ClientSidebar() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-slate-800 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <UsmsLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks listNavItem={links} />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <button
          onClick={(e) => {
            e.preventDefault();
            // Clear the session cookie by setting an empty object with an expired expiry date
            Cookies.set("session", JSON.stringify({}), {
              expires: new Date(0),
            });
            // Redirect to the login page
            window.location.href = "/login";
          }}
          className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
        >
          <PowerIcon className="w-6" />
          <div className="hidden md:block">Déconnexion</div>
        </button>
      </div>
    </div>
  );
}
