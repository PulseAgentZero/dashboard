import { api } from "./client";
import { uploadMultipart } from "./upload";
import type { AssetUploadResponse, OrgProfile, UpdateOrgRequest } from "@/types/org";

export const orgApi = {
  get: () => api.get<OrgProfile>("/organization"),
  update: (body: UpdateOrgRequest) => api.put<OrgProfile>("/organization", body),
  uploadAsset: (file: File, category: "logo" | "profile" | "data" | "csv" | "attachment") => {
    const fd = new FormData();
    fd.append("category", category);
    fd.append("file", file);
    return uploadMultipart<AssetUploadResponse>("/organization/assets/upload", fd);
  },
};
