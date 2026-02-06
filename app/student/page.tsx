"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useExams } from "@/hooks/useExams";
import Badge from "@/components/ui/Badge";

const statusConfig = {
  not_started: { label: "Não iniciado", variant: "default" as const },
  in_progress: { label: "Em andamento", variant: "warning" as const },
  completed: { label: "Concluído", variant: "success" as const },
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const { exams, loading } = useExams(user?.uid);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-500" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-green-900">
        Simulados Disponíveis
      </h1>
      {exams.length === 0 ? (
        <p className="text-center text-green-400">
          Nenhum simulado disponível no momento.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam) => {
            const status = statusConfig[exam.studentStatus];
            return (
              <div
                key={exam.id}
                className="flex flex-col justify-between rounded-xl border border-green-100 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-green-900">
                      {exam.title}
                    </h2>
                    <Badge label={status.label} variant={status.variant} />
                  </div>
                  <p className="text-sm text-green-400">Dia {exam.day}</p>
                </div>
                <Link
                  href={
                    exam.studentStatus === "completed"
                      ? `/student/result/${exam.id}`
                      : `/student/exam/${exam.id}`
                  }
                  className={`mt-2 block rounded-lg px-4 py-2 text-center text-sm font-semibold transition-colors ${
                    exam.studentStatus === "completed"
                      ? "border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                      : "bg-green-500 text-white hover:bg-green-700"
                  }`}
                >
                  {exam.studentStatus === "completed"
                    ? "Ver Resultado"
                    : exam.studentStatus === "in_progress"
                      ? "Continuar"
                      : "Iniciar Simulado"}
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
