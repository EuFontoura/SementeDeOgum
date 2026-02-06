"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-sm font-medium text-green-900">
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          className={`w-full rounded-lg border px-4 py-2.5 text-green-900 outline-none transition-colors placeholder:text-green-200 focus:ring-2 ${
            error
              ? "border-red-500 focus:ring-red-200"
              : "border-green-200 focus:border-green-500 focus:ring-green-100"
          }`}
          {...props}
        />
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
