"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, setDoc, Timestamp, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { compressImageToBase64, getBase64SizeKB } from "@/lib/image";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import type { ExamDay } from "@/types/exam";
import type { Alternative } from "@/types/question";

type QuestionDraft = {
  subject: string;
  text: string;
  imageBase64?: string;
  alternatives: Alternative[];
  correctAnswer: string;
};

const daySubjects: Record<ExamDay, string[]> = {
  1: ["Linguagens", "Ciências Humanas"],
  2: ["Ciências da Natureza", "Matemática"],
};

const emptyQuestion = (): QuestionDraft => ({
  subject: "",
  text: "",
  imageBase64: undefined,
  alternatives: [
    { label: "A", text: "" },
    { label: "B", text: "" },
    { label: "C", text: "" },
    { label: "D", text: "" },
    { label: "E", text: "" },
  ],
  correctAnswer: "",
});

export default function NewExamPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [title, setTitle] = useState("");
  const [day, setDay] = useState<ExamDay>(1);
  const [questions, setQuestions] = useState<QuestionDraft[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionDraft>(
    emptyQuestion()
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState("");
  const [publishing, setPublishing] = useState(false);

  const subjects = daySubjects[day];

  function handleAddOrUpdateQuestion() {
    setError("");
    const q = currentQuestion;
    if (!q.subject) {
      setError("Selecione a matéria.");
      return;
    }
    if (!q.text.trim()) {
      setError("Digite o enunciado da questão.");
      return;
    }
    if (q.alternatives.some((a) => !a.text.trim())) {
      setError("Preencha todas as alternativas.");
      return;
    }
    if (!q.correctAnswer) {
      setError("Selecione a resposta correta.");
      return;
    }

    if (editingIndex !== null) {
      setQuestions((prev) =>
        prev.map((item, i) => (i === editingIndex ? q : item))
      );
    } else {
      setQuestions((prev) => [...prev, q]);
    }

    setCurrentQuestion(emptyQuestion());
    setEditingIndex(null);
  }

  function handleEditQuestion(index: number) {
    setCurrentQuestion({ ...questions[index] });
    setEditingIndex(index);
  }

  function handleDeleteQuestion(index: number) {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setCurrentQuestion(emptyQuestion());
      setEditingIndex(null);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageError("");
    try {
      const base64 = await compressImageToBase64(file);
      setCurrentQuestion((prev) => ({ ...prev, imageBase64: base64 }));
    } catch (err) {
      setImageError(
        err instanceof Error ? err.message : "Erro ao processar imagem."
      );
    }
  }

  async function handlePublish() {
    if (!user) return;
    setPublishing(true);

    const examRef = doc(collection(db, "exams"));
    const examId = examRef.id;

    await setDoc(examRef, {
      title,
      createdBy: user.uid,
      day,
      status: "published",
      createdAt: Timestamp.now(),
      publishedAt: Timestamp.now(),
    });

    const questionPromises = questions.map((q, index) => {
      const questionRef = doc(collection(db, "questions"));
      return setDoc(questionRef, {
        examId,
        subject: q.subject,
        text: q.text,
        imageBase64: q.imageBase64 || null,
        alternatives: q.alternatives,
        correctAnswer: q.correctAnswer,
        order: index + 1,
      });
    });

    await Promise.all(questionPromises);
    router.replace("/teacher");
  }

  const subjectCounts = questions.reduce(
    (acc, q) => {
      acc[q.subject] = (acc[q.subject] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  if (step === 1) {
    return (
      <div className="mx-auto max-w-lg">
        <h1 className="mb-6 text-2xl font-bold text-green-900">
          Novo Simulado
        </h1>
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
                  className={`flex-1 rounded-lg py-2 font-medium transition-colors ${
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
          <Button
            onClick={() => {
              if (!title.trim()) {
                setError("Informe o título do simulado.");
                return;
              }
              setError("");
              setStep(2);
            }}
            className="w-full"
          >
            Próximo
          </Button>
          {error && (
            <p className="text-center text-sm text-red-500">{error}</p>
          )}
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold text-green-900">
          {title} — Questões
        </h1>
        <div className="flex gap-6">
          <div className="w-64 shrink-0">
            <div className="rounded-xl border border-green-100 bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-green-900">
                Questões ({questions.length})
              </h3>
              {questions.length === 0 ? (
                <p className="text-xs text-green-400">Nenhuma questão ainda.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {questions.map((q, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs ${
                        editingIndex === i
                          ? "bg-green-100"
                          : "bg-green-50 hover:bg-green-100"
                      }`}
                    >
                      <button
                        onClick={() => handleEditQuestion(i)}
                        className="flex-1 text-left"
                      >
                        <span className="font-bold text-green-900">
                          {i + 1}.
                        </span>{" "}
                        <span className="text-green-400">{q.subject}</span>
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(i)}
                        className="ml-2 text-red-400 hover:text-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 rounded-xl border border-green-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-green-900">
              {editingIndex !== null
                ? `Editando Questão ${editingIndex + 1}`
                : "Nova Questão"}
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-green-900">
                  Matéria
                </label>
                <select
                  value={currentQuestion.subject}
                  onChange={(e) =>
                    setCurrentQuestion((prev) => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-green-200 px-4 py-2.5 text-green-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                >
                  <option value="">Selecione...</option>
                  {subjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-green-900">
                  Enunciado
                </label>
                <textarea
                  value={currentQuestion.text}
                  onChange={(e) =>
                    setCurrentQuestion((prev) => ({
                      ...prev,
                      text: e.target.value,
                    }))
                  }
                  placeholder="Digite o enunciado da questão..."
                  className="min-h-32 w-full rounded-lg border border-green-200 px-4 py-2.5 text-green-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-green-900">
                  Imagem (opcional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="text-sm text-green-400"
                />
                {imageError && (
                  <p className="text-xs text-red-500">{imageError}</p>
                )}
                {currentQuestion.imageBase64 && (
                  <div className="relative">
                    <img
                      src={currentQuestion.imageBase64}
                      alt="Preview"
                      className="max-h-48 rounded-lg"
                    />
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs text-green-400">
                        {getBase64SizeKB(currentQuestion.imageBase64)}KB
                      </span>
                      <button
                        onClick={() =>
                          setCurrentQuestion((prev) => ({
                            ...prev,
                            imageBase64: undefined,
                          }))
                        }
                        className="text-xs text-red-400 hover:text-red-600"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-green-900">
                  Alternativas
                </label>
                {currentQuestion.alternatives.map((alt, i) => (
                  <div key={alt.label} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={currentQuestion.correctAnswer === alt.label}
                      onChange={() =>
                        setCurrentQuestion((prev) => ({
                          ...prev,
                          correctAnswer: alt.label,
                        }))
                      }
                      className="accent-green-500"
                    />
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-200 text-xs font-bold text-green-700">
                      {alt.label}
                    </span>
                    <input
                      type="text"
                      value={alt.text}
                      onChange={(e) =>
                        setCurrentQuestion((prev) => ({
                          ...prev,
                          alternatives: prev.alternatives.map((a, j) =>
                            j === i ? { ...a, text: e.target.value } : a
                          ),
                        }))
                      }
                      placeholder={`Alternativa ${alt.label}`}
                      className="flex-1 rounded-lg border border-green-200 px-3 py-2 text-sm text-green-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                ))}
              </div>

              {error && (
                <p className="text-center text-sm text-red-500">{error}</p>
              )}

              <Button onClick={handleAddOrUpdateQuestion} className="w-full">
                {editingIndex !== null
                  ? "Salvar Alterações"
                  : "Adicionar Questão"}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <Button variant="outlined" onClick={() => setStep(1)}>
            Voltar
          </Button>
          <Button
            onClick={() => {
              if (questions.length === 0) {
                setError("Adicione pelo menos uma questão.");
                return;
              }
              setError("");
              setStep(3);
            }}
          >
            Revisar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-green-900">
        Revisão do Simulado
      </h1>
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-green-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-green-900">{title}</h2>
          <p className="text-sm text-green-400">
            Dia {day} — {daySubjects[day].join(" + ")}
          </p>
          <p className="mt-2 text-sm text-green-700">
            {questions.length} questões
          </p>
        </div>

        <div className="rounded-xl border border-green-100 bg-white p-6 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-green-900">
            Distribuição por Matéria
          </h3>
          <div className="flex flex-col gap-2">
            {Object.entries(subjectCounts).map(([subject, count]) => (
              <div key={subject} className="flex justify-between text-sm">
                <span className="text-green-700">{subject}</span>
                <span className="font-medium text-green-900">
                  {count} questões
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto rounded-xl border border-green-100 bg-white p-6 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-green-900">
            Questões
          </h3>
          <div className="flex flex-col gap-2">
            {questions.map((q, i) => (
              <div
                key={i}
                className="rounded-lg bg-green-50 px-4 py-3 text-sm"
              >
                <span className="font-bold text-green-900">{i + 1}.</span>{" "}
                <span className="text-green-400">[{q.subject}]</span>{" "}
                <span className="text-green-700">
                  {q.text.length > 100
                    ? q.text.slice(0, 100) + "..."
                    : q.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outlined" onClick={() => setStep(2)}>
            Voltar
          </Button>
          <Button loading={publishing} onClick={handlePublish}>
            Publicar Simulado
          </Button>
        </div>
      </div>
    </div>
  );
}
