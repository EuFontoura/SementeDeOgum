"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getCollection, where } from "@/lib/firestore";
import Badge from "@/components/ui/Badge";
import type { Exam } from "@/types/exam";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchExams() {
      const data = await getCollection<Exam>(
        "exams",
        where("createdBy", "==", user!.uid)
      );
      setExams(data);
      setLoading(false);
    }

    fetchExams();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green-900">Meus Simulados</h1>
        <Link
          href="/teacher/exam/new"
          className="rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700"
        >
          Criar Simulado
        </Link>
      </div>
      {exams.length === 0 ? (
        <p className="text-center text-green-400">
          Você ainda não criou nenhum simulado.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="flex flex-col justify-between rounded-xl border border-green-100 bg-white p-6 shadow-sm"
            >
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-green-900">
                    {exam.title}
                  </h2>
                  <Badge
                    label={exam.status === "draft" ? "Rascunho" : "Publicado"}
                    variant={exam.status === "draft" ? "warning" : "success"}
                  />
                </div>
                <p className="text-sm text-green-400">Dia {exam.day}</p>
              </div>
              <Link
                href={`/teacher/exam/${exam.id}`}
                className="text-sm font-medium text-green-500 transition-colors hover:text-green-700"
              >
                Gerenciar →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
