"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getDocument, getCollection, where } from "@/lib/firestore";
import type { Exam } from "@/types/exam";
import type { Result } from "@/types/result";
import type { User } from "@/types/user";

type ResultWithUser = Result & { userName: string };

export default function ExamResultsPage() {
  const params = useParams();
  const examId = params.id as string;
  const { user } = useAuth();
  const [exam, setExam] = useState<Exam | null>(null);
  const [results, setResults] = useState<ResultWithUser[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      const [examData, resultsData] = await Promise.all([
        getDocument<Exam>("exams", examId),
        getCollection<Result>("results", where("examId", "==", examId)),
      ]);

      const finishedResults = resultsData.filter((r) => r.finishedAt);

      const withUsers = await Promise.all(
        finishedResults.map(async (r) => {
          const userData = await getDocument<User>("users", r.userId);
          return { ...r, userName: userData?.name ?? r.userId };
        })
      );

      setExam(examData);
      setResults(withUsers);
      setLoading(false);
    }

    fetchData();
  }, [user, examId]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href={`/teacher/exam/${examId}`}
        className="mb-4 inline-block text-sm text-green-500 hover:text-green-700"
      >
        ← Voltar
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-green-900">
        Resultados — {exam?.title}
      </h1>
      {results.length === 0 ? (
        <p className="text-center text-green-400">
          Nenhum aluno concluiu este simulado ainda.
        </p>
      ) : (
        <div className="rounded-xl border border-green-100 bg-white shadow-sm">
          <div className="grid grid-cols-4 border-b border-green-100 px-6 py-3 text-xs font-semibold uppercase text-green-400">
            <span>Aluno</span>
            <span className="text-center">Acertos</span>
            <span className="text-center">%</span>
            <span className="text-right">Data</span>
          </div>
          {results.map((r) => {
            const pct = Math.round((r.score / r.totalQuestions) * 100);
            const isExpanded = expandedId === r.id;
            return (
              <div key={r.id} className="border-b border-green-50 last:border-0">
                <button
                  onClick={() =>
                    setExpandedId(isExpanded ? null : r.id)
                  }
                  className="grid w-full grid-cols-4 px-6 py-4 text-sm transition-colors hover:bg-green-50"
                >
                  <span className="text-left font-medium text-green-900">
                    {r.userName}
                  </span>
                  <span className="text-center text-green-700">
                    {r.score}/{r.totalQuestions}
                  </span>
                  <span
                    className={`text-center font-semibold ${
                      pct >= 70
                        ? "text-green-500"
                        : pct >= 40
                          ? "text-yellow-500"
                          : "text-red-500"
                    }`}
                  >
                    {pct}%
                  </span>
                  <span className="text-right text-green-400">
                    {r.finishedAt?.toDate().toLocaleDateString("pt-BR")}
                  </span>
                </button>
                {isExpanded && r.subjectBreakdown.length > 0 && (
                  <div className="border-t border-green-50 bg-green-50 px-6 py-3">
                    <p className="mb-2 text-xs font-semibold text-green-700">
                      Por Matéria
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {r.subjectBreakdown.map((s) => (
                        <div
                          key={s.subject}
                          className="flex justify-between text-xs"
                        >
                          <span className="text-green-700">{s.subject}</span>
                          <span className="font-medium text-green-900">
                            {s.correct}/{s.total} (
                            {Math.round((s.correct / s.total) * 100)}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
