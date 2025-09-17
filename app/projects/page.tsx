// app/projects/page.tsx
import Link from "next/link";

export const metadata = { title: "Projects — SamJoorNetwork" };

// ⚠️ This list is ONLY for the Projects page.
// It does NOT affect your Home page.
const projects = [
  {
    title: "ABSTRXT — Animated Portfolio + Store",
    role: "Next.js • Tailwind • Framer Motion",
    date: "2025",
    blurb:
      "Interactive, blob-driven navbar with password gate, SVG logo pieces as motion components, and Vercel deploy.",
    tags: ["Next.js", "Tailwind", "Framer Motion", "TypeScript"],
    links: [
      { label: "Repo", href: "#" },
      { label: "Live", href: "#" },
    ],
  },
  {
    title: "Win Sandbox Orchestrator",
    role: "PowerShell • VirtualBox • Sysmon/Procmon",
    date: "2025",
    blurb:
      "One-command malware detonation lab: start VM, run task, collect logs, archive artifacts to host.",
    tags: ["PowerShell", "VirtualBox", "Automation", "Security"],
    links: [{ label: "Docs", href: "#" }],
  },
  {
    title: "Solana Analytics Mini-Site",
    role: "Next.js • RPC • Charts",
    date: "2025",
    blurb:
      "Token dashboard with price, volume, holders, whale alerts, and wallet drill-downs.",
    tags: ["Next.js", "Charting", "ETL", "Solana"],
    links: [
      { label: "Repo", href: "#" },
      { label: "Live", href: "#" },
    ],
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
            <div className="text-sm text-zinc-600">{p.role}</div>
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
