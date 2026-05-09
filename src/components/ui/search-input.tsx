import { Search } from "lucide-react";

type SearchInputProps = {
  placeholder?: string;
  className?: string;
};

export default function SearchInput({
  placeholder = "Search…",
  className = "",
}: SearchInputProps) {
  return (
    <div className={`relative hidden sm:block ${className}`}>
      <Search
        size={15}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
      />
      <input
        type="text"
        placeholder={placeholder}
        className="h-10 w-64 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-500 focus:border-blue-400 focus:outline-none xl:w-80"
      />
    </div>
  );
}
