/**
 * @file lib/backendUrl.js
 * @description Safe backend API URL resolver for Next.js server-side and client-side code.
 * Ensures that production deployments NEVER fall back to localhost or 127.0.0.1.
 */

export function getBackendUrl() {
  const envUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.BACKEND_API_URL ||
    process.env.API_URL;

  if (envUrl && typeof envUrl === "string" && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, "");
  }

  // During local development, allow local Express port
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:5000/api";
  }

  // In production, return empty string so API routes immediately return informative 503
  // rather than hanging and crashing trying to connect to a non-existent localhost.
  return "";
}

export function missingBackendResponse() {
  return Response.json(
    {
      success: false,
      error:
        "Backend API URL is not configured. Please set NEXT_PUBLIC_API_URL in your deployment environment variables",
    },
    { status: 503 },
  );
}
