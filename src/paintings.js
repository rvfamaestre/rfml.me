const W = 640, H = 800, TAU = Math.PI * 2;
const cache = new Map();

export const PALETTES = [
  ['#f6ead8', '#e4572e', '#8c2f39', '#f3a712', '#2b1b17'],
  ['#eef3e2', '#2f6f5e', '#9cd08f', '#e7f59e', '#16302b'],
  ['#141a33', '#5b6cf0', '#c1b2f5', '#f5b7a8', '#2a2f6b'],
  ['#fbe9e4', '#e05a6f', '#7a2848', '#f6a57d', '#fff4d6'],
  ['#f2eee4', '#1f2a2c', '#b9a77c', '#d86f45', '#e7dfcb'],
  ['#0f2d45', '#13869e', '#56d2c8', '#f2d98a', '#e9f4f1'],
  ['#f7e5c8', '#cf6f2c', '#8a3434', '#ecb45c', '#3b2a22'],
  ['#ece4f7', '#7d4bc2', '#2a2355', '#e0a3cf', '#f7f0ff'],
  ['#e8f1f5', '#2a5fa8', '#12294d', '#8ec5dc', '#f4c95d'],
  ['#261d24', '#d85f46', '#f0b289', '#8a7497', '#f4e9dc'],
  ['#f4f1dc', '#7c9438', '#2d5845', '#cdd57a', '#e98a3b'],
  ['#f6e2d3', '#b3412f', '#582725', '#ee8a66', '#2f4858'],
  ['#223648', '#aac0d2', '#e6f0f2', '#6a8ba5', '#f28c38'],
  ['#f5e9f0', '#b06a9b', '#55406b', '#dcb3cb', '#f2c14e'],
  ['#26332f', '#a7bb8a', '#e4dcae', '#5f7d66', '#d9734e'],
  ['#eee8dc', '#232323', '#c0b8a6', '#e0522c', '#3d6fb6'],
  ['#f8ecc2', '#e6b12f', '#c3452e', '#7f5e2e', '#f1dd9a'],
  ['#1e2144', '#6b78c8', '#b7c4ea', '#f3d1b0', '#e46a6a'],
];

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
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const rand = (rng, a, b) => a + rng() * (b - a);
const pick = (rng, arr) => arr[(rng() * arr.length) | 0];
const gauss = rng => Math.sqrt(-2 * Math.log(1 - rng())) * Math.cos(TAU * rng());
const noiseSeed = rng => (rng() * 4294967296) >>> 0;
const canvas = (w, h) => Object.assign(document.createElement('canvas'), { width: w, height: h });
function shuffle(rng, arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = rng() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function hex2rgb(hex) { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function css(c, a = 1) { const [r, g, b] = typeof c === 'string' ? hex2rgb(c) : c; return `rgba(${r | 0},${g | 0},${b | 0},${a})`; }
function adjust([r, g, b], amt) { const t = Math.min(1, Math.abs(amt)), tar = amt < 0 ? 0 : 255; return [r + (tar - r) * t, g + (tar - g) * t, b + (tar - b) * t]; }
function shade(hex, amt) { return adjust(hex2rgb(hex), amt); }
function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
function stops(colors, t) { const n = colors.length - 1, s = Math.min(n - 1, Math.max(0, Math.floor(t * n))); return mix(colors[s], colors[s + 1], t * n - s); }
const luma = ([r, g, b]) => (r * .3 + g * .59 + b * .11) / 255;

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
    ctx.globalCompositeOperation = luma(hex2rgb(pal[0])) < .5 ? 'screen' : 'multiply'; ctx.drawImage(wash, 0, 0); ctx.globalCompositeOperation = 'source-over';
  }
  grain(ctx, rng, 10);
}

function field(ctx, rng, pal) {
  const [ground, ...colors] = pal;
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, css(shade(ground, .08))); bg.addColorStop(1, css(shade(ground, -.12)));
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  const n = 2 + (rng() * 2 | 0), m = rand(rng, 40, 70), gap = rand(rng, 22, 50);
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

