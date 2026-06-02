import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/server/apiGuards";

type ActivityItem = {
  id: string;
  source: "GitHub" | "LinkedIn";
  title: string;
  text: string;
  meta: string;
  href: string;
  pixel: "terminal" | "chart" | "lock" | "board";
  createdAt: string;
};

type GitHubEvent = {
  id: string;
  type: string;
  created_at: string;
  repo?: { name?: string; url?: string };
  payload?: {
    action?: string;
    ref_type?: string;
    size?: number;
    commits?: Array<{ message?: string }>;
    pull_request?: { title?: string; html_url?: string };
    issue?: { title?: string; html_url?: string };
  };
};

const GITHUB_USER = "SamJoor";
const LINKEDIN_PROFILE = "https://www.linkedin.com/in/samjoor/";

export const dynamic = "force-dynamic";

function timeAgo(value: string) {
  const date = new Date(value);
  const diff = Date.now() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < hour) return `${Math.max(1, Math.floor(diff / minute))}m ago`;
  if (diff < day) return `${Math.floor(diff / hour)}h ago`;
  return `${Math.floor(diff / day)}d ago`;
}

function repoUrl(name?: string) {
  return name ? `https://github.com/${name}` : `https://github.com/${GITHUB_USER}?tab=repositories`;
}

function mapGitHubEvent(event: GitHubEvent): ActivityItem | null {
  const repo = event.repo?.name?.replace(`${GITHUB_USER}/`, "") ?? "GitHub";
  const href = repoUrl(event.repo?.name);
  const createdAt = event.created_at;
  const meta = `${timeAgo(createdAt)} / GitHub`;

  if (event.type === "PushEvent") {
    const count = event.payload?.size ?? event.payload?.commits?.length ?? 1;
    const message = event.payload?.commits?.[0]?.message;
    return {
      id: event.id,
      source: "GitHub",
      title: `Pushed ${count} update${count === 1 ? "" : "s"} to ${repo}`,
      text: message ? message.split("\n")[0] : "Code changes published to GitHub.",
      meta,
      href,
      pixel: "terminal",
      createdAt,
    };
  }

  if (event.type === "CreateEvent") {
    return {
      id: event.id,
      source: "GitHub",
      title: `Created ${event.payload?.ref_type ?? "item"} in ${repo}`,
      text: "New repository activity was published.",
      meta,
      href,
      pixel: "chart",
      createdAt,
    };
  }

  if (event.type === "PullRequestEvent" && event.payload?.pull_request) {
    return {
      id: event.id,
      source: "GitHub",
      title: `${event.payload.action ?? "Updated"} pull request in ${repo}`,
      text: event.payload.pull_request.title ?? "Pull request activity.",
      meta,
      href: event.payload.pull_request.html_url ?? href,
      pixel: "lock",
      createdAt,
    };
  }

  if (event.type === "IssuesEvent" && event.payload?.issue) {
    return {
      id: event.id,
      source: "GitHub",
      title: `${event.payload.action ?? "Updated"} issue in ${repo}`,
      text: event.payload.issue.title ?? "Issue activity.",
      meta,
      href: event.payload.issue.html_url ?? href,
      pixel: "board",
      createdAt,
    };
  }

  if (event.type === "WatchEvent") {
    return {
      id: event.id,
      source: "GitHub",
      title: `Starred ${repo}`,
      text: "Saved a repository on GitHub.",
      meta,
      href,
      pixel: "chart",
      createdAt,
    };
  }

  return null;
}

async function getGitHubActivity() {
  const response = await fetch(`https://api.github.com/users/${GITHUB_USER}/events/public`, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "SamJoor.com",
    },
    next: { revalidate: 300 },
  });

  if (!response.ok) return [];
  const events = (await response.json()) as GitHubEvent[];
  return events.map(mapGitHubEvent).filter((item): item is ActivityItem => Boolean(item));
}

async function getLinkedInActivity() {
  const feedUrl = process.env.LINKEDIN_ACTIVITY_JSON_URL;
  if (!feedUrl) return [];

  try {
    const parsedUrl = new URL(feedUrl);
    if (parsedUrl.protocol !== "https:") return [];

    const response = await fetch(feedUrl, { next: { revalidate: 900 } });
    if (!response.ok) return [];
    const data = (await response.json()) as Array<Partial<ActivityItem>>;
    return data
      .filter((item) => item.title && item.href)
      .map((item, index) => ({
        id: item.id ?? `linkedin-${index}`,
        source: "LinkedIn" as const,
        title: item.title ?? "LinkedIn update",
        text: item.text ?? "Recent LinkedIn activity.",
        meta: item.createdAt ? `${timeAgo(item.createdAt)} / LinkedIn` : "LinkedIn",
        href: item.href ?? LINKEDIN_PROFILE,
        pixel: item.pixel ?? ("lock" as const),
        createdAt: item.createdAt ?? new Date().toISOString(),
      }));
  } catch {
    return [];
  }
}

export async function GET(req: Request) {
  const limited = rateLimit(req, "activity", 60, 60_000);
  if (limited) return limited;

  const [githubItems, linkedInItems] = await Promise.all([getGitHubActivity(), getLinkedInActivity()]);
  const items = [...githubItems, ...linkedInItems]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return NextResponse.json({
    items,
    linkedInConnected: linkedInItems.length > 0,
    linkedInProfile: LINKEDIN_PROFILE,
  });
}
