"use client";

import { Star } from "lucide-react";

type Props = {
  starred: boolean;
  onToggle: () => void;
  disabled?: boolean;
  size?: number;
};

export function StarButton({ starred, onToggle, disabled, size = 16 }: Props) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      disabled={disabled}
      className="rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-amber-500 disabled:opacity-50"
      aria-label={starred ? "Unstar" : "Star"}
    >
      <Star
        size={size}
        className={starred ? "fill-amber-400 text-amber-400" : ""}
      />
    </button>
  );
}