function veils(ctx, rng, pal) {
  ctx.fillStyle = pal[0]; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(rand(rng, -1, 1));
  for (let i = 0; i < 9; i++) {
    const x = rand(rng, -420, 220), width = rand(rng, 100, 340), color = pal[1 + i % (pal.length - 1)];
    const gradient = ctx.createLinearGradient(x, 0, x + width, 0);
    gradient.addColorStop(0, css(color, 0));
    gradient.addColorStop(.7, css(color, .8));
    gradient.addColorStop(1, css(color, .12));
    ctx.fillStyle = gradient; ctx.beginPath(); ctx.moveTo(x, -H);
    ctx.bezierCurveTo(x + width * 2, -100, x - width, 100, x + width, H);
    ctx.lineTo(x + width * 2, H);
    ctx.bezierCurveTo(x + width, 100, x + width * 3, -100, x + width, -H);
    ctx.closePath(); ctx.fill();
  }
  ctx.restore(); grain(ctx, rng, 9);
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
      case 4: ctx.arc(0, s / 2, s / 2, -TAU / 4, TAU / 4); break;
      case 5: ctx.moveTo(0, s); ctx.arc(0, 0, s, TAU / 4, 0, true); ctx.arc(s, s, s, -TAU / 4, Math.PI, true); break;
      case 6: ctx.arc(s / 2, s / 2, s * .42, 0, TAU); ctx.arc(s / 2, s / 2, s * .2, 0, TAU, true); break;
    }
    ctx.fill('evenodd'); ctx.restore();
  }
  grain(ctx, rng, 14);
}

function halftone(ctx, rng, pal) {
  const noise = makeNoise(noiseSeed(rng)), [ground, ...inks] = pal, reach = Math.hypot(W, H) / 2 + 30;
  ctx.fillStyle = ground; ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = luma(hex2rgb(ground)) < .5 ? 'screen' : 'multiply';
  shuffle(rng, inks).slice(0, 3).forEach((ink, n) => {
    const step = rand(rng, 12, 20), angle = rand(rng, 0, TAU), cos = Math.cos(angle), sin = Math.sin(angle);
    const f = rand(rng, 1.2, 2.4), cut = rand(rng, .42, .52), ox = rand(rng, 0, 99);
    ctx.fillStyle = ink;
    for (let v = -reach; v < reach; v += step) for (let u = -reach; u < reach; u += step) {
      const x = W / 2 + u * cos - v * sin, y = H / 2 + u * sin + v * cos;
      if (x < -step || y < -step || x > W + step || y > H + step) continue;
      const r = step * .72 * clamp((noise.fbm(x / W * f + ox, y / H * f * 1.25 + n * 9, 4) - cut) * 5, 0, 1);
      if (r > .8) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
    }
  });
  ctx.globalCompositeOperation = 'source-over';
  grain(ctx, rng, 10);
}

function squeegee(ctx, rng, pal) {
  const noise = makeNoise(noiseSeed(rng)), colors = pal.map(hex2rgb), angle = rand(rng, .3, .6) * (rng() < .5 ? -1 : 1), cos = Math.cos(angle), sin = Math.sin(angle);
  const drags = Array.from({ length: 7 + (rng() * 4 | 0) }, (_, i) => ({
    c: colors[i % colors.length], top: rand(rng, -140, 360), height: rand(rng, 90, 280),
    fade: rand(rng, 0, .45), wear: rand(rng, .36, .48), o: rand(rng, 0, 99)
  }));
  ctx.drawImage(pixels(320, 400, (px, py) => {
    const x = px * cos + (py - 200) * sin, y = (py - 200) * cos - px * sin + 200;
    let c = colors[0];
    for (const d of drags) {
      const v = (y - d.top) / d.height;
      if (v < 0 || v > 1) continue;
      const streak = noise.fbm(x * .005 + d.o, y * .05 + d.o, 5);
      const paint = streak - d.wear + Math.min(v, 1 - v) * .9 - x / 320 * d.fade;
      if (paint > 0) c = mix(c, adjust(d.c, (streak - .5) * .45), Math.min(1, paint * 5));
    }
    return c;
  }), 0, 0, W, H);
  grain(ctx, rng, 8);
}

function folds(ctx, rng, pal) {
  const colors = pal.map(hex2rgb), faces = [colors[0], colors[1], colors[3]];
  const creases = Array.from({ length: 3 + (rng() * 3 | 0) }, () => {
    const a = rand(rng, 0, Math.PI), nx = Math.cos(a), ny = Math.sin(a);
    return { nx, ny, d: rand(rng, .15, .85) * 320 * nx + rand(rng, .15, .85) * 400 * ny, light: rand(rng, .06, .2) };
  });
  ctx.drawImage(pixels(320, 400, (x, y) => {
    let flips = 0, light = -y / 400 * .08;
    for (const c of creases) {
      const s = x * c.nx + y * c.ny - c.d;
      if (s > 0) flips++;
      light += Math.sign(s) * c.light * (1 - Math.exp(-Math.abs(s) / 14)) + Math.exp(-Math.abs(s) / 1.5) * .08;
    }
    return adjust(faces[flips % 3], light);
  }), 0, 0, W, H);
  grain(ctx, rng, 7);
}

