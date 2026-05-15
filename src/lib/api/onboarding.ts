import { api } from "./client";
import type {
  CompleteOnboardingResponse,
  ConnectionPrefillResponse,
  IntrospectResponse,
  OnboardingConnectionRequest,
  OnboardingConnectionResponse,
  OnboardingContextRequest,
  OrgContextResponse,
  SchemaMappingPrefillResponse,
  SchemaMappingRequest,
} from "@/types/onboarding";

export const onboardingApi = {
  saveContext: (body: OnboardingContextRequest) =>
    api.put<{ message: string }>("/onboarding/context", body),

  getContext: () =>
    api.get<OrgContextResponse>("/organization"),

  saveConnection: (body: OnboardingConnectionRequest) =>
    api.post<OnboardingConnectionResponse>("/onboarding/connection", {
      ...body,
      connector_type: body.db_type,
    }),

  getConnection: () =>
    api.get<ConnectionPrefillResponse[]>("/connections"),

  getSchema: () =>
    api.get<IntrospectResponse>("/onboarding/connection/schema"),

  saveSchemaMapping: (body: SchemaMappingRequest) =>
    api.post<{ schema_mapping: { id: string } }>("/onboarding/schema-mapping", body),

  getSchemaMapping: () =>
    api.get<SchemaMappingPrefillResponse[]>("/schema-mappings"),

  complete: () =>
    api.post<CompleteOnboardingResponse>("/onboarding/complete", {}),
};
