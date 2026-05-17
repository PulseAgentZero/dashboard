import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usersApi } from "@/lib/api/users-api";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: usersApi.list,
    staleTime: 30_000,
    retry: 1,
  });
}

export function useInvitations() {
  return useQuery({
    queryKey: ["users", "invitations"],
    queryFn: usersApi.invitations,
    staleTime: 30_000,
    retry: 1,
  });
}

export function useInviteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { email: string; role: string }) => usersApi.invite(body),
    onSuccess: (_, vars) => {
      void qc.invalidateQueries({ queryKey: ["users", "invitations"] });
      toast.success(`Invitation sent to ${vars.email}`);
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to send invitation";
      toast.error(msg);
    },
  });
}

export function useUpdateUserRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      usersApi.updateRole(userId, role),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["users"] });
      toast.success("Role updated");
    },
    onError: () => toast.error("Failed to update role"),
  });
}

export function useDeactivateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => usersApi.deactivate(userId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deactivated");
    },
    onError: () => toast.error("Failed to deactivate user"),
  });
}

export function useRevokeInvitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (invitationId: string) => usersApi.revokeInvitation(invitationId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["users", "invitations"] });
      toast.success("Invitation revoked");
    },
    onError: () => toast.error("Failed to revoke invitation"),
  });
}

export function useUpdateMe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { full_name?: string | null }) => usersApi.updateMe(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["auth", "me"] });
      toast.success("Profile updated");
    },
    onError: () => toast.error("Failed to update profile"),
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: (body: { current_password: string; new_password: string }) =>
      usersApi.updatePassword(body),
    onSuccess: () => toast.success("Password updated"),
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to update password";
      toast.error(msg);
    },
  });
}
