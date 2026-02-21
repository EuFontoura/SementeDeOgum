"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useExam } from "@/hooks/useExam";
import { useTimer } from "@/hooks/useTimer";
import Timer from "@/components/exam/Timer";
import QuestionCard from "@/components/exam/QuestionCard";
import QuestionNav from "@/components/exam/QuestionNav";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import type { SubjectScore } from "@/types/result";

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;
  const { user } = useAuth();
  const { showToast } = useToast();
  const { exam, questions, answers, setAnswers, loading } = useExam(
    examId,
    user?.uid
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timerMinimized, setTimerMinimized] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [startedAtMs, setStartedAtMs] = useState<number | null>(null);
  const finishedRef = useRef(false);

  const { formatted, isWarning, isTimeUp } = useTimer(startedAtMs);

  useEffect(() => {
    if (!user || loading) return;

    async function initResult() {
      const resultRef = doc(db, "results", `${examId}_${user!.uid}`);
      const resultSnap = await getDoc(resultRef);

      if (resultSnap.exists()) {
        const data = resultSnap.data();
        if (data.finishedAt) {
          finishedRef.current = true;
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
    if (!user || submitting || finishedRef.current) return;
    setSubmitting(true);
    finishedRef.current = true;

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

    showToast("Prova finalizada!");
    router.replace(`/student/result/${examId}`);
  }, [user, submitting, questions, answers, examId, router, showToast]);

  useEffect(() => {
    if (isTimeUp && startedAtMs) {
      submitExam();
    }
  }, [isTimeUp, startedAtMs, submitExam]);

  const handleSelectAnswer = useCallback(
    async (questionId: string, label: string) => {
      if (!user || finishedRef.current || submitting) return;

      try {
        const answerRef = doc(
          db,
          "answers",
          `${examId}_${user.uid}_${questionId}`
        );
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
      } catch {
        showToast("Erro ao salvar resposta", "error");
      }
    },
    [user, examId, submitting, setAnswers, showToast]
  );

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (showFinishModal) return;
      const key = e.key.toLowerCase();
      if (["a", "b", "c", "d", "e"].includes(key) && currentQuestion) {
        handleSelectAnswer(currentQuestion.id, key.toUpperCase());
      }
      if (e.key === "ArrowLeft") {
        setCurrentIndex((i) => Math.max(0, i - 1));
      }
      if (e.key === "ArrowRight") {
        setCurrentIndex((i) => Math.min(questions.length - 1, i + 1));
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentQuestion, questions.length, showFinishModal, handleSelectAnswer]);

  if (loading || !exam || !startedAtMs) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-500" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-green-400">
          Este simulado não possui questões.
        </p>
        <Button variant="outlined" onClick={() => router.replace("/student")}>
          Voltar ao Dashboard
        </Button>
      </div>
    );
  }

  const answeredSet = new Set(
    questions
      .map((q, i) => (answers.has(q.id) ? i : -1))
      .filter((i) => i !== -1)
  );

  return (
    <div className="flex min-h-screen bg-white">
      <div className="fixed left-0 top-0 z-30 flex w-full items-center justify-between border-b border-green-100 bg-white px-4 py-3 md:hidden">
        <span className="text-sm font-semibold text-green-900">
          Questão {currentIndex + 1} de {questions.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMobileNav(true)}
            className="cursor-pointer rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700"
          >
            {answeredSet.size}/{questions.length} ✓
          </button>
          <button
            onClick={() => setShowFinishModal(true)}
            className="cursor-pointer rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white"
          >
            Finalizar
          </button>
        </div>
      </div>

      <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col justify-between border-r border-green-100 bg-white p-4 md:flex">
        <QuestionNav
          totalQuestions={questions.length}
          currentIndex={currentIndex}
          answeredSet={answeredSet}
          onNavigate={setCurrentIndex}
        />
        <Button
          variant="danger"
          onClick={() => setShowFinishModal(true)}
          className={`w-full ${answeredSet.size == questions.length ? "btn-primary" : ""}`}
        >
          Finalizar Prova
        </Button>
      </aside>

      {showMobileNav && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setShowMobileNav(false)}>
          <div className="absolute bottom-0 left-0 right-0 max-h-[70vh] overflow-y-auto rounded-t-2xl bg-white p-4" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-green-900">Navegação</h3>
              <button onClick={() => setShowMobileNav(false)} className="cursor-pointer text-green-400">✕</button>
            </div>
            <QuestionNav
              totalQuestions={questions.length}
              currentIndex={currentIndex}
              answeredSet={answeredSet}
              onNavigate={(i) => { setCurrentIndex(i); setShowMobileNav(false); }}
            />
          </div>
        </div>
      )}

      <main className="flex-1 px-4 pb-8 pt-16 md:ml-64 md:px-8 md:pt-8">
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

      <Modal
        open={showFinishModal}
        onClose={() => setShowFinishModal(false)}
        title="Finalizar Prova?"
      >
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
      </Modal>
    </div>
  );
}
