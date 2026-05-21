export function getApiBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://localhost:8000"
  );
}

export function getPublicRedocUrl(): string {
  return `${getApiBaseUrl()}/api/public/redoc`;
}

export function getPublicOpenApiUrl(): string {
  return `${getApiBaseUrl()}/api/public/openapi.json`;
}
