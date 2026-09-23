import { Image } from "next-sanity/image";
import { PortableText } from "next-sanity";
import { RevealItem } from "@/components/motion/Reveal";
import type { DoctorsQueryResult } from "@/sanity.types";

export type Doctor = Omit<DoctorsQueryResult[number], "name"> & { name: string };

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase();
}

export default function DoctorCard({ doctor }: { doctor: Doctor }) {
  const subtitle = [doctor.qualifications, doctor.specialisation].filter(Boolean).join(" · ");

  return (
    <RevealItem className="flex h-full flex-col overflow-hidden rounded-card bg-primary/5">
      <div className="aspect-[4/3] w-full overflow-hidden bg-white">
        {doctor.photo?.url && doctor.photo.width && doctor.photo.height ? (
          <Image
            src={doctor.photo.url}
            alt={doctor.photo.alt ?? doctor.name}
            width={doctor.photo.width}
            height={doctor.photo.height}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="size-full object-cover"
          />
        ) : (
          // No photo uploaded yet — initials avatar rather than a blank/broken image.
          <div className="flex size-full items-center justify-center">
            <span className="flex size-20 items-center justify-center rounded-full bg-primary/15 font-display text-2xl font-semibold text-primary-text">
              {initials(doctor.name)}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-semibold text-ink">{doctor.name}</h3>
        {subtitle && <p className="mt-1 text-sm font-medium text-primary-text">{subtitle}</p>}
        {doctor.registrationNumber && (
          <p className="mt-1 text-xs text-muted">Reg. No. {doctor.registrationNumber}</p>
        )}
        {doctor.bio && doctor.bio.length > 0 && (
          <div className="mt-4 flex-1 space-y-3 text-sm leading-relaxed text-muted [&_p]:m-0">
            <PortableText value={doctor.bio} />
          </div>
        )}
      </div>
    </RevealItem>
  );
}
