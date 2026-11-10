import { Link } from "react-router-dom";
import { education, leadership, skills, work, type Role } from "@/content/experience";

function Roles({ title, items }: { title: string; items: Role[] }) {
  return (
    <section className="mt-16">
      <h2 className="label text-mute">({title})</h2>
      <ul>
        {items.map((r) => (
          <li key={r.title + r.when} className="grid gap-4 border-b border-edge py-8 md:grid-cols-[1fr_2fr]">
            <div>
              <p className="label text-accent">{r.when}</p>
              <h3 className="mt-2 text-xl font-semibold leading-tight">{r.title}</h3>
              <p className="mt-1 text-chalk/60">{r.org}</p>
            </div>
            <ul className="space-y-3 text-chalk/85">
              {r.points.map((pt) => (
                <li key={pt} className="flex gap-3">
                  <span aria-hidden className="text-accent">→</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Experience() {
  return (
    <div className="page pt-16 md:pt-24">
      <p className="label text-mute">(Experience)</p>
      <h1 className="mt-4 text-[clamp(2.6rem,7vw,6rem)] font-bold leading-[0.92] tracking-tight">
        Where I've <span className="font-serif font-normal italic text-accent">been</span>
      </h1>

      <Roles title="Work" items={work} />
      <Roles title="Leadership" items={leadership} />

      <section className="mt-16">
        <h2 className="label text-mute">(Education)</h2>
        <ul>
          {education.map((e) => (
            <li key={e.org} className="grid gap-2 border-b border-edge py-6 md:grid-cols-[1fr_2fr_auto] md:items-baseline">
              <span className="label text-accent">{e.when}</span>
              <span>
                <span className="block text-xl font-semibold">{e.org}</span>
                <span className="text-chalk/60">{e.course}</span>
              </span>
              <span className="label text-mute">{e.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <h2 className="label text-mute">(Toolkit)</h2>
        <dl className="mt-4 grid gap-6 md:grid-cols-2">
          {skills.map((s) => (
            <div key={s.group} className="rounded-2xl border border-edge bg-panel p-6">
              <dt className="font-semibold">{s.group}</dt>
              <dd className="mt-3 text-chalk/70">{s.items.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Link to="/work" className="mt-16 inline-block rounded-full bg-accent px-6 py-3 font-semibold text-night">
        See the projects →
      </Link>
    </div>
  );
}
