import { defineCliConfig } from "sanity/cli";

// Used by the Sanity CLI (dataset import, typegen, deploy). Reads .env.local via `sanity` itself.
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  },
});
