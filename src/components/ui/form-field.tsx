import { type LucideIcon } from "lucide-react";

type FormFieldProps = {
  label: string;
  id: string;
  type?: "text" | "email" | "password";
  placeholder?: string;
  name?: string;
  required?: boolean;
  icon?: LucideIcon;
};

export default function FormField({
  label,
  id,
  type = "text",
  placeholder,
  name,
  required,
  icon: Icon,
}: FormFieldProps) {
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
          className={`h-10.5 w-full rounded-lg border border-slate-200 bg-slate-50 ${Icon ? "pl-9" : "pl-3"} pr-4 text-[13px] text-slate-700 placeholder:text-slate-500 focus:border-blue-400 focus:outline-none transition-colors`}
        />
      </div>
    </div>
  );
}
