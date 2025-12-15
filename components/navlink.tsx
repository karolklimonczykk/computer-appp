"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export default function NavLink({ href, children, className = "" }: Props) {
  const pathname = usePathname() || "/";
  const isActive =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  const base = "text-[#e5e5e1] no-underline py-1 px-3 rounded-sm hover:bg-white/10 hover:text-gray-900";
  const active = "bg-white/20 text-gray-900 font-semibold";

  const cls = `${base} ${isActive ? active : ""} ${className}`.trim();

  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
