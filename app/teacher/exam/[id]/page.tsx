"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import {
  getDocument,
  getCollection,
  deleteDocument,
  where,
} from "@/lib/firestore";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Skeleton from "@/components/ui/Skeleton";
import type { Exam } from "@/types/exam";
import type { Question } from "@/types/question";
import type { Result } from "@/types/result";

export default function ExamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;
  const { user } = useAuth();
  const { showToast } = useToast();
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      const [examData, questionsData, resultsData] = await Promise.all([
        getDocument<Exam>("exams", examId),
        getCollection<Question>("questions", where("examId", "==", examId)),
        getCollection<Result>("results", where("examId", "==", examId)),
      ]);
      setExam(examData);
      setQuestions(questionsData);
      setResults(resultsData.filter((r) => r.finishedAt));
      setLoading(false);
    }

    fetchData();
  }, [user, examId]);

  async function handleDelete() {
    setDeleteError("");
    setDeleting(true);

    try {
      const res = await fetch("/api/verify-delete-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deletePassword }),
      });

      if (!res.ok) {
        const data = await res.json();
        setDeleteError(data.error || "Erro ao verificar senha.");
        setDeleting(false);
        return;
      }

      const answersData = await getCollection<{ id: string }>(
        "answers",
        where("examId", "==", examId)
      );

      await Promise.all([
        ...questions.map((q) => deleteDocument("questions", q.id)),
        ...results.map((r) => deleteDocument("results", r.id)),
        ...answersData.map((a) => deleteDocument("answers", a.id)),
        deleteDocument("exams", examId),
      ]);

      showToast("Simulado excluído");
      router.replace("/teacher");
    } catch {
      setDeleteError("Erro ao excluir simulado.");
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl">
        <Skeleton className="mb-4 h-4 w-20" />
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="mb-6 grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <Skeleton className="mb-1 h-4 w-12" />
                <Skeleton className="h-6 w-8" />
              </div>
            ))}
          </div>
          <Skeleton className="h-10 w-full rounded-lg" />
        </Card>
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
      <Card>
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
              {questions.length}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-green-400">Respostas</p>
            <p className="text-lg font-semibold text-green-900">
              {results.length}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {exam.status === "published" && (
            <Link
              href={`/teacher/exam/${examId}/results`}
              className="block rounded-lg bg-green-500 px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-green-700"
            >
              Ver Resultados dos Alunos
            </Link>
          )}
          <Link
            href={`/teacher/exam/${examId}/edit`}
            className="block rounded-lg border-2 border-green-500 px-4 py-2 text-center text-sm font-semibold text-green-500 transition-colors hover:bg-green-500 hover:text-white"
          >
            {exam.status === "draft" ? "Continuar Editando" : "Editar Simulado"}
          </Link>
          <button
            onClick={() => {
              setShowDeleteModal(true);
              setDeletePassword("");
              setDeleteError("");
            }}
            className="cursor-pointer rounded-lg border-2 border-red-300 px-4 py-2 text-center text-sm font-semibold text-red-500 transition-colors hover:bg-red-50"
          >
            Excluir Simulado
          </button>
        </div>
      </Card>

      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Excluir Simulado"
      >
        <p className="mb-4 text-sm text-green-400">
          Esta ação é irreversível. Todas as questões, respostas e resultados
          dos alunos serão permanentemente apagados. Informe a senha de
          exclusão para confirmar.
        </p>
        <div className="flex flex-col gap-3">
          <Input
            id="delete-password"
            label="Senha de exclusão"
            type="password"
            placeholder="Digite a senha"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
          />
          {deleteError && (
            <p className="text-center text-sm text-red-500">{deleteError}</p>
          )}
          <div className="flex gap-3">
            <Button
              variant="outlined"
              onClick={() => setShowDeleteModal(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              loading={deleting}
              onClick={handleDelete}
              disabled={!deletePassword}
              className="flex-1"
            >
              Excluir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
