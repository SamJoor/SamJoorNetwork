import Link from "next/link";
import { ArrowLeft, Github } from "lucide-react";
import ProjectFlipCard, { type ProjectCardData } from "@/components/ProjectFlipCard";
import TerminalSiteNav from "@/components/TerminalSiteNav";

export const metadata = { title: "Projects | SamJoor.com" };

const projects: ProjectCardData[] = [
  {
    title: "Data Science Capstone",
    date: "2026",
    blurb: "A Python modeling pipeline that cleans a dataset, trains scikit-learn models, saves model outputs, and generates evaluation plots.",
    tags: ["Python", "Data Science", "Modeling", "Analysis"],
    links: [{ label: "GitHub", href: "https://github.com/SamJoor/Data-Science-Capstone" }],
  },
  {
    title: "Chess Minigame",
    date: "2026",
    blurb: "Chess minigame vs AI opponent that learns each game.",
    tags: ["Next.js", "Chess.js", "AI", "Game Logic"],
    links: [
      { label: "Play", href: "/chess" },
      { label: "GitHub", href: "https://github.com/SamJoor/SamJoorNetwork" },
    ],
  },
  {
    title: "Python Projects",
    date: "2025",
    blurb: "A collection of Python coursework and experiments that show the programming side of the data science track.",
    tags: ["Python", "Scripting", "Coursework", "Problem Solving"],
    links: [{ label: "GitHub", href: "https://github.com/SamJoor/Python-Projects" }],
  },
  {
    title: "Java Projects",
    date: "2025",
    blurb: "Java class projects and practice work, useful as a clean Computer Science signal beside the web and Python work.",
    tags: ["Java", "Computer Science", "OOP", "Coursework"],
    links: [{ label: "GitHub", href: "https://github.com/SamJoor/Java-Projects" }],
  },
  {
    title: "QUPSC Website",
    date: "2025",
    blurb: "A club website for the Quinnipiac University Political Science Club, built as a real public-facing web project.",
    tags: ["TypeScript", "Web", "Club Site", "Vercel"],
    links: [
      { label: "Live", href: "https://qupsc-website.vercel.app" },
      { label: "GitHub", href: "https://github.com/SamJoor/QUPSC-Website" },
    ],
  },
  {
    title: "QUPDT Website",
    date: "2025",
    blurb: "A fraternity website project focused on clear information architecture, public presentation, and deployment.",
    tags: ["TypeScript", "Web", "Organization Site", "Vercel"],
    links: [
      { label: "Live", href: "https://qupd-twebsite.vercel.app" },
      { label: "GitHub", href: "https://github.com/SamJoor/QUPDTwebsite" },
    ],
  },
];

export default function ProjectsPage() {
  return (
    <main className="site-shell min-h-screen">
      <TerminalSiteNav />
      <div className="container-page site-fit-page projects-fit-page">
        <div className="projects-fit-header">
          <div>
            <Link href="/" className="btn btn-subtle">
              <ArrowLeft className="size-4" />
              Home
            </Link>
            <h1>Project lab</h1>
            <p>
              A working shelf of web apps, data projects, CS coursework, and
              small systems that became more useful than the assignment.
            </p>
          </div>
          <a href="https://github.com/SamJoor" target="_blank" rel="noopener noreferrer" className="btn btn-ink">
            <Github className="size-4" />
            GitHub profile
          </a>
        </div>

        <div className="projects-fit-grid">
          {projects.map((project) => (
            <ProjectFlipCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </main>
  );
}
