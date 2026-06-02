"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Code2,
  Egg,
  FileText,
  Github,
  Home,
  Linkedin,
  MonitorCog,
  Mail,
  MapPin,
  Menu,
  ShieldCheck,
  Swords,
  Terminal,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent } from "react";
import { usePathname } from "next/navigation";
import { markEggFound } from "@/lib/eggProgress";

type ActivitySource = "GitHub" | "LinkedIn";

type ActivityItem = {
  id: string;
  source: ActivitySource;
  title: string;
  text: string;
  meta: string;
  href: string;
};

type TerminalLine = {
  id: number;
  kind: "prompt" | "text" | "success" | "error" | "command" | "link";
  text: string;
  href?: string;
};

const fallbackActivities: ActivityItem[] = [
  {
    id: "github-fallback",
    source: "GitHub",
    title: "Loading GitHub activity",
    text: "Fetching the latest public events from GitHub.",
    meta: "Live / GitHub",
    href: "https://github.com/SamJoor?tab=repositories",
  },
];

const terminalCommands = [
  { command: "about", text: "Show info about Sam Joor" },
  { command: "projects", text: "List featured projects" },
  { command: "skills", text: "Display core skills" },
  { command: "experience", text: "Show work experience" },
  { command: "contact", text: "Get in touch" },
  { command: "github", text: "Open GitHub profile" },
  { command: "linkedin", text: "Open LinkedIn profile" },
  { command: "resume", text: "Download resume" },
  { command: "chess", text: "Open the chess lab" },
  { command: "egg", text: "Try your luck" },
  { command: "ls", text: "List site directories" },
  { command: "pwd", text: "Print working directory" },
  { command: "date", text: "Show current local time" },
  { command: "whoami", text: "Identify this terminal session" },
  { command: "open", text: "Open a route: open projects | chess | about" },
  { command: "clear", text: "Clear the terminal" },
];

const terminalCommandNames = terminalCommands.map((item) => item.command);

const projects = [
  {
    icon: MonitorCog,
    title: "Automated Windows Sandbox",
    text: "Automatically provisions, configures, tests, and cleans up isolated Windows environments.",
    tags: ["PowerShell", "Python", "VM", "Automation"],
    tone: "blue",
    href: "/projects",
  },
  {
    icon: BarChart3,
    title: "Stock Analyzer",
    text: "End-to-end data pipeline with technical indicators, ML models, and backtesting.",
    tags: ["Python", "Pandas", "Scikit-learn", "Streamlit"],
    tone: "green",
    href: "/projects",
  },
  {
    icon: Code2,
    title: "Portfolio Website",
    text: "A playful LinkedIn-style portfolio with hacker vibes and hidden surprises.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    tone: "coral",
    href: "/projects",
  },
];

export function LogoSJ({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <span className={`${className} inline-flex items-center justify-center font-mono font-black text-lime-400`}>
      SJ&gt;
    </span>
  );
}

export default function DevLinkd() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const syncScale = () => {
      const width = window.innerWidth;
      setScale(width >= 1024 && width < 1536 ? width / 1536 : 1);
    };

    syncScale();
    window.addEventListener("resize", syncScale);
    return () => window.removeEventListener("resize", syncScale);
  }, []);

  const shellStyle: CSSProperties = scale < 1 ? { minHeight: `${1120 * scale}px` } : {};
  const pageStyle: CSSProperties = scale < 1 ? { transform: `scale(${scale})` } : {};

  return (
    <div className="sj-scale-shell" style={shellStyle}>
      <div className="sj-page" style={pageStyle}>
        <TopNav />
        <div className="sj-layout sj-layout-home">
          <ProtocolRail />
          <ProfileRail />
          <main className="sj-main">
            <Hero />
            <ActivityFeed />
          </main>
        </div>
        <FeaturedProjects />
      </div>
    </div>
  );
}

function TopNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!open) return;
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <header className="sj-topbar">
      <Link href="/" className="sj-brand">
        <LogoSJ className="sj-logo-mark" />
        <strong>SamJoor<span>.com</span></strong>
      </Link>

      <nav className="sj-nav">
        <NavItem href="/aboutme" icon={UserRound} label="About" />
        <NavItem href="/projects" icon={Home} label="Projects" />
        <NavItem href="https://www.linkedin.com/in/samjoor/" icon={Linkedin} label="LinkedIn" external />
        <NavItem href="https://github.com/SamJoor?tab=repositories" icon={Github} label="GitHub" external />
        <NavItem href="/egg-hunt" icon={Egg} label="Easter Eggs" />
        <Link href="/chess">
          <Swords className="size-5" /> Chess
        </Link>
      </nav>

      <div className="sj-system">
        <span /> SYSTEM ONLINE
        <img className="sj-alien" src="/pixel-alien.png" alt="" aria-hidden="true" />
      </div>

      <button className="sj-menu" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {open ? (
        <div ref={menuRef} className="sj-mobile-menu">
          <Link href="/projects">Projects</Link>
          <a href="https://www.linkedin.com/in/samjoor/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://github.com/SamJoor?tab=repositories" target="_blank" rel="noopener noreferrer">GitHub</a>
          <Link href="/aboutme">About</Link>
          <Link href="/chess">Chess</Link>
          <Link href="/egg-hunt">Easter Eggs</Link>
          <a href="/SAM_JOOR_RESUME.pdf" download="SAM_JOOR_RESUME.pdf">Resume</a>
        </div>
      ) : null}
    </header>
  );
}

function NavItem({
  href,
  icon: Icon,
  label,
  external = false,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      <Icon className="size-5" />
      {label}
    </Link>
  );
}

function ProtocolRail() {
  return (
    <aside className="sj-protocol" aria-hidden="true">
      <div className="sj-dots">
        <span />
        <span />
        <span />
      </div>
      <div className="sj-dots sj-dots-blue">
        <span />
        <span />
        <span />
      </div>
      <p>SJ_PROTOCOL V1.0</p>
      <strong>[_]</strong>
    </aside>
  );
}

function ProfileRail() {
  return (
    <aside className="sj-profile">
      <div className="sj-avatar-wrap">
        <img src="/sam-profile.png" alt="Portrait of Sam Joor" />
      </div>
      <h1>Sam Joor</h1>
      <div className="sj-available"><span /> Available for work</div>

      <div className="sj-role">&gt; Full-stack developer</div>
      <ProfileItem icon={ShieldCheck} label="Cybersecurity" />
      <ProfileItem icon={BarChart3} label="Data Science" />
      <ProfileItem icon={Terminal} label="Automation" />
      <ProfileItem icon={Code2} label="Computer Science" />
      <ProfileItem icon={BarChart3} label="Economics" />

      <div className="sj-note">
        <p>
          I build secure, intelligent, and automated systems that solve real
          problems. I break things on purpose, learn constantly, and hide
          easter eggs everywhere.
        </p>
      </div>

      <div className="sj-location">
        <p><MapPin className="size-4" /> Newburyport, MA</p>
        <p><span className="sj-clock" /> EDT (UTC-4)</p>
      </div>

      <div className="sj-socials">
        <a href="https://github.com/SamJoor?tab=repositories" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github /></a>
        <a href="https://www.linkedin.com/in/samjoor/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin /></a>
        <a href="mailto:skjoor@quinnipiac.edu" aria-label="Email"><Mail /></a>
        <Link href="/chess" aria-label="Chess"><Swords /></Link>
      </div>
    </aside>
  );
}

function ProfileItem({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="sj-profile-item">
      <Icon className="size-5" />
      {label}
    </div>
  );
}

function SourceIcon({ source }: { source: ActivitySource }) {
  const Icon = source === "LinkedIn" ? Linkedin : Github;
  return <Icon className="size-6" strokeWidth={2.25} aria-hidden="true" />;
}

