"use client";

type TimerProps = {
  formatted: string;
  isWarning: boolean;
  minimized: boolean;
  onToggle: () => void;
};

export default function Timer({
  formatted,
  isWarning,
  minimized,
  onToggle,
}: TimerProps) {
  if (minimized) {
    return (
      <button
        onClick={onToggle}
        className={`fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-colors ${
          isWarning ? "bg-red-500 text-white" : "bg-white text-green-700"
        }`}
      >
        ⏱
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 rounded-2xl bg-white p-4 shadow-lg ${
        isWarning ? "border-2 border-red-300" : "border border-green-100"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <span
          className={`font-mono text-3xl font-bold ${
            isWarning ? "text-red-500" : "text-green-900"
          }`}
        >
          {formatted}
        </span>
        <button
          onClick={onToggle}
          className="text-sm text-green-400 hover:text-green-700"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
