"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, setDoc, Timestamp, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import type { ExamDay } from "@/types/exam";

const daySubjects: Record<ExamDay, string[]> = {
  1: ["Linguagens", "Ciências Humanas"],
  2: ["Ciências da Natureza", "Matemática"],
};

export default function NewExamPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [day, setDay] = useState<ExamDay>(1);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    if (!user) return;
    if (!title.trim()) {
      setError("Informe o título do simulado.");
      return;
    }

    setSaving(true);
    const examRef = doc(collection(db, "exams"));
    await setDoc(examRef, {
      title,
      createdBy: user.uid,
      day,
      status: "draft",
      createdAt: Timestamp.now(),
      publishedAt: null,
    });

    router.replace(`/teacher/exam/${examRef.id}/edit`);
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold text-green-900">Novo Simulado</h1>
      <div className="flex flex-col gap-4 rounded-xl border border-green-100 bg-white p-6 shadow-sm">
        <Input
          id="title"
          label="Título do Simulado"
          type="text"
          placeholder="Ex: Simulado ENEM 2025 - 1º Semestre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-green-900">Dia</span>
          <div className="flex gap-2">
            {([1, 2] as ExamDay[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDay(d)}
                className={`flex-1 cursor-pointer rounded-lg py-2 font-medium transition-colors ${
                  day === d
                    ? "bg-green-500 text-white"
                    : "bg-green-50 text-green-500"
                }`}
              >
                Dia {d}
              </button>
            ))}
          </div>
          <p className="text-xs text-green-400">
            {daySubjects[day].join(" + ")}
          </p>
        </div>
        <Button onClick={handleCreate} loading={saving} className="btn-primary">
          Criar e Adicionar Questões
        </Button>
        {error && (
          <p className="text-center text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
}
