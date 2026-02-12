"use client";

import { useState } from "react";
import RouteGuard from "@/components/layout/RouteGuard";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";

const teacherLinks = [
  { href: "/teacher", label: "Dashboard", icon: "📋" },
  { href: "/teacher/exam/new", label: "Criar Simulado", icon: "✏️" },
];

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <RouteGuard allowedRole="teacher">
      <Navbar onMenuToggle={() => setMobileOpen((o) => !o)} />
      <Sidebar links={teacherLinks} basePath="/teacher" />
      <MobileNav
        links={teacherLinks}
        basePath="/teacher"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <main className="mt-16 min-h-[calc(100vh-4rem)] bg-green-50 p-4 md:ml-56 md:p-6">
        {children}
      </main>
    </RouteGuard>
  );
}
