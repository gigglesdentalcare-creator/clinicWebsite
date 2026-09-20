// Cache tags shared by data fetching (tags each fetch by the document types it reads)
// and the revalidation webhook (expires the tag for the type that just changed).
export function tagFor(documentType: string) {
  return `sanity:${documentType}`;
}

export function tagsFor(...documentTypes: string[]) {
  return documentTypes.map(tagFor);
}
