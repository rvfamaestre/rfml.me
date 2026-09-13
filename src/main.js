import projects from './projects.js';
import posts from './posts.js';
import { painting } from './paintings.js';
import logos from './tools.js';

const $ = (selector) => document.querySelector(selector);
const entries = [...projects, ...posts];
const featured = ['traffic', 'lattice', 'scheduler', 'paris', 'mit', 'life', 'robot'];
const galleryEntries = [...featured.map(id => entries.find(entry => entry.id === id)).filter(Boolean), ...entries.filter(entry => !featured.includes(entry.id))];
const compact = matchMedia('(max-width: 700px)');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const wall = $('#wall');
const preview = $('#preview');
const reader = $('#reader');
const katexUrl = 'https://cdn.jsdelivr.net/npm/katex@0.18.7/dist/';
let page = 0;
let activeFrame;
let hideTimer;
let returnView = '#gallery';
let paused = reducedMotion.matches;
let motionChosen = false;
let journalRendered = false;
let katex;
const pageSize = 4;

const escape = (text = '') => String(text).replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[c]);
const safeUrl = (url = '') => /^(https:\/\/|assets\/)/.test(url) ? escape(url) : '';
const dateLabel = (date) => {
  const [year, month, day] = date.split('-').map(Number);
  if (!month) return String(year);
  return new Intl.DateTimeFormat('en', {month:'short', year:'numeric', ...(day ? {day:'numeric'} : {})})
    .format(new Date(year, month - 1, day || 1));
};
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const unpainted = [];
let paintTimer;
const artwork = entry => `<img class="art-image" data-art="${escape(entry.id)}" alt="" draggable="false">`;
const tools = entry => entry.tools?.length ? `<ul class="tools">${entry.tools.map(tool => {
  const [logo, label = tool] = [].concat(logos[tool] || []);
  return `<li title="${escape(tool)}">${logo ? `<img src="assets/tools/${logo}" alt="${label ? '' : escape(tool)}">` : ''}${escape(label)}</li>`;
}).join('')}</ul>` : '';
function paint(root) {
  unpainted.unshift(...root.querySelectorAll('img[data-art]'));
  clearTimeout(paintTimer);
  paintNext();
}
function paintNext() {
  const start = performance.now();
  while (unpainted.length && performance.now() - start < 12) {
    const img = unpainted.shift();
    const entry = entries.find(item => item.id === img.dataset.art);
    if (!entry || !img.isConnected) continue;
    img.removeAttribute('data-art');
    img.src = painting(entry.artSeed || entry.id, entry.artStyle, entry.artPalette);
  }
  if (unpainted.length) paintTimer = setTimeout(paintNext);
}

function renderMath(root) {
  const blocks = root.querySelectorAll('[data-tex]');
  if (!blocks.length) return;
  katex ||= import(`${katexUrl}katex.mjs`).then(module => {
    document.head.insertAdjacentHTML('beforeend', `<link rel="stylesheet" href="${katexUrl}katex.min.css">`);
    return module.default;
  });
  katex.then(({ render }) => blocks.forEach(block => render(block.dataset.tex, block, { displayMode: true, throwOnError: false }))).catch(() => {});
}

function hidePreview() {
  clearTimeout(hideTimer);
  preview.classList.remove('open');
  preview.inert = true;
  activeFrame?.setAttribute('aria-expanded', 'false');
  activeFrame = null;
}
function scheduleHide() {
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    if (!preview.matches(':hover') && !preview.contains(document.activeElement)) hidePreview();
  }, 260);
}
function showPreview(entry, frame) {
  if (reader.open) return;
  clearTimeout(hideTimer);
  activeFrame?.setAttribute('aria-expanded', 'false');
  activeFrame = frame;
  frame.setAttribute('aria-expanded', 'true');
  const art = frame.querySelector('.art-image[src]')?.src;
  preview.innerHTML = `<span class="thumb">${art ? `<img src="${art}" alt="">` : ''}</span><div class="text"><p class="eyebrow">${dateLabel(entry.date)}</p><h2>${escape(entry.title)}</h2><p class="sub">${escape(entry.subtitle || '')}</p><p class="summary">${escape(entry.summary)}</p>${tools(entry)}</div><a href="#entry/${escape(entry.id)}">Read more <img src="assets/icons/arrow-right.svg" alt=""></a>`;
  preview.inert = false;
  preview.classList.add('open');
}

