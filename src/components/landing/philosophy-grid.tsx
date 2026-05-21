
export default function PhilosophyGrid() {
  return (
    <div className="bg-[var(--mk-bg)] text-[var(--mk-text)] font-mono selection:bg-zinc-800">
      <div className="max-w-7xl mx-auto border-x border-[var(--mk-border)]">
        
        <div className="border-y border-[var(--mk-border)] p-8 lg:p-10">
          <h2 className="text-xl text-zinc-200 tracking-tight font-bold">
            / stop guessing with generic AI.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 border-b border-[var(--mk-border)]">
          
          <div className="p-12 lg:p-16 border-r border-[var(--mk-border)] flex flex-col gap-6">
            <div className="inline-block">
              <span className="bg-[var(--mk-surface-2)] text-[10px] text-[var(--mk-text-muted)] px-2 py-1 rounded border border-[var(--mk-border)] uppercase tracking-widest font-sans font-bold">
                data without context is noise
              </span>
            </div>
            <div className="space-y-4">
              <p className="text-[var(--mk-text-muted)] leading-relaxed max-w-sm">
                <span className="text-[var(--mk-text)] font-bold">/ Generic. Static. Irrelevant.</span> Standard chatbots don&apos;t know your business. Entivia learns your operational context so answers match your KPIs.
              </p>
            </div>
          </div>

          <div className="p-12 lg:p-16 flex flex-col gap-6">
            <div className="inline-block">
              <span className="bg-[var(--mk-surface-2)] text-[10px] text-[var(--mk-text-muted)] px-2 py-1 rounded border border-[var(--mk-border)] uppercase tracking-widest font-sans font-bold">
                answers backed by your data
              </span>
            </div>
            <div className="space-y-4">
              <p className="text-[var(--mk-text-muted)] leading-relaxed max-w-sm">
                <span className="text-[var(--mk-text)] font-bold">/ &quot;AI can&apos;t handle complex DBs.&quot;</span> Entivia sits between the model and your data. Every number comes from a live, validated query—not a guess.
              </p>
            </div>
          </div>
        </div>

        <div className="p-16 lg:p-24 border-b border-[var(--mk-border)] flex justify-center text-center">
          <h3 className="text-3xl md:text-4xl font-sans text-[var(--mk-text-muted)] max-w-3xl leading-tight">
            <span className="text-[var(--mk-text)]">Hello, Entivia.</span> Works for any business on day one—paired with your{" "}
            <span className="text-[var(--mk-text)] underline decoration-[var(--mk-border)] underline-offset-8">
              live operational data
            </span>
            .
          </h3>
        </div>

      </div>
    </div>
  );
}
