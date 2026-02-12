"use client";

import { useEffect } from "react";

type ToastVariant = "success" | "error";

type ToastProps = {
  message: string;
  variant: ToastVariant;
  onDismiss: () => void;
};

const variantStyles: Record<ToastVariant, string> = {
  success: "bg-green-500 text-white",
  error: "bg-red-500 text-white",
};

export default function Toast({ message, variant, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className={`fixed bottom-6 left-1/2 z-[200] -translate-x-1/2 rounded-lg px-6 py-3 text-sm font-medium shadow-lg ${variantStyles[variant]}`}
    >
      {message}
    </div>
  );
}