function HeroMark() {
  return (
    <div className="sj-hero-mark" aria-hidden="true">
      <Swords className="size-14" strokeWidth={2.1} />
      <span>win</span>
    </div>
  );
}

function Hero() {
  return (
    <section className="sj-hero">
      <div>
        <h2>
          <span className="sj-headline-line">I build stuff. Secure it.</span>
          <span className="sj-headline-line">Automate it. <span>Win</span> with it.</span>
        </h2>
        <div className="sj-code">
          <code><span>while</span> (<b>curious</b>) {"{ build(); breakThings(); learn(); }"}</code>
          <i />
        </div>
      </div>
      <HeroMark />
    </section>
  );
}

function ActivityFeed() {
  const [items, setItems] = useState<ActivityItem[]>(fallbackActivities);
  const [linkedInConnected, setLinkedInConnected] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadActivity() {
      try {
        const response = await fetch("/api/activity", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as {
          items?: ActivityItem[];
          linkedInConnected?: boolean;
        };
        if (!active) return;
        setItems(data.items?.length ? data.items : fallbackActivities);
        setLinkedInConnected(Boolean(data.linkedInConnected));
      } catch {
        if (active) setItems(fallbackActivities);
      }
    }

    loadActivity();
    const interval = window.setInterval(loadActivity, 5 * 60 * 1000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <section className="sj-feed">
      <div className="sj-feed-head">
        <h2><span>SJ&gt;</span> Activity Feed</h2>
        <p>Live: <strong>GitHub{linkedInConnected ? " + LinkedIn" : ""}</strong></p>
      </div>
      <div className="sj-feed-list">
        {items.map((item) => (
          <a href={item.href} key={item.id} className="sj-feed-row" target="_blank" rel="noopener noreferrer">
            <div className="sj-feed-icon">
              <SourceIcon source={item.source} />
            </div>
            <div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <small>{item.meta}</small>
            </div>
          </a>
        ))}
      </div>
      <a href="https://github.com/SamJoor?tab=repositories" className="sj-view-all" target="_blank" rel="noopener noreferrer">
        View GitHub activity <ArrowRight className="size-4" />
      </a>
    </section>
  );
}

function TerminalPanel() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: 1, kind: "prompt", text: "help" },
    { id: 2, kind: "success", text: "Available commands:" },
    ...terminalCommands.map((item, index) => ({
      id: index + 3,
      kind: "command" as const,
      text: item.command.padEnd(11) + " " + item.text,
    })),
  ]);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  function append(nextLines: Omit<TerminalLine, "id">[]) {
    setLines((current) => {
      const startId = current.length ? current[current.length - 1].id + 1 : 1;
      return [
        ...current,
        ...nextLines.map((line, index) => ({ ...line, id: startId + index })),
      ].slice(-80);
    });
  }

  async function runCommand(rawCommand: string) {
    const displayCommand = rawCommand.trim();
    const normalized = displayCommand.toLowerCase();
    const [command = "", ...args] = normalized.split(/\s+/);
    if (!command) return;

    setHistory((current) => [...current.filter((item) => item !== displayCommand), displayCommand].slice(-30));
    setHistoryIndex(null);

    if (command === "clear") {
      setInput("");
      setLines([]);
      return;
    }

    append([{ kind: "prompt", text: displayCommand }]);

    if (command === "help" || command === "?") {
      append([
        { kind: "success", text: "Available commands:" },
        ...terminalCommands.map((item) => ({
          kind: "command" as const,
          text: item.command.padEnd(11) + " " + item.text,
        })),
      ]);
      return;
    }

    if (command === "whoami") {
      append([
        { kind: "text", text: "sam@SamJoor.com" },
        { kind: "text", text: "Role: builder / student / cybersecurity + data systems" },
      ]);
      return;
    }

    if (command === "pwd") {
      append([{ kind: "text", text: "/home/sam/portfolio" }]);
      return;
    }

    if (command === "ls" || command === "dir") {
      append([
        { kind: "text", text: "about.txt  projects/  chess/  resume.pdf  contact.link  egg.lock" },
      ]);
      return;
    }

    if (command === "date") {
      append([
        { kind: "text", text: new Intl.DateTimeFormat("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone: "America/New_York",
        }).format(new Date()) + " EDT" },
      ]);
      return;
    }

    if (command === "about") {
      append([
        { kind: "text", text: "Sam Joor builds secure, automated, data-driven tools with a playful hacker-lab edge." },
        { kind: "text", text: "Current focus: cybersecurity, data science, automation, and chess experiments." },
      ]);
      return;
    }

    if (command === "projects") {
      append([
        { kind: "success", text: "> Fetching featured projects..." },
        ...projects.map((project, index) => ({ kind: "text" as const, text: "[" + (index + 1) + "] " + project.title })),
        { kind: "link", text: "Open full projects page", href: "/projects" },
      ]);
      return;
    }

    if (command === "chess") {
      append([{ kind: "link", text: "Open chess lab", href: "/chess" }]);
      return;
    }

    if (command === "skills") {
      append([
        { kind: "text", text: "Core stack: TypeScript, Next.js, Python, PowerShell, SQL, data pipelines, VM automation." },
        { kind: "text", text: "Domains: cybersecurity tooling, portfolio systems, chess logic, and applied data science." },
      ]);
      return;
    }

    if (command === "experience") {
      append([
        { kind: "text", text: "Student builder focused on shipping practical projects, security labs, and automation workflows." },
        { kind: "link", text: "View resume", href: "/SAM_JOOR_RESUME.pdf" },
      ]);
      return;
    }

    if (command === "contact") {
      append([
        { kind: "link", text: "Email skjoor@quinnipiac.edu", href: "mailto:skjoor@quinnipiac.edu" },
        { kind: "link", text: "LinkedIn profile", href: "https://www.linkedin.com/in/samjoor/" },
      ]);
      return;
    }

    if (command === "github") {
      append([{ kind: "link", text: "GitHub profile", href: "https://github.com/SamJoor?tab=repositories" }]);
      return;
    }

    if (command === "linkedin") {
      append([{ kind: "link", text: "LinkedIn profile", href: "https://www.linkedin.com/in/samjoor/" }]);
      return;
    }

    if (command === "resume") {
      append([{ kind: "link", text: "Download resume", href: "/SAM_JOOR_RESUME.pdf" }]);
      return;
    }

    if (command === "open") {
      const target = args[0];
      const routes: Record<string, { text: string; href: string }> = {
        about: { text: "Open About page", href: "/aboutme" },
        projects: { text: "Open Projects page", href: "/projects" },
        chess: { text: "Open Chess lab", href: "/chess" },
        egg: { text: "Open Egg Hunt", href: "/egg-hunt" },
        github: { text: "Open GitHub profile", href: "https://github.com/SamJoor?tab=repositories" },
        linkedin: { text: "Open LinkedIn profile", href: "https://www.linkedin.com/in/samjoor/" },
        resume: { text: "Download resume", href: "/SAM_JOOR_RESUME.pdf" },
      };

      if (target && routes[target]) {
        append([{ kind: "link", text: routes[target].text, href: routes[target].href }]);
      } else {
        append([
          { kind: "error", text: "Usage: open projects | chess | about | egg | github | linkedin | resume" },
        ]);
      }
      return;
    }

    if (command === "sudo") {
      append([
        { kind: "error", text: "Permission denied. Nice try." },
        { kind: "text", text: "Try: help" },
      ]);
      return;
    }

    if (command === "egg") {
      await markEggFound("Code");
      append([
        { kind: "success", text: "Egg unlocked: Code" },
        { kind: "text", text: "Progress saved. Check the Egg Hunt page for status and leaderboard." },
        { kind: "link", text: "Open Egg Hunt", href: "/egg-hunt" },
      ]);
      return;
    }

    append([
      { kind: "error", text: "Command not found: " + command },
      { kind: "text", text: "Type help to see available commands." },
    ]);
  }

  function submitCommand(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = input;
    setInput("");
    void runCommand(next);
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      const next = input;
      setInput("");
      void runCommand(next);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!history.length) return;
      const nextIndex = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex]);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex === null) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(null);
        setInput("");
      } else {
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex]);
      }
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();
      const partial = input.trim().toLowerCase();
      if (!partial) return;
      const matches = terminalCommandNames.filter((name) => name.startsWith(partial));
      if (matches.length === 1) {
        setInput(matches[0]);
      } else if (matches.length > 1) {
        append([{ kind: "text", text: matches.join("  ") }]);
      }
    }
  }

  function runShortcut(command: string) {
    inputRef.current?.focus();
    void runCommand(command);
  }

  return (
    <aside className="sj-terminal-side">
      <div className="sj-terminal">
        <div className="sj-terminal-title">
          <span>SJ TERMINAL</span>
          <strong>_ [] x</strong>
        </div>
        <div
          className="sj-terminal-body"
          ref={bodyRef}
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((line) => <TerminalOutput key={line.id} line={line} />)}
          <form className="sj-terminal-input-row" onSubmit={submitCommand}>
            <label htmlFor="sj-terminal-input">Visitor@SamJoor.com:~$</label>
            <input
              id="sj-terminal-input"
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleInputKeyDown}
              autoComplete="off"
              spellCheck={false}
              aria-label="Terminal command"
            />
            <i aria-hidden="true" />
          </form>
        </div>
        <div className="sj-terminal-shortcuts" aria-label="Terminal quick commands">
          {["help", "projects", "chess", "contact", "egg", "clear"].map((command) => (
            <button key={command} type="button" onClick={() => runShortcut(command)}>
              {command}
            </button>
          ))}
        </div>
      </div>
      <div className="sj-tip">
        <Egg className="size-10" strokeWidth={2.1} aria-hidden="true" />
        <p><strong>Tip:</strong> There is more here than meets the eye. Try the egg command.</p>
      </div>
    </aside>
  );
}

