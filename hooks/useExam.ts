"use client";

import { useEffect, useState } from "react";
import { getDocument, getCollection, where, orderBy } from "@/lib/firestore";
import type { Exam } from "@/types/exam";
import type { Question } from "@/types/question";
import type { Answer } from "@/types/result";

export function useExam(examId: string, userId: string | undefined) {
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    async function fetchExam() {
      setLoading(true);
      const [examData, questionsData, answersData] = await Promise.all([
        getDocument<Exam>("exams", examId),
        getCollection<Question>(
          "questions",
          where("examId", "==", examId),
          orderBy("order", "asc")
        ),
        getCollection<Answer>(
          "answers",
          where("examId", "==", examId),
          where("userId", "==", userId)
        ),
      ]);

      setExam(examData);
      setQuestions(questionsData);
      setAnswers(
        new Map(answersData.map((a) => [a.questionId, a.selectedAnswer]))
      );
      setLoading(false);
    }

    fetchExam();
  }, [examId, userId]);

  return { exam, questions, answers, setAnswers, loading };
}
