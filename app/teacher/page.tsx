"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getCollection } from "@/lib/firestore";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import type { Exam } from "@/types/exam";
import type { Result } from "@/types/result";

type ExamWithStats = Exam & {
  studentCount: number;
  questionCount: number;
};

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [exams, setExams] = useState<ExamWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchExams() {
      const examsData = await getCollection<Exam>("exams");

      const allResults = await getCollection<Result>("results");
      const finishedResults = allResults.filter((r) => r.finishedAt);

      const withStats: ExamWithStats[] = examsData.map((exam) => ({
        ...exam,
        studentCount: finishedResults.filter((r) => r.examId === exam.id)
          .length,
        questionCount: 0,
      }));

      setExams(withStats);
      setLoading(false);
    }

    fetchExams();
  }, [user]);

  if (loading) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <Skeleton className="mb-3 h-6 w-3/4" />
              <Skeleton className="mb-2 h-4 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green-900">Meus Simulados</h1>
        <Link
          href="/teacher/exam/new"
          className="cursor-pointer rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700"
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
            <Card
              key={exam.id}
              className="flex flex-col justify-between"
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
                {exam.status === "published" && (
                  <p className="mt-1 text-sm text-green-700">
                    {exam.studentCount}{" "}
                    {exam.studentCount === 1
                      ? "aluno concluiu"
                      : "alunos concluíram"}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={exam.status === "draft" ? `/teacher/exam/${exam.id}/edit` : `/teacher/exam/${exam.id}`}
                  className="text-sm font-medium text-green-500 transition-colors hover:text-green-700"
                >
                  {exam.status === "draft" ? "Continuar Editando →" : "Detalhes →"}
                </Link>
                {exam.status === "published" && exam.studentCount > 0 && (
                  <Link
                    href={`/teacher/exam/${exam.id}/results`}
                    className="text-sm font-medium text-green-700 transition-colors hover:text-green-900"
                  >
                    Ver Resultados →
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
