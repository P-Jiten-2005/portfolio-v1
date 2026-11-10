import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { headline, isDataset, score, type Answer, type Dataset } from "./score";

type Load = { state: "loading" } | { state: "error" } | { state: "ready"; data: Dataset };

// The visitor labels each case, then sees how the model did on the same ones.
// Nothing is computed live: the model's answers were exported once into a
// static JSON file, which the page simply reads.
export default function BeatTheModel() {
  const [load, setLoad] = useState<Load>({ state: "loading" });
  const [answers, setAnswers] = useState<Answer[]>([]);
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let alive = true;
    fetch("/data/beat-the-model.json")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => alive && setLoad(isDataset(d) ? { state: "ready", data: d } : { state: "error" }))
      .catch(() => alive && setLoad({ state: "error" }));
    return () => {
      alive = false;
    };
  }, []);

  const done = load.state === "ready" && answers.length === load.data.cases.length;
  // When the results appear, move keyboard and screen-reader focus to them.
  useEffect(() => {
    if (done) heading.current?.focus();
  }, [done]);

  return (
    <section className="page border-t border-edge py-16" aria-labelledby="btm">
      <div className="label mb-8 flex flex-wrap justify-between gap-2 text-mute">
        <h2 id="btm">(Beat the model)</h2>
        <Link to="/work" className="hover:text-accent">Skip to the projects →</Link>
      </div>

      {load.state === "loading" && <p className="text-chalk/60">Loading cases…</p>}

      {load.state === "error" && (
        <p className="text-chalk/70">
          The cases didn't load.{" "}
          <Link to="/work" className="text-accent underline underline-offset-4">See the projects instead →</Link>
        </p>
      )}

      {load.state === "ready" && !done && <Round data={load.data} index={answers.length} onAnswer={(a) => setAnswers([...answers, a])} />}

      {load.state === "ready" && done && <Results data={load.data} answers={answers} headingRef={heading} onAgain={() => setAnswers([])} />}
    </section>
  );
}

function Round({ data, index, onAnswer }: { data: Dataset; index: number; onAnswer: (a: Answer) => void }) {
  const c = data.cases[index];
  const total = data.cases.length;
  return (
    <div className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:items-center">
      <div>
        <p className="text-[clamp(2rem,5vw,3.75rem)] font-bold leading-[0.95] tracking-tight">
          Can you out-guess <span className="font-serif font-normal italic text-accent">my model?</span>
        </p>
        <p className="mt-4 max-w-[40ch] text-chalk/70">
          {total} cases from a real project. Call each one, then see what the model said and how sure it was.
        </p>
        {data.placeholder && <p className="label mt-4 inline-block rounded border border-edge px-2 py-1 text-mute">Sample data · real cases coming</p>}
      </div>

      <div className="rounded-2xl border border-edge bg-panel p-6">
        <div className="label flex justify-between text-mute" aria-live="polite">
          <span>Case {index + 1} of {total}</span>
          <span aria-hidden>{"●".repeat(index)}{"○".repeat(total - index)}</span>
        </div>
        {c.image ? (
          <img src={c.image} alt={c.prompt} className="mt-4 aspect-video w-full rounded-xl bg-night object-contain" />
        ) : (
          <div className="mt-4 flex aspect-video items-center justify-center rounded-xl border border-dashed border-edge bg-night p-6 text-center text-chalk/60">
            {c.prompt}
          </div>
        )}
        {c.image && <p className="mt-3 text-chalk/80">{c.prompt}</p>}
        {/* key={c.id} gives each case fresh buttons, so focus doesn't sit on the last choice. */}
        <div key={c.id} className="mt-5 grid grid-cols-2 gap-3">
          <button onClick={() => onAnswer("positive")} className="rounded-full bg-accent py-3 font-semibold text-night">
            {data.labels.positive}
          </button>
          <button onClick={() => onAnswer("negative")} className="rounded-full border border-chalk/40 py-3 font-semibold hover:bg-chalk hover:text-night">
            {data.labels.negative}
          </button>
        </div>
      </div>
    </div>
  );
}

function Results({
  data,
  answers,
  headingRef,
  onAgain,
}: {
  data: Dataset;
  answers: Answer[];
  headingRef: React.RefObject<HTMLHeadingElement>;
  onAgain: () => void;
}) {
  const r = score(data.cases, answers);
  const name = (a: Answer) => data.labels[a];
  const mark = (ok: boolean) => <span className={ok ? "text-green" : "text-red"}>{ok ? "✓" : "✗"}</span>;

  return (
    <div>
      <h3 ref={headingRef} tabIndex={-1} className="text-[clamp(2rem,5vw,3.75rem)] font-bold leading-[0.95] tracking-tight outline-none">
        {headline(r)}
      </h3>
      <p className="mt-3 text-chalk/70">
        You {r.you}/{r.total} · Model {r.model}/{r.total}
      </p>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[30rem] text-left">
          <thead className="label text-mute">
            <tr className="border-b border-edge">
              <th className="py-2 pr-4 font-normal">Case</th>
              <th className="py-2 pr-4 font-normal">Truth</th>
              <th className="py-2 pr-4 font-normal">You</th>
              <th className="py-2 pr-4 font-normal">Model</th>
              <th className="py-2 font-normal">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {data.cases.map((c, i) => (
              <tr key={c.id} className="border-b border-edge">
                <td className="py-2 pr-4 text-mute">{String(i + 1).padStart(2, "0")}</td>
                <td className="py-2 pr-4">{name(c.truth)}</td>
                <td className="py-2 pr-4">{name(answers[i])} {mark(answers[i] === c.truth)}</td>
                <td className="py-2 pr-4">{name(c.model)} {mark(c.model === c.truth)}</td>
                <td className="py-2">
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-20 overflow-hidden rounded-full bg-edge" aria-hidden>
                      <span className="block h-full bg-accent" style={{ width: `${c.confidence * 100}%` }} />
                    </span>
                    <span className="tabular-nums">{Math.round(c.confidence * 100)}%</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to={data.caseStudy} className="rounded-full bg-accent px-6 py-3 font-semibold text-night">
          How the model works →
        </Link>
        <button onClick={onAgain} className="rounded-full border border-chalk/30 px-6 py-3 hover:bg-chalk hover:text-night">
          Play again
        </button>
      </div>
    </div>
  );
}
