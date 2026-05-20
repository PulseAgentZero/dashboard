import { api } from "./client";

export const securityApi = {
  patchOrgSecurity: (require_2fa: boolean) =>
    api.patch<{ require_2fa: boolean }>("/organization/security", { require_2fa }),

  requestOrgDeleteCode: () =>
    api.post<void>("/organization/delete/request-code", {}),

  confirmOrgDelete: (code: string) =>
    api.post<void>("/organization/delete/confirm", { code }),

  deleteMyAccount: (body: { password?: string; totp_code?: string }) =>
    api.delete<void>("/users/me", body),
};
