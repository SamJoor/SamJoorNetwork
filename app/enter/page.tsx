// app/enter/page.tsx
"use client";
export const dynamic = "force-dynamic"; // avoid prerender/export issues

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function EnterPage() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const qs = useSearchParams();
  const redirect = qs.get("redirect") || "/";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        router.push(redirect);
      } else {
        setErr("Wrong password, plz no hack.");
      }
    } catch {
      setErr("Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-zinc-200 bg-white w-full max-w-sm p-6 shadow-sm"
      >
        <h1 className="text-xl font-semibold">Welcome!</h1>
        <p className="text-sm text-zinc-600 mt-1">
          This is a private site please enter a password to access.
        </p>

        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Password"
          className="mt-4 w-full border border-zinc-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
          autoFocus
        />
        {err ? <p className="text-red-600 text-sm mt-2">{err}</p> : null}

        <button
          type="submit"
          disabled={busy || !pw}
          className="mt-4 w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-full text-sm font-medium bg-blue-600 text-white disabled:opacity-60"
        >
          {busy ? "Checking…" : "Continue"}
        </button>
      </form>
    </div>
  );
}
