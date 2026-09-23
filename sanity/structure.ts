import type { StructureResolver } from "sanity/structure";
import { singletonTypes } from "./schemaTypes";

// Sidebar layout for staff: the two one-off documents first, then everything else.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Website content")
    .items([
      S.listItem()
        .title("Clinic details & settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.listItem()
        .title("Home page")
        .id("homePage")
        .child(S.document().schemaType("homePage").documentId("homePage")),
      S.listItem()
        .title("Recommendations page")
        .id("recommendationsPage")
        .child(S.document().schemaType("recommendationsPage").documentId("recommendationsPage")),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => !singletonTypes.includes(item.getId() ?? "")),
    ]);
