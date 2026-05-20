"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Clock,
  Crown,
  Loader2,
  Mail,
  MoreHorizontal,
  Plus,
  Shield,
  Trash2,
  UserMinus,
  Users,
  XCircle,
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import {
  useUsers,
  useInvitations,
  useInviteUser,
  useUpdateUserRole,
  useDeactivateUser,
  useRevokeInvitation,
} from "@/hooks/users/use-users";
import type { OrgUser } from "@/types/users";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";
import { inviteUserSchema, useFormValidation } from "@/lib/validation";
import { FieldError } from "@/components/ui/field-error";

const ROLES = ["admin", "manager", "analyst", "viewer"] as const;
type Role = (typeof ROLES)[number];

const ROLE_META: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  admin: { label: "Admin", color: "bg-rose-50 text-rose-700", icon: Crown },
  manager: { label: "Manager", color: "bg-amber-50 text-amber-700", icon: Shield },
  analyst: { label: "Analyst", color: "bg-orange-50 text-orange-700", icon: Users },
  viewer: { label: "Viewer", color: "bg-slate-100 text-slate-600", icon: Users },
};

function RoleBadge({ role }: { role: string }) {
  const meta = ROLE_META[role.toLowerCase()] ?? { label: role, color: "bg-slate-100 text-slate-600", icon: Users };
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold capitalize ${meta.color}`}>
      <Icon size={10} />
      {meta.label}
    </span>
  );
}

function Initial({ name, email }: { name: string; email: string }) {
  const letter = name?.charAt(0)?.toUpperCase() || email?.charAt(0)?.toUpperCase() || "?";
  return (
    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-xs font-bold text-slate-700 select-none border border-slate-200">
      {letter}
    </div>
  );
}

function UserRow({
  member,
  currentUserId,
  onRoleChange,
  onDeactivateRequest,
  updatingRole,
  deactivating,
}: {
  member: OrgUser;
  currentUserId: string | undefined;
  onRoleChange: (userId: string, role: string) => void;
  onDeactivateRequest: (member: OrgUser) => void;
  updatingRole: boolean;
  deactivating: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isSelf = member.id === currentUserId;

  return (
    <tr className="group hover:bg-slate-50/50 text-sm">
      <td className="border-b border-slate-100 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <Initial name={member.full_name} email={member.email} />
          <div>
            <div className="flex items-center gap-1.5">
              <p className="font-medium text-slate-900">{member.full_name}</p>
              {isSelf && (
                <span className="rounded bg-orange-50 px-1.5 py-px text-[10px] font-semibold text-orange-700">You</span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">{member.email}</p>
          </div>
        </div>
      </td>

      <td className="border-b border-slate-100 px-5 py-3.5">
        {isSelf ? (
          <RoleBadge role={member.role} />
        ) : (
          <div className="relative max-w-[130px]">
            <select
              disabled={updatingRole}
              value={member.role.toLowerCase()}
              onChange={(e) => onRoleChange(member.id, e.target.value)}
              className="w-full appearance-none rounded-lg border border-slate-200 bg-white pl-2.5 pr-8 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-100 disabled:opacity-50 transition-all"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{ROLE_META[r]?.label ?? r}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        )}
      </td>

      <td className="border-b border-slate-100 px-5 py-3.5">
        {member.is_active ? (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
            <CheckCircle2 size={13} /> Active
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
            <XCircle size={13} /> Inactive
          </span>
        )}
      </td>

      <td className="border-b border-slate-100 px-5 py-3.5 text-xs text-slate-500">
        {member.last_login_at
          ? new Date(member.last_login_at).toLocaleDateString(undefined, { dateStyle: "medium" })
          : "Never"}
      </td>

      <td className="border-b border-slate-100 px-5 py-3.5 text-right">
        {!isSelf && (
          <div className="relative inline-block">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50 shadow-sm"
            >
              <MoreHorizontal size={15} />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-9 z-20 w-44 rounded-xl border border-slate-200 bg-white py-1 shadow-md">
                  <button
                    disabled={deactivating}
                    onClick={() => {
                      setMenuOpen(false);
                      onDeactivateRequest(member);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                  >
                    <UserMinus size={13} />
                    {deactivating ? "Deactivating…" : "Deactivate user"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </td>
    </tr>
  );
}

function InviteForm({ onClose }: { onClose: () => void }) {
  const { mutate: invite, isPending } = useInviteUser();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("analyst");
  const { fieldErrors, clearErrors, validate, handleApiError } = useFormValidation();

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    clearErrors();
    const payload = validate(inviteUserSchema, { email, role });
    if (!payload) return;
    invite(payload, {
      onSuccess: () => {
        setEmail("");
        onClose();
      },
      onError: handleApiError,
    });
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900">Invite a team member</p>
        <button type="button" onClick={onClose} className="text-xs font-semibold text-slate-500 hover:text-slate-800">Cancel</button>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-semibold text-slate-600">Email address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="colleague@company.com"
            className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 ${
              fieldErrors.email
                ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10"
                : "border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            }`}
            aria-invalid={Boolean(fieldErrors.email)}
          />
          <FieldError message={fieldErrors.email} />
        </div>
        <div className="sm:w-40">
          <label className="mb-1.5 block text-xs font-semibold text-slate-600">Role</label>
          <div className="relative">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 py-2 text-sm text-slate-700 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{ROLE_META[r]?.label ?? r}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={isPending || !email}
          className="flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50 transition-colors shadow-sm"
        >
          {isPending && <Loader2 size={14} className="animate-spin" />}
          {isPending ? "Sending…" : "Send invite"}
        </button>
      </form>
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[240, 100, 80, 100, 40].map((w, i) => (
        <td key={i} className="border-b border-slate-100 px-5 py-4">
          <div className="h-3.5 rounded bg-slate-100" style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

export function TeamPage() {
  const { user: me } = useAuth();
  const { data: members, isLoading: loadingMembers } = useUsers();
  const { data: invData, isLoading: loadingInvites } = useInvitations();
  const { mutate: updateRole, isPending: updatingRole, variables: updatingVars } = useUpdateUserRole();
  const { mutate: deactivate, isPending: deactivating, variables: deactivatingId } = useDeactivateUser();
  const { mutate: revokeInv, isPending: revoking, variables: revokingId } = useRevokeInvitation();
  const [showInvite, setShowInvite] = useState(false);
  const { requestDeleteConfirm, deleteConfirmModal } = useDeleteConfirm();

  const invitations = invData?.invitations ?? (Array.isArray(invData) ? invData : []);
  const activeMembers = members?.filter((m) => m.is_active) ?? [];

  return (
    <div className="mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Team & roles</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Manage who has access and what they can do within the workspace.
          </p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          disabled={showInvite}
          className="flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50 transition-colors shadow-sm sm:shrink-0"
        >
          <Plus size={16} />
          Invite member
        </button>
      </div>

      {showInvite && <InviteForm onClose={() => setShowInvite(false)} />}

      {/* Members table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-4 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Members</p>
            {!loadingMembers && (
              <span className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-medium text-slate-500 shadow-sm">
                {activeMembers.length} active
              </span>
            )}
          </div>
        </div>

        <div className="divide-y divide-slate-100 md:hidden">
          {loadingMembers &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse space-y-2 px-4 py-4">
                <div className="h-4 w-40 rounded bg-slate-100" />
                <div className="h-3 w-56 rounded bg-slate-50" />
              </div>
            ))}
          {!loadingMembers && members?.map((member) => (
            <div key={member.id} className="flex items-start justify-between gap-3 px-4 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <Initial name={member.full_name} email={member.email} />
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">{member.full_name}</p>
                  <p className="truncate text-[11px] text-slate-400">{member.email}</p>
                  <div className="mt-1.5">
                    <RoleBadge role={member.role} />
                  </div>
                </div>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  member.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                }`}
              >
                {member.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          ))}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[720px] border-separate border-spacing-0">
            <thead>
              <tr className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                {["Member", "Role", "Status", "Last login", ""].map((col, i) => (
                  <th
                    key={i}
                    className={`border-b border-slate-100 px-5 pb-3 pt-4 text-left font-semibold ${i === 4 ? "text-right" : ""}`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loadingMembers && Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}

              {!loadingMembers && (!members || members.length === 0) && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sm text-slate-400">
                    No active workspace members found.
                  </td>
                </tr>
              )}

              {members?.map((member) => (
                <UserRow
                  key={member.id}
                  member={member}
                  currentUserId={me?.id}
                  updatingRole={updatingRole && updatingVars?.userId === member.id}
                  deactivating={deactivating && deactivatingId === member.id}
                  onRoleChange={(userId, role) => updateRole({ userId, role })}
                  onDeactivateRequest={(member) =>
                    requestDeleteConfirm({
                      title: "Deactivate user",
                      description: `Deactivate ${member.full_name}? They will lose access to this organization immediately.`,
                      confirmLabel: "Deactivate",
                      onConfirm: () => deactivate(member.id),
                    })
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending invitations */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-4 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Pending invitations</p>
            {!loadingInvites && invitations.length > 0 && (
              <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                {invitations.length} pending
              </span>
            )}
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {loadingInvites && (
            <div className="space-y-3 p-5">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded-lg bg-slate-100" />
              ))}
            </div>
          )}

          {!loadingInvites && invitations.length === 0 && (
            <div className="flex flex-col items-center py-12 text-center">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-50 text-slate-400 border border-slate-200">
                <Mail size={18} />
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-700">No pending invitations</p>
              <p className="mt-0.5 text-xs text-slate-400">Invite a team member to get started.</p>
            </div>
          )}

          {invitations.map((inv) => (
            <div key={inv.invitation_id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500 border border-slate-200">
                  {inv.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{inv.email}</p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Clock size={11} />
                    Expires {new Date(inv.expires_at).toLocaleDateString(undefined, { dateStyle: "medium" })}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 border-t border-slate-50 pt-3 sm:border-0 sm:pt-0">
                <RoleBadge role={inv.role} />
                <button
                  disabled={revoking && revokingId === inv.invitation_id}
                  onClick={() =>
                    requestDeleteConfirm({
                      title: "Revoke invitation",
                      description: `Revoke the invitation for ${inv.email}? They will not be able to join with the current link.`,
                      confirmLabel: "Revoke",
                      onConfirm: () => revokeInv(inv.invitation_id),
                    })
                  }
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50 shadow-sm transition-colors"
                >
                  {revoking && revokingId === inv.invitation_id
                    ? <Loader2 size={12} className="animate-spin" />
                    : <Trash2 size={12} />}
                  Revoke
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role legend */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/60 px-5 py-5">
        <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Role permissions reference</p>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { role: "admin", desc: "Full root access to configure pipelines, invite users, update plans, and control workspace settings." },
            { role: "manager", desc: "Access dashboards, generate metrics, handle data exports, and submit complex agent workflows." },
            { role: "analyst", desc: "Review entity metrics, view operational logs, and execute read-only queries." },
            { role: "viewer", desc: "Global workspace visibility across metrics and structured layout reports only." },
          ].map(({ role, desc }) => {
            const meta = ROLE_META[role];
            const Icon = meta.icon;
            return (
              <div key={role} className="rounded-xl bg-white p-3.5 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`flex h-6 w-6 items-center justify-center rounded-md ${meta.color}`}>
                      <Icon size={11} />
                    </div>
                    <span className="text-xs font-bold text-slate-800 capitalize">{meta.label}</span>
                  </div>
                  <p className="text-[11px] leading-normal text-slate-500">{desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {deleteConfirmModal}
    </div>
  );
}