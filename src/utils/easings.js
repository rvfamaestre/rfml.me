const cubicBezier = (t, p1x, p1y, p2x, p2y) => {
  const cx = 3 * p1x;
  const bx = 3 * (p2x - p1x) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * p1y;
  const by = 3 * (p2y - p1y) - cy;
  const ay = 1 - cy - by;

  const sampleCurveX = (x) => ((ax * x + bx) * x + cx) * x;
  const sampleCurveY = (x) => ((ay * x + by) * x + cy) * x;
  const sampleDerivX = (x) => (3 * ax * x + 2 * bx) * x + cx;

  let x = t;
  for (let i = 0; i < 6; i += 1) {
    const dx = sampleCurveX(x) - t;
    if (Math.abs(dx) < 1e-4) break;
    const d = sampleDerivX(x);
    if (Math.abs(d) < 1e-6) break;
    x -= dx / d;
  }

  let lo = 0;
  let hi = 1;
  while (sampleCurveX(x) - t > 1e-4) {
    if (sampleCurveX(x) > t) {
      hi = x;
    } else {
      lo = x;
    }
    x = 0.5 * (lo + hi);
  }

  return sampleCurveY(x);
};

export const easeStandard = (t) => cubicBezier(t, 0.65, 0.05, 0.36, 1);
export const easeDramatic = (t) => cubicBezier(t, 0.77, 0, 0.18, 1);
