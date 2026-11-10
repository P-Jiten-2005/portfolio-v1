export type Answer = "positive" | "negative";

export type Case = {
  id: string;
  image: string | null;
  prompt: string;
  truth: Answer;
  model: Answer;
  confidence: number; // 0 to 1, the model's own confidence in its answer
};

export type Dataset = {
  placeholder?: boolean;
  project: string;
  caseStudy: string;
  labels: { positive: string; negative: string };
  cases: Case[];
};

export type Result = { you: number; model: number; total: number; verdict: "you" | "model" | "draw" };

/** Count correct answers for the visitor and the model over the cases answered. */
export function score(cases: Case[], answers: Answer[]): Result {
  let you = 0;
  let model = 0;
  cases.forEach((c, i) => {
    if (answers[i] === c.truth) you++;
    if (c.model === c.truth) model++;
  });
  return { you, model, total: cases.length, verdict: you > model ? "you" : model > you ? "model" : "draw" };
}

export function headline(r: Result): string {
  if (r.verdict === "model") return `My model beat you ${r.model} to ${r.you}.`;
  if (r.verdict === "you") return `You beat my model ${r.you} to ${r.model}.`;
  return `A draw: ${r.you} each.`;
}

/** Check the JSON has the shape the page needs, so a bad file fails loudly and early. */
export function isDataset(d: unknown): d is Dataset {
  const x = d as Dataset;
  const ans = (a: unknown) => a === "positive" || a === "negative";
  return (
    !!x &&
    typeof x.caseStudy === "string" &&
    !!x.labels &&
    typeof x.labels.positive === "string" &&
    typeof x.labels.negative === "string" &&
    Array.isArray(x.cases) &&
    x.cases.length > 0 &&
    x.cases.every((c) => typeof c.id === "string" && typeof c.prompt === "string" && ans(c.truth) && ans(c.model) && typeof c.confidence === "number")
  );
}
