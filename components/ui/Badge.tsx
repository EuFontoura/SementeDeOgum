"use client";

type BadgeVariant = "success" | "warning" | "default";

type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
};

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  default: "bg-gray-100 text-gray-600",
};

export default function Badge({ label, variant = "default" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${variantStyles[variant]}`}
    >
      {label}
    </span>
  );
}
