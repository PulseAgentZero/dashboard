import { api } from "./client";
import type {
  CompleteOnboardingResponse,
  IntrospectResponse,
  OnboardingConnectionRequest,
  OnboardingConnectionResponse,
  OnboardingContextRequest,
  SchemaMappingRequest,
} from "@/types/onboarding";

export const onboardingApi = {
  saveContext: (body: OnboardingContextRequest) =>
    api.put<{ message: string }>("/onboarding/context", body),

  saveConnection: (body: OnboardingConnectionRequest) =>
    api.post<OnboardingConnectionResponse>("/onboarding/connection", body),

  getSchema: () =>
    api.get<IntrospectResponse>("/onboarding/connection/schema"),

  saveSchemaMapping: (body: SchemaMappingRequest) =>
    api.post<{ schema_mapping: { id: string } }>("/onboarding/schema-mapping", body),

  complete: () =>
    api.post<CompleteOnboardingResponse>("/onboarding/complete", {}),
};
