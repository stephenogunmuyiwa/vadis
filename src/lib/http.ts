// src/lib/http.ts
export class HttpError extends Error {
  status: number;
  body?: unknown;
  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

async function withTimeout<T>(p: Promise<T>, ms = 30000): Promise<T> {
  let t: NodeJS.Timeout;
  const timeout = new Promise<never>((_, reject) => {
    t = setTimeout(() => reject(new Error("Request timed out")), ms);
  });
  try {
    return await Promise.race([p, timeout]);
  } finally {
    clearTimeout(t!);
  }
}

export async function postMultipart<T = unknown>(
  url: string,
  form: FormData,
  init?: RequestInit
): Promise<T> {
  const res = await withTimeout(fetch(url, { method: "POST", body: form, ...init }));
  if (!res.ok) {
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      try {
        body = await res.text();
      } catch { /* ignore */ }
    }
    throw new HttpError(`HTTP ${res.status}`, res.status, body);
  }
  return (await res.json()) as T;
}
