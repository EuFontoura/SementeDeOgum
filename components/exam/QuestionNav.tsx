"use client";

type QuestionNavProps = {
  totalQuestions: number;
  currentIndex: number;
  answeredSet: Set<number>;
  onNavigate: (index: number) => void;
};

export default function QuestionNav({
  totalQuestions,
  currentIndex,
  answeredSet,
  onNavigate,
}: QuestionNavProps) {
  const answeredCount = answeredSet.size;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-green-900">Questões</h3>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }, (_, i) => {
          const isAnswered = answeredSet.has(i);
          const isCurrent = i === currentIndex;
          return (
            <button
              key={i}
              onClick={() => onNavigate(i)}
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                isCurrent ? "ring-2 ring-green-500 " : ""
              }${
                isAnswered
                  ? "bg-green-500 text-white"
                  : "border border-green-200 bg-white text-green-900 hover:bg-green-50"
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-green-400">
        {answeredCount} de {totalQuestions} respondidas
      </p>
    </div>
  );
}
