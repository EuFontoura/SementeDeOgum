"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getDocument, getCollection, where } from "@/lib/firestore";
import Badge from "@/components/ui/Badge";
import type { Exam } from "@/types/exam";
import type { Question } from "@/types/question";
import type { Result } from "@/types/result";

export default function ExamDetailPage() {
  const params = useParams();
  const examId = params.id as string;
  const { user } = useAuth();
  const [exam, setExam] = useState<Exam | null>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      const [examData, questionsData, resultsData] = await Promise.all([
        getDocument<Exam>("exams", examId),
        getCollection<Question>("questions", where("examId", "==", examId)),
        getCollection<Result>("results", where("examId", "==", examId)),
      ]);
      setExam(examData);
      setQuestionCount(questionsData.length);
      setResults(resultsData.filter((r) => r.finishedAt));
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

  if (!exam) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-green-400">Simulado não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/teacher"
        className="mb-4 inline-block text-sm text-green-500 hover:text-green-700"
      >
        ← Voltar
      </Link>
      <div className="rounded-xl border border-green-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-green-900">{exam.title}</h1>
          <Badge
            label={exam.status === "draft" ? "Rascunho" : "Publicado"}
            variant={exam.status === "draft" ? "warning" : "success"}
          />
        </div>
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-green-400">Dia</p>
            <p className="text-lg font-semibold text-green-900">{exam.day}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-green-400">Questões</p>
            <p className="text-lg font-semibold text-green-900">
              {questionCount}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-green-400">Respostas</p>
            <p className="text-lg font-semibold text-green-900">
              {results.length}
            </p>
          </div>
        </div>
        {exam.status === "published" ? (
          <Link
            href={`/teacher/exam/${examId}/results`}
            className="block rounded-lg bg-green-500 px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-green-700"
          >
            Ver Resultados dos Alunos
          </Link>
        ) : (
          <p className="text-center text-sm text-green-400">
            Nenhum resultado disponível (simulado não publicado).
          </p>
        )}
      </div>
    </div>
  );
}
