// app/about/page.tsx
import Link from "next/link";

export const metadata = {
  title: "About — SamJoorNetwork",
  description: "About Sam Joor",
};

export default function AboutPage() {
  return (
    <div className="container-page py-8">
      {/* Header row */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">About me</h1>
        <Link href="/" className="btn">Home</Link>
      </div>

      {/* Top card: intro */}
      <section className="card p-6">
        <div className="flex items-start gap-4">
          <div className="size-16 md:size-20 rounded-xl bg-zinc-200 flex items-center justify-center text-lg md:text-2xl font-bold text-zinc-700">
            SJ
          </div>
          <div>
            <h2 className="text-xl font-semibold">Sam Joor</h2>
            <p className="text-zinc-600">
              Full-Stack Developer • Data Science • Cybersecurity
            </p>
            <p className="mt-3 text-zinc-700 leading-relaxed">
              I enjoy building things that feel thoughtful and thourough. Recently I’ve been staying on track with my studies and getting the most out of college. 
              In my free time, I have had a lot of fun building web apps with Next.js + Tailwind and tinkering with security automation inside my VM. 
              When my face isnt glued to a screen, Im out on campus either in classes, with my fraternity or shooting hoops with my friends.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["JavaScript", "Python", "PowerShell"].map((t) => (
                <span key={t} className="pill">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Details grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* What I'm doing */}
        <section className="card p-6">
          <h3 className="text-sm font-semibold text-zinc-700">What I’m doing</h3>
          <ul className="mt-3 list-disc list-inside text-sm text-zinc-700 space-y-2">
            <li>Polishing <strong>SamJoorNetwork</strong> and using it to test fun new features whenever im bored!</li>
            <li>Learning about anything I find fun or interesting, recently thats been automation, security workflows, and scripts.</li>
            <li>Working towards my bachelors in data science and graduating this spring!!.</li>
          </ul>
        </section>

        {/* Experience snapshot (filler) */}
        <section className="card p-6">
          <h3 className="text-sm font-semibold text-zinc-700">Experience snapshot</h3>
          <ul className="mt-3 text-sm text-zinc-700 space-y-3">
            <li>
              <div className="font-medium">Full-Stack Projects</div>
              <div className="text-zinc-600">Next.js, </div>
            </li>
            <li>
              <div className="font-medium">Data / Analytics</div>
              <div className="text-zinc-600">ETL scripts, CSV/JSON pipelines, charting</div>
            </li>
            <li>
              <div className="font-medium">Cyber tinkerer</div>
              <div className="text-zinc-600">Sandboxing, VM automation</div>
            </li>
          </ul>
        </section>

        {/* Contact & links */}
        <section className="card p-6">
          <h3 className="text-sm font-semibold text-zinc-700">Get in touch</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href="/SamJoorResume.pdf" download className="btn">Download Resume</a>
            <a href="mailto:skjoor@quinnipiac,edu" className="btn">Email</a>
            <a href="https://github.com/SamJoor" target="_blank" rel="noopener noreferrer" className="btn">GitHub</a>
            <a href="https://www.linkedin.com/in/samjoor/" target="_blank" rel="noopener noreferrer" className="btn">LinkedIn</a>
          </div>
          <p className="mt-3 text-xs text-zinc-500">
            Prefer DM? Replace these links later with your actual contact preferences.
          </p>
        </section>
      </div>

      {/* Back home button (mobile friendly) */}
      <div className="mt-6">
        <Link href="/" className="btn">← Back to Home</Link>
      </div>
    </div>
  );
}
