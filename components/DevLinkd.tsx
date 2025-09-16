'use client';

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
} from "lucide-react";

/* ---------- Branding ---------- */
const SITE_NAME = "SamJoorNetwork";

/* ---------- Profile Data ---------- */
const profile = {
  name: "Sam Joor",
  headline: "Full-Stack Developer • Data Science • Cybersecurity",
  location: "New Haven, CT",
  avatarInitials: "SJ",
  about:
    "I build fast, delightful web apps, data tools, and security automation. On a mission to ship, learn, and have fun.",
  badges: [
    { icon: Award, label: "Top 1% Debugger" },
    { icon: Sparkles, label: "Typescript Enjoyer" },
    { icon: Briefcase, label: "Open to Collab" },
  ],
  links: [
    { icon: Github, label: "GitHub", href: "https://github.com/" },
    { icon: Globe, label: "Website", href: "https://example.com" },
    { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/" },
    { icon: Mail, label: "Email", href: "mailto:you@example.com" },
  ],
};

/* ---------- Projects ---------- */
const projects = [
  {
    title: "ABSTRXT — Animated Portfolio + Store",
    role: "Next.js • Tailwind • Framer Motion",
    date: "2025",
    blurb:
      "Interactive, blob-driven navbar with password gate, SVG logo pieces as motion components, and Vercel deploy.",
    tags: ["Next.js", "Tailwind", "Framer Motion", "TypeScript"],
    highlights: [
      "Custom SVG motion components with drag physics",
      "Password-gated home with togglable protection",
      "Mobile-first design, 95+ Lighthouse",
    ],
    links: [
      { label: "Repo", href: "#", icon: Github },
      { label: "Live", href: "#", icon: ExternalLink },
    ],
  },
  {
    title: "Win Sandbox Orchestrator",
    role: "PowerShell • VirtualBox • Sysmon/Procmon",
    date: "2025",
    blurb:
      "One-command malware detonation lab: start VM, run task, collect logs, archive artifacts to host.",
    tags: ["PowerShell", "VirtualBox", "Automation", "Security"],
    highlights: [
      "Headless VM control via VBoxManage guestcontrol",
      "Scheduled task runner w/ SYSTEM privileges",
      "Log bundling & timestamped reports",
    ],
    links: [{ label: "Docs", href: "#", icon: LinkIcon }],
  },
  {
    title: "Solana Analytics Mini-Site",
    role: "Next.js • RPC • Charts",
    date: "2025",
    blurb:
      "Token dashboard with price, volume, holders, whale alerts, and wallet drill-downs.",
    tags: ["Next.js", "Charting", "ETL", "Solana"],
    highlights: [
      "Server actions for fresh on-demand RPCs",
      "CSV export + shareable deep links",
      "Zero-JS charts on static pages where possible",
    ],
    links: [
      { label: "Repo", href: "#", icon: Github },
      { label: "Live", href: "#", icon: ExternalLink },
    ],
  },
];

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
          <AboutCard />
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
function TopNav() {
  return (
    <div className="sticky top-0 z-50 border-b border-zinc-200 bg-white/70 backdrop-blur">
      <div className="container-page h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LogoSJ className="h-7 w-7" />
          <span className="font-bold tracking-tight">{SITE_NAME}</span>
        </div>

        <div className="hidden md:flex items-center gap-1">
          <NavButton icon={Code2} label="Projects" />
          <NavButton icon={Briefcase} label="Experience" />
          <NavButton icon={Star} label="Highlights" />
        </div>

        <div className="flex items-center gap-2">
          <a href="#" className="btn">Download Resume</a>
          <a href="#" className="btn-primary">Connect</a>
        </div>
      </div>
    </div>
  );
}

function NavButton({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <button className="btn">
      <Icon className="size-4" /> {label}
    </button>
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
            <Pill>Open to work</Pill>
            <Pill>Freelance</Pill>
            <Pill>Mentorship</Pill>
          </div>
        </div>
      </div>
    </Card>
  );
}

function AboutCard() {
  return (
    <Card className="p-4">
      <SectionTitle icon={InfoIcon}>About</SectionTitle>
      <p className="text-sm text-zinc-700 mt-2 leading-relaxed">{profile.about}</p>
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
        🚀 Shipping season. I turned my portfolio into a LinkedIn-style feed to list
        projects like “roles.” Open to fun collabs & code reviews — say hi!
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

function ProjectsFeed() {
  return (
    <div className="space-y-4">
      {projects.map((p, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
        >
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
                    <l.icon className="size-4" /> {l.label}
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

            <ul className="mt-3 grid gap-2 sm:grid-cols-2 list-disc list-inside text-sm text-zinc-700">
              {p.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </Card>
        </motion.div>
      ))}
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
        <li><a className="hover:underline" href="#">Resume.pdf</a></li>
        <li><a className="hover:underline" href="#">Key Projects</a></li>
        <li><a className="hover:underline" href="#">Speaking & Mentoring</a></li>
        <li><a className="hover:underline" href="#">Reading List</a></li>
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
