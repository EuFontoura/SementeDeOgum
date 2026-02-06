import { Timestamp } from "firebase/firestore";

export type ExamDay = 1 | 2;

export type ExamStatus = "draft" | "published";

export type Exam = {
  id: string;
  title: string;
  createdBy: string;
  day: ExamDay;
  status: ExamStatus;
  createdAt: Timestamp;
  publishedAt: Timestamp | null;
};
