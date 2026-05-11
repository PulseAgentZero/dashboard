import Image from "next/image";
import { ArrowRight } from "lucide-react";

const cases = [
  {
    id: "healthcare",
    category: "For Healthcare",
    headline: "Spot deteriorating patients before alerts even fire.",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&auto=format&fit=crop&q=80",
    from: "from-teal-900/90",
    accent: "text-teal-300",
    border: "border-teal-800/40",
  },
  {
    id: "telecom",
    category: "For Telecom",
    headline: "Retain subscribers at the moment they consider leaving.",
    image:
      "https://images.unsplash.com/photo-1596272875729-ed2b4e4aa00a?w=1200&auto=format&fit=crop&q=80",
    from: "from-orange-900/90",
    accent: "text-orange-300",
    border: "border-orange-800/40",
  },
];

export default function UseCasesSection() {
  return (
    <section className="bg-[#0d0f1a] px-4 pb-24 md:px-10 lg:px-28">
      {/* Heading */}
      <div className="mb-10 max-w-xl">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-400">
          Use Cases
        </span>
        <h2 className="mt-3 text-4xl font-black leading-tight tracking-tight text-white md:text-5xl">
          Intelligence for
          <br />
          every industry.
        </h2>
      </div>

      {/* Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {cases.map((c) => (
          <div
            key={c.id}
            className={`group relative min-h-[520px] overflow-hidden rounded-3xl border ${c.border}`}
          >
            <Image
              src={c.image}
              alt={c.category}
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            {/* gradient overlay */}
            <div
              className={`absolute inset-0 bg-linear-to-t ${c.from} via-black/30 to-transparent`}
            />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-between p-8">
              <span
                className={`text-[11px] font-bold uppercase tracking-[0.2em] ${c.accent}`}
              >
                {c.category}
              </span>

              <div>
                <h3 className="max-w-xs text-3xl font-black leading-tight text-white md:text-4xl">
                  {c.headline}
                </h3>
                <a
                  href="#"
                  className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold text-white/70 transition-colors hover:text-white"
                >
                  Learn more
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
