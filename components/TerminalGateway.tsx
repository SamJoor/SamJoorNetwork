"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { markEggFound } from "@/lib/eggProgress";
import { LogoSJ } from "./DevLinkd";

type GatewayLine = {
  id: number;
  kind: "prompt" | "text" | "success" | "error" | "command" | "typing";
  text: string;
};

const welcomeText = "Welcome to SamJoor.com";

const commands = [
  { name: "about", text: "Read about Sam" },
  { name: "projects", text: "View project work" },
  { name: "github", text: "Open GitHub" },
  { name: "linkedin", text: "Open LinkedIn" },
  { name: "chess", text: "Open the chess lab" },
  { name: "eggs", text: "Open Easter Eggs" },
];

const utilityCommands = [
  { name: "resume", text: "Download resume" },
  { name: "egg", text: "Unlock a hidden egg" },
  { name: "clear", text: "Clear the terminal" },
  { name: "help", text: "Show commands" },
];

const allCommands = [...commands, ...utilityCommands];
const commandNames = allCommands.map((command) => command.name);
const resumeHref = "/SAM_JOOR_RESUME.pdf";
const resumeDownloadName = "SAM_JOOR_RESUME.pdf";
const welcomeTypingMs = 68;
const commandIntroDelayMs = 360;
const commandLineDelayMs = 210;

