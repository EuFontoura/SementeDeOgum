"use client";

import { useEffect, useState } from "react";
import { getCollection, where, orderBy } from "@/lib/firestore";
import type { Exam } from "@/types/exam";
import type { Result } from "@/types/result";

export type ExamWithStatus = Exam & {
  studentStatus: "not_started" | "in_progress" | "completed";
};

export function useExams(userId: string | undefined) {
  const [exams, setExams] = useState<ExamWithStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    async function fetchExams() {
      setLoading(true);
      const [allExams, results] = await Promise.all([
        getCollection<Exam>("exams", where("status", "==", "published")),
        getCollection<Result>("results", where("userId", "==", userId)),
      ]);

      const resultMap = new Map(results.map((r) => [r.examId, r]));

      const examsWithStatus: ExamWithStatus[] = allExams.map((exam) => {
        const result = resultMap.get(exam.id);
        let studentStatus: ExamWithStatus["studentStatus"] = "not_started";
        if (result?.finishedAt) {
          studentStatus = "completed";
        } else if (result) {
          studentStatus = "in_progress";
        }
        return { ...exam, studentStatus };
      });

      setExams(examsWithStatus);
      setLoading(false);
    }

    fetchExams();
  }, [userId]);

  return { exams, loading };
}
