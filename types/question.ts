export type Alternative = {
  label: string;
  text: string;
};

export type Question = {
  id: string;
  examId: string;
  subject: string;
  text: string;
  imageBase64?: string;
  alternatives: Alternative[];
  correctAnswer: string;
  order: number;
};
