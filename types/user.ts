import { Timestamp } from "firebase/firestore";

export type UserRole = "student" | "teacher";

export type User = {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Timestamp;
};
