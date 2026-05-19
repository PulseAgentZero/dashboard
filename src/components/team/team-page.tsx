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

const ROLES = ["admin", "manager", "analyst", "viewer"] as const;
type Role = (typeof ROLES)[number];

const ROLE_META: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  admin: { label: "Admin", color: "bg-rose-50 text-rose-700", icon: Crown },
  manager: { label: "Manager", color: "bg-amber-50 text-amber-700", icon: Shield },
  analyst: { label: "Analyst", color: "bg-blue-50 text-blue-700", icon: Users },
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
    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-teal-400 text-xs font-bold text-white select-none">
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
    <tr className="group hover:bg-slate-50/60 text-sm">
      <td className="border-b border-slate-100 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <Initial name={member.full_name} email={member.email} />
          <div>
            <p className="font-medium text-slate-900">
              {member.full_name}
              {isSelf && (
                <span className="ml-1.5 rounded bg-blue-50 px-1.5 py-px text-[10px] font-semibold text-blue-600">You</span>
              )}
            </p>
            <p className="text-[11px] text-slate-400">{member.email}</p>
          </div>
        </div>
      </td>

      <td className="border-b border-slate-100 px-5 py-3.5">
        {isSelf ? (
          <RoleBadge role={member.role} />
        ) : (
          <select
            disabled={updatingRole}
            value={member.role.toLowerCase()}
            onChange={(e) => onRoleChange(member.id, e.target.value)}
            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 outline-none focus:border-blue-500 disabled:opacity-50"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>{ROLE_META[r]?.label ?? r}</option>
            ))}
          </select>
        )}
      </td>

      <td className="border-b border-slate-100 px-5 py-3.5">
        {member.is_active ? (
          <span className="flex items-center gap-1 text-xs text-emerald-600">
            <CheckCircle2 size={12} /> Active
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <XCircle size={12} /> Inactive
          </span>
        )}
      </td>

      <td className="border-b border-slate-100 px-5 py-3.5 text-xs text-slate-400">
        {member.last_login_at
          ? new Date(member.last_login_at).toLocaleDateString()
          : "Never"}
      </td>

      <td className="border-b border-slate-100 px-5 py-3.5 text-right">
        {!isSelf && (
          <div className="relative inline-block">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <MoreHorizontal size={15} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-8 z-10 w-44 rounded-xl border border-slate-200 bg-white py-1 shadow-lg shadow-slate-900/10">
                <button
                  disabled={deactivating}
                  onClick={() => {
                    setMenuOpen(false);
                    onDeactivateRequest(member);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                >
                  <UserMinus size={13} />
                  {deactivating ? "Deactivating…" : "Deactivate user"}
                </button>
              </div>
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

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    invite({ email, role }, { onSuccess: () => { setEmail(""); onClose(); } });
  }

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">Invite a team member</p>
        <button onClick={onClose} className="text-xs text-slate-400 hover:text-slate-700">Cancel</button>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-semibold text-slate-600">Email address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="colleague@company.com"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>{ROLE_META[r]?.label ?? r}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={isPending || !email}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending && <Loader2 size={13} className="animate-spin" />}
          {isPending ? "Sending…" : "Send invite"}
        </button>
      </form>
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[200, 80, 60, 80, 40].map((w, i) => (
        <td key={i} className="border-b border-slate-100 px-5 py-3.5">
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
    <div className="mx-auto space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Team & roles</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Manage who has access and what they can do.
          </p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          disabled={showInvite}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <Plus size={14} />
          Invite member
        </button>
      </div>

      {showInvite && <InviteForm onClose={() => setShowInvite(false)} />}

      {/* Members table */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-800">Members</p>
            {!loadingMembers && (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs text-slate-500">
                {activeMembers.length} active
              </span>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-0">
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
                    No members found.
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
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-800">Pending invitations</p>
            {!loadingInvites && invitations.length > 0 && (
              <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
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
            <div className="flex flex-col items-center py-10 text-center">
              <Mail size={28} className="text-slate-200" />
              <p className="mt-2 text-sm font-medium text-slate-500">No pending invitations</p>
              <p className="mt-0.5 text-xs text-slate-400">Invite a team member to get started.</p>
            </div>
          )}

          {invitations.map((inv) => (
            <div key={inv.invitation_id} className="flex items-center justify-between gap-4 px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                  {inv.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{inv.email}</p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock size={10} />
                    Expires {new Date(inv.expires_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
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
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                >
                  {revoking && revokingId === inv.invitation_id
                    ? <Loader2 size={11} className="animate-spin" />
                    : <Trash2 size={11} />}
                  Revoke
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role legend */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Role permissions</p>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { role: "admin", desc: "Full access — configure, invite, manage billing and settings" },
            { role: "manager", desc: "Dashboard, recommendations, exports, and agent queries" },
            { role: "analyst", desc: "Entity profiles, recommendations, and read-only agent" },
            { role: "viewer", desc: "Dashboard and report visibility only" },
          ].map(({ role, desc }) => {
            const meta = ROLE_META[role];
            const Icon = meta.icon;
            return (
              <div key={role} className="rounded-lg bg-white p-3 border border-slate-200">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-md ${meta.color}`}>
                    <Icon size={11} />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 capitalize">{meta.label}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-500">{desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {deleteConfirmModal}
    </div>
  );
}