function TerminalOutput({ line }: { line: TerminalLine }) {
  if (line.kind === "prompt") {
    return <p><span>Visitor@SamJoor.com:~$</span> {line.text}</p>;
  }

  if (line.kind === "link" && line.href) {
    return (
      <p>
        <a
          href={line.href}
          target={line.href.startsWith("http") ? "_blank" : undefined}
          rel={line.href.startsWith("http") ? "noopener noreferrer" : undefined}
          download={line.href.endsWith(".pdf") ? "SAM_JOOR_RESUME.pdf" : undefined}
        >
          {line.text} <ArrowRight className="size-3" />
        </a>
      </p>
    );
  }

  if (line.kind === "error") {
    return <p className="sj-terminal-error">{line.text}</p>;
  }

  if (line.kind === "success") {
    return <p className="sj-green">{line.text}</p>;
  }

  if (line.kind === "command") {
    const [command, ...rest] = line.text.trim().split(/\s+/);
    return <TerminalCommand command={command} text={rest.join(" ")} />;
  }

  return <p>{line.text}</p>;
}

function TerminalCommand({ command, text }: { command: string; text: string }) {
  return (
    <div className="sj-command">
      <b>{command}</b>
      <span>{text}</span>
    </div>
  );
}

function FeaturedProjects() {
  return (
    <section className="sj-projects">
      <h2><span>SJ&gt;</span> Featured Projects</h2>
      <div className="sj-project-grid">
        {projects.map((project) => {
          const Icon = project.icon;
          return (
          <Link href={project.href} key={project.title} className={`sj-project sj-project-${project.tone}`}>
            <span className="sj-project-icon">
              <Icon className="size-9" strokeWidth={2.1} aria-hidden="true" />
            </span>
            <div>
              <h3>{project.title}</h3>
              <p>{project.text}</p>
              <div>
                {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </div>
          </Link>
        )})}
      </div>
    </section>
  );
}
