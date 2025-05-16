const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * A generic POST helper function with type-safe response.
 * @param path API path (e.g. /doctors/book)
 * @param data Request payload
 * @returns Parsed response as type T
 */
export async function apiPost<T>(path: string, data: unknown): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const result: T = await response.json();
  return result;
}
