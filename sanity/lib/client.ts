import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  // Enables click-to-edit overlays when the site is opened inside Studio's Presentation tool.
  stega: { studioUrl: "/studio" },
});
