"use client";

import { useState } from "react";
import RouteGuard from "@/components/layout/RouteGuard";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";

const studentLinks = [
  { href: "/student", label: "Dashboard", icon: "📋" },
  { href: "/student/profile", label: "Meu Perfil", icon: "👤" },
];

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <RouteGuard allowedRole="student">
      <Navbar onMenuToggle={() => setMobileOpen((o) => !o)} />
      <Sidebar links={studentLinks} basePath="/student" />
      <MobileNav
        links={studentLinks}
        basePath="/student"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <main className="mt-16 min-h-[calc(100vh-4rem)] bg-green-50 p-4 md:ml-56 md:p-6">
        {children}
      </main>
    </RouteGuard>
  );
}
