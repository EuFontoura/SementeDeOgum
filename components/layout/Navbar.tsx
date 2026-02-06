"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "@/lib/auth";

export default function Navbar() {
  const { user } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.replace("/login");
  }

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-green-100 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/">
          <Image
            src="/images/brand/logo/logo-primary.png"
            alt="Semente de Ogum"
            width={140}
            height={74}
            priority
          />
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-green-700">{user?.email}</span>
          <button
            onClick={handleSignOut}
            className="text-sm text-green-400 transition-colors hover:text-red-500"
          >
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
}
