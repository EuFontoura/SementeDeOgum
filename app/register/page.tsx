"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/components/layout/AuthLayout";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import PasswordCriteria from "@/components/ui/PasswordCriteria";
import { signUp } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";
import {
  validateEmail,
  checkPassword,
  isPasswordValid,
  validateInviteCode,
} from "@/lib/validation";
import type { UserRole } from "@/types/user";

export default function RegisterPage() {
  const router = useRouter();
  const { user, role: currentRole } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordChecks = checkPassword(password);

  if (user && currentRole) {
    router.replace(currentRole === "teacher" ? "/teacher" : "/student");
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Email inválido.");
      return;
    }

    if (!isPasswordValid(password)) {
      setError("A senha não atende todos os critérios.");
      return;
    }

    if (role === "teacher" && !validateInviteCode(inviteCode)) {
      setError("Código de convite inválido.");
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, name, role);
    } catch {
      setError("Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Criar Conta" subtitle="Cadastre-se na plataforma">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="name"
          label="Nome"
          type="text"
          placeholder="Seu nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <div className="flex flex-col gap-1.5">
          <Input
            id="password"
            label="Senha"
            type="password"
            placeholder="Crie uma senha forte"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {password && <PasswordCriteria checks={passwordChecks} />}
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-green-900">Eu sou:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`flex-1 rounded-lg py-2 font-medium transition-colors ${
                role === "student"
                  ? "bg-green-500 text-white"
                  : "bg-green-50 text-green-500"
              }`}
            >
              Aluno
            </button>
            <button
              type="button"
              onClick={() => setRole("teacher")}
              className={`flex-1 rounded-lg py-2 font-medium transition-colors ${
                role === "teacher"
                  ? "bg-green-500 text-white"
                  : "bg-green-50 text-green-500"
              }`}
            >
              Professor
            </button>
          </div>
        </div>
        {role === "teacher" && (
          <Input
            id="inviteCode"
            label="Código de convite"
            type="text"
            placeholder="Insira o código fornecido pela coordenação"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            required
          />
        )}
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
          Cadastrar
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-green-400">
        Já tem conta?{" "}
        <Link
          href="/login"
          className="font-semibold text-green-500 hover:text-green-700"
        >
          Entrar
        </Link>
      </p>
    </AuthLayout>
  );
}
