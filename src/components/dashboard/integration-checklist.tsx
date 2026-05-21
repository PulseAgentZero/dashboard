import { integrationTasks } from "@/lib/demo.data";
import { SectionHeading } from "@/components/shared/section-heading";

export function IntegrationChecklist() {
  return (
    <section className="rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
      <SectionHeading eyebrow="Backend-ready" title="Endpoint swap list" />

      <div className="space-y-2">
        {integrationTasks.map((task) => (
          <div key={task} className="flex items-center gap-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            <span className="text-slate-700">{task}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
