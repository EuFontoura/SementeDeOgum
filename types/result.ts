import { Timestamp } from "firebase/firestore";

export type SubjectScore = {
  subject: string;
  correct: number;
  total: number;
};

export type Answer = {
  id: string;
  examId: string;
  userId: string;
  questionId: string;
  selectedAnswer: string;
  answeredAt: Timestamp;
};

export type Result = {
  id: string;
  examId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  subjectBreakdown: SubjectScore[];
  startedAt: Timestamp;
  finishedAt: Timestamp | null;
};
