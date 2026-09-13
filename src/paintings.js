const W = 640, H = 800, TAU = Math.PI * 2;
const cache = new Map();

const C = {
  porcelain: '#f3ece2', porcelainCool: '#e8edf0',
  ultramarine: '#2a469a', ultramarineDeep: '#16265c',
  terracotta: '#b8532f', terracottaSoft: '#cf7e54',
  icyTeal: '#83d6cb', icyTealDeep: '#3f9d97',
  darkPlum: '#3c1f40', darkPlumDeep: '#231029',
  paleButter: '#eecf72', paleButterSoft: '#f3e2ab',
  deepGreen: '#204b3a', deepGreenDeep: '#12332a',
  paperWarm: '#ece3d2', studioGrey: '#cdc5b8', inkNear: '#0c0d12',
  oxblood: '#5a1e24', ochre: '#c98f3a',
};

const PALETTES = {
  mineral: [
    [C.porcelain, C.terracotta, C.darkPlum, C.paleButter],
    [C.porcelainCool, C.icyTealDeep, C.deepGreen, C.paleButterSoft],
    [C.paperWarm, C.terracottaSoft, C.ultramarineDeep, C.darkPlum],
  ],
  watercolor: [
    [C.porcelain, C.ultramarine, C.terracottaSoft, C.paleButter],
    [C.paperWarm, C.icyTealDeep, C.terracotta, C.ochre],
    [C.porcelainCool, C.darkPlum, C.icyTeal, C.paleButter],
  ],
  field: [
    [C.oxblood, C.terracotta, C.darkPlumDeep],
    [C.ochre, C.paleButter, C.terracotta],
    [C.deepGreenDeep, C.icyTealDeep, C.paleButterSoft],
    [C.ultramarineDeep, C.ultramarine, C.darkPlumDeep],
    [C.darkPlum, C.terracottaSoft, C.paleButter],
  ],
  geometry: [
    [C.porcelain, C.ultramarine, C.terracotta, C.paleButter, C.inkNear],
    [C.paperWarm, C.deepGreen, C.terracottaSoft, C.paleButterSoft, C.darkPlum],
    [C.porcelainCool, C.icyTealDeep, C.ultramarineDeep, C.paleButter, C.terracotta],
  ],
  sculpture: [
    [C.paperWarm, C.terracotta, C.porcelain, C.paleButter],
    [C.porcelainCool, C.ultramarine, C.icyTeal, C.porcelain],
    [C.studioGrey, C.deepGreen, C.paleButterSoft, C.terracottaSoft],
  ],
  relief: [
    [C.porcelain, C.paperWarm, C.studioGrey],
    [C.porcelainCool, C.icyTeal, C.icyTealDeep, C.deepGreen],
    [C.paleButterSoft, C.terracottaSoft, C.terracotta, C.darkPlum],
  ],
  cellular: [
    [C.ultramarineDeep, C.icyTeal, C.porcelainCool, C.deepGreen],
    [C.darkPlumDeep, C.icyTealDeep, C.paleButterSoft, C.porcelain],
    [C.deepGreenDeep, C.icyTeal, C.ultramarine, C.porcelain],
  ],
};

function hashSeed(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
  h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^ (h >>> 16)) >>> 0;
}
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const lerp = (a, b, t) => a + (b - a) * t;
const rand = (rng, a, b) => a + rng() * (b - a);
const pick = (rng, arr) => arr[(rng() * arr.length) | 0];
const gauss = rng => Math.sqrt(-2 * Math.log(1 - rng())) * Math.cos(TAU * rng());
const noiseSeed = rng => (rng() * 4294967296) >>> 0;
const canvas = (w, h) => Object.assign(document.createElement('canvas'), { width: w, height: h });

