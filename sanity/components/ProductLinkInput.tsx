"use client";

import { Button, Card, Flex, Stack, Text } from "@sanity/ui";
import { useCallback, useEffect, useRef, useState } from "react";
import { type ObjectInputProps, set, useClient } from "sanity";
import { apiVersion } from "../env";

type ProductValue = {
  link?: string;
  name?: string;
  image?: { asset?: { _ref?: string } };
};

type Status = { tone: "positive" | "caution" | "critical" | "primary"; message: string } | null;

// Studio form for one product in a category: the usual fields, plus a "Fetch title & photo"
// button that reads them from the pasted link (via app/api/product-details) and stores a copy
// of the photo in Sanity. It also runs by itself when a link is pasted into an empty product.
export default function ProductLinkInput(props: ObjectInputProps) {
  const { onChange, renderDefault } = props;
  const value = props.value as ProductValue | undefined;
  const client = useClient({ apiVersion });
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const autoFetchedLink = useRef<string | null>(null);

  const link = value?.link?.trim() ?? "";
  const hasName = Boolean(value?.name);
  const hasImage = Boolean(value?.image?.asset?._ref);
  const validLink = /^https?:\/\/\S+\.\S+/.test(link);

  // `overwrite`: the button replaces what's there; the automatic run only fills empty fields.
  const fetchDetails = useCallback(
    async (overwrite: boolean) => {
      setBusy(true);
      setStatus({ tone: "primary", message: "Reading the product page…" });
      try {
        const response = await fetch(`/api/product-details?url=${encodeURIComponent(link)}`);
        const details = (await response.json()) as { title?: string | null; imageUrl?: string | null; message?: string };
        if (!response.ok) throw new Error(details.message ?? "Couldn't read that page.");

        const patches = [];
        if (details.title && (overwrite || !hasName)) patches.push(set(details.title, ["name"]));

        let photoFailed = false;
        if (details.imageUrl && (overwrite || !hasImage)) {
          setStatus({ tone: "primary", message: "Saving the photo…" });
          const imageResponse = await fetch(`/api/product-details/image?url=${encodeURIComponent(details.imageUrl)}`);
          if (imageResponse.ok) {
            const blob = await imageResponse.blob();
            const asset = await client.assets.upload("image", blob, {
              filename: `${(details.title ?? "product").slice(0, 60)}.${blob.type.split("/")[1] ?? "jpg"}`,
              source: { id: link, name: "product-link", url: link },
            });
            patches.push(set({ _type: "image", asset: { _type: "reference", _ref: asset._id } }, ["image"]));
          } else {
            photoFailed = true;
          }
        }

        if (patches.length) onChange(patches);
        const missing = [!details.title && "name", (!details.imageUrl || photoFailed) && "photo"].filter(Boolean);
        setStatus(
          missing.length
            ? { tone: "caution", message: `Couldn't find the ${missing.join(" or ")} — please add it by hand.` }
            : { tone: "positive", message: "Name and photo filled in from the link. Feel free to shorten the name." },
        );
      } catch (error) {
        setStatus({
          tone: "critical",
          message: `${error instanceof Error ? error.message : "Something went wrong."} You can still add the name and photo by hand.`,
        });
      } finally {
        setBusy(false);
      }
    },
    [client, hasImage, hasName, link, onChange],
  );

  // Fill in a freshly pasted link once, after typing pauses.
  useEffect(() => {
    if (!validLink || hasName || hasImage || busy || autoFetchedLink.current === link) return;
    const timer = setTimeout(() => {
      autoFetchedLink.current = link;
      void fetchDetails(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [busy, fetchDetails, hasImage, hasName, link, validLink]);

  return (
    <Stack gap={4}>
      {renderDefault(props)}
      <Flex align="center" gap={3} wrap="wrap">
        <Button
          text={busy ? "Fetching…" : "Fetch title & photo from link"}
          mode="ghost"
          tone="primary"
          disabled={!validLink || busy || props.readOnly === true}
          loading={busy}
          onClick={() => void fetchDetails(true)}
        />
      </Flex>
      {status && (
        <Card padding={3} radius={2} tone={status.tone} border>
          <Text size={1}>{status.message}</Text>
        </Card>
      )}
    </Stack>
  );
}
