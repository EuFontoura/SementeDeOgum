"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getDocument, getCollection, where } from "@/lib/firestore";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import type { User } from "@/types/user";
import type { Result } from "@/types/result";

export default function StudentProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      const [profileData, resultsData] = await Promise.all([
        getDocument<User>("users", user!.uid),
        getCollection<Result>(
          "results",
          where("userId", "==", user!.uid)
        ),
      ]);
      setProfile(profileData);
      setResults(resultsData.filter((r) => r.finishedAt));
      setLoading(false);
    }

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-48" />
        <Card>
          <Skeleton className="mb-4 h-6 w-32" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <Skeleton className="mb-1 h-4 w-16" />
                <Skeleton className="h-5 w-32" />
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <Skeleton className="mb-4 h-6 w-48" />
          {[1, 2].map((i) => (
            <Skeleton key={i} className="mb-2 h-14 w-full rounded-lg" />
          ))}
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-green-900">Meu Perfil</h1>

      <Card>
        <h2 className="mb-4 text-lg font-semibold text-green-900">
          Meus Dados
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <p className="text-sm font-medium text-green-400">Nome</p>
            <p className="text-green-900">{profile?.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-green-400">Email</p>
            <p className="text-green-900">{profile?.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-green-400">Papel</p>
            <p className="text-green-900">Aluno</p>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold text-green-900">
          Histórico de Simulados
        </h2>
        {results.length === 0 ? (
          <p className="text-green-400">Nenhum simulado concluído ainda.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {results.map((result) => (
              <Link
                key={result.id}
                href={`/student/result/${result.examId}`}
                className="flex items-center justify-between rounded-lg border border-green-100 px-4 py-3 transition-colors hover:bg-green-50"
              >
                <div>
                  <p className="text-sm font-medium text-green-900">
                    Simulado
                  </p>
                  <p className="text-xs text-green-400">
                    {result.finishedAt?.toDate().toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <span className="text-sm font-bold text-green-700">
                  {result.score}/{result.totalQuestions}
                </span>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
