import { api } from "./client";
import { uploadMultipart } from "./upload";
import type {
  AssetUploadResponse,
  CompleteSetupResponse,
  MemberSettingsRequest,
  OrgProfile,
  UpdateOrgRequest,
} from "@/types/org";

export const orgApi = {
  get: () => api.get<OrgProfile>("/organization"),
  update: (body: UpdateOrgRequest) => api.put<OrgProfile>("/organization", body),
  patchMemberSettings: (body: MemberSettingsRequest) =>
    api.patch<OrgProfile>("/organization/member-settings", body),
  completeSetup: () => api.post<CompleteSetupResponse>("/organization/complete-setup", {}),
  uploadAsset: (file: File, category: "logo" | "profile" | "data" | "csv" | "attachment") => {
    const fd = new FormData();
    fd.append("category", category);
    fd.append("file", file);
    return uploadMultipart<AssetUploadResponse>("/organization/assets/upload", fd);
  },
};