function collage(ctx, rng, pal) {
  const [ground, ...inks] = pal;
  ctx.fillStyle = ground; ctx.fillRect(0, 0, W, H);
  for (let i = 0, n = 5 + (rng() * 3 | 0); i < n; i++) {
    const r = rand(rng, 120, 250) * (1 - i / n * .55);
    ctx.save(); ctx.translate(clamp(W / 2 + gauss(rng) * 170, 0, W), clamp(H / 2 + gauss(rng) * 210, 0, H)); ctx.rotate((rng() * 4 | 0) * TAU / 4 + gauss(rng) * .06);
    ctx.shadowColor = 'rgba(30,20,10,.3)'; ctx.shadowBlur = 22; ctx.shadowOffsetX = 5; ctx.shadowOffsetY = 12;
    ctx.fillStyle = inks[i % inks.length]; ctx.beginPath();
    switch (rng() * 4 | 0) {
      case 0: ctx.arc(0, 0, r, Math.PI, 0); ctx.lineTo(r, r * 1.3); ctx.lineTo(-r, r * 1.3); break;
      case 1: ctx.arc(0, 0, r * .8, 0, TAU); break;
      case 2: ctx.roundRect(-r * .38, -r, r * .76, r * 2, r * .38); break;
      case 3: ctx.moveTo(-r, r); ctx.arc(-r, r, r * 2, -TAU / 4, 0); break;
    }
    ctx.fill(); ctx.restore();
  }
  grain(ctx, rng, 10);
}

function glow(ctx, rng, pal) {
  const [ground, ...rest] = pal, lg = luma(hex2rgb(ground));
  const inks = rest.sort((p, q) => Math.abs(luma(hex2rgb(q)) - lg) - Math.abs(luma(hex2rgb(p)) - lg)).slice(0, 3);
  ctx.fillStyle = ground; ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 6; i++) {
    const x = rand(rng, 0, W), y = rand(rng, 0, H), r = rand(rng, 180, 420), ink = inks[i % inks.length];
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, css(ink, .95)); g.addColorStop(.5, css(ink, .45)); g.addColorStop(1, css(ink, 0));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  grain(ctx, rng, 36);
}

function marbling(ctx, rng, pal) {
  const colors = pal.map(hex2rgb), ops = [];
  for (let k = 0, groups = 6 + (rng() * 4 | 0); k < groups; k++) {
    const cx = rand(rng, 0, 320), cy = rand(rng, 0, 400);
    for (let i = 0, drops = 4 + (rng() * 5 | 0); i < drops; i++) ops.push({ cx, cy, r: rand(rng, 16, 52), c: 1 + ops.length % (colors.length - 1) });
  }
  for (let v = 0; v < 3; v++) ops.push({ vx: rand(rng, 30, 290), vy: rand(rng, 30, 370), spin: rand(rng, 2, 5) * (rng() < .5 ? -1 : 1), reach: rand(rng, 50, 130) });
  const wave = rand(rng, 8, 24), length = rand(rng, 90, 220), phase = rand(rng, 0, TAU);
  ctx.drawImage(pixels(320, 400, (x, y) => {
    x -= wave * Math.sin(y / length * TAU + phase);
    for (let i = ops.length - 1; i >= 0; i--) {
      const o = ops[i];
      if (o.spin) {
        const dx = x - o.vx, dy = y - o.vy, a = -o.spin * o.reach / (Math.hypot(dx, dy) + o.reach), c = Math.cos(a), s = Math.sin(a);
        x = o.vx + dx * c - dy * s; y = o.vy + dx * s + dy * c;
      } else {
        const dx = x - o.cx, dy = y - o.cy, d2 = dx * dx + dy * dy, r2 = o.r * o.r;
        if (d2 < r2) return colors[o.c];
        const s = Math.sqrt(1 - r2 / d2);
        x = o.cx + dx * s; y = o.cy + dy * s;
      }
    }
    return colors[0];
  }), 0, 0, W, H);
  grain(ctx, rng, 6);
}

function terrazzo(ctx, rng, pal) {
  const [ground, ...inks] = pal;
  ctx.fillStyle = ground; ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 700; i++) {
    const x = rand(rng, -20, W + 20), y = rand(rng, -20, H + 20), r = 2 + 34 * rng() ** 3, sides = 3 + (rng() * 4 | 0), rot = rand(rng, 0, TAU);
    ctx.fillStyle = css(adjust(hex2rgb(pick(rng, inks)), gauss(rng) * .1));
    polygon(ctx, Array.from({ length: sides }, (_, k) => {
      const a = rot + k / sides * TAU + rand(rng, -.35, .35), q = r * rand(rng, .5, 1);
      return { x: x + Math.cos(a) * q, y: y + Math.sin(a) * q };
    }));
    ctx.fill();
  }
  grain(ctx, rng, 12);
}

