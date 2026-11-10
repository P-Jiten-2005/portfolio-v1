import { Link } from "react-router-dom";
import { featured, projects } from "@/content/projects";
import ProjectCard from "@/components/ProjectCard";

export default function Work() {
  const rest = projects.filter((p) => !p.featured);
  return (
    <div className="page pt-16 md:pt-24">
      <p className="label text-mute">(Work)</p>
      <h1 className="mt-4 text-[clamp(2.6rem,7vw,6rem)] font-bold leading-[0.92] tracking-tight">
        Things I've <span className="font-serif font-normal italic text-accent">built</span>
      </h1>

      <ul className="mt-12 grid gap-4 md:grid-cols-3">
        {featured.map((p, i) => (
          <li key={p.slug}>
            <ProjectCard p={p} index={i} />
          </li>
        ))}
      </ul>

      <h2 className="label mb-2 mt-20 text-mute">(More projects)</h2>
      <ul>
        {rest.map((p) => (
          <li key={p.slug} className="border-b border-edge">
            <Link to={`/work/${p.slug}`} className="group grid gap-1 py-5 md:grid-cols-[2fr_3fr_auto] md:items-baseline md:gap-6">
              <span className="text-xl font-semibold group-hover:text-accent">{p.name}</span>
              <span className="text-chalk/60">{p.tagline}</span>
              <span className="label text-mute">
                {p.category} · {p.year}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
