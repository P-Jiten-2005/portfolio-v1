import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { profile } from "@/content/profile";
import { createAxis, gaussian, lookAhead, predict, update, type Axis, type Tuning } from "@/lib/kalman";
import { useReducedMotion } from "@/lib/useReducedMotion";

// How the filter is tuned for a hand-moved cursor, which changes speed sharply.
const TUNING: Tuning = { processNoise: 1_000_000, measurementNoise: 144 };
const SENSOR_NOISE = 12; // px of fake jitter added to each "detection"
const LOCK_AFTER = 0.8; // seconds the cursor must stay still
const LOOK_AHEAD = 0.25; // seconds into the future for the predicted point
const TRAIL = 36; // filtered positions kept for the trail
const BOX = 68;

const pad = (n: number, w = 4) => String(Math.max(0, Math.round(n))).padStart(w, "0");

export default function TrackerHero() {
  const reduced = useReducedMotion();
  // The live tracker needs a mouse or trackpad. Phones and reduced-motion
  // visitors get the finished state: name locked, nothing moving.
  const [live, setLive] = useState(false);
  const [locked, setLocked] = useState(true);
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const hud = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const on = fine && !reduced;
    setLive(on);
    setLocked(!on);
  }, [reduced]);

  useEffect(() => {
    if (!live) return;
    const el = section.current!;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const css = getComputedStyle(document.documentElement);
    const colour = (name: string, alpha = 1) => `rgb(${css.getPropertyValue(`--${name}`).trim()} / ${alpha})`;

    let w = 0;
    let h = 0;
    const resize = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(cv);
    resize();

    let target: { x: number; y: number } | null = null; // the true cursor position
    let lastMove = 0;
    let ax: Axis | null = null;
    let ay: Axis | null = null;
    let conf = 0;
    let trail: { x: number; y: number }[] = [];
    let isLocked = false;

    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      target = { x: e.clientX - r.left, y: e.clientY - r.top };
      lastMove = performance.now();
    };
    const onLeave = () => (target = null);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, w, h);

      // 1. Predict: move the belief forward, even with nothing to measure.
      if (ax && ay) {
        ax = predict(ax, dt, TUNING);
        ay = predict(ay, dt, TUNING);
      }

      // 2. Measure: a detector never reports the exact spot, so add jitter.
      let raw: { x: number; y: number } | null = null;
      if (target) {
        raw = { x: target.x + gaussian() * SENSOR_NOISE, y: target.y + gaussian() * SENSOR_NOISE };
        if (!ax || !ay) {
          ax = createAxis(raw.x);
          ay = createAxis(raw.y);
        }
        // 3. Update: pull the belief toward the measurement by the Kalman gain.
        ax = update(ax, raw.x, TUNING);
        ay = update(ay, raw.y, TUNING);
      }
      if (!ax || !ay) return;

      const speed = Math.hypot(ax.vel, ay.vel);
      const goal = target ? 0.62 + 0.37 * Math.exp(-speed / 700) : 0;
      conf += (goal - conf) * Math.min(1, dt * (target ? 6 : 1.6));

      // The target left the frame and confidence ran out: drop the track.
      if (!target && conf < 0.05) {
        ax = ay = null;
        trail = [];
        if (hud.current) hud.current.textContent = "NO TARGET · move the cursor into the frame";
        return;
      }

      const still = target ? (now - lastMove) / 1000 : 0;
      const nowLocked = still >= LOCK_AFTER;
      if (nowLocked !== isLocked) {
        isLocked = nowLocked;
        if (nowLocked) setLocked(true); // the name stays filled once it has been locked
      }

      const x = ax.pos;
      const y = ay.pos;
      trail.push({ x, y });
      if (trail.length > TRAIL) trail.shift();

      // Smoothed trail, fading toward its tail.
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      for (let i = 1; i < trail.length; i++) {
        ctx.strokeStyle = colour("accent", (i / trail.length) * 0.7);
        ctx.beginPath();
        ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
        ctx.lineTo(trail[i].x, trail[i].y);
        ctx.stroke();
      }

      // Predicted point: where the filter thinks the target will be shortly.
      const px = lookAhead(ax, LOOK_AHEAD);
      const py = lookAhead(ay, LOOK_AHEAD);
      ctx.setLineDash([4, 5]);
      ctx.strokeStyle = colour("chalk", 0.5);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(px, py);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.stroke();

      // Raw detection: the jittery dot the filter is fed.
      if (raw) {
        ctx.fillStyle = colour("red");
        ctx.beginPath();
        ctx.arc(raw.x, raw.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Detection box: corner brackets while tracking, dashed while coasting.
      const tone = !target ? colour("mute") : isLocked ? colour("green") : colour("accent");
      const b = BOX / 2;
      const c = 14;
      ctx.strokeStyle = tone;
      ctx.lineWidth = 2;
      if (!target) {
        ctx.setLineDash([6, 6]);
        ctx.strokeRect(x - b, y - b, BOX, BOX);
        ctx.setLineDash([]);
      } else {
        ctx.beginPath();
        for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
          ctx.moveTo(x + sx * b, y + sy * (b - c));
          ctx.lineTo(x + sx * b, y + sy * b);
          ctx.lineTo(x + sx * (b - c), y + sy * b);
        }
        ctx.stroke();
        // A ring that fills while the cursor holds still.
        if (!isLocked && still > 0.15) {
          ctx.beginPath();
          ctx.arc(x, y, b + 10, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1, still / LOCK_AFTER));
          ctx.stroke();
        }
      }

      const status = !target ? "COASTING" : isLocked ? "LOCKED" : "TRACKING";
      ctx.font = `500 11px ${css.getPropertyValue("--font-mono").trim()}, monospace`;
      ctx.fillStyle = tone;
      ctx.fillText(`${status} ${conf.toFixed(2)}`, x - b, y - b - 8);

      if (hud.current) {
        const gain = ax.p00 / (ax.p00 + TUNING.measurementNoise);
        hud.current.textContent = `${status} · x ${pad(x)} y ${pad(y)} · v ${pad(speed)} px/s · gain ${gain.toFixed(2)} · conf ${conf.toFixed(2)}`;
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [live]);

  return (
    <section ref={section} className="relative overflow-hidden border-b border-edge">
      {live && <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 z-10 h-full w-full" />}

      <div className="page relative flex min-h-[calc(100svh-4rem)] flex-col justify-between gap-10 pb-8 pt-10">
        <div className="label flex flex-wrap justify-between gap-2 text-mute">
          <span>{profile.role}</span>
          <span>GITAM '27 · IIT Madras</span>
        </div>

        <div>
          <h1
            className={`text-[clamp(3.2rem,15vw,13rem)] font-extrabold uppercase leading-[0.84] tracking-tight transition-colors duration-700 ${
              locked ? "text-chalk" : "hollow"
            }`}
          >
            Jiten
            <span className={`block text-right transition-colors duration-700 ${locked ? "text-accent" : ""}`}>Ashrith</span>
          </h1>
          <p className="label mt-4 text-accent" aria-hidden={!live}>
            {live ? (locked ? "● Target locked" : "○ Move your cursor. Hold still to lock on.") : "● Target locked"}
          </p>
        </div>

        <div className="grid items-end gap-8 md:grid-cols-[1.4fr_1fr]">
          <p className="max-w-[44ch] text-lg text-chalk/80 md:text-xl">{profile.line}</p>
          <div className="relative z-20 flex flex-wrap gap-3 md:justify-end">
            <Link to="/work" className="rounded-full bg-accent px-6 py-3 font-semibold text-night">
              See the work →
            </Link>
            <Link to="/contact" className="rounded-full border border-chalk/30 px-6 py-3 hover:bg-chalk hover:text-night">
              Get in touch
            </Link>
          </div>
        </div>

        {live && (
          <div aria-hidden className="label flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-edge pt-4 text-mute">
            <p ref={hud} className="tabular-nums">NO TARGET · move the cursor into the frame</p>
            <p className="flex flex-wrap gap-x-5">
              <span><span className="text-red">●</span> raw detection</span>
              <span><span className="text-accent">━</span> Kalman estimate</span>
              <span>┄○ predicted</span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
