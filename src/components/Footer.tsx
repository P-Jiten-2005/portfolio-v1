import { Link } from "react-router-dom";
import { profile } from "@/content/profile";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-edge">
      <div className="page label flex flex-wrap items-center justify-between gap-4 py-8 text-mute">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <ul className="flex flex-wrap gap-6">
          <li>
            <Link to="/work" className="hover:text-accent">Projects</Link>
          </li>
          <li>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="hover:text-accent">GitHub ↗</a>
          </li>
          <li>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-accent">LinkedIn ↗</a>
          </li>
          <li>
            <a href={`mailto:${profile.email}`} className="hover:text-accent">Email</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
