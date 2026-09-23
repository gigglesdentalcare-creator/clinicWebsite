import { Link2 } from "lucide-react";
import type { ReactNode } from "react";
import { FacebookIcon, GoogleIcon, InstagramIcon, WhatsAppIcon } from "@/components/icons/SocialIcons";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { whatsappLink, type SiteInfo, type SocialLink } from "@/lib/site";

type IconComponent = (props: { size?: number; className?: string }) => ReactNode;
type SocialItem = { label: string; href: string; Icon: IconComponent };

const platformIcons: Record<SocialLink["platform"], IconComponent> = {
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
  // No brand glyph for these; a generic "link" icon, with the platform name as the label.
  LinkedIn: Link2,
  YouTube: Link2,
  X: Link2,
};

const platformOrder: SocialLink["platform"][] = ["Instagram", "Facebook", "YouTube", "X", "LinkedIn"];

// Google (the clinic's Maps listing) and WhatsApp are always available; the social profiles
// appear once their URLs are filled in under Studio → Clinic details → Social.
export function socialItems(info: SiteInfo): SocialItem[] {
  const profiles = [...info.socialLinks]
    .sort((a, b) => platformOrder.indexOf(a.platform) - platformOrder.indexOf(b.platform))
    .map((link) => ({ label: link.platform, href: link.url, Icon: platformIcons[link.platform] }));
  return [
    { label: "Google", href: info.mapsUrl, Icon: GoogleIcon },
    { label: "WhatsApp", href: whatsappLink(info.whatsapp), Icon: WhatsAppIcon },
    ...profiles,
  ];
}

const tones = {
  // On light/adaptive backgrounds (Contact page, home page).
  light: "bg-primary/10 text-primary-text group-hover:bg-primary group-hover:text-white",
  // On the fixed-dark footer.
  dark: "bg-white/10 text-white group-hover:bg-white group-hover:text-navy",
} as const;

const sizes = {
  sm: { button: "size-10", icon: 18 },
  lg: { button: "size-14 md:size-16", icon: 26 },
} as const;

/**
 * Round social icon buttons. They fade in one after another as they scroll into view, and zoom
 * in on hover/focus (the zoom sits on the inner link, so it doesn't fight the fade's transform).
 */
export default function SocialLinks({
  info,
  tone = "light",
  size = "sm",
  showLabels = false,
  className = "",
}: {
  info: SiteInfo;
  tone?: keyof typeof tones;
  size?: keyof typeof sizes;
  showLabels?: boolean;
  className?: string;
}) {
  const { button, icon } = sizes[size];
  return (
    <RevealGroup className={`flex flex-wrap gap-3 ${className}`}>
      {socialItems(info).map(({ label, href, Icon }) => (
        <RevealItem key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className="group flex flex-col items-center gap-2 text-sm font-medium text-muted"
          >
            <span
              className={`flex ${button} items-center justify-center rounded-full transition duration-300 ease-out group-hover:scale-115 group-focus-visible:scale-115 motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${tones[tone]}`}
            >
              <Icon size={icon} />
            </span>
            {showLabels && <span aria-hidden>{label}</span>}
          </a>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
