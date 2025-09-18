'use client';

import ProjectCard from "@/components/ProjectCard";
import React from "react";
import { motion } from "framer-motion";
import {
  Github,
  Mail,
  Globe,
  Linkedin,
  CalendarDays,
  Code2,
  Star,
  ExternalLink,
  MapPin,
  Link as LinkIcon,
  Award,
  Briefcase,
  Sparkles,
  Apple,
} from "lucide-react";

/* ---------- Branding ---------- */
const SITE_NAME = "SamJoorNetwork";

/* ---------- Profile Data ---------- */
const profile = {
  name: "Sam Joor",
  headline: "Full-Stack Developer • Cybersecurity Entusiast ",
  location: "Boston, MA",
  avatarInitials: "SJ",
  about:
    "I love learning especially when its cybersecurity/computer related... 💻🤓💻",
  badges: [
    { icon: Apple, label: "Student" },
    { icon: Briefcase, label: "Unemployed" },
  ],
  links: [
    { icon: Github, label: "GitHub", href: "https://github.com/SamJoor?tab=repositories" },
    { icon: Globe, label: "Website", href: "https://example.com" },
    { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/samjoor/" },
    { icon: Mail, label: "skjoor@quinnipiac.edu", href: "mailto:skjoor@quinnipiac.edu" },
  ],
};


/* ---------- Projects ---------- */
const featuredProject = {
  title: "Automated Windows Sandbox (WIP) ",
  role: "VirtualBox • Sysmon/Procmon/Wireshark • Powershell",
  date: "2025",
  blurb:
    "A fully automated malware analysis sandbox on VirtualBox that uses tools such as WireShark, Procmon and Sysmon. With just one command, it boots a Windows VM, executes, and gathers logs from Sysmon, Procmon, and Wireshark. Results are returned to the host machine to allow for reverse-engineering and forensic analysis.",
  tags: ["VirtualBox", "Powershell automation", "Sysmon + Procmon", "Wireshark"],
  highlights: [
    "One-command automation: spin up, execute, and collect logs",
    "Host stored results for analysis",
    "Built for malware detonation and reverse-engineering,",
    "Centralized log collection"
  ],
  links: [
    { label: "Repo", href: "https://github.com/your/repo" },
    { label: "Live", href: "https://your-live-site.com" },
  ],
  progress: 30, 
  status: "Debugging automation errors", 
};

/* ---------- Reusable UI ---------- */
const Card = ({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) => (
  <div className={`card ${className}`}>{children}</div>
);

const SectionTitle = ({
  icon: Icon,
  children,
}: {
  icon: any;
  children: React.ReactNode;
}) => (
  <div className="section-title">
    <Icon className="size-4" />
    <span>{children}</span>
  </div>
);

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="pill">{children}</span>
);

const LinkButton = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <a href={href} className="btn">
    {children}
  </a>
);

/* ---------- Page ---------- */
export default function DevLinkd() {
  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="container-page py-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left column */}
        <div className="lg:col-span-3 space-y-6">
          <ProfileCard />
          <BadgesCard />
        </div>

        {/* Middle column */}
        <div className="lg:col-span-6 space-y-6">
          <IntroPost />
          <ProjectsFeed />
        </div>

        {/* Right column */}
        <div className="lg:col-span-3 space-y-6">
          <ContactCard />
          <QuickLinks />
        </div>
      </main>
      <Footer />
    </div>
  );
}

/* ---------- Top Navigation ---------- */
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, User, Code2 as CodeIcon } from "lucide-react";

function TopNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close sheet on route change
  useEffect(() => { if (open) setOpen(false); }, [pathname]);

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Close when clicking outside the panel
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!open) return;
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div className={`sticky top-0 z-50 border-b border-zinc-200 bg-white/70 backdrop-blur ${open ? "shadow-sm" : ""}`}>
      <div className="container-page h-14 flex items-center justify-between gap-2">
        {/* Logo + site name */}
        <div className="flex items-center gap-2 min-w-0">
          <LogoSJ className="h-7 w-7 shrink-0" />
          <Link href="/" className="font-bold tracking-tight truncate">
            {SITE_NAME}
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink href="/" label="Home" icon={User} />
          <NavLink href="/projects" label="Projects" icon={CodeIcon} />
          <NavLink href="/aboutme" label="About me" icon={User} />
        </nav>

        {/* Desktop actions (with playful hover) */}
        <div className="hidden md:flex items-center gap-2">
          <a
            href="/SamJoorResume.pdf"
            download
            className="btn transform transition duration-200 ease-out hover:scale-110 hover:-rotate-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300"
          >
            Download Resume
          </a>
          <a
            href="mailto:skjoor@quinnipiac.edu"
            className="btn-primary transform transition duration-200 ease-out hover:scale-110 hover:rotate-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
          >
            Connect
          </a>
        </div>

        {/* Hamburger (mobile) */}
        <button
          className="md:hidden inline-flex items-center justify-center p-2 rounded-lg border border-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(s => !s)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile sheet */}
      {open && (
        <div
          id="mobile-menu"
          ref={panelRef}
          className="md:hidden z-[60] border-t border-zinc-200 bg-white/95 backdrop-blur-sm"
        >
          <div className="container-page py-3 flex flex-col gap-2">
            {/* Internal links — same hover effects for consistency */}
            <Link href="/" className="btn transform transition duration-200 ease-out hover:scale-110 hover:-rotate-2">
              Home
            </Link>
            <Link href="/projects" className="btn transform transition duration-200 ease-out hover:scale-110 hover:rotate-2">
              Projects
            </Link>
            <Link href="/aboutme" className="btn transform transition duration-200 ease-out hover:scale-110 hover:-rotate-2">
              About me
            </Link>

            <div className="mt-2 h-px bg-zinc-200" />

            {/* Actions on mobile (same vibe) */}
            <a
              href="/SamJoorResume.pdf"
              download
              className="btn transform transition duration-200 ease-out hover:scale-110 hover:-rotate-2"
            >
              Download Resume
            </a>
            <a
              href="mailto:skjoor@quinnipiac.edu"
              className="btn-primary text-center transform transition duration-200 ease-out hover:scale-110 hover:rotate-2"
            >
              Connect
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon?: any;
}) {
  return (
    <Link
      href={href}
      className="btn transform transition duration-200 ease-out hover:scale-110 hover:-rotate-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300"
    >
      {Icon ? <Icon className="size-4" /> : null} {label}
    </Link>
  );
}

/* ---------- Left Column ---------- */
function ProfileCard() {
  return (
    <Card className="overflow-hidden">
      {/* Banner with name inside */}
      <div className="relative h-28 md:h-32 bg-gradient-to-r from-blue-600 to-indigo-500">
        <div className="absolute inset-x-4 md:inset-x-6 bottom-3 text-white">
          <h1 className="text-xl md:text-2xl font-semibold leading-tight">Sam Joor</h1>
          <p className="text-xs md:text-sm/5 opacity-95">
            Full-Stack Developer • Data Science • Cybersecurity
          </p>
          <p className="text-[11px] md:text-xs opacity-90 mt-0.5 flex items-center gap-1">
            <MapPin className="size-3" /> New Haven, CT
          </p>
        </div>
      </div>

      {/* Body: avatar + chips */}
      <div className="p-4 md:p-5 flex items-start gap-3 md:gap-4">
        <div className="size-16 md:size-20 rounded-xl bg-zinc-200 border border-white shadow-md flex items-center justify-center text-lg md:text-2xl font-bold text-zinc-700">
          SJ
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap gap-2">
            <Pill>Looking For Work👨‍💻💼🙏</Pill>
          </div>
        </div>
      </div>
    </Card>
  );
}


function BadgesCard() {
  return (
    <Card className="p-4">
      <SectionTitle icon={Star}>Badges</SectionTitle>
      <div className="mt-3 flex flex-wrap gap-2">
        {profile.badges.map((b, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-amber-50 border border-amber-200"
          >
            <b.icon className="size-3" /> {b.label}
          </span>
        ))}
      </div>
    </Card>
  );
}

/* ---------- Middle Column ---------- */
function IntroPost() {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2">
        <div className="size-10 rounded-full bg-zinc-200 flex items-center justify-center font-semibold">
          {profile.avatarInitials}
        </div>
        <div>
          <div className="text-sm font-semibold">{profile.name}</div>
          <div className="text-xs text-zinc-500">{profile.headline}</div>
        </div>
      </div>
      <div className="mt-3 text-sm leading-relaxed">
        Hey everyone 👋, I turned my resume into a LinkedIn-style feed to list my
        projects and introduce myself in a way that hopefully feels a little more 
        engaging then reading a piece of paper 😄.
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {"JavaScript Typescript Next.js Tailwind Framer Motion Python SQL PowerShell"
          .split(" ")
          .map((t) => (
            <Pill key={t}>{t}</Pill>
          ))}
      </div>
    </Card>
  );
}

