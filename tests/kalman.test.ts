import { describe, expect, it } from "vitest";
import { createAxis, gaussian, lookAhead, predict, update, type Tuning } from "../src/lib/kalman";

const tuning: Tuning = { processNoise: 400, measurementNoise: 100 };
const dt = 1 / 60;

// A small repeatable random source, so the tests give the same result every run.
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

describe("kalman filter", () => {
  it("settles on a target that stands still", () => {
    const rnd = seeded(1);
    let a = createAxis(0);
    for (let i = 0; i < 300; i++) a = update(predict(a, dt, tuning), 200 + gaussian(rnd) * 10, tuning);
    expect(Math.abs(a.pos - 200)).toBeLessThan(5);
    expect(Math.abs(a.vel)).toBeLessThan(40);
  });

  it("is closer to the truth than the raw measurements", () => {
    const rnd = seeded(2);
    let a = createAxis(0);
    let rawErr = 0;
    let filtErr = 0;
    let n = 0;
    for (let i = 0; i < 600; i++) {
      const truth = 100 + i * 2; // moving at a steady 120 px/s
      const z = truth + gaussian(rnd) * 10;
      a = update(predict(a, dt, tuning), z, tuning);
      if (i > 120) {
        rawErr += (z - truth) ** 2;
        filtErr += (a.pos - truth) ** 2;
        n++;
      }
    }
    expect(Math.sqrt(filtErr / n)).toBeLessThan(Math.sqrt(rawErr / n) * 0.7);
  });

  it("learns the velocity and predicts ahead with it", () => {
    let a = createAxis(0);
    for (let i = 0; i < 300; i++) a = update(predict(a, dt, tuning), i * 2, tuning);
    expect(a.vel).toBeGreaterThan(110);
    expect(a.vel).toBeLessThan(130);
    expect(lookAhead(a, 0.5)).toBeCloseTo(a.pos + a.vel * 0.5);
  });

  it("grows less certain when it only predicts", () => {
    let a = createAxis(0);
    for (let i = 0; i < 100; i++) a = update(predict(a, dt, tuning), 50, tuning);
    const before = a.p00;
    for (let i = 0; i < 30; i++) a = predict(a, dt, tuning);
    expect(a.p00).toBeGreaterThan(before);
  });
});
