"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight, RotateCcw } from "lucide-react";

type ProjectLink = {
  label: string;
  href: string;
};

export type ProjectCardData = {
  title: string;
  date: string;
  blurb: string;
  tags: string[];
  links: ProjectLink[];
};

export default function ProjectFlipCard({ project }: { project: ProjectCardData }) {
  const [flipped, setFlipped] = useState(false);
  const [height, setHeight] = useState<number | null>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const isFeatured = project.title === "Data Science Capstone";

  useLayoutEffect(() => {
    const activeFace = flipped ? backRef.current : frontRef.current;
    if (!activeFace) return;

    const syncHeight = () => setHeight(activeFace.offsetHeight);
    syncHeight();

    const observer = new ResizeObserver(syncHeight);
    observer.observe(activeFace);
    return () => observer.disconnect();
  }, [flipped, project]);

  return (
    <article className={`project-tile project-flip-card ${flipped ? "is-flipped" : ""}`}>
      <div className="project-flip-inner" style={height ? { height } : undefined}>
        <div ref={frontRef} className="project-card-face project-card-front" aria-hidden={flipped}>
          <div className="project-card-top">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-lime-400">
                {project.date}
              </p>
              <h2>{project.title}</h2>
            </div>
            <button
              type="button"
              className={`tile-arrow project-flip-trigger ${isFeatured ? "is-featured" : ""}`}
              onClick={() => setFlipped(true)}
              aria-label={`Flip ${project.title} for description`}
              tabIndex={flipped ? -1 : 0}
            >
              <span>Flip</span>
              <ArrowUpRight className="size-4" />
            </button>
          </div>

          <div className="project-card-tags">
            {project.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="skill-chip">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div ref={backRef} className="project-card-face project-card-back" aria-hidden={!flipped}>
          <div className="project-card-back-head">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-lime-400">
              Description
            </p>
            <button
              type="button"
              className={`tile-arrow project-flip-trigger ${isFeatured ? "is-featured" : ""}`}
              onClick={() => setFlipped(false)}
              aria-label={`Flip ${project.title} back to summary`}
              tabIndex={flipped ? 0 : -1}
            >
              <span>Back</span>
              <RotateCcw className="size-4" />
            </button>
          </div>
          <h2>{project.title}</h2>
          <p>{project.blurb}</p>
          <div className="project-card-links">
            {project.links.map((link) => (
              <a
                key={`${project.title}-${link.label}`}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="btn btn-subtle"
                tabIndex={flipped ? 0 : -1}
              >
                {link.label}
                <ArrowUpRight className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
