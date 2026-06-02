import Link from "next/link";
import { ArrowLeft, Download, Github, Linkedin, Mail, MapPin } from "lucide-react";
import ProfilePhoto from "@/components/ProfilePhoto";
import TerminalSiteNav from "@/components/TerminalSiteNav";

export const metadata = {
  title: "About | SamJoor.com",
  description: "About Sam Joor",
};

const focusAreas = [
  "Thrive Wealth Management Systems & AI Integration Intern",
  "TRaViS ASM Cybersecurity / Software Intern",
  "Building web apps with Next.js and Tailwind",
  "Learning security workflows, VM automation, and forensic tooling",
  "Finishing my Master's in Cybersecurity at Quinnipiac University",
  "Turning class projects into useful, weird, and memorable demos",
];

const skills = [
  { name: "Python", level: 1 },
  { name: "JavaScript", level: 1 },
  { name: "TypeScript", level: 1 },
  { name: "HTML/CSS", level: 1 },
  { name: "Next.js", level: 1 },
  { name: "React", level: 1 },
  { name: "Tailwind CSS", level: 1 },
  { name: "Git", level: 2 },
  { name: "SQL", level: 2 },
  { name: "Supabase/Postgres", level: 1 },
  { name: "Vercel", level: 1 },
  { name: "R", level: 2 },
  { name: "Java", level: 2 },
  { name: "PowerShell", level: 2 },
  { name: "pandas", level: 2 },
  { name: "scikit-learn", level: 2 },
  { name: "Jupyter", level: 2 },
  { name: "Model Evaluation", level: 2 },
  { name: "Linux", level: 2 },
  { name: "VM Automation", level: 2 },
  { name: "matplotlib", level: 2 },
  { name: "Sysmon", level: 3 },
  { name: "joblib", level: 3 },
  { name: "Resend", level: 3 },
  { name: "Chess.js", level: 3 },
  { name: "VirtualBox", level: 1 },
  { name: "VS Code", level: 1 },
];

const masteryGroups = [
  { level: 1, label: "Strongest", items: skills.filter((skill) => skill.level === 1) },
  { level: 2, label: "Comfortable", items: skills.filter((skill) => skill.level === 2) },
  { level: 3, label: "Working On", items: skills.filter((skill) => skill.level === 3) },
];

export default function AboutPage() {
  return (
    <main className="site-shell about-page min-h-screen">
      <TerminalSiteNav />
      <div className="container-page site-fit-page about-fit-page">
        <Link href="/" className="about-home-link">
          <ArrowLeft className="size-4" />
          Home
        </Link>

        <section className="about-dossier">
          <div className="about-id">
            <ProfilePhoto />
            <div>
              <h1>Sam Joor</h1>
              <p className="about-location">
                <MapPin className="size-4" />
                Newburyport, MA
              </p>
              <div className="about-education">
                <p>B.S. Data Science</p>
                <p>Min. Economics</p>
                <p>Min. Computer Science</p>
              </div>
            </div>
          </div>

          <div className="about-main">
            <h2>
              Full Stack Developer With a Background in{" "}
              <span className="text-lime-400">Data Science</span> and{" "}
              <span className="text-lime-400">Cybersecurity</span>
            </h2>
            <p>
              I’m Sam Joor, a Data Science graduate from Quinnipiac University
              pursuing a master’s degree in Cybersecurity. My interests sit at
              the intersection of software, data, cybersecurity, and AI.
            </p>
            <p>
              I’ve worked on projects ranging from a behavior based malware
              detection capstone to full stack websites, alumni platforms, and
              AI workflow systems. I like building things that are useful,
              clean, and scalable, whether that means improving a process,
              organizing information, or turning an idea into a working
              product.
            </p>

            <div className="about-actions">
              <a href="/SAM_JOOR_RESUME.pdf" download="SAM_JOOR_RESUME.pdf" className="btn btn-primary">
                <Download className="size-4" />
                Download resume
              </a>
              <a href="mailto:skjoor@quinnipiac.edu" className="btn btn-ink">
                <Mail className="size-4" />
                Email
              </a>
              <a href="https://github.com/SamJoor" target="_blank" rel="noopener noreferrer" className="btn btn-subtle">
                <Github className="size-4" />
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/samjoor/" target="_blank" rel="noopener noreferrer" className="btn btn-subtle">
                <Linkedin className="size-4" />
                LinkedIn
              </a>
            </div>

            <div className="about-compact-grid">
              <div>
                <h3>Current Work</h3>
                <ul>
                  {focusAreas.slice(0, 5).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Toolbox</h3>
                <p className="mastery-key">Proficiency</p>
                <div className="mastery-menu-list">
                  {masteryGroups.map((group) => (
                    <details key={group.level} className={`mastery-menu mastery-${group.level}`}>
                      <summary>
                        <span>
                          <b>{group.level}</b>
                          {group.label}
                        </span>
                        <span className="mastery-count">{group.items.length}</span>
                      </summary>
                      <div className="about-skill-list">
                        {group.items.map((skill) => (
                          <span key={skill.name} className={`skill-chip mastery-chip mastery-${skill.level}`}>
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
