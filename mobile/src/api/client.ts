import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "reliefmesh_session_token";

// Set at build time via app.json's extra.apiUrl, or override with
// EXPO_PUBLIC_API_URL in a local .env for pointing at a dev server instead
// of the deployed site.
const API_URL: string =
  process.env.EXPO_PUBLIC_API_URL ??
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ??
  "https://reliefmesh-theta.vercel.app";

export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

/**
 * Thin wrapper around fetch that talks to the existing ReliefMesh Next.js
 * backend — the same API the web app's own client code calls. No second
 * backend; this just adds the Authorization header a native client needs
 * in place of the browser cookie the web app relies on.
 */
export async function apiRequest<T>(
  path: string,
  options: { method?: string; body?: unknown } = {}
): Promise<T> {
  const token = await getToken();

  const res = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  // Every route in this backend returns JSON, success or error, so this is
  // safe even for non-2xx responses — the error message/details live in
  // the body, not just the status code.
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      (data as { error?: string }).error ?? `Request failed (${res.status})`,
      res.status,
      (data as { details?: unknown }).details
    );
  }

  return data as T;
}
