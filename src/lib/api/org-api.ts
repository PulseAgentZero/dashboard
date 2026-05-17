import { api } from "./client";
import type { OrgProfile, UpdateOrgRequest } from "@/types/org";

export const orgApi = {
  get: () => api.get<OrgProfile>("/organization"),
  update: (body: UpdateOrgRequest) => api.put<OrgProfile>("/organization", body),
};