function frame(entry, index) {
  const slot = document.createElement('div');
  const button = document.createElement('button');
  slot.className = 'slot';
  button.className = `frame ${entry.frame || 'paper'}`;
  button.style.cssText = `--delay: ${index * -1.3}s; --bob: ${4.6 + index % 4 * .7}s; --sway: ${6 + index % 3 * 1.3}s; --tilt: ${index % 2 ? 1.4 : -1.4}deg`;
  button.setAttribute('aria-label', `${entry.title}, ${dateLabel(entry.date)}`);
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', 'preview');
  button.innerHTML = `<span class="mat">${artwork(entry)}</span>`;
  button.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'touch' && !pointers.size && !wall.classList.contains('moving')) showPreview(entry, button);
  });
  button.addEventListener('pointerleave', event => { if (event.pointerType !== 'touch') scheduleHide(); });
  button.addEventListener('focus', () => {
    if (touch || !button.matches(':focus-visible')) return;
    if (compact.matches) return showPreview(entry, button);
    camera.settled = () => showPreview(entry, button);
    glide(index);
  });
  button.addEventListener('blur', () => { if (activeFrame === button) scheduleHide(); });
  let touch = false;
  const activate = previewFirst => {
    if (previewFirst && activeFrame !== button) showPreview(entry, button);
    else {
      if (!compact.matches) glide(index);
      location.hash = `entry/${entry.id}`;
    }
  };
  button.addEventListener('pointerdown', event => { touch = event.pointerType === 'touch'; });
  button.addEventListener('pointerup', event => {
    if (event.pointerType !== 'touch' || dragged >= 5 || swipe?.horizontal) return;
    event.preventDefault();
    activate(true);
  });
  button.addEventListener('click', event => {
    if (!touch || event.detail === 0) activate(false);
  });
  slot.append(button);
  return slot;
}

function renderPage() {
  hidePreview();
  const count = Math.ceil(galleryEntries.length / pageSize);
  page = Math.min(page, count - 1);
  wall.replaceChildren(...galleryEntries.slice(page * pageSize, (page + 1) * pageSize).map((entry, index) => frame(entry, page * pageSize + index)));
  $('#pages').innerHTML = Array.from({length: count}, (_, index) => `<button aria-label="Page ${index + 1} of ${count}" ${index === page ? 'aria-current="page"' : ''} data-page="${index}"><span></span></button>`).join('');
  $('#gallery-status').textContent = `Page ${page + 1} of ${count}.`;
  paint(wall);
}

const LENS = .48, EDGE = .92;
const shapes = [[230, 235], [290, 205], [215, 215], [185, 235], [275, 195]];
const camera = {x: 0, y: 0, zoom: 1, target: 1, anchor: [0, 0], min: .5, max: 2, vx: 0, vy: 0, goal: null, bounds: [0, 0, 0, 0], frame: 0, settled: null};
const pointers = new Map();
let slots = [];
let dragged = 0;
let pinch = 0;