function hex2rgb(hex) { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function css(c, a = 1) { const [r, g, b] = typeof c === 'string' ? hex2rgb(c) : c; return `rgba(${r | 0},${g | 0},${b | 0},${a})`; }
function adjust([r, g, b], amt) { const t = Math.min(1, Math.abs(amt)), tar = amt < 0 ? 0 : 255; return [r + (tar - r) * t, g + (tar - g) * t, b + (tar - b) * t]; }
function shade(hex, amt) { return adjust(hex2rgb(hex), amt); }
function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
function stops(colors, t) { const n = colors.length - 1, s = Math.min(n - 1, Math.max(0, Math.floor(t * n))); return mix(colors[s], colors[s + 1], t * n - s); }

function makeNoise(seed) {
  function hash(ix, iy) {
    let h = ix * 374761393 + iy * 668265263 + seed;
    h = (h ^ (h >>> 13)) * 1274126177; h = h ^ (h >>> 16);
    return (h >>> 0) / 4294967296;
  }
  function noise2(x, y) {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    return lerp(lerp(hash(xi, yi), hash(xi + 1, yi), u), lerp(hash(xi, yi + 1), hash(xi + 1, yi + 1), u), v);
  }
  function fbm(x, y, oct = 4) {
    let sum = 0, amp = .5, freq = 1, norm = 0;
    for (let i = 0; i < oct; i++) { sum += noise2(x * freq, y * freq) * amp; norm += amp; amp *= .5; freq *= 2.03; }
    return sum / norm;
  }
  return { noise2, fbm };
}
function warp(noise, x, y, amt) {
  const qx = noise.fbm(x, y, 3), qy = noise.fbm(x + 5.2, y + 1.3, 3);
  const rx = noise.fbm(x + 4 * qx + 1.7, y + 4 * qy + 9.2, 3), ry = noise.fbm(x + 4 * qx + 8.3, y + 4 * qy + 2.8, 3);
  return noise.fbm(x + amt * rx, y + amt * ry, 5);
}
function grain(ctx, rng, amount) {
  const img = ctx.getImageData(0, 0, W, H), d = img.data;
  for (let i = 0; i < d.length; i += 4) { const n = (rng() - .5) * amount; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
  ctx.putImageData(img, 0, 0);
}
function deform(rng, pts, depth) {
  for (let d = 0; d < depth; d++) {
    pts = pts.flatMap((a, i) => {
      const b = pts[(i + 1) % pts.length], len = Math.hypot(b.x - a.x, b.y - a.y), v = (a.v + b.v) / 2;
      return [a, { x: (a.x + b.x) / 2 + gauss(rng) * len * v, y: (a.y + b.y) / 2 + gauss(rng) * len * v, v: v * rand(rng, .7, 1.15) }];
    });
  }
  return pts;
}
function polygon(ctx, pts) { ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.closePath(); }
function pixels(w, h, shader) {
  const buf = canvas(w, h), bctx = buf.getContext('2d'), img = bctx.createImageData(w, h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const [r, g, b] = shader(x, y), i = (y * w + x) * 4;
    img.data[i] = r; img.data[i + 1] = g; img.data[i + 2] = b; img.data[i + 3] = 255;
  }
  bctx.putImageData(img, 0, 0);
  return buf;
}

function mineral(ctx, rng, pal) {
  const noise = makeNoise(noiseSeed(rng));
  const freq = rand(rng, 2.6, 4.2), warpAmt = rand(rng, 1.6, 2.8);
  const angle = rand(rng, 0, TAU), stretch = rand(rng, .6, 1.6);
  const cos = Math.cos(angle), sin = Math.sin(angle), colors = pal.map(hex2rgb);
  ctx.drawImage(pixels(200, 250, (x, y) => {
    const nx = x / 200 - .5, ny = y / 250 - .5;
    const v = warp(noise, (nx * cos - ny * sin * stretch) * freq + 10, (nx * sin + ny * cos * stretch) * freq + 10, warpAmt);
    return stops(colors, Math.pow(v, 1.15));
  }), 0, 0, W, H);
  grain(ctx, rng, 7);
}

function watercolor(ctx, rng, pal) {
  ctx.fillStyle = pal[0]; ctx.fillRect(0, 0, W, H);
  const blooms = 3 + (rng() * 4 | 0), wash = canvas(W, H), wctx = wash.getContext('2d');
  for (let b = 0; b < blooms; b++) {
    const cx = rand(rng, 80, W - 80), cy = rand(rng, 100, H - 100), r = rand(rng, 100, 230);
    const stretch = rand(rng, .55, 1.45), rot = rand(rng, 0, TAU), cos = Math.cos(rot), sin = Math.sin(rot);
    const base = deform(rng, Array.from({ length: 10 }, (_, i) => {
      const ex = Math.cos(i / 10 * TAU) * r * stretch, ey = Math.sin(i / 10 * TAU) * r / stretch;
      return { x: cx + ex * cos - ey * sin, y: cy + ex * sin + ey * cos, v: rand(rng, .05, .3) };
    }), 3);
    wctx.clearRect(0, 0, W, H);
    wctx.fillStyle = pal[1 + b % (pal.length - 1)];
    for (let layer = 1; layer <= 36; layer++) {
      wctx.globalAlpha = .035; polygon(wctx, deform(rng, base, 3)); wctx.fill();
      if (layer % 6) continue;
      wctx.globalCompositeOperation = 'destination-out'; wctx.globalAlpha = .06;
      for (let k = 0; k < 48; k++) { wctx.beginPath(); wctx.arc(cx + gauss(rng) * r, cy + gauss(rng) * r, rand(rng, 3, 22), 0, TAU); wctx.fill(); }
      wctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalCompositeOperation = 'multiply'; ctx.drawImage(wash, 0, 0); ctx.globalCompositeOperation = 'source-over';
  }
  grain(ctx, rng, 10);
}

function field(ctx, rng, pal) {
  const [ground, ...colors] = pal;
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, css(shade(ground, .08))); bg.addColorStop(1, css(shade(ground, -.12)));
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  const n = 1 + (rng() * 3 | 0), m = rand(rng, 40, 70), gap = rand(rng, 22, 50);
  const weights = Array.from({ length: n }, () => rand(rng, .5, 1.7)), total = weights.reduce((a, b) => a + b);
  let y = m + rand(rng, -12, 12);
  weights.forEach((weight, i) => {
    const h = (H - 2 * m - gap * (n - 1)) * weight / total, color = colors[i % colors.length], w = W - 2 * m;
    const edge = [];
    for (let t = 0; t < 1; t += .1) edge.push({ x: m + t * w, y, v: .04 });
    for (let t = 0; t < 1; t += .2) edge.push({ x: W - m, y: y + t * h, v: .04 });
    for (let t = 1; t > 0; t -= .1) edge.push({ x: m + t * w, y: y + h, v: .04 });
    for (let t = 1; t > 0; t -= .2) edge.push({ x: m, y: y + t * h, v: .04 });
    ctx.save();
    ctx.shadowColor = css(shade(color, .25), .55); ctx.shadowBlur = 60;
    ctx.fillStyle = css(color, .35); polygon(ctx, edge); ctx.fill();
    ctx.restore();
    ctx.fillStyle = color; ctx.globalAlpha = .06;
    for (let layer = 0; layer < 34; layer++) { polygon(ctx, deform(rng, edge, 2)); ctx.fill(); }
    ctx.lineCap = 'round';
    for (let s = 0; s < 700; s++) {
      const sx = rand(rng, m - 10, W - m + 10), sy = rand(rng, y, y + h), len = rand(rng, 20, 160);
      ctx.globalAlpha = rand(rng, .03, .1);
      ctx.strokeStyle = css(adjust(hex2rgb(color), gauss(rng) * .2)); ctx.lineWidth = rand(rng, 3, 18);
      ctx.beginPath(); ctx.moveTo(sx - len / 2, sy); ctx.quadraticCurveTo(sx, sy + gauss(rng) * 5, sx + len / 2, sy + gauss(rng) * 3); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    y += h + gap;
  });
  grain(ctx, rng, 9);
}

function geometry(ctx, rng, pal) {
  const [ground, ...inks] = pal, cols = pick(rng, [3, 4, 4, 5]), s = W / cols, rows = Math.ceil(H / s);
  ctx.fillStyle = ground; ctx.fillRect(0, 0, W, H);
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const back = pick(rng, [ground, ground, ...inks]);
    let front = pick(rng, inks); if (front === back) front = ground;
    ctx.save(); ctx.translate((i + .5) * s, (j + .5) * s); ctx.rotate((rng() * 4 | 0) * TAU / 4); ctx.translate(-s / 2, -s / 2);
    ctx.fillStyle = back; ctx.fillRect(-.5, -.5, s + 1, s + 1);
    ctx.fillStyle = front; ctx.beginPath();
    switch (rng() * 7 | 0) {
      case 0: ctx.moveTo(0, 0); ctx.arc(0, 0, s, 0, TAU / 4); break;
      case 1: ctx.arc(s / 2, s, s / 2, Math.PI, 0); break;
      case 2: ctx.arc(s / 2, s / 2, s * .36, 0, TAU); break;
      case 3: ctx.moveTo(0, 0); ctx.lineTo(s, 0); ctx.lineTo(0, s); break;
      case 4: for (let k = 0; k < 4; k++) ctx.rect(0, k * s / 4, s, s / 8); break;
      case 5: ctx.moveTo(0, s); ctx.arc(0, 0, s, TAU / 4, 0, true); ctx.arc(s, s, s, -TAU / 4, Math.PI, true); break;
      case 6: ctx.arc(s / 2, s / 2, s * .42, 0, TAU); ctx.arc(s / 2, s / 2, s * .2, 0, TAU, true); break;
    }
    ctx.fill('evenodd'); ctx.restore();
  }
  grain(ctx, rng, 14);
}

function sculpture(ctx, rng, pal) {
  const bw = 320, bh = 400, [floor, ...colors] = pal.map(hex2rgb);
  const forms = Array.from({ length: 4 + (rng() * 4 | 0) }, () => ({ x: rand(rng, 70, bw - 70), y: rand(rng, 80, bh - 90), r: rand(rng, 30, 76), c: pick(rng, colors) }));
  const L = [-.42, -.56, .71], Hv = [-.42 / 1.85, -.56 / 1.85, 1.71 / 1.85];
  ctx.drawImage(pixels(bw, bh, (x, y) => {
    let h = 0, gx = 0, gy = 0, r = 0, g = 0, b = 0, weight = 0, shadow = 0;
    for (const f of forms) {
      const dx = x - f.x, dy = y - f.y, rr = f.r * f.r, q = Math.exp(-(dx * dx + dy * dy) / rr), q2 = q * q;
      h += q; gx -= 2 * dx / rr * q; gy -= 2 * dy / rr * q;
      r += f.c[0] * q2; g += f.c[1] * q2; b += f.c[2] * q2; weight += q2;
      const sx = dx - f.r * .55, sy = dy - f.r * .75;
      shadow += Math.exp(-(sx * sx + sy * sy) / (rr * 1.5));
    }
    const ground = floor.map(c => c * (1.04 - y / bh * .14) * (1 - Math.min(1, shadow * .55 + h * .4) * .38));
    const edge = Math.min(1, Math.max(0, (h - .5) / (Math.hypot(gx, gy) + 1e-4) + .5));
    if (!edge) return ground;
    const slope = 30 / Math.sqrt(Math.max(h - .5, 0) + .015);
    const nx = -gx * slope, ny = -gy * slope, nl = Math.hypot(nx, ny, 1);
    const diffuse = Math.max(0, (nx * L[0] + ny * L[1] + L[2]) / nl);
    const spec = Math.pow(Math.max(0, (nx * Hv[0] + ny * Hv[1] + Hv[2]) / nl), 30);
    const lit = .32 + diffuse * .78;
    return [r, g, b].map((c, i) => lerp(ground[i], Math.min(255, c / weight * lit + spec * 55), edge));
  }), 0, 0, W, H);
  grain(ctx, rng, 6);
}

function relief(ctx, rng, pal) {
  const noise = makeNoise(noiseSeed(rng)), gw = 161, gh = 201, f = rand(rng, 1.3, 2.4), levels = 5 + (rng() * 4 | 0);
  const grid = new Float32Array(gw * gh), ox = rand(rng, 0, 90), oy = rand(rng, 0, 90);
  for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) grid[j * gw + i] = noise.fbm(i / gw * f + ox, j / gh * f * 1.25 + oy, 3);
  let lo = Infinity, hi = -Infinity;
  for (const v of grid) { lo = Math.min(lo, v); hi = Math.max(hi, v); }
  const level = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const gx = x / W * (gw - 1), gy = y / H * (gh - 1), i = gx | 0, j = gy | 0, u = gx - i, v = gy - j;
    const h = lerp(lerp(grid[j * gw + i], grid[j * gw + i + 1], u), lerp(grid[(j + 1) * gw + i], grid[(j + 1) * gw + i + 1], u), v);
    level[y * W + x] = Math.min(levels - 1, (h - lo) / (hi - lo) * levels | 0);
  }
  const img = ctx.createImageData(W, H), d = img.data, colors = pal.map(hex2rgb);
  const tones = Array.from({ length: levels }, (_, l) => stops(colors, l / (levels - 1)));
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x, l = level[i];
    let shadow = 0;
    for (let k = 3; k <= 30; k += 3) {
      const sx = x - k, sy = y - (k * 1.3 | 0);
      if (sx < 0 || sy < 0) break;
      if (level[sy * W + sx] > l) { shadow = (1 - k / 33) ** 1.5; break; }
    }
    const lit = x > 1 && y > 1 && level[i - W - 1] < l ? .22 : 0;
    const [r, g, b] = adjust(tones[l], lit - shadow * .28);
    d[i * 4] = r; d[i * 4 + 1] = g; d[i * 4 + 2] = b; d[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  grain(ctx, rng, 8);
}

function cellular(ctx, rng, pal) {
  const bw = 320, bh = 400, [lead, ...colors] = pal.map(hex2rgb);
  const sites = Array.from({ length: 24 + (rng() * 18 | 0) }, () => ({ x: rand(rng, -20, bw + 20), y: rand(rng, -20, bh + 20), c: adjust(pick(rng, colors), gauss(rng) * .08) }));
  ctx.drawImage(pixels(bw, bh, (x, y) => {
    let a, b, da = Infinity, db = Infinity;
    for (const s of sites) {
      const d = (x - s.x) ** 2 + (y - s.y) ** 2;
      if (d < da) { db = da; b = a; da = d; a = s; } else if (d < db) { db = d; b = s; }
    }
    const gap = Math.hypot(b.x - a.x, b.y - a.y), edge = (db - da) / (2 * gap);
    if (edge < 1.4) return lead;
    const bevel = Math.max(0, 1 - (edge - 1.4) / 7);
    const facing = ((b.x - a.x) * -.6 + (b.y - a.y) * -.8) / gap;
    const glow = Math.max(0, 1 - Math.sqrt(da) / 90) * .12;
    return adjust(a.c, glow + bevel * facing * .38 - bevel * .06);
  }), 0, 0, W, H);
  grain(ctx, rng, 6);
}

export const STYLES = ['mineral', 'watercolor', 'field', 'geometry', 'sculpture', 'relief', 'cellular'];
const RENDERERS = { mineral, watercolor, field, geometry, sculpture, relief, cellular };

export function painting(seed, style) {
  const key = `${seed}:${style || ''}`;
  if (cache.has(key)) return cache.get(key);
  const h = hashSeed(String(seed)), rng = mulberry32(h);
  const chosen = RENDERERS[style] ? style : STYLES[h % STYLES.length];
  const art = canvas(W, H), ctx = art.getContext('2d', { willReadFrequently: true });
  RENDERERS[chosen](ctx, rng, pick(rng, PALETTES[chosen]));
  const url = art.toDataURL('image/jpeg', .9);
  cache.set(key, url);
  return url;
}
