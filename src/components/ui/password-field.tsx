"use client";

import { useState } from "react";
import { Key, View, EyeClosed } from "lucide-react";

type PasswordFieldProps = {
  label?: string;
  id?: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
};

export default function PasswordField({
  label = "Password",
  id = "password",
  name,
  placeholder = "••••••••",
  required,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-[13px] font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        <Key
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          id={id}
          type={visible ? "text" : "password"}
          name={name ?? id}
          required={required}
          placeholder={placeholder}
          className="h-10.5 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-10 text-[13px] text-slate-700 placeholder:text-slate-500 focus:border-blue-400 focus:outline-none transition-colors"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeClosed size={15} /> : <View size={15} />}
        </button>
      </div>
    </div>
  );
}
