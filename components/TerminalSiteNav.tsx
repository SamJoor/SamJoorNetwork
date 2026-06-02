"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Egg, FolderKanban, Github, Linkedin, Swords, UserRound } from "lucide-react";
import { LogoSJ } from "./DevLinkd";

const links = [
  { label: "About", href: "/aboutme", icon: UserRound },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "GitHub", href: "https://github.com/SamJoor?tab=repositories", icon: Github, external: true },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/samjoor/", icon: Linkedin, external: true },
  { label: "Chess", href: "/chess", icon: Swords },
  { label: "Easter Eggs", href: "/egg-hunt", icon: Egg },
];

export default function TerminalSiteNav() {
  const pathname = usePathname();

  return (
    <header className="terminal-site-nav">
      <Link href="/" className="terminal-site-brand" aria-label="SamJoor.com terminal">
        <LogoSJ className="sj-logo-mark" />
        <strong>SamJoor<span>.com</span></strong>
      </Link>
      <nav>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={!link.external && pathname === link.href ? "is-active" : undefined}
              aria-current={!link.external && pathname === link.href ? "page" : undefined}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
            >
              {Icon ? <Icon className="size-4" aria-hidden="true" /> : null}
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