function honeycomb(count, pitch = 400, row = 265) {
  const cells = [[0, 0]];
  const steps = [[1, 0], [0, 1], [-1, 1], [-1, 0], [0, -1], [1, -1]];
  for (let ring = 1; cells.length < count; ring++) {
    let q = 0, r = -ring;
    for (const [dq, dr] of steps) for (let i = 0; i < ring; i++) {
      cells.push([(q + r / 2) * pitch, r * row]);
      q += dq; r += dr;
    }
  }
  return cells;
}
const centre = () => [innerWidth / 2, innerHeight / 2 - 35];
function lens(x, y) {
  const [hx, hy] = centre(), r = Math.hypot(x / hx, y / hy);
  if (r <= LENS) return [x, y, 1];
  const k = Math.tanh((r - LENS) / (EDGE - LENS)), squeeze = (LENS + (EDGE - LENS) * k) / r;
  return [x * squeeze, y * squeeze, Math.sqrt((1 - k * k) * squeeze)];
}
function unlens(x, y) {
  const [hx, hy] = centre(), r = Math.hypot(x / hx, y / hy);
  if (r <= LENS) return [x, y];
  const stretch = (LENS + (EDGE - LENS) * Math.atanh(Math.min(.95, (r - LENS) / (EDGE - LENS)))) / r;
  return [x * stretch, y * stretch];
}
function draw() {
  const [cx, cy] = centre();
  for (const slot of slots) {
    const [x, y, scale] = lens((slot.x - camera.x) * camera.zoom, (slot.y - camera.y) * camera.zoom);
    slot.el.style.transform = `translate(${cx + x - slot.w / 2}px, ${cy + y - slot.h / 2}px) scale(${camera.zoom * scale})`;
    slot.el.style.opacity = clamp((scale - .12) * 4, 0, 1);
    slot.el.style.pointerEvents = scale > .12 ? '' : 'none';
  }
}
function move() {
  camera.frame ||= requestAnimationFrame(tick);
}
function tick() {
  camera.frame = 0;
  let moving = false;
  if (camera.zoom !== camera.target) {
    const zoom = Math.abs(camera.target - camera.zoom) < .001 ? camera.target : camera.zoom + (camera.target - camera.zoom) * .2;
    const [ax, ay] = camera.anchor;
    camera.x += ax / camera.zoom - ax / zoom;
    camera.y += ay / camera.zoom - ay / zoom;
    camera.zoom = zoom;
    moving = true;
  }
  if (camera.goal) {
    camera.x += (camera.goal[0] - camera.x) * .14;
    camera.y += (camera.goal[1] - camera.y) * .14;
    if (Math.hypot(camera.goal[0] - camera.x, camera.goal[1] - camera.y) < .5) camera.goal = null;
    moving = true;
  } else if (!pointers.size) {
    const [x0, y0, x1, y1] = camera.bounds;
    camera.x += camera.vx;
    camera.y += camera.vy;
    const bx = clamp(camera.x, x0, x1) - camera.x, by = clamp(camera.y, y0, y1) - camera.y;
    const friction = bx || by ? .6 : .92;
    camera.vx *= friction;
    camera.vy *= friction;
    camera.x += bx * .18;
    camera.y += by * .18;
    moving ||= Math.abs(camera.vx) + Math.abs(camera.vy) > .05 || Math.abs(bx) + Math.abs(by) > .5;
  }
  draw();
  wall.classList.toggle('moving', moving || pointers.size > 0);
  if (moving) return move();
  if (camera.settled) camera.settled();
  else if (!pointers.size) wall.querySelector('.frame:hover')?.dispatchEvent(new Event('pointerenter'));
  camera.settled = null;
}
function pull(value, delta, min, max) {
  const give = 150 / camera.zoom, over = Math.abs(value - clamp(value, min, max));
  return clamp(value + delta * (1 - Math.min(1, over / give)) ** 2, min - give, max + give);
}
function glide(index) {
  hidePreview();
  camera.goal = [slots[index].x, slots[index].y];
  move();
}
function zoomAt(zoom, clientX, clientY) {
  const [cx, cy] = centre();
  hidePreview();
  camera.target = clamp(zoom, camera.min, camera.max);
  camera.anchor = unlens(clientX - cx, clientY - cy);
  move();
}
function fitBoard(reset) {
  const [hx, hy] = centre();
  const reach = (axis, size) => Math.max(...slots.map(slot => Math.abs(slot[axis]) + slot[size] / 2));
  const fit = Math.min(hx / reach('x', 'w'), hy / reach('y', 'h'));
  camera.min = fit * .85;
  camera.max = clamp(fit * 3, 1.6, 2.2);
  if (reset) camera.zoom = camera.target = fit * 1.2;
  camera.zoom = clamp(camera.zoom, camera.min, camera.max);
  camera.target = clamp(camera.target, camera.min, camera.max);
}
function renderBoard() {
  hidePreview();
  const cells = honeycomb(galleryEntries.length);
  slots = galleryEntries.map((entry, index) => {
    const el = frame(entry, index), [w, h] = shapes[index % shapes.length], [x, y] = cells[index];
    el.style.width = `${w}px`;
    el.style.height = `${h}px`;
    return {el, w, h, x, y};
  });
  wall.replaceChildren(...slots.map(slot => slot.el));
  const xs = slots.map(slot => slot.x), ys = slots.map(slot => slot.y);
  camera.bounds = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
  camera.x = camera.y = 0;
  fitBoard(true);
  draw();
  $('#gallery-status').textContent = `${slots.length} entries. Drag to move, scroll to zoom.`;
  paint(wall);
}
function renderGallery() {
  cancelAnimationFrame(camera.frame);
  camera.frame = 0;
  camera.vx = camera.vy = 0;
  camera.goal = camera.settled = null;
  pointers.clear();
  dragged = 0;
  wall.className = compact.matches ? 'wall' : 'board';
  $('#pages').hidden = !compact.matches;
  slots = [];
  if (compact.matches) renderPage();
  else renderBoard();
}

