import Logo from "~/components/Logo";
import { Globe } from "lucide-react";
import GithubIcon from "../icons/GitHubIcon";
import XIcon from "../icons/XIcon";
import LinkedInIcon from "../icons/LinkedInIcon";

const SOCIAL_LINKS = {
  portfolio: "https://math-to-dev.vercel.app/",
  github: "https://github.com/KeepSerene",
  twitter: "https://x.com/UsualLearner",
  linkedin: "https://www.linkedin.com/in/dhrubajyoti-bhattacharjee-320822318/",
} as const;

interface SocialLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const socialLinks: SocialLink[] = [
  {
    label: "Portfolio",
    href: SOCIAL_LINKS.portfolio,
    icon: <Globe className="size-4" />,
  },
  {
    label: "GitHub",
    href: SOCIAL_LINKS.github,
    icon: <GithubIcon className="size-4" />,
  },
  {
    label: "X / Twitter",
    href: SOCIAL_LINKS.twitter,
    icon: <XIcon className="size-4" />,
  },
  {
    label: "LinkedIn",
    href: SOCIAL_LINKS.linkedin,
    icon: <LinkedInIcon className="size-4" />,
  },
];

const Footer = () => (
  <footer className="bg-[#0d0d0e]">
    {/* Top border accent */}
    <div
      aria-hidden="true"
      className="h-px w-full"
      style={{
        backgroundImage:
          "linear-gradient(to right, transparent, oklch(0.6716 0.1368 48.5130 / 0.35), transparent)",
      }}
    />

    <div className="mx-auto max-w-6xl px-6 py-14 text-center">
      <div className="flex flex-col items-center gap-8 text-center">
        {/* Logo */}
        <Logo size={30} className="text-primary" />

        {/* Tagline */}
        <p className="max-w-xs text-sm leading-relaxed text-white/35">
          A distraction-free environment for visual builders. Focus on the
          craft.
        </p>

        {/* Social icons */}
        <nav aria-label="Social links">
          <ul className="flex items-center gap-2" role="list">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  title={link.label}
                  className="flex size-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/4 text-white/40 transition-all duration-150 hover:border-white/14 hover:bg-white/8 hover:text-white/75 focus-visible:border-white/14 focus-visible:bg-white/8 focus-visible:text-white/75 focus-visible:outline-none"
                >
                  {link.icon}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Divider */}
        <div className="h-px w-full max-w-xs bg-white/6" />

        {/* Developer credit */}
        <p className="text-xs text-white/25">
          Designed &amp; developed by{" "}
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-white/40 underline-offset-2 transition-colors hover:text-white/60 hover:underline focus-visible:text-white/60 focus-visible:underline focus-visible:outline-none"
          >
            KeepSerene
          </a>
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
