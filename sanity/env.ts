function assertValue<T>(value: T | undefined, message: string): T {
  if (value === undefined || value === "") {
    throw new Error(message);
  }
  return value;
}

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing NEXT_PUBLIC_SANITY_PROJECT_ID — copy .env.example to .env.local and add your Sanity project ID.",
);

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export const apiVersion = "2026-01-01";

// Read token (Viewer role). Server-only — lets draft mode read unpublished content.
export const readToken = process.env.SANITY_API_READ_TOKEN;
