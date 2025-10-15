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
            <h2 className="text-xl font-semibold">Sam Joor </h2>
            <p className="text-zinc-600">
              Full-Stack Developer • Data Science • Cybersecurity
            </p>
            <p className="mt-3 text-zinc-700 leading-relaxed">
              Hey im Sam, Im a 3rd year at Quinnipiac University expected to graduate this spring with a Batchelors in Data Science and two minors in Economics and Computer Science.
              After that ill continue working towards my masters in Cybersecurity which I am on track to acheive in 2027.             
              I enjoy learning about anything tech and recently I’ve had a lot of fun building web apps with Next.js+Tailwind and tinkering with automation inside my VM. 
              When my face isnt glued to a screen, Im out on campus either in classes, at the gym, with my fraternity or hooping with friends.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["JavaScript", "Python", "R", "SQL", "JSON", "SQL", "Javascript", "HTML"].map((t) => (
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
            <li>Polishing <strong>SamJoorNetwork</strong> and using it to have fun whenever im bored!</li>
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
              <div className="text-zinc-600">SamJoor.com, abstrkt.store, StockAnalyzer </div>
            </li>
            <li>
              <div className="font-medium">Data Science</div>
              <div className="text-zinc-600">Python, R, Data modeling</div>
            </li>
            <li>
              <div className="font-medium">Cybersecurity</div>
              <div className="text-zinc-600">VMs, Wireshark, Terminal</div>
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
            72 65 74 72 6F
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
