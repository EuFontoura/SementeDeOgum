"use client";

import type { Question } from "@/types/question";

type QuestionCardProps = {
  question: Question;
  selectedAnswer: string | undefined;
  onSelectAnswer: (label: string) => void;
  questionNumber: number;
};

export default function QuestionCard({
  question,
  selectedAnswer,
  onSelectAnswer,
  questionNumber,
}: QuestionCardProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-white">
          {questionNumber}
        </span>
        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          {question.subject}
        </span>
      </div>
      <p className="text-base leading-relaxed text-green-900 whitespace-pre-wrap">
        {question.text}
      </p>
      {question.imageBase64 && (
        <div className="flex justify-center">
          <img
            src={question.imageBase64}
            alt="Imagem da questão"
            className="max-w-sm rounded-lg"
          />
        </div>
      )}
      <div className="flex flex-col gap-2">
        {question.alternatives.map((alt) => {
          const isSelected = selectedAnswer === alt.label;
          return (
            <button
              key={alt.label}
              onClick={() => onSelectAnswer(alt.label)}
              className={`flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-left text-sm transition-colors ${
                isSelected
                  ? "bg-green-500 text-white"
                  : "border border-green-200 bg-green-50 text-green-900 hover:bg-green-100"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  isSelected
                    ? "bg-white text-green-500"
                    : "bg-green-200 text-green-700"
                }`}
              >
                {alt.label}
              </span>
              {alt.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
