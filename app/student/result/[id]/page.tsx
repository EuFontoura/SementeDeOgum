"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getDocument, getCollection, where, orderBy } from "@/lib/firestore";
import type { Result } from "@/types/result";
import type { Question } from "@/types/question";
import type { Exam } from "@/types/exam";

export default function ResultPage() {
  const params = useParams();
  const examId = params.id as string;
  const { user } = useAuth();
  const [result, setResult] = useState<Result | null>(null);
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answersMap, setAnswersMap] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      const [resultData, examData, questionsData, answersData] =
        await Promise.all([
          getDocument<Result>("results", `${examId}_${user!.uid}`),
          getDocument<Exam>("exams", examId),
          getCollection<Question>(
            "questions",
            where("examId", "==", examId),
            orderBy("order", "asc")
          ),
          getCollection<{ questionId: string; selectedAnswer: string }>(
            "answers",
            where("examId", "==", examId),
            where("userId", "==", user!.uid)
          ),
        ]);

      setResult(resultData);
      setExam(examData);
      setQuestions(questionsData);
      setAnswersMap(
        new Map(answersData.map((a) => [a.questionId, a.selectedAnswer]))
      );
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

  if (!result || !result.finishedAt) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-green-400">Resultado não encontrado.</p>
      </div>
    );
  }

  const percentage = Math.round((result.score / result.totalQuestions) * 100);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-green-100 bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-xl font-bold text-green-900">
          {exam?.title ?? "Simulado"}
        </h1>
        <div className="flex items-baseline gap-3">
          <span className="text-5xl font-bold text-green-500">
            {result.score}/{result.totalQuestions}
          </span>
          <span className="text-lg text-green-400">{percentage}%</span>
        </div>
        <p className="mt-2 text-sm text-green-400">
          Concluído em{" "}
          {result.finishedAt.toDate().toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      <div className="rounded-xl border border-green-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-green-900">
          Desempenho por Matéria
        </h2>
        <div className="flex flex-col gap-4">
          {result.subjectBreakdown.map((subject) => {
            const pct = Math.round((subject.correct / subject.total) * 100);
            return (
              <div key={subject.subject}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-green-900">
                    {subject.subject}
                  </span>
                  <span className="text-sm text-green-400">
                    {subject.correct}/{subject.total} ({pct}%)
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-green-100">
                  <div
                    className="h-full rounded-full bg-green-500 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-green-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-green-900">
          Revisão das Questões
        </h2>
        <div className="flex flex-col gap-3">
          {questions.map((q, i) => {
            const selected = answersMap.get(q.id);
            const isCorrect = selected === q.correctAnswer;
            return (
              <div
                key={q.id}
                className={`rounded-lg border px-4 py-3 ${
                  isCorrect
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-sm font-bold text-green-900">
                    {i + 1}.
                  </span>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                    {q.subject}
                  </span>
                  <span className="ml-auto text-lg">
                    {isCorrect ? "✓" : "✗"}
                  </span>
                </div>
                <p className="line-clamp-2 text-sm text-green-900">
                  {q.text}
                </p>
                <div className="mt-2 flex gap-4 text-xs">
                  {selected && !isCorrect && (
                    <span className="text-red-500">
                      Sua resposta: {selected}
                    </span>
                  )}
                  <span className="text-green-500">
                    Correta: {q.correctAnswer}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Link
        href="/student"
        className="inline-block rounded-lg border-2 border-green-500 px-6 py-2 text-center font-semibold text-green-500 transition-colors hover:bg-green-500 hover:text-white"
      >
        Voltar ao Dashboard
      </Link>
    </div>
  );
}
