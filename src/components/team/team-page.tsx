import { Crown, Eye, UserCog, Users } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";

const roles = [
  { role: "Organization Admin", permissions: "Full access, configuration, users, billing, settings", users: "2", icon: Crown },
  { role: "Operations Manager", permissions: "Dashboard, agent, recommendations, exports", users: "8", icon: UserCog },
  { role: "Team Member / Analyst", permissions: "Profiles, agent queries, action recommendations", users: "21", icon: Users },
  { role: "Read-Only Viewer", permissions: "Dashboard and report visibility only", users: "12", icon: Eye },
];

export function TeamPage() {
  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <PageHero eyebrow="Team and roles" title="Control who can configure, query, act, and view operational intelligence." description="Pulse needs role-based access control so admins, managers, analysts, and executive viewers see the right level of operational data." action="Invite user" />
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SectionHeading eyebrow="RBAC" title="Configured roles" />
        <div className="grid gap-4 md:grid-cols-2">
          {roles.map(({ role, permissions, users, icon: Icon }) => (
            <article key={role} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700"><Icon size={17} /></div>
                <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">{users} users</span>
              </div>
              <h2 className="mt-4 font-semibold text-slate-950">{role}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{permissions}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
