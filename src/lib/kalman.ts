// A Kalman filter for one axis (x or y) of a moving point.
//
// It holds a belief about two things: where the point is (pos) and how fast it
// is moving (vel). Each frame it does two steps:
//
//   predict: "given my last belief, where should the point be now?"
//            The belief moves forward by vel * dt and becomes less certain.
//   update:  "a noisy measurement just arrived; how far do I move toward it?"
//            The answer is the Kalman gain, a number between 0 and 1. A gain
//            near 1 trusts the measurement, near 0 trusts the prediction.
//
// Uncertainty is kept in P, a 2x2 table: p00 is doubt about position, p11 is
// doubt about velocity, and p01/p10 say how the two errors move together.

export type Axis = {
  pos: number;
  vel: number;
  p00: number;
  p01: number;
  p10: number;
  p11: number;
};

export type Tuning = {
  /** How much the target's speed may change by itself. Higher follows turns faster but smooths less. */
  processNoise: number;
  /** How noisy the measurements are, as a variance in px². Higher smooths more but lags more. */
  measurementNoise: number;
};

export function createAxis(pos: number): Axis {
  // Start sure of nothing: large doubt, so the first measurements are trusted.
  return { pos, vel: 0, p00: 1000, p01: 0, p10: 0, p11: 1000 };
}

/** Move the belief forward by dt seconds, assuming constant velocity. */
export function predict(a: Axis, dt: number, t: Tuning): Axis {
  const q = t.processNoise;
  const dt2 = dt * dt;
  // P = F P Fᵀ + Q, with F = [[1, dt], [0, 1]] and Q from a random-acceleration model.
  const p00 = a.p00 + dt * (a.p10 + a.p01) + dt2 * a.p11 + (q * dt2 * dt2) / 4;
  const p01 = a.p01 + dt * a.p11 + (q * dt2 * dt) / 2;
  const p10 = a.p10 + dt * a.p11 + (q * dt2 * dt) / 2;
  const p11 = a.p11 + q * dt2;
  return { pos: a.pos + a.vel * dt, vel: a.vel, p00, p01, p10, p11 };
}

/** Blend in a measurement of position. */
export function update(a: Axis, measured: number, t: Tuning): Axis {
  const residual = measured - a.pos; // how wrong the prediction was
  const s = a.p00 + t.measurementNoise; // total doubt: ours plus the sensor's
  const k0 = a.p00 / s; // gain for position
  const k1 = a.p10 / s; // gain for velocity
  return {
    pos: a.pos + k0 * residual,
    vel: a.vel + k1 * residual,
    p00: (1 - k0) * a.p00,
    p01: (1 - k0) * a.p01,
    p10: a.p10 - k1 * a.p00,
    p11: a.p11 - k1 * a.p01,
  };
}

/** Where the filter expects the point to be `ahead` seconds from now. */
export function lookAhead(a: Axis, ahead: number): number {
  return a.pos + a.vel * ahead;
}

// Random number from a bell curve (Box-Muller). Used to fake sensor noise.
export function gaussian(random: () => number = Math.random): number {
  const u = Math.max(random(), 1e-12);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * random());
}
