"use client";

import Image from "next/image";
import type { ReactNode } from "react";

type AuthLayoutProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export default function AuthLayout({
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-green-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 flex flex-col items-center gap-4">
          <Image
            src="/images/brand/logo/logo-primary.png"
            alt="Semente de Ogum"
            width={200}
            height={106}
            priority
          />
          <div className="text-center">
            <h1 className="text-2xl font-bold text-green-900">{title}</h1>
            {subtitle && (
              <p className="mt-1 text-sm text-green-400">{subtitle}</p>
            )}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
