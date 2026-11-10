import { Link } from "react-router-dom";
import type { Project } from "@/content/projects";

export default function ProjectCard({ p, index }: { p: Project; index?: number }) {
  return (
    <Link
      to={`/work/${p.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-edge bg-panel p-6 transition-colors hover:border-accent/60"
    >
      <div className="label flex justify-between text-mute">
        <span>
          {p.category} · {p.year}
        </span>
        {index !== undefined && <span className="text-accent">({String(index + 1).padStart(2, "0")})</span>}
      </div>
      <h3 className="mt-6 text-2xl font-semibold leading-tight group-hover:text-accent">{p.name}</h3>
      <p className="mt-3 text-chalk/70">{p.tagline}</p>
      <ul className="mt-auto flex flex-wrap gap-2 pt-6">
        {p.stack.slice(0, 4).map((s) => (
          <li key={s} className="label rounded-full border border-edge px-2.5 py-1 text-chalk/60">
            {s}
          </li>
        ))}
      </ul>
    </Link>
  );
}
