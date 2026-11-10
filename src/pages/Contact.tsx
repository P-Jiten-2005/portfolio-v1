import { useState } from "react";
import { Link } from "react-router-dom";
import { profile } from "@/content/profile";

const MAX = 1000;

// The form is drawn as the minutes of a meeting that hasn't happened yet: the
// visitor fills in the agenda, and the action item at the bottom writes itself.
// No server is involved. "Adjourn" opens a ready-made email draft, which the
// visitor sends from their own account.
export default function Contact() {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  const who = name.trim() || "a visitor";
  const subject = `Meeting request from ${who}`;
  const body = `${msg.trim()}\n\n— ${who}`;
  const q = (s: string) => encodeURIComponent(s);
  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${q(profile.email)}&su=${q(subject)}&body=${q(body)}`;
  const mailto = `mailto:${profile.email}?subject=${q(subject)}&body=${q(body)}`;
  const ready = msg.trim().length > 0;
  const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  const ruled = {
    backgroundImage: "repeating-linear-gradient(transparent 0 35px, rgb(var(--ink) / 0.16) 35px 36px)",
    lineHeight: "36px",
  };

  return (
    <div className="page pt-16 md:pt-24">
      <p className="label text-mute">(Contact)</p>
      <h1 className="mt-4 text-[clamp(2.6rem,7vw,6rem)] font-bold leading-[0.92] tracking-tight">
        Let's call this a <span className="font-serif font-normal italic text-accent">meeting.</span>
      </h1>
      <p className="mt-6 max-w-[48ch] text-lg text-chalk/70">
        Fill in the minutes below. Adjourning opens an email draft to me with everything already written.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (ready) window.open(gmail, "_blank", "noopener");
        }}
        className="mt-12 max-w-3xl rounded-2xl bg-card p-6 text-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] md:p-10"
      >
        <div className="label flex flex-wrap justify-between gap-2 border-b-2 border-ink pb-3">
          <span className="font-bold">Minutes of meeting</span>
          <span>{today} · No. 001</span>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="label text-ink/60">Attendee 1</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              placeholder="your name"
              autoComplete="name"
              className="mt-1 w-full border-b border-ink/30 bg-transparent font-hand text-2xl text-blue placeholder:text-ink/30"
            />
          </label>
          <div>
            <span className="label text-ink/60">Attendee 2</span>
            <p className="mt-1 border-b border-ink/30 font-hand text-2xl">{profile.name}</p>
          </div>
        </div>

        <label className="mt-8 block">
          <span className="label flex justify-between text-ink/60">
            <span>Agenda</span>
            <span aria-live="polite">
              {msg.length}/{MAX}
            </span>
          </span>
          <textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            maxLength={MAX}
            rows={6}
            required
            placeholder="An internship, a project, a hard problem…"
            className="mt-1 w-full resize-none bg-transparent font-hand text-2xl text-blue placeholder:text-ink/30"
            style={ruled}
          />
        </label>

        <div className="mt-6 rounded-xl border-2 border-dashed border-ink/30 p-4">
          <span className="label text-ink/60">Action item</span>
          <p className="mt-1 flex flex-wrap items-baseline gap-x-3 text-lg font-semibold">
            <span>Jiten to reply to {who}</span>
            <span className="label rounded bg-ink px-2 py-1 text-card">Owner: Jiten</span>
            <span className="label rounded border border-red px-2 py-1 text-red">Due: soon</span>
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={!ready}
            className="rounded-full bg-ink px-6 py-3 font-semibold text-card transition-colors hover:bg-red disabled:cursor-not-allowed disabled:opacity-40"
          >
            Adjourn & open Gmail →
          </button>
          <a href={mailto} className="label underline underline-offset-4 hover:text-red">
            Use my mail app instead
          </a>
        </div>
      </form>

      <ul className="mt-12 grid max-w-3xl gap-3 sm:grid-cols-3">
        {[
          { label: "GitHub", sub: "Code & READMEs", href: profile.github },
          { label: "LinkedIn", sub: "Professional", href: profile.linkedin },
          { label: "Résumé", sub: "PDF, 1 page", href: profile.resume },
        ].map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl border border-edge bg-panel p-5 transition-colors hover:border-accent/60"
            >
              <span className="block text-xl font-semibold">{l.label} ↗</span>
              <span className="label text-mute">{l.sub}</span>
            </a>
          </li>
        ))}
      </ul>

      <Link to="/work" className="label mt-10 inline-block text-mute hover:text-accent">
        Or look at the projects first →
      </Link>
    </div>
  );
}