export default function TerminalGateway() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [shrinkCount, setShrinkCount] = useState(0);
  const [isRebounding, setIsRebounding] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lines, setLines] = useState<GatewayLine[]>([
    { id: 2, kind: "typing", text: "" },
  ]);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    let index = 0;
    const interval = window.setInterval(() => {
      index += 1;
      setLines((current) =>
        current.map((line) =>
          line.id === 2 ? { ...line, text: welcomeText.slice(0, index) } : line,
        ),
      );

      if (index >= welcomeText.length) {
        window.clearInterval(interval);
        window.setTimeout(() => {
          setLines((current) =>
            current.map((line) => (line.id === 2 ? { ...line, kind: "text" as const, text: welcomeText } : line)),
          );

          const introLines: Omit<GatewayLine, "id">[] = [
            { kind: "success", text: "Available commands:" },
            ...commands.map((command) => ({
              kind: "command" as const,
              text: command.name.padEnd(10) + command.text,
            })),
          ];

          introLines.forEach((line, lineIndex) => {
            window.setTimeout(() => append([line]), lineIndex * commandLineDelayMs);
          });
        }, commandIntroDelayMs);
      }
    }, welcomeTypingMs);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  function append(nextLines: Omit<GatewayLine, "id">[]) {
    setLines((current) => {
      const start = current.length ? current[current.length - 1].id + 1 : 1;
      return [...current, ...nextLines.map((line, index) => ({ ...line, id: start + index }))].slice(-120);
    });
  }

  function remember(command: string) {
    setHistory((current) => [...current.filter((item) => item !== command), command].slice(-40));
    setHistoryIndex(null);
  }

  function navigateTo(href: string) {
    window.setTimeout(() => {
      if (href.startsWith("http")) {
        window.open(href, "_blank", "noopener,noreferrer");
      } else if (href.endsWith(".pdf")) {
        const link = document.createElement("a");
        link.href = href;
        link.download = resumeDownloadName;
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        router.push(href);
      }
    }, 250);
  }

  async function runCommand(raw: string) {
    const display = raw.trim();
    const normalized = display.toLowerCase();
    const [command = "", target = ""] = normalized.split(/\s+/);
    if (!command) return;

    remember(display);

    if (command === "clear") {
      setInput("");
      setLines([]);
      return;
    }

    append([{ kind: "prompt", text: display }]);

    if (command === "help" || command === "?") {
      append([
        { kind: "success", text: "Available commands:" },
        ...allCommands.map((item) => ({
          kind: "command" as const,
          text: item.name.padEnd(10) + item.text,
        })),
      ]);
      return;
    }

    const routes: Record<string, { label: string; href: string }> = {
      home: { label: "Terminal home is already loaded.", href: "/home" },
      projects: { label: "Opening projects...", href: "/projects" },
      about: { label: "Opening about page...", href: "/aboutme" },
      chess: { label: "Opening chess lab...", href: "/chess" },
      eggs: { label: "Opening Easter Eggs...", href: "/egg-hunt" },
      easter: { label: "Opening Easter Eggs...", href: "/egg-hunt" },
      github: { label: "Opening GitHub...", href: "https://github.com/SamJoor?tab=repositories" },
      linkedin: { label: "Opening LinkedIn...", href: "https://www.linkedin.com/in/samjoor/" },
      resume: { label: "Downloading resume...", href: resumeHref },
    };

    if (command === "open") {
      if (target && routes[target]) {
        append([{ kind: "success", text: routes[target].label }]);
        navigateTo(routes[target].href);
      } else {
        append([{ kind: "error", text: "Usage: open projects | about | chess | github | linkedin | resume | eggs" }]);
      }
      return;
    }

    if (routes[command]) {
      append([{ kind: "success", text: routes[command].label }]);
      navigateTo(routes[command].href);
      return;
    }

    if (command === "ls" || command === "dir") {
      append([{ kind: "text", text: "home  projects  about  chess  github  linkedin  resume  eggs  egg" }]);
      return;
    }

    if (command === "whoami") {
      append([{ kind: "text", text: "visitor@SamJoor.com" }]);
      return;
    }

    if (command === "egg") {
      await markEggFound("Code");
      append([
        { kind: "success", text: "Egg unlocked: Code" },
        { kind: "text", text: "Type projects, about, chess, or eggs to keep exploring." },
      ]);
      return;
    }

    append([
      { kind: "error", text: "Command not found: " + command },
      { kind: "text", text: "Type help for available commands." },
    ]);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = input;
    setInput("");
    void runCommand(next);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
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
      const matches = commandNames.filter((name) => name.startsWith(partial));
      if (matches.length === 1) setInput(matches[0]);
      if (matches.length > 1) append([{ kind: "text", text: matches.join("  ") }]);
    }
  }

  function handleMinimize() {
    if (isRebounding) return;

    const nextCount = shrinkCount + 1;
    setShrinkCount(nextCount);

    if (nextCount >= 5) {
      window.setTimeout(() => {
        setIsRebounding(true);
        setShrinkCount(0);
        window.setTimeout(() => setIsRebounding(false), 760);
      }, 180);
    }
  }

  function handleSpinAnimation() {
    if (isSpinning) return;
    setIsSpinning(true);
    window.setTimeout(() => {
      setIsSpinning(false);
      inputRef.current?.focus();
    }, 760);
  }

  const terminalClassName = [
    "sj-gateway-terminal",
    isFullscreen ? "is-fullscreen" : "",
    shrinkCount ? `is-shrunk-${shrinkCount}` : "",
    isRebounding ? "is-rebounding" : "",
    isSpinning ? "is-spinning" : "",
  ].filter(Boolean).join(" ");

  return (
    <main className={isFullscreen ? "sj-gateway is-terminal-fullscreen" : "sj-gateway"} onClick={() => inputRef.current?.focus()}>
      <section className={terminalClassName} aria-label="SamJoor.com terminal gateway">
        <div className="sj-gateway-top">
          <div className="sj-gateway-brand">
            <LogoSJ className="sj-logo-mark" />
          </div>
          <div className="sj-window-controls" aria-label="Terminal window controls">
            <button type="button" aria-label="Minimize terminal" onClick={handleMinimize}>
              -
            </button>
            <button
              type="button"
              aria-label={isFullscreen ? "Restore terminal size" : "Fullscreen terminal"}
              aria-pressed={isFullscreen}
              onClick={() => setIsFullscreen((current) => !current)}
            >
              □
            </button>
            <button type="button" aria-label="Spin terminal" onClick={handleSpinAnimation}>
              X
            </button>
          </div>
        </div>
        <div className="sj-gateway-body" ref={bodyRef}>
          {lines.map((line) => <GatewayOutput key={line.id} line={line} />)}
          <form className="sj-gateway-input" onSubmit={submit}>
            <label htmlFor="gateway-terminal-input">Visitor@SamJoor.com:~$</label>
            <div className="sj-gateway-entry" aria-hidden="true">
              <span>{input}</span>
              <i />
            </div>
            <input
              ref={inputRef}
              id="gateway-terminal-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              spellCheck={false}
              aria-label="Terminal command"
            />
          </form>
        </div>
        <div className="sj-gateway-actions">
          {[
            ["about", "about"],
            ["projects", "projects"],
            ["github", "github"],
            ["linkedin", "linkedin"],
            ["chess", "chess"],
            ["easter eggs", "eggs"],
          ].map(([label, command]) => (
            <button key={command} type="button" onClick={() => void runCommand(command)}>
              {label}<ArrowRight className="size-3" />
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

function GatewayOutput({ line }: { line: GatewayLine }) {
  if (line.kind === "prompt") return <p><span>Visitor@SamJoor.com:~$</span> {line.text}</p>;
  if (line.kind === "typing") {
    return (
      <p className="sj-gateway-typing sj-gateway-welcome">
        <WelcomeText text={line.text} />
        <i aria-hidden="true" />
      </p>
    );
  }
  if (line.kind === "success") return <p className="sj-gateway-success">{line.text}</p>;
  if (line.kind === "error") return <p className="sj-gateway-error">{line.text}</p>;
  if (line.kind === "command") {
    const [name, ...rest] = line.text.trim().split(/\s+/);
    return (
      <div className="sj-gateway-command">
        <b>{name}</b>
        <span>{rest.join(" ")}</span>
      </div>
    );
  }
  if (line.text === welcomeText) {
    return <p className="sj-gateway-welcome"><WelcomeText text={line.text} /></p>;
  }

  return <p>{line.text}</p>;
}

function WelcomeText({ text }: { text: string }) {
  const greenStart = "Welcome to ".length;
  const intro = text.slice(0, Math.min(text.length, greenStart));
  const domain = text.length > greenStart ? text.slice(greenStart) : "";

  return (
    <>
      {intro}
      {domain ? <span>{domain}</span> : null}
    </>
  );
}
