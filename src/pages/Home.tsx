import { Link } from "react-router-dom";
import { featured, projects } from "@/content/projects";
import ProjectCard from "@/components/ProjectCard";
import TrackerHero from "@/features/tracker/TrackerHero";
import BeatTheModel from "@/features/beat-the-model/BeatTheModel";

export default function Home() {
  return (
    <>
      <TrackerHero />

      <section className="page py-16" aria-labelledby="selected">
        <div className="label mb-8 flex justify-between text-mute">
          <h2 id="selected">(Selected work)</h2>
          <Link to="/work" className="hover:text-accent">
            All {String(projects.length).padStart(2, "0")} projects →
          </Link>
        </div>
        <ul className="grid gap-4 md:grid-cols-3">
          {featured.map((p, i) => (
            <li key={p.slug}>
              <ProjectCard p={p} index={i} />
            </li>
          ))}
        </ul>
      </section>

      <BeatTheModel />
    </>
  );
}
