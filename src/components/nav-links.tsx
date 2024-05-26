"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export type NavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export default function NavLinks({ listNavItem }: { listNavItem: NavItem[] }) {
  const pathname = usePathname();

  return (
    <>
      {listNavItem.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-slate-200 hover:text-slate-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-slate-200 text-slate-600": pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
