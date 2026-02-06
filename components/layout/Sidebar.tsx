"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/student", label: "Dashboard", icon: "📋" },
  { href: "/student/profile", label: "Meu Perfil", icon: "👤" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 flex h-[calc(100vh-4rem)] w-56 flex-col gap-1 bg-green-900 p-3">
      {links.map((link) => {
        const isActive =
          link.href === "/student"
            ? pathname === "/student"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white transition-colors ${
              isActive ? "bg-green-700" : "hover:bg-green-700/50"
            }`}
          >
            <span>{link.icon}</span>
            {link.label}
          </Link>
        );
      })}
    </aside>
  );
}
