// src/config/env.ts
export const ENV = {
  API_BASE: process.env.NEXT_PUBLIC_API_BASE ?? "",
  SUPPORT_EMAIL: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "",
};

if (!ENV.API_BASE) {
  // Soft warn during dev; avoid crashing prod build
  // eslint-disable-next-line no-console
  console.warn("[env] NEXT_PUBLIC_API_BASE is not set");
}
