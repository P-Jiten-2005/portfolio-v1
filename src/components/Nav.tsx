import { NavLink } from "react-router-dom";
import { profile } from "@/content/profile";

const links = [
  { to: "/work", label: "Work" },
  { to: "/experience", label: "Experience" },
  { to: "/contact", label: "Contact" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-edge bg-night/85 backdrop-blur">
      <nav aria-label="Main" className="page flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4">
        <NavLink to="/" className="font-semibold tracking-tight">
          {profile.short} <span className="text-accent">●</span>
        </NavLink>
        <ul className="label flex flex-wrap items-center gap-x-6 gap-y-2">
          {links.map((l) => (
            <li key={l.to}>
              {/* NavLink knows which page is open, so the current one gets the accent. */}
              <NavLink to={l.to} className={({ isActive }) => (isActive ? "text-accent" : "text-chalk/70 hover:text-chalk")}>
                {l.label}
              </NavLink>
            </li>
          ))}
          <li>
            <a href={profile.resume} className="rounded-full border border-chalk/30 px-3 py-1.5 hover:bg-chalk hover:text-night">
              Résumé
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
