import { Image } from "next-sanity/image";
import { PortableText } from "next-sanity";
import { RevealItem } from "@/components/motion/Reveal";
import ReadMore from "@/components/ui/ReadMore";
import type { DoctorsQueryResult } from "@/sanity.types";

export type Doctor = Omit<DoctorsQueryResult[number], "name"> & { name: string };

function initials(name: string) {
  // Skip a leading "Dr." — otherwise every doctor's initials would start with "D".
  const parts = name
    .replace(/^dr\.?\s+/i, "")
    .trim()
    .split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "")).toUpperCase();
}

// Editors often leave trailing empty lines in a bio, which would render as blank gaps.
function withoutEmptyBlocks(bio: NonNullable<Doctor["bio"]>) {
  return bio.filter((block) => block._type !== "block" || block.children?.some((child) => child.text?.trim()));
}

// One row of the /team page: photo on one side, details on the other. `reverse` flips the sides
// on desktop so consecutive rows alternate; on mobile the photo always sits on top.
export default function DoctorRow({ doctor, reverse }: { doctor: Doctor; reverse: boolean }) {
  const subtitle = [doctor.qualifications?.trim(), doctor.specialisation?.trim()].filter(Boolean).join(" · ");
  const bio = doctor.bio ? withoutEmptyBlocks(doctor.bio) : [];

  return (
    <RevealItem
      className={`flex flex-col gap-8 md:items-center md:gap-14 ${reverse ? "md:flex-row-reverse" : "md:flex-row"}`}
    >
      <div className="w-full md:w-2/5 md:shrink-0">
        <div className="aspect-[4/5] w-full overflow-hidden rounded-card bg-primary/10">
          {doctor.photo?.url && doctor.photo.width && doctor.photo.height ? (
            <Image
              src={doctor.photo.url}
              alt={doctor.photo.alt ?? doctor.name}
              width={doctor.photo.width}
              height={doctor.photo.height}
              sizes="(min-width: 768px) 40vw, 100vw"
              className="size-full object-cover"
            />
          ) : (
            // No photo uploaded yet — initials rather than a blank/broken image.
            <div className="flex size-full items-center justify-center">
              <span className="flex size-28 items-center justify-center rounded-full bg-primary/15 font-display text-4xl font-semibold text-primary-text">
                {initials(doctor.name)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="md:w-3/5">
        <h2 className="text-3xl font-semibold text-ink md:text-4xl">{doctor.name}</h2>
        {subtitle && <p className="mt-2 text-base font-medium text-primary-text">{subtitle}</p>}
        {doctor.registrationNumber && <p className="mt-1 text-sm text-muted">Reg. No. {doctor.registrationNumber}</p>}
        {bio.length > 0 && (
          <div className="mt-5 leading-relaxed text-muted">
            <ReadMore clampClassName="line-clamp-6">
              <div className="space-y-4">
                <PortableText value={bio} />
              </div>
            </ReadMore>
          </div>
        )}
      </div>
    </RevealItem>
  );
}
