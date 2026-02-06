import type { ApiResponse } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

type ApiOptions = RequestInit & {
  query?: Record<string, string | number | boolean | undefined>;
};

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<ApiResponse<T>> {
  const url = new URL(path, API_BASE_URL || "http://localhost:3000");
  if (options.query) {
    Object.entries(options.query).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString(), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }

  const data = (await response.json()) as T;
  return { data, success: true };
}