function ProgressBar({
  value,
  label,
}: {
  value: number; // 0..100
  label?: string;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const color =
    pct < 34 ? "bg-blue-500" : pct < 67 ? "bg-turqoise-500" : "bg-emerald-500";

  return (
    <div
      className="mt-4 select-none"
      role="progressbar"
      aria-label={label ?? "Project progress"}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      title={`${pct}% complete`}
    >
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200">
        <div className={`h-2 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1 flex items-center justify-between text-[10px] text-zinc-500">
        <span>{pct < 100 ? "In progress" : "Complete"}</span>
        <span className="tabular-nums">{pct}%</span>
      </div>
    </div>
  );
}

function ProjectsFeed() {
  const p = featuredProject;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        ⬇️ ✨My favorite project at the moment✨ ⬇️
      </h2>

      <Card className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm text-zinc-500 flex items-center gap-2">
              <CalendarDays className="size-4" /> {p.date}
            </div>
            <h3 className="text-lg font-semibold mt-1">{p.title}</h3>
            <div className="text-sm text-zinc-600">{p.role}</div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {p.links?.map((l, i) => (
              <LinkButton key={i} href={l.href}>
                {l.label}
              </LinkButton>
            ))}
          </div>
        </div>

        <p className="text-sm text-zinc-700 mt-3 leading-relaxed">{p.blurb}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <Pill key={t}>{t}</Pill>
          ))}
        </div>

        {p.highlights?.length ? (
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 list-disc list-inside text-sm text-zinc-700">
            {p.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        ) : null}

        {/* NEW: status + progress */}
        {typeof p.progress === "number" || p.status ? (
          <div className="mt-2">
            {p.status ? (
              <p className="text-xs text-zinc-500">
                <span className="font-medium">Current status:</span> {p.status}
              </p>
            ) : null}
            {typeof p.progress === "number" ? (
              <ProgressBar value={p.progress} label="Automated Windows Sandbox progress" />
            ) : null}
          </div>
        ) : null}
      </Card>

      {/* keep your CTA if you had one here */}
      <div>
        <a href="/projects" className="btn">See all projects →</a>
      </div>
    </div>
  );
}



/* ---------- Right Column ---------- */
function ContactCard() {
  return (
    <Card className="p-4">
      <SectionTitle icon={Mail}>Contact</SectionTitle>
      <div className="mt-3 flex flex-col gap-2">
        {profile.links.map((l, i) => (
          <a
            key={i}
            href={l.href}
            target="_blank"                // 👈 opens in new tab
            rel="noopener noreferrer"     // 👈 security best practice
            className="w-full inline-flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-zinc-200 hover:bg-zinc-50"
          >
            <span className="inline-flex items-center gap-2 text-sm">
              <l.icon className="size-4" /> {l.label}
            </span>
            <ExternalLink className="size-4" />
          </a>
        ))}
      </div>
    </Card>
  );
}

function QuickLinks() {
  return (
    <Card className="p-4">
      <SectionTitle icon={LinkIcon}>Quick links</SectionTitle>
      <ul className="mt-3 text-sm leading-7">
        <li><a className="hover:underline" href="/SamJoorResume.pdf" target="_blank" rel="noopener noreferrer">Resume.pdf</a></li>
      </ul>
    </Card>
  );
}


/* ---------- Footer ---------- */
function Footer() {
  return (
    <div className="py-10">
      <div className="container-page text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <LogoSJ className="h-6 w-6" />
          <span>
            {SITE_NAME} — a LinkedIn-style portfolio parody. Built with love and caffeine.
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Logo ---------- */
function LogoSJ({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#2563EB"/>
      {/* S curve */}
      <path
        d="M42 20c-3-3-7-4-11-4-6 0-11 3-11 8 0 9 18 6 18 13 0 4-4 6-9 6-4 0-8-1-11-4"
        stroke="white"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* J curve */}
      <path
        d="M45 20v18c0 7-4 10-10 10-3 0-6-1-8-3"
        stroke="white"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------- Info Icon ---------- */
function InfoIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-4" {...props}>
      <path
        d="M12 22C17.5 22 22 17.5 22 12S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M11 10h2v7h-2v-7Z" fill="currentColor" />
      <path d="M11 7h2v2h-2V7Z" fill="currentColor" />
    </svg>
  );
}


