"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import type { UserRole } from "@/types/user";

type RouteGuardProps = {
  allowedRole: UserRole;
  children: React.ReactNode;
};

export default function RouteGuard({ allowedRole, children }: RouteGuardProps) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user || !role) {
      router.replace("/login");
      return;
    }

    if (role !== allowedRole) {
      router.replace(role === "teacher" ? "/teacher" : "/student");
    }
  }, [user, role, loading, allowedRole, router]);

  if (loading || !user || !role) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-500" />
      </div>
    );
  }

  if (role !== allowedRole) {
    return null;
  }

  return <>{children}</>;
}
