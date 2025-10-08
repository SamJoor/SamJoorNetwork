// app/enter/page.tsx
"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic"; // prevents static prerender

function EnterForm() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const qs = useSearchParams();
  const redirect = qs?.get("redirect") || "/";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) router.push(redirect);
      else setErr("Wrong password.");
    } catch {
      setErr("Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-zinc-200 bg-white w-full max-w-sm p-6 shadow-sm"
      >
        <h1 className="text-xl font-semibold">Enter</h1>
        <p className="text-sm text-zinc-600 mt-1">
          This site is protected. Enter the password to continue.
        </p>

        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Password"
          className="mt-4 w-full border border-zinc-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
          autoFocus
        />

        {err && <p className="text-red-600 text-sm mt-2">{err}</p>}

        <button
          type="submit"
          disabled={busy || !pw}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-medium disabled:opacity-60"
        >
          {busy ? "Checking..." : "Continue"}
        </button>
      </form>
    </div>
  );
}

export default function EnterPage() {
  // Suspense wrapper is required for useSearchParams in production builds
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      <EnterForm />
    </Suspense>
  );
}
