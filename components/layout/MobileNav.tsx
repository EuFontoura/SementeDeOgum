"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SidebarLink } from "./Sidebar";

type MobileNavProps = {
  links: SidebarLink[];
  basePath: string;
  open: boolean;
  onClose: () => void;
};

export default function MobileNav({
  links,
  basePath,
  open,
  onClose,
}: MobileNavProps) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <aside
        className="absolute left-0 top-0 flex h-full w-64 flex-col gap-1 bg-green-900 p-3 pt-20"
        onClick={(e) => e.stopPropagation()}
      >
        {links.map((link) => {
          const isActive =
            link.href === basePath
              ? pathname === basePath
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
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
    </div>
  );
}
