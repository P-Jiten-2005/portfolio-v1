import { describe, expect, it } from "vitest";
import { headline, isDataset, score, type Case } from "../src/features/beat-the-model/score";

const c = (truth: Case["truth"], model: Case["model"]): Case => ({ id: truth + model, image: null, prompt: "?", truth, model, confidence: 0.9 });
const cases = [c("positive", "positive"), c("negative", "positive"), c("negative", "negative")];

describe("beat the model scoring", () => {
  it("counts both sides against the truth", () => {
    expect(score(cases, ["positive", "negative", "negative"])).toEqual({ you: 3, model: 2, total: 3, verdict: "you" });
    expect(score(cases, ["negative", "positive", "positive"])).toMatchObject({ you: 0, model: 2, verdict: "model" });
    expect(score(cases, ["positive", "positive", "negative"])).toMatchObject({ you: 2, model: 2, verdict: "draw" });
  });

  it("writes the headline for each outcome", () => {
    expect(headline({ you: 6, model: 8, total: 10, verdict: "model" })).toBe("My model beat you 8 to 6.");
    expect(headline({ you: 9, model: 8, total: 10, verdict: "you" })).toBe("You beat my model 9 to 8.");
    expect(headline({ you: 7, model: 7, total: 10, verdict: "draw" })).toBe("A draw: 7 each.");
  });

  it("rejects a malformed data file", () => {
    const good = { project: "p", caseStudy: "/work/p", labels: { positive: "Hit", negative: "Miss" }, cases };
    expect(isDataset(good)).toBe(true);
    expect(isDataset({ ...good, cases: [] })).toBe(false);
    expect(isDataset({ ...good, cases: [{ ...cases[0], truth: "maybe" }] })).toBe(false);
    expect(isDataset(null)).toBe(false);
  });
});