wall.addEventListener('pointerdown', event => {
  if (compact.matches || event.button > 0) return;
  pointers.set(event.pointerId, [event.clientX, event.clientY, event.timeStamp]);
  dragged = 0;
  pinch = 0;
  camera.vx = camera.vy = 0;
  camera.goal = camera.settled = null;
});
wall.addEventListener('pointermove', event => {
  const last = pointers.get(event.pointerId);
  if (!last) return;
  pointers.set(event.pointerId, [event.clientX, event.clientY, event.timeStamp]);
  if (pointers.size > 1) {
    const [[ax, ay], [bx, by]] = pointers.values();
    const distance = Math.hypot(ax - bx, ay - by);
    if (pinch) zoomAt(camera.target * distance / pinch, (ax + bx) / 2, (ay + by) / 2);
    pinch = distance;
    dragged = 5;
    return;
  }
  const dx = event.clientX - last[0], dy = event.clientY - last[1];
  dragged += Math.hypot(dx, dy);
  if (dragged < 5) return;
  if (!wall.hasPointerCapture(event.pointerId)) {
    wall.setPointerCapture(event.pointerId);
    hidePreview();
  }
  const [x0, y0, x1, y1] = camera.bounds, frames = Math.max(.5, (event.timeStamp - last[2]) / 16.7);
  const px = camera.x, py = camera.y;
  camera.x = pull(camera.x, -dx / camera.zoom, x0, x1);
  camera.y = pull(camera.y, -dy / camera.zoom, y0, y1);
  const limit = 40 / camera.zoom;
  camera.vx = clamp(camera.vx * .4 + (camera.x - px) / frames * .6, -limit, limit);
  camera.vy = clamp(camera.vy * .4 + (camera.y - py) / frames * .6, -limit, limit);
  move();
});
const release = event => {
  const last = pointers.get(event.pointerId);
  if (!last) return;
  pointers.delete(event.pointerId);
  pinch = 0;
  if (last && event.timeStamp - last[2] > 90) camera.vx = camera.vy = 0;
  move();
};
wall.addEventListener('pointerup', release);
wall.addEventListener('pointercancel', release);
wall.addEventListener('click', event => { if (dragged >= 5 && event.detail) event.stopPropagation(); }, true);
wall.addEventListener('wheel', event => {
  if (compact.matches) return;
  event.preventDefault();
  const pixels = event.deltaY * [1, 16, innerHeight][event.deltaMode];
  zoomAt(camera.target * Math.exp(-pixels * (event.ctrlKey ? .01 : .0015)), event.clientX, event.clientY);
}, {passive: false});

