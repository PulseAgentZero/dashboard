import { type LucideIcon } from "lucide-react";
import { FieldError } from "@/components/ui/field-error";

type FormFieldProps = {
  label: string;
  id: string;
  type?: "text" | "email" | "password";
  placeholder?: string;
  name?: string;
  required?: boolean;
  icon?: LucideIcon;
  error?: string;
};

export default function FormField({
  label,
  id,
  type = "text",
  placeholder,
  name,
  required,
  icon: Icon,
  error,
}: FormFieldProps) {
  const invalid = Boolean(error);

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-[13px] font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        )}
        <input
          id={id}
          type={type}
          name={name ?? id}
          required={required}
          placeholder={placeholder}
          aria-invalid={invalid}
          aria-describedby={invalid ? `${id}-error` : undefined}
          className={`h-10.5 w-full rounded-lg border bg-slate-50 ${Icon ? "pl-9" : "pl-3"} pr-4 text-[13px] text-slate-700 placeholder:text-slate-500 placeholder:text-[13px] focus:outline-none transition-colors ${
            invalid
              ? "border-rose-300 focus:border-rose-400"
              : "border-slate-200 focus:border-blue-400"
          }`}
        />
      </div>
      <FieldError message={error} />
    </div>
  );
}
