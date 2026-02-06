"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useExam } from "@/hooks/useExam";
import { useTimer } from "@/hooks/useTimer";
import Timer from "@/components/exam/Timer";
import QuestionCard from "@/components/exam/QuestionCard";
import QuestionNav from "@/components/exam/QuestionNav";
import Button from "@/components/ui/Button";
import type { SubjectScore } from "@/types/result";

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;
  const { user } = useAuth();
  const { exam, questions, answers, setAnswers, loading } = useExam(
    examId,
    user?.uid
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timerMinimized, setTimerMinimized] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [startedAtMs, setStartedAtMs] = useState<number | null>(null);

  const { formatted, isWarning, isTimeUp } = useTimer(startedAtMs);

  useEffect(() => {
    if (!user || loading) return;

    async function initResult() {
      const resultRef = doc(db, "results", `${examId}_${user!.uid}`);
      const resultSnap = await getDoc(resultRef);

      if (resultSnap.exists()) {
        const data = resultSnap.data();
        if (data.finishedAt) {
          router.replace(`/student/result/${examId}`);
          return;
        }
        setStartedAtMs(data.startedAt.toMillis());
      } else {
        const now = Timestamp.now();
        await setDoc(resultRef, {
          examId,
          userId: user!.uid,
          score: 0,
          totalQuestions: 0,
          subjectBreakdown: [],
          startedAt: now,
          finishedAt: null,
        });
        setStartedAtMs(now.toMillis());
      }
    }

    initResult();
  }, [user, loading, examId, router]);

  const submitExam = useCallback(async () => {
    if (!user || submitting) return;
    setSubmitting(true);

    const subjectMap = new Map<string, { correct: number; total: number }>();

    for (const q of questions) {
      const entry = subjectMap.get(q.subject) || { correct: 0, total: 0 };
      entry.total++;
      if (answers.get(q.id) === q.correctAnswer) {
        entry.correct++;
      }
      subjectMap.set(q.subject, entry);
    }

    const subjectBreakdown: SubjectScore[] = Array.from(
      subjectMap.entries()
    ).map(([subject, data]) => ({
      subject,
      correct: data.correct,
      total: data.total,
    }));

    const score = subjectBreakdown.reduce((sum, s) => sum + s.correct, 0);

    const resultRef = doc(db, "results", `${examId}_${user.uid}`);
    await setDoc(
      resultRef,
      {
        score,
        totalQuestions: questions.length,
        subjectBreakdown,
        finishedAt: Timestamp.now(),
      },
      { merge: true }
    );

    router.replace(`/student/result/${examId}`);
  }, [user, submitting, questions, answers, examId, router]);

  useEffect(() => {
    if (isTimeUp && startedAtMs) {
      submitExam();
    }
  }, [isTimeUp, startedAtMs, submitExam]);

  async function handleSelectAnswer(questionId: string, label: string) {
    if (!user) return;

    const answerRef = doc(db, "answers", `${examId}_${user.uid}_${questionId}`);
    await setDoc(answerRef, {
      examId,
      userId: user.uid,
      questionId,
      selectedAnswer: label,
      answeredAt: Timestamp.now(),
    });

    setAnswers((prev) => {
      const next = new Map(prev);
      next.set(questionId, label);
      return next;
    });
  }

  if (loading || !exam || !startedAtMs) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-500" />
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredSet = new Set(
    questions
      .map((q, i) => (answers.has(q.id) ? i : -1))
      .filter((i) => i !== -1)
  );

  return (
    <div className="flex min-h-screen bg-white">
      <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col justify-between border-r border-green-100 bg-white p-4">
        <QuestionNav
          totalQuestions={questions.length}
          currentIndex={currentIndex}
          answeredSet={answeredSet}
          onNavigate={setCurrentIndex}
        />
        <Button
          variant="danger"
          onClick={() => setShowFinishModal(true)}
          className="w-full"
        >
          Finalizar Prova
        </Button>
      </aside>

      <main className="ml-64 flex-1 p-8">
        <div className="mx-auto max-w-3xl">
          {currentQuestion && (
            <QuestionCard
              question={currentQuestion}
              selectedAnswer={answers.get(currentQuestion.id)}
              onSelectAnswer={(label) =>
                handleSelectAnswer(currentQuestion.id, label)
              }
              questionNumber={currentIndex + 1}
            />
          )}

          <div className="mt-8 flex justify-between">
            <Button
              variant="outlined"
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
            >
              Anterior
            </Button>
            <Button
              variant="outlined"
              onClick={() =>
                setCurrentIndex((i) =>
                  Math.min(questions.length - 1, i + 1)
                )
              }
              disabled={currentIndex === questions.length - 1}
            >
              Próxima
            </Button>
          </div>
        </div>
      </main>

      <Timer
        formatted={formatted}
        isWarning={isWarning}
        minimized={timerMinimized}
        onToggle={() => setTimerMinimized((m) => !m)}
      />

      {showFinishModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-2 text-lg font-bold text-green-900">
              Finalizar Prova?
            </h2>
            <p className="mb-4 text-sm text-green-400">
              Você respondeu {answeredSet.size} de {questions.length} questões.
              {answeredSet.size < questions.length &&
                " Questões não respondidas serão consideradas erradas."}
            </p>
            <div className="flex gap-3">
              <Button
                variant="outlined"
                onClick={() => setShowFinishModal(false)}
                className="flex-1"
              >
                Voltar
              </Button>
              <Button
                variant="danger"
                loading={submitting}
                onClick={submitExam}
                className="flex-1"
              >
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
