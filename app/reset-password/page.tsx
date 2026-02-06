"use client";

import { useState } from "react";
import Link from "next/link";
import AuthLayout from "@/components/layout/AuthLayout";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { resetPassword } from "@/lib/auth";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await resetPassword(email);
      setSuccess(true);
    } catch {
      setError("Erro ao enviar link. Verifique o email informado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Recuperar Senha" subtitle="Enviaremos um link para seu email">
      {success ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-center text-sm font-medium text-green-500">
            Link enviado! Verifique seu email.
          </p>
          <Link
            href="/login"
            className="font-semibold text-green-500 hover:text-green-700"
          >
            Voltar para login
          </Link>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {error && (
              <p className="text-center text-sm text-red-500">{error}</p>
            )}
            <Button type="submit" loading={loading} className="w-full">
              Enviar link
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-green-400">
            <Link
              href="/login"
              className="font-semibold text-green-500 hover:text-green-700"
            >
              Voltar para login
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
}
