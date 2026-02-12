"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "@/lib/auth";

type NavbarProps = {
  onMenuToggle?: () => void;
};

export default function Navbar({ onMenuToggle }: NavbarProps) {
  const { userName } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.replace("/login");
  }

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-green-100 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="cursor-pointer text-green-700 md:hidden"
              aria-label="Menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}
          <Link href="/">
            <Image
              src="/images/brand/logo/logo-primary.png"
              alt="Semente de Ogum"
              width={140}
              height={74}
              priority
            />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-green-700 sm:inline">
            {userName}
          </span>
          <button
            onClick={handleSignOut}
            className="cursor-pointer text-sm text-green-400 transition-colors hover:text-red-500"
          >
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
}
