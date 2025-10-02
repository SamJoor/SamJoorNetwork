// app/projects/page.tsx
import Link from "next/link";

export const metadata = { title: "Projects — SamJoorNetwork" };

// ⚠️ This list is ONLY for the Projects page.
// It does NOT affect your Home page.
const projects = [
  {
    title: "Store Page",
    date: "2025",
    blurb:
      "This is for my brand so its under lock and key while I get my trademark. It inlcudes a password page, SVG logo with motion, interactive store visuals.",
    tags: ["Next.js", "Tailwind", "Framer Motion", "TypeScript"],
    links: [
      { label: "Repo coming soon", href: "#" },
    ],
  },
  {
    title: "Automated Windows Sandbox ",
    date: "2025",
    blurb:
      "One-command malware detonation lab: start VM, run task, collect logs, archive artifacts to host.",
    tags: ["PowerShell", "VirtualBox", "Automation", "Security"],
    links: [{ label: "WIP", href: "#" }],
    },
    {
      title: "Portfolio Website",
      date: "2025",
      blurb: "Fun interactive way for me to dsiplay my expertise and enjoyment for coding and cybersecuirty",
      tags: ["Next.js", "Tailwind", "Vercel", "Git", "SQL", "Love", "/api", "/coffee"],
      links: [{ label: "You're already here!", href: "#" }],
  },
];

export default function ProjectsPage() {
  return (
    <div className="container-page py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Link href="/" className="btn">Home</Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <div key={i} className="card p-4 flex flex-col">
            <div className="text-sm text-zinc-500">{p.date}</div>
            <h2 className="text-lg font-semibold mt-1">{p.title}</h2>
            <p className="text-sm text-zinc-700 mt-3 leading-relaxed">{p.blurb}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span key={t} className="pill">{t}</span>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              {p.links?.map((l, k) => (
                <a
                  key={k}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