let swipe;
let suppressTap = false;
document.addEventListener('pointerdown', event => {
  suppressTap = false;
  if (!compact.matches || event.pointerType !== 'touch' || $('#gallery').hidden || reader.open || event.target.closest('#pages, .dock')) return;
  if (!event.isPrimary) { swipe = null; wall.style.translate = ''; return; }
  swipe = {id: event.pointerId, x: event.clientX, y: event.clientY, dx: 0, horizontal: false};
});
document.addEventListener('pointermove', event => {
  if (!swipe || event.pointerId !== swipe.id) return;
  const dx = event.clientX - swipe.x, dy = event.clientY - swipe.y;
  if (!swipe.horizontal) {
    if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) { swipe = null; return; }
    if (Math.abs(dx) < 12 || Math.abs(dx) < Math.abs(dy) * 1.3) return;
    swipe.horizontal = suppressTap = true;
    document.body.setPointerCapture(event.pointerId);
    hidePreview();
  }
  swipe.dx = dx;
  wall.style.translate = `${clamp(dx, -innerWidth / 3, innerWidth / 3)}px 0`;
});
function finishSwipe(event) {
  if (!swipe || event.pointerId !== swipe.id) return;
  const {dx, horizontal} = swipe;
  swipe = null;
  wall.style.translate = '';
  if (event.type !== 'pointerup' || !horizontal || Math.abs(dx) < Math.min(70, innerWidth * .18)) return;
  const next = clamp(page + (dx < 0 ? 1 : -1), 0, Math.ceil(galleryEntries.length / pageSize) - 1);
  if (next === page) return;
  page = next;
  renderPage();
  if (!reducedMotion.matches) wall.animate([{opacity: .3, translate: `${dx < 0 ? 24 : -24}px 0`}, {opacity: 1, translate: '0 0'}], {duration: 180, easing: 'ease-out'});
}
document.addEventListener('pointerup', finishSwipe);
document.addEventListener('pointercancel', finishSwipe);
document.body.addEventListener('lostpointercapture', event => { if (event.target === document.body) finishSwipe(event); });
document.addEventListener('click', event => {
  if (suppressTap && event.detail) { event.preventDefault(); event.stopPropagation(); }
}, true);

function renderJournal() {
  $('#entries').innerHTML = [...entries].sort((a,b) => b.date.localeCompare(a.date)).map(entry =>
    `<a class="entry" href="#entry/${escape(entry.id)}"><time datetime="${escape(entry.date)}">${dateLabel(entry.date)}</time><span><h3>${escape(entry.title)}</h3><p>${escape(entry.subtitle || entry.summary)}</p></span><span class="thumbnail">${artwork(entry)}</span><img class="entry-arrow" src="assets/icons/arrow-up-right.svg" alt=""></a>`
  ).join('');
  paint($('#entries'));
}

const link = ({ label, url }) => `<a href="${safeUrl(url)}" target="_blank" rel="noopener noreferrer">${escape(label)}<img src="assets/icons/arrow-up-right.svg" alt=""></a>`;
const linkList = list => list.length ? `<div class="links">${list.map(link).join('')}</div>` : '';

function openDialog(html) {
  hidePreview();
  $('#article').innerHTML = html;
  paint($('#article'));
  renderMath($('#article'));
  reader.scrollTop = 0;
  if (!reader.open) reader.showModal();
}

function openEntry(entry) {
  const image = safeUrl(entry.image);
  openDialog(`<p class="eyebrow">${dateLabel(entry.date)}</p><h2 id="reader-title">${escape(entry.title)}</h2><p class="subtitle">${escape(entry.subtitle || '')}</p>${tools(entry)}<figure class="reader-art">${artwork(entry)}</figure><div class="prose">${(entry.body || [entry.summary]).map(p => `<p>${escape(p)}</p>`).join('')}</div>`
    + (image ? `<figure class="work"><a href="${image}" target="_blank" rel="noopener"><img src="${image}" alt="${escape(entry.imageNote || entry.title)}"></a><figcaption>${escape(entry.imageNote || '')}</figcaption></figure>` : '')
    + (entry.formula ? `<figure class="formula"><div data-tex="${escape(entry.formula)}">${escape(entry.formula)}</div><figcaption>${escape(entry.formulaNote || '')}</figcaption></figure>` : '')
    + linkList((entry.links || []).filter(item => safeUrl(item.url))));
}