function packing(ctx, rng, pal) {
  const [ground, ...inks] = pal, circles = [];
  ctx.fillStyle = ground; ctx.fillRect(0, 0, W, H);
  for (let tries = 0; tries < 5000 && circles.length < 220; tries++) {
    const x = rand(rng, 0, W), y = rand(rng, 0, H);
    let r = lerp(170, 8, tries / 5000) * rand(rng, .6, 1);
    for (const c of circles) r = Math.min(r, Math.hypot(x - c.x, y - c.y) - c.r - 7);
    if (r < 5) continue;
    circles.push({ x, y, r });
    ctx.fillStyle = pick(rng, inks); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    if (r > 26 && rng() < .55) { ctx.fillStyle = pick(rng, [ground, ...inks]); ctx.beginPath(); ctx.arc(x, y, r * rand(rng, .3, .62), 0, TAU); ctx.fill(); }
  }
  grain(ctx, rng, 10);
}

function albers(ctx, rng, pal) {
  const colors = shuffle(rng, pal), lift = rand(rng, .58, .7), step = rand(rng, .19, .24);
  ctx.fillStyle = colors[0]; ctx.fillRect(0, 0, W, H);
  for (let i = 1; i < 4; i++) {
    const s = W * (.96 - i * step);
    ctx.fillStyle = colors[i]; ctx.fillRect((W - s) / 2, (H - s) * lift, s, s);
  }
  grain(ctx, rng, 16);
}

function vasarely(ctx, rng, pal) {
  const [ground, a, b, c] = pal, n = pick(rng, [8, 10, 12]), s = W / n, rows = Math.ceil(H / s);
  const bx = rand(rng, .3, .7) * W, by = rand(rng, .3, .7) * H, R = rand(rng, 260, 420), k = rand(rng, .7, 1.2);
  const bulge = (x, y) => { const dx = x - bx, dy = y - by, t = Math.max(0, 1 - Math.hypot(dx, dy) / R), m = 1 + k * t * t; return [bx + dx * m, by + dy * m, m]; };
  ctx.fillStyle = ground; ctx.fillRect(0, 0, W, H);
  for (let j = -1; j <= rows; j++) for (let i = -1; i <= n; i++) {
    const corners = [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]].map(([u, v]) => bulge(u * s, v * s));
    const [cx, cy, m] = bulge((i + .5) * s, (j + .5) * s), odd = (i + j) & 1;
    ctx.fillStyle = odd ? a : ground;
    polygon(ctx, corners.map(([x, y]) => ({ x, y }))); ctx.fill();
    ctx.fillStyle = odd ? c : b; ctx.beginPath(); ctx.arc(cx, cy, s * .3 * m, 0, TAU); ctx.fill();
  }
  grain(ctx, rng, 9);
}

function dither(ctx, rng, pal) {
  const noise = makeNoise(noiseSeed(rng)), colors = pal.map(hex2rgb).sort((p, q) => luma(p) - luma(q));
  const size = pick(rng, [6, 8, 10]), cols = Math.ceil(W / size), rows = Math.ceil(H / size), f = rand(rng, 1.6, 3), amt = rand(rng, 1.2, 2.4);
  const bayer = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  const buf = pixels(cols, rows, (x, y) => {
    const v = clamp((warp(noise, x / cols * f + 4, y / rows * f * 1.25 + 4, amt) - .28) / .44, 0, 1);
    return colors[clamp(Math.round(v * (colors.length - 1) + bayer[(y % 4) * 4 + x % 4] / 16 - .47), 0, colors.length - 1)];
  });
  ctx.imageSmoothingEnabled = false; ctx.drawImage(buf, 0, 0, cols * size, rows * size); ctx.imageSmoothingEnabled = true;
  grain(ctx, rng, 6);
}

const RENDERERS = {mineral, watercolor, field, relief, cellular, veils, geometry, halftone, squeegee, folds, collage, glow, marbling, terrazzo, packing, albers, vasarely, dither};
export const STYLES = Object.keys(RENDERERS);

export function painting(seed, style, palette) {
  const key = `${seed}:${style || ''}:${palette ?? ''}`;
  if (cache.has(key)) return cache.get(key);
  const h = hashSeed(String(seed)), rng = mulberry32(h);
  const chosen = RENDERERS[style] ? style : STYLES[h % STYLES.length];
  const colors = PALETTES[palette] || PALETTES[h % PALETTES.length];
  const art = canvas(W, H), ctx = art.getContext('2d', {willReadFrequently: true});
  RENDERERS[chosen](ctx, rng, colors);
  const url = art.toDataURL('image/jpeg', .9);
  cache.set(key, url);
  return url;
}
