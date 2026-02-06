"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/components/layout/AuthLayout";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { signIn } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";
import { validateEmail } from "@/lib/validation";

export default function LoginPage() {
  const router = useRouter();
  const { user, role } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && role) {
      router.replace(role === "teacher" ? "/teacher" : "/student");
    }
  }, [user, role, router]);

  if (user && role) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Email inválido.");
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
    } catch {
      setError("Email ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Entrar" subtitle="Acesse sua conta">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={email && !validateEmail(email) ? "Email inválido" : undefined}
          required
        />
        <Input
          id="password"
          label="Senha"
          type="password"
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-center text-sm text-red-500">{error}</p>}
        <Button
          type="submit"
          loading={loading}
          className="
    w-full
    bg-[#5b8b07]
    text-white
    font-semibold
    tracking-wide
    rounded-lg
    py-3
    transition-all
    duration-200
    hover:bg-[#336130]
    focus:outline-none
    focus:ring-2
    focus:ring-[#9ec187]
    active:bg-[#15311a]
    disabled:opacity-70
  "
        >
          Entrar
        </Button>
        <Link
          href="/reset-password"
          className="text-center text-sm text-green-500 hover:text-green-700"
        >
          Esqueceu sua senha?
        </Link>
      </form>
      <p className="mt-6 text-center text-sm text-green-400">
        Não tem conta?{" "}
        <Link
          href="/register"
          className="font-semibold text-green-500 hover:text-green-700"
        >
          Cadastre-se
        </Link>
      </p>
    </AuthLayout>
  );
}
