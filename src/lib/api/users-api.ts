import { api } from "./client";
import { uploadMultipart } from "./upload";
import type { OrgUser, InvitationsResponse } from "@/types/users";

export type UserProfileResponse = {
  id: string;
  email: string;
  full_name: string;
  profile_image_url: string | null;
};

export const usersApi = {
  list: () => api.get<OrgUser[]>("/users"),
  invitations: () => api.get<InvitationsResponse>("/users/invitations"),
  invite: (body: { email: string; role: string }) =>
    api.post<{ invitation_id: string; email: string; role: string; expires_at: string }>(
      "/users/invite",
      body,
    ),
  updateRole: (userId: string, role: string) =>
    api.patch<OrgUser>(`/users/${userId}/role`, { role }),
  deactivate: (userId: string) => api.delete<void>(`/users/${userId}`),
  revokeInvitation: (invitationId: string) =>
    api.delete<void>(`/users/invitations/${invitationId}`),
  updateMe: (body: { full_name?: string | null; avatar_url?: string | null }) =>
    api.put<UserProfileResponse>("/users/me", body),
  uploadAvatar: (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return uploadMultipart<UserProfileResponse>("/users/me/avatar", fd);
  },
  updatePassword: (body: { current_password: string; new_password: string }) =>
    api.put<void>("/users/me/password", body),
};
