export function getApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  const base = url !== undefined ? url : "http://localhost:8000";
  return base.replace(/\/$/, "");
}

export function getPublicRedocUrl(): string {
  return `${getApiBaseUrl()}/api/public/redoc`;
}

export function getPublicOpenApiUrl(): string {
  return `${getApiBaseUrl()}/api/public/openapi.json`;
}
