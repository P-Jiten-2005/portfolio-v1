import { Link, useParams } from "react-router-dom";
import { findProject, projects } from "@/content/projects";
import NotFound from "@/pages/NotFound";

export default function Project() {
  const { slug } = useParams();
  const p = findProject(slug);
  if (!p) return <NotFound />;
  const next = projects[(projects.indexOf(p) + 1) % projects.length];

  return (
    <article className="page pt-16 md:pt-24">
      <Link to="/work" className="label text-mute hover:text-accent">
        ← All projects
      </Link>
      <p className="label mt-10 text-accent">
        {p.category} · {p.year}
      </p>
      <h1 className="mt-3 text-[clamp(2.4rem,7vw,5.5rem)] font-bold leading-[0.95] tracking-tight">{p.name}</h1>
      {p.expanded && <p className="mt-3 font-serif text-2xl italic text-chalk/70">{p.expanded}</p>}
      <p className="mt-8 max-w-[60ch] text-lg text-chalk/80 md:text-xl">{p.summary}</p>

      {p.numbers && (
        <dl className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {p.numbers.map((n) => (
            <div key={n.label} className="flex flex-col-reverse justify-end rounded-2xl border border-edge bg-panel p-5">
              <dt className="label mt-2 text-mute">{n.label}</dt>
              <dd className="text-4xl font-bold text-accent">{n.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-14 grid gap-10 md:grid-cols-[2fr_1fr]">
        <section aria-labelledby="how">
          <h2 id="how" className="label text-mute">
            (How it works)
          </h2>
          <ul className="mt-4 space-y-4">
            {p.points.map((pt) => (
              <li key={pt} className="flex gap-3 text-chalk/85">
                <span aria-hidden className="text-accent">→</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
          {p.note && <p className="mt-8 rounded-xl border border-edge p-4 text-sm text-chalk/60">Worth knowing: {p.note}</p>}
        </section>
        <aside>
          <h2 className="label text-mute">(Built with)</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {p.stack.map((s) => (
              <li key={s} className="label rounded-full border border-edge px-2.5 py-1 text-chalk/70">
                {s}
              </li>
            ))}
          </ul>
          {p.repo && (
            <a
              href={p.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block rounded-full bg-accent px-5 py-2.5 font-semibold text-night"
            >
              View the code ↗
            </a>
          )}
        </aside>
      </div>

      <Link to={`/work/${next.slug}`} className="group mt-20 block border-t border-edge pt-8">
        <span className="label text-mute">Next project</span>
        <span className="mt-2 block text-3xl font-semibold group-hover:text-accent">{next.name} →</span>
      </Link>
    </article>
  );
}