function openAbout() {
  openDialog(`<p class="eyebrow">About me</p><h2 id="reader-title">Hi, I'm Rafa.</h2><div class="prose"><p>I'm an engineering student from Spain. I did my bachelor's at ICAI in Madrid and two years at CentraleSupélec in Paris, and now I'm back at ICAI doing a master's in industrial engineering.</p><p>Most of the stuff here mixes math and code with real problems, like traffic, robots or money. This summer I was a data science intern at Acerinox.</p><p>I also co-founded Junior Enterprise Comillas, and I'm its president.</p></div><a class="cv" href="assets/pdfs/CV_EN_RML.pdf" target="_blank" rel="noopener"><img src="assets/pdfs/cv-preview.jpg" alt="The first page of my CV"><span><strong>My CV</strong>One page, PDF</span></a>`
    + linkList([{ label: 'GitHub', url: 'https://github.com/rvfamaestre' }, { label: 'LinkedIn', url: 'https://www.linkedin.com/in/rafael-maestre-lopez/' }]));
}

function route() {
  const hash = location.hash || '#gallery';
  const entry = entries.find(item => hash === `#entry/${item.id}`);
  if (entry) return openEntry(entry);
  if (hash === '#about') return openAbout();
  if (reader.open) reader.close();
  hidePreview();
  const journal = hash === '#journal';
  if (journal && !journalRendered) { renderJournal(); journalRendered = true; }
  returnView = journal ? '#journal' : '#gallery';
  $('#gallery').hidden = journal;
  $('#journal').hidden = !journal;
  document.body.classList.toggle('reading', journal);
  document.querySelectorAll('.dock a').forEach(link => {
    if (link.hash === returnView) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

$('#pages').addEventListener('click', event => {
  const target = event.target.closest('button');
  if (!target) return;
  page = Number(target.dataset.page);
  renderPage();
  $('#pages [aria-current]').focus({preventScroll:true});
});
preview.addEventListener('pointerenter', () => clearTimeout(hideTimer));
preview.addEventListener('pointerleave', event => { if (event.pointerType !== 'touch') scheduleHide(); });
preview.addEventListener('focusout', scheduleHide);
preview.addEventListener('click', event => {
  if (compact.matches && !event.target.closest('a')) preview.querySelector('a')?.click();
});
preview.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    activeFrame?.focus();
    hidePreview();
    camera.settled = null;
  }
  if (event.key === 'Tab' && activeFrame) {
    const next = event.shiftKey ? activeFrame : activeFrame.parentElement.nextElementSibling?.firstElementChild || $(compact.matches ? '#pages button' : '.dock a');
    event.preventDefault();
    hidePreview();
    next.focus();
  }
});
wall.addEventListener('keydown', event => {
  if (event.key === 'Escape') hidePreview();
  if (event.key === 'Tab' && !event.shiftKey && event.target === activeFrame && preview.classList.contains('open')) {
    event.preventDefault();
    preview.querySelector('a').focus();
  }
  if (!compact.matches && ['+', '=', '-'].includes(event.key)) zoomAt(camera.target * (event.key === '-' ? .8 : 1.25), ...centre());
});
document.addEventListener('pointerdown', event => {
  if (!event.target.closest('.frame, .preview')) hidePreview();
});
const closeReader = () => { location.hash = returnView; };
$('#close-reader').addEventListener('click', closeReader);
reader.addEventListener('cancel', event => { event.preventDefault(); closeReader(); });
reader.addEventListener('click', event => {
  const box = reader.getBoundingClientRect();
  if (event.target === reader && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) closeReader();
});
function updateMotion() {
  document.body.classList.toggle('paused', paused);
  const button = $('#motion');
  const label = paused ? 'Play' : 'Pause';
  button.setAttribute('aria-label', label);
  button.setAttribute('aria-pressed', String(paused));
  button.title = label;
  button.querySelector('img').src = `assets/icons/${paused ? 'play' : 'pause'}.svg`;
}
$('#motion').addEventListener('click', () => { motionChosen = true; paused = !paused; updateMotion(); });
reducedMotion.addEventListener('change', () => { if (!motionChosen) { paused = reducedMotion.matches; updateMotion(); } });
compact.addEventListener('change', () => { page = 0; renderGallery(); });
window.addEventListener('resize', () => {
  hidePreview();
  swipe = null;
  wall.style.translate = '';
  if (slots.length) { fitBoard(); draw(); }
});
window.addEventListener('hashchange', route);
renderGallery();
updateMotion();
route();
