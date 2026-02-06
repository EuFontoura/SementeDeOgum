"use client";

import type { PasswordCheck } from "@/lib/validation";

type PasswordCriteriaProps = {
  checks: PasswordCheck;
};

const criteria: { key: keyof PasswordCheck; label: string }[] = [
  { key: "minLength", label: "Mínimo 8 caracteres" },
  { key: "hasUppercase", label: "Uma letra maiúscula" },
  { key: "hasLowercase", label: "Uma letra minúscula" },
  { key: "hasNumber", label: "Um número" },
  { key: "hasSpecial", label: "Um caractere especial (!@#$...)" },
];

export default function PasswordCriteria({ checks }: PasswordCriteriaProps) {
  return (
    <ul className="flex flex-col gap-1">
      {criteria.map(({ key, label }) => (
        <li
          key={key}
          className={`flex items-center gap-2 text-xs ${
            checks[key] ? "text-green-500" : "text-green-200"
          }`}
        >
          <span className="text-sm">{checks[key] ? "✓" : "○"}</span>
          {label}
        </li>
      ))}
    </ul>
  );
}
