"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function EnterPage() {
  const [pw, setPw] = useState("");
  const [error, setError] = useState<string | null>(null);
  const sp = useSearchParams();
  const router = useRouter();
  const next = sp.get("next") || "/";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    if (res.ok) {
      router.replace(next);
    } else {
      const j = await res.json().catch(() => ({}));
      setError(j?.message || "Invalid password");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 p-6">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Welcome!</h1>
        <p className="mt-2 text-sm text-zinc-600">
          This site is private. Please enter the password to access.
        </p>

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2"
            placeholder="Password"
            autoFocus
          />
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button className="btn-primary w-full justify-center">Unlock</button>
        </form>
        </div>
    </div>
  );
}
