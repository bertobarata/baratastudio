(() => {
'use strict';

// ---------- world ----------
const W = 1200, H = 760;
const P = { x: 90, y: 92, w: 1020, h: 576 };
P.r = P.x + P.w; P.b = P.y + P.h;
const CX = P.x + P.w / 2, CY = P.y + P.h / 2;
const GOAL_HALF = 58, GOAL_DEPTH = 24;
const RUNOFF = 14;   // how far past the lines the invader may run
const BOARD = 30;    // ad boards distance from the lines
const TAU = Math.PI * 2;

const params = new URLSearchParams(location.search);
const GOD = params.has('god');

// ---------- helpers ----------
const $ = id => document.getElementById(id);
const rand = (a, b) => a + Math.random() * (b - a);
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const fmt = s => s.toFixed(1);
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

// ---------- dom ----------
const stage = $('stage'), canvas = $('game'), ctx = canvas.getContext('2d');
const hud = $('hud'), hudScore = $('hud-score'), hudBest = $('hud-best'), staminaFill = $('stamina-fill');
const ticker = $('ticker'), tickerText = $('ticker-text');
const menu = $('menu'), over = $('over'), pauseEl = $('pause');
const nameInput = $('name'), btnSprint = $('btn-sprint'), btnMute = $('btn-mute');
const isTouch = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
if (isTouch) document.body.classList.add('touch');

let scale = 1, dpr = 1;
function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  const vw = window.innerWidth, vh = window.innerHeight;
  scale = Math.min(vw / W, vh / H);
  const cw = Math.floor(W * scale), ch = Math.floor(H * scale);
  stage.style.width = cw + 'px'; stage.style.height = ch + 'px';
  canvas.style.width = cw + 'px'; canvas.style.height = ch + 'px';
  canvas.width = Math.floor(cw * dpr); canvas.height = Math.floor(ch * dpr);
  document.documentElement.style.setProperty('--u', scale + 'px');
  $('rotate').classList.toggle('hidden', !(isTouch && vh > vw));
  window.scrollTo(0, 0);
}
addEventListener('resize', resize);
resize();

// ---------- copy ----------
const LINES = {
  start: [
    'Temos um invasor no relvado! O árbitro não sabe o que fazer.',
    'Alguém saltou a vedação! E vem de camisola na mão!',
    'Interrompe-se o jogo: há um adepto em campo e está com pressa.',
    'O realizador tenta cortar a imagem mas o invasor é demasiado rápido.',
  ],
  goal: [
    'GOOOOLO! O invasor marca e até os seguranças festejam!',
    'GOLO! Melhor que o ponta de lança titular, diga-se.',
    'GOLAÇO! O clube já está a preparar o contrato.',
    'GOLO! O VAR está a rever... e não há nada a rever.',
  ],
  selfie: [
    'Selfie com o craque! Isto vai direto para as stories.',
    'O número 10 fez pose! Profissionalismo total.',
    'Selfie tirada. O craque até sorriu, coitado.',
  ],
  juke: [
    'Que finta! O segurança ficou a ver navios.',
    'Passou-lhe por debaixo do braço!',
    'Finta de corpo e o segurança vai parar à bancada.',
    'Olé! A bancada aplaude.',
    'O segurança agarrou o ar. Muito ar.',
  ],
  caught: [
    'Levado em ombros. Não da maneira que queria.',
    'Pelo menos apareceu na televisão.',
    'A mãe estava a ver. A mãe viu tudo.',
    'Proibido de entrar no estádio até 2047.',
    'O segurança vai ser promovido a chefe de turno.',
    'Multa de 500 euros. Glória: incalculável.',
    'Saiu de campo com mais seguranças do que um presidente.',
    'O treinador pediu o contacto. Para o processar.',
  ],
  intro: {
    gordo: 'Entrou o Sr. Armando: 22 anos de casa, zero sprints. Mas ocupa espaço.',
    sprinter: 'Atenção: o segurança novo fez atletismo no secundário!',
    dog: 'Soltaram o Bobi! O Bobi não perdoa.',
  },
};
const MILESTONES = [
  [10, 'Dez segundos! Já jogou mais que o suplente habitual.'],
  [20, 'Vinte segundos e a segurança ainda a apertar os atacadores.'],
  [30, 'Meio minuto! O realizador já desistiu de cortar a imagem.'],
  [45, 'Quarenta e cinco segundos. Está a ser mais perigoso que a equipa da casa.'],
  [60, 'UM MINUTO! Alguém dê um contrato a este homem!'],
  [90, 'Noventa segundos! O treinador quer saber se joga a lateral.'],
  [120, 'DOIS MINUTOS! A transmissão já foi para intervalo publicitário.'],
  [180, 'Três minutos. Vai ser estudado nas academias de futebol.'],
  [240, 'Quatro minutos. Os seguranças estão a pensar mudar de profissão.'],
];
const RANKS = [
  [5, 'Tropeçou na vedação'],
  [10, 'Turista do relvado'],
  [20, 'Invasor amador'],
  [35, 'Corredor de bancada'],
  [50, 'Pesadelo da segurança'],
  [75, 'Lenda do relvado'],
  [110, 'Fantasma do estádio'],
  [Infinity, 'Imortal do relvado'],
];
const rankFor = s => RANKS.find(r => s < r[0])[1];

// ---------- audio ----------
const audio = {
  ctx: null, master: null, crowd: null, muted: store.get('pi.muted', false),
  init() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const c = this.ctx = new AC();
    this.master = c.createGain();
    this.master.gain.value = this.muted ? 0 : 0.8;
    this.master.connect(c.destination);
    const len = c.sampleRate * 2, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 3.5; }
    const src = c.createBufferSource(); src.buffer = buf; src.loop = true;
    const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 650; bp.Q.value = 0.5;
    this.crowd = c.createGain(); this.crowd.gain.value = 0;
    src.connect(bp); bp.connect(this.crowd); this.crowd.connect(this.master); src.start();
  },
  setCrowd(v) { if (this.ctx) this.crowd.gain.setTargetAtTime(v, this.ctx.currentTime, 0.3); },
  tone(freq, dur, type = 'sine', vol = 0.2, slideTo = 0, delay = 0) {
    if (!this.ctx) return;
    const c = this.ctx, t = c.currentTime + delay;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this.master); o.start(t); o.stop(t + dur + 0.02);
  },
  whistle(dur = 0.35, delay = 0) {
    if (!this.ctx) return;
    const c = this.ctx, t = c.currentTime + delay;
    const o = c.createOscillator(), lfo = c.createOscillator(), lg = c.createGain(), g = c.createGain();
    o.frequency.value = 2900; lfo.frequency.value = 28; lg.gain.value = 180;
    lfo.connect(lg); lg.connect(o.frequency);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.1, t + 0.02);
    g.gain.setValueAtTime(0.1, t + dur - 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this.master);
    o.start(t); lfo.start(t); o.stop(t + dur + 0.05); lfo.stop(t + dur + 0.05);
  },
  thud() { this.tone(180, 0.35, 'sine', 0.6, 40); this.tone(90, 0.25, 'triangle', 0.3, 30, 0.05); },
  bark() { this.tone(620, 0.07, 'square', 0.06, 320); this.tone(600, 0.07, 'square', 0.06, 300, 0.14); },
  kick() { this.tone(240, 0.08, 'triangle', 0.25, 90); },
  shutter() { this.tone(2200, 0.03, 'square', 0.05); this.tone(1200, 0.05, 'square', 0.05, 0, 0.06); },
  juke() { this.tone(500, 0.12, 'triangle', 0.12, 900); },
  goal() { [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.25, 'triangle', 0.15, 0, i * 0.09)); },
  toggle() {
    this.muted = !this.muted;
    store.set('pi.muted', this.muted);
    if (this.master) this.master.gain.value = this.muted ? 0 : 0.8;
    btnMute.textContent = this.muted ? '🔇' : '🔊';
  },
};
btnMute.textContent = audio.muted ? '🔇' : '🔊';

// ---------- input ----------
const keys = {};
const joy = { active: false, id: null, ox: 0, oy: 0, x: 0, y: 0, dx: 0, dy: 0 };
let touchSprint = false;

addEventListener('keydown', e => {
  if (document.activeElement === nameInput) {
    if (e.code === 'Enter') { e.preventDefault(); tryStart(); }
    return;
  }
  keys[e.code] = true;
  if (e.target instanceof HTMLButtonElement && (e.code === 'Enter' || e.code === 'Space')) return; // native click handles it
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
  if (e.code === 'KeyM') audio.toggle();
  if ((e.code === 'KeyP' || e.code === 'Escape') && (G.mode === 'play' || G.mode === 'paused')) togglePause();
  if ((e.code === 'Enter' || e.code === 'Space') && !e.repeat) {
    if (G.mode === 'over' && performance.now() > G.overLockUntil) startGame();
    else if (G.mode === 'menu') tryStart();
    else if (G.mode === 'paused' && e.code === 'Enter') togglePause();
  }
});
addEventListener('keyup', e => { keys[e.code] = false; });
addEventListener('blur', () => { for (const k in keys) keys[k] = false; if (G.mode === 'play') togglePause(); });
document.addEventListener('visibilitychange', () => { if (document.hidden && G.mode === 'play') togglePause(); });

canvas.addEventListener('pointerdown', e => {
  if (e.pointerType === 'mouse' || joy.active) return;
  joy.active = true; joy.id = e.pointerId;
  joy.ox = joy.x = e.offsetX; joy.oy = joy.y = e.offsetY;
  joy.dx = joy.dy = 0;
  try { canvas.setPointerCapture(e.pointerId); } catch {}
});
canvas.addEventListener('pointermove', e => {
  if (!joy.active || e.pointerId !== joy.id) return;
  joy.x = e.offsetX; joy.y = e.offsetY;
  const R = 55;
  let dx = (joy.x - joy.ox) / R, dy = (joy.y - joy.oy) / R;
  const m = Math.hypot(dx, dy);
  if (m > 1) { dx /= m; dy /= m; }
  joy.dx = m < 0.12 ? 0 : dx; joy.dy = m < 0.12 ? 0 : dy;
});
const endJoy = e => { if (e.pointerId === joy.id) { joy.active = false; joy.dx = joy.dy = 0; } };
canvas.addEventListener('pointerup', endJoy);
canvas.addEventListener('pointercancel', endJoy);

btnSprint.addEventListener('pointerdown', e => { e.preventDefault(); touchSprint = true; btnSprint.classList.add('on'); });
const sprintOff = () => { touchSprint = false; btnSprint.classList.remove('on'); };
btnSprint.addEventListener('pointerup', sprintOff);
btnSprint.addEventListener('pointercancel', sprintOff);
btnSprint.addEventListener('pointerleave', sprintOff);

function readInput() {
  let x = 0, y = 0;
  if (keys.ArrowLeft || keys.KeyA) x -= 1;
  if (keys.ArrowRight || keys.KeyD) x += 1;
  if (keys.ArrowUp || keys.KeyW) y -= 1;
  if (keys.ArrowDown || keys.KeyS) y += 1;
  if (joy.active) { x = joy.dx; y = joy.dy; }
  const m = Math.hypot(x, y);
  if (m > 1) { x /= m; y /= m; }
  return { x, y, sprint: !!(keys.Space || keys.ShiftLeft || keys.ShiftRight || touchSprint) };
}

// ---------- state ----------
const G = {
  mode: 'menu', time: 0, t: 0, bonus: 0,
  player: null, stewards: [], squad: [], ball: null,
  particles: [], popups: [], excite: 0.3, shake: 0, flash: 0,
  spawnTimer: 0, introduced: {}, milestones: 0,
  selfieCd: 0, goalReset: 0, caughtT: 0, catcher: null,
  goals: 0, selfies: 0, jukes: 0, overLockUntil: 0,
  name: '',
  best: store.get('pi.best', 0),
  comment: { text: '', shown: 0, t: 0 },
};
const nameHint = $('name-hint'), btnPlay = $('btn-play');
const typedName = () => (nameInput.value || '').trim().slice(0, 14);
function syncName() {
  btnPlay.disabled = !typedName();
  nameHint.classList.remove('error');
  nameHint.textContent = typedName() ? 'Pronto, ' + typedName() + '. Boa sorte.' : 'Precisas de um nome para entrar em campo.';
}
nameInput.addEventListener('input', syncName);
syncName();
hudBest.textContent = fmt(G.best);

const score = () => G.t + G.bonus;

function makeSquad() {
  const squad = [];
  const lines = [
    { f: 0.03, ys: [0.5], keeper: true },
    { f: 0.2, ys: [0.14, 0.38, 0.62, 0.86] },
    { f: 0.33, ys: [0.12, 0.37, 0.63, 0.88] },
    { f: 0.44, ys: [0.36, 0.64] },
  ];
  let numA = 1, numB = 1;
  for (const team of ['A', 'B']) {
    for (const l of lines) {
      for (const fy of l.ys) {
        const fx = team === 'A' ? l.f : 1 - l.f;
        const num = team === 'A' ? numA++ : numB++;
        const p = {
          x: P.x + fx * P.w, y: P.y + fy * P.h, vx: 0, vy: 0,
          hx: P.x + fx * P.w, hy: P.y + fy * P.h,
          r: 10, team, num, keeper: !!l.keeper, star: team === 'A' && num === 10,
          face: team === 'A' ? 0 : Math.PI, phase: Math.random() * TAU, kickCd: 0, walk: 0, wanderT: rand(0, 2),
        };
        if (p.keeper) { p.x = p.hx = team === 'A' ? P.x + 12 : P.r - 12; p.r = 11; }
        squad.push(p);
      }
    }
  }
  squad.push({ x: CX + 40, y: CY - 60, vx: 0, vy: 0, hx: CX + 40, hy: CY - 60, r: 10, team: 'R', num: 0, face: 0, phase: 1, kickCd: 0, walk: 0, wanderT: 0 });
  return squad;
}

function resetBall() { G.ball = { x: CX, y: CY, vx: 0, vy: 0, r: 6, spin: 0 }; }

function resetWorld() {
  G.squad = makeSquad();
  resetBall();
  G.stewards = [];
  G.particles = [];
  G.popups = [];
}
resetWorld();

// ---------- leaderboard ----------
const CFG = window.PITCH_CONFIG || {};
const ONLINE = !!(CFG.supabaseUrl && CFG.supabaseAnonKey);
const DEVICE = (() => {
  let id = store.get('pi.device', '');
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID()
      : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); });
    store.set('pi.device', id);
  }
  return id;
})();
let claimed = ''; // name already confirmed for this device in this session

async function rpc(fn, body) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 5000);
  try {
    const res = await fetch(`${CFG.supabaseUrl.replace(/\/$/, '')}/rest/v1/rpc/${fn}`, {
      method: 'POST',
      headers: {
        apikey: CFG.supabaseAnonKey,
        // legacy anon keys are JWTs and also go in Authorization; new sb_publishable_ keys must not
        ...(CFG.supabaseAnonKey.startsWith('eyJ') ? { Authorization: 'Bearer ' + CFG.supabaseAnonKey } : {}),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: ctl.signal,
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

function localBoard() {
  // one line per name, keeping its best
  const best = new Map();
  for (const e of store.get('pi.board', [])) {
    const k = e.name.toLowerCase();
    if (!best.has(k) || best.get(k).score < e.score) best.set(k, e);
  }
  return [...best.values()].sort((a, b) => b.score - a.score).slice(0, 10);
}

function saveLocal(name, score) {
  const board = localBoard().filter(e => e.name.toLowerCase() !== name.toLowerCase());
  const prev = localBoard().find(e => e.name.toLowerCase() === name.toLowerCase());
  board.push({ name, score: Math.max(score, prev ? prev.score : 0) });
  board.sort((a, b) => b.score - a.score);
  store.set('pi.board', board.slice(0, 10));
}

async function loadBoard(el, me) {
  if (ONLINE) {
    try {
      const rows = await rpc('pitch_top', { p_limit: 20 });
      renderRows(el, 'Ranking geral', rows.map(r => ({ name: r.name, score: Number(r.best) })), me);
      return;
    } catch { /* fall back to the local board */ }
  }
  renderRows(el, ONLINE ? 'Top invasores (sem ligação — neste dispositivo)' : 'Top invasores (neste dispositivo)', localBoard(), me);
}

function renderRows(el, title, rows, me) {
  el.textContent = '';
  if (!rows.length) return;
  const h = document.createElement('h3'); h.textContent = title;
  const ol = document.createElement('ol');
  const meKey = (me || '').toLowerCase();
  rows.forEach((e, i) => {
    const li = document.createElement('li');
    if (meKey && e.name.toLowerCase() === meKey) li.className = 'me';
    const pos = document.createElement('span'); pos.className = 'pos'; pos.textContent = (i + 1) + '.';
    const nm = document.createElement('span'); nm.textContent = e.name;
    const sc = document.createElement('span'); sc.className = 'sc'; sc.textContent = fmt(e.score) + 's';
    li.append(pos, nm, sc);
    ol.append(li);
  });
  el.append(h, ol);
}

// ---------- flow ----------
function nameError(msg) {
  nameHint.textContent = msg;
  nameHint.classList.add('error');
  nameInput.classList.remove('shake'); void nameInput.offsetWidth; nameInput.classList.add('shake');
  if (!isTouch) nameInput.focus();
}

// The name step is mandatory: nobody enters the pitch anonymous.
// Online, the name must also be free (or already owned by this device).
let starting = false;
async function tryStart() {
  const name = typedName();
  if (!name) return nameError('Escreve primeiro o teu nome!');
  if (starting) return;
  audio.init(); // must happen inside the user gesture, before any await
  if (ONLINE && name.toLowerCase() !== claimed.toLowerCase()) {
    starting = true;
    btnPlay.disabled = true;
    btnPlay.textContent = 'A VERIFICAR…';
    let status = 'offline';
    try { status = await rpc('pitch_claim_name', { p_name: name, p_device: DEVICE }); } catch { /* play offline */ }
    starting = false;
    btnPlay.textContent = 'ENTRAR EM CAMPO';
    syncName();
    if (status === 'taken') return nameError('O nome "' + name + '" já é de outra pessoa. Escolhe outro.');
    if (status === 'invalid') return nameError('Esse nome não serve. Experimenta outro.');
    if (status === 'ok') claimed = name;
  }
  G.name = name;
  startGame();
}

function startGame() {
  audio.init();
  nameInput.blur();
  resetWorld();
  G.player = { x: CX + rand(-60, 60), y: P.b + 4, vx: 0, vy: -60, r: 11, stamina: 1, tired: false, face: -Math.PI / 2, walk: 0, sprinting: false };
  Object.assign(G, {
    t: 0, bonus: 0, spawnTimer: 1.0, introduced: { normal: true }, milestones: 0,
    selfieCd: 0, goalReset: 0, caughtT: 0, catcher: null, goals: 0, selfies: 0, jukes: 0,
    excite: 0.6, shake: 0, flash: 0, mode: 'play',
  });
  menu.classList.add('hidden'); over.classList.add('hidden'); pauseEl.classList.add('hidden');
  document.body.classList.add('playing');
  hud.classList.remove('hidden'); ticker.classList.remove('hidden');
  btnSprint.classList.toggle('hidden', !isTouch);
  say(pick(LINES.start));
  audio.whistle(0.25); audio.whistle(0.5, 0.35);
}

function togglePause() {
  if (G.mode === 'play') { G.mode = 'paused'; pauseEl.classList.remove('hidden'); }
  else if (G.mode === 'paused') { G.mode = 'play'; pauseEl.classList.add('hidden'); audio.init(); }
}

function showMenu() {
  G.mode = 'menu';
  document.body.classList.remove('playing');
  over.classList.add('hidden'); hud.classList.add('hidden'); ticker.classList.add('hidden'); btnSprint.classList.add('hidden');
  menu.classList.remove('hidden');
  loadBoard($('menu-board'));
  resetWorld();
  nameInput.value = '';
  syncName();
  if (!isTouch) nameInput.focus();
}

function say(text) { G.comment = { text, shown: 0, t: 0 }; }

function popup(x, y, text, color = '#f2e205', size = 22) {
  G.popups.push({ x, y, text, color, size, t: 0 });
}

function caught(s) {
  if (GOD) return;
  G.mode = 'caught';
  G.caughtT = 0;
  G.catcher = s;
  G.final = score();
  G.shake = 16;
  G.excite = 1.4;
  audio.thud(); audio.whistle(0.9, 0.1);
  say(pick(LINES.caught));
  joy.active = false; sprintOff();
}

function finish() {
  G.mode = 'over';
  document.body.classList.remove('playing');
  G.overLockUntil = performance.now() + 1500;
  const final = G.final;
  const isRecord = final > G.best;
  if (isRecord) { G.best = final; store.set('pi.best', final); hudBest.textContent = fmt(final); }
  saveLocal(G.name, Math.round(final * 10) / 10);

  $('over-caption').textContent = '"' + G.comment.text + '"';
  $('over-score').textContent = fmt(final) + 's';
  $('over-rank').textContent = rankFor(final);
  $('over-record').classList.toggle('hidden', !isRecord);
  $('over-kicker').textContent = G.name + ' · fim da invasão';
  const bits = [`${fmt(G.t)}s a correr`];
  if (G.goals) bits.push(`${G.goals} golo${G.goals > 1 ? 's' : ''}`);
  if (G.selfies) bits.push(`${G.selfies} selfie${G.selfies > 1 ? 's' : ''}`);
  if (G.jukes) bits.push(`${G.jukes} finta${G.jukes > 1 ? 's' : ''}`);
  $('over-stats').textContent = bits.join(' · ');
  const boardEl = $('over-board');
  const name = G.name;
  if (ONLINE && claimed && claimed.toLowerCase() === name.toLowerCase()) {
    renderRows(boardEl, 'A enviar resultado…', [], name);
    rpc('pitch_submit', { p_name: name, p_device: DEVICE, p_score: Math.round(final * 10) / 10 })
      .then(pos => { if (pos) $('over-stats').textContent += ` · ${pos}º no ranking geral`; })
      .catch(() => {})
      .finally(() => loadBoard(boardEl, name));
  } else {
    loadBoard(boardEl, name);
  }
  btnSprint.classList.add('hidden');
  over.classList.remove('hidden');
  $('btn-again').focus();
}

btnPlay.addEventListener('click', tryStart);
$('btn-again').addEventListener('click', () => { if (performance.now() > G.overLockUntil) startGame(); });
$('btn-menu').addEventListener('click', showMenu);
$('btn-resume').addEventListener('click', togglePause);
$('btn-pause').addEventListener('click', togglePause);
btnMute.addEventListener('click', () => { audio.init(); audio.toggle(); });
loadBoard($('menu-board'));

// ---------- stewards ----------
const STEWARD = {
  normal:   { r: 12, base: 132, turn: 4.0, lead: 0.25, vest: '#f2e205', stripe: '#c9c9c9' },
  gordo:    { r: 17, base: 100, turn: 2.2, lead: 0.4,  vest: '#f2e205', stripe: '#c9c9c9' },
  sprinter: { r: 11, base: 250, turn: 3.0, lead: 0.15, vest: '#ff8a00', stripe: '#ffffff' },
  dog:      { r: 8,  base: 238, turn: 5.5, lead: 0.1 },
};

function spawnPoint() {
  const pl = G.player;
  let best = null;
  for (let i = 0; i < 10; i++) {
    const side = Math.floor(Math.random() * 4), off = BOARD - 8;
    let x, y;
    if (side === 0) { x = rand(P.x + 20, P.r - 20); y = P.y - off; }
    else if (side === 1) { x = rand(P.x + 20, P.r - 20); y = P.b + off; }
    else if (side === 2) { x = P.x - off; y = rand(P.y + 20, P.b - 20); }
    else { x = P.r + off; y = rand(P.y + 20, P.b - 20); }
    if (Math.abs(y - CY) < GOAL_HALF + 14 && side >= 2) continue; // not inside the goal
    const d = Math.hypot(x - pl.x, y - pl.y);
    if (d > 340) return { x, y };
    if (!best || d > best.d) best = { x, y, d };
  }
  return best || { x: CX, y: P.y - BOARD + 8 };
}

function spawnSteward() {
  const t = G.t;
  const pool = ['normal', 'normal'];
  if (t > 14) pool.push('gordo');
  if (t > 28) pool.push('sprinter', 'sprinter');
  if (t > 48 && G.stewards.filter(s => s.type === 'dog').length < 2) pool.push('dog');
  let type = pick(pool);
  // make sure each new type shows up promptly once unlocked
  for (const k of ['gordo', 'sprinter', 'dog']) if (pool.includes(k) && !G.introduced[k]) type = k;
  if (!G.introduced[type]) { G.introduced[type] = true; say(LINES.intro[type]); if (type === 'dog') audio.bark(); }
  const def = STEWARD[type];
  const pt = spawnPoint();
  G.stewards.push({
    type, x: pt.x, y: pt.y, vx: 0, vy: 0, r: def.r, state: 'alert', t: 0,
    stun: 0, cycle: rand(0, 1), tired: false, walk: 0, face: Math.atan2(G.player.y - pt.y, G.player.x - pt.x),
    close: false, jukeCd: 0, zig: Math.random() * TAU,
    flank: G.stewards.length === 0 ? 0 : rand(-1, 1),
  });
}

function diff() { return 1 + Math.min(0.55, G.t / 110); }

function updateSteward(s, dt, target, chase) {
  const def = STEWARD[s.type];
  s.t += dt;
  if (s.state === 'alert') {
    if (s.t > 0.7) s.state = 'chase';
    s.face = Math.atan2(target.y - s.y, target.x - s.x);
    return;
  }
  if (s.stun > 0) {
    s.stun -= dt;
    s.vx *= Math.pow(0.02, dt); s.vy *= Math.pow(0.02, dt);
    s.x += s.vx * dt; s.y += s.vy * dt;
    return;
  }
  let speed = def.base * (chase ? diff() : 1.3);
  if (s.type === 'sprinter') {
    s.cycle += dt;
    s.tired = s.cycle % 3.2 > 1.8;
    if (s.tired) speed = 45;
  }
  const tx = target.x + (target.vx || 0) * def.lead;
  const ty = target.y + (target.vy || 0) * def.lead;
  let dx = tx - s.x, dy = ty - s.y;
  let d = Math.hypot(dx, dy) || 1;
  if (chase && s.flank) { // aim beside the invader while far away, so the pack spreads and surrounds
    const off = s.flank * Math.min(1, Math.max(0, (d - 90) / 260)) * 130;
    const px = -dy / d, py = dx / d;
    dx += px * off; dy += py * off;
    d = Math.hypot(dx, dy) || 1;
  }
  dx /= d; dy /= d;
  if (s.type === 'dog') {
    s.zig += dt * 7;
    const z = Math.sin(s.zig) * 0.55;
    const ndx = dx - dy * z, ndy = dy + dx * z, m = Math.hypot(ndx, ndy);
    dx = ndx / m; dy = ndy / m;
    if (Math.random() < dt * 0.4) audio.bark();
  }
  const k = Math.min(1, def.turn * dt);
  s.vx += (dx * speed - s.vx) * k;
  s.vy += (dy * speed - s.vy) * k;
  s.x += s.vx * dt; s.y += s.vy * dt;
  s.x = clamp(s.x, P.x - BOARD + 4, P.r + BOARD - 4);
  s.y = clamp(s.y, P.y - BOARD + 4, P.b + BOARD - 4);
  const v = Math.hypot(s.vx, s.vy);
  if (v > 8) s.face = Math.atan2(s.vy, s.vx);
  s.walk += v * dt * 0.09;
}

// ---------- physics helpers ----------
function separate(a, b, wa) {
  const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy), min = a.r + b.r;
  if (d >= min || d === 0) return false;
  const o = (min - d), nx = dx / d, ny = dy / d;
  a.x -= nx * o * wa; a.y -= ny * o * wa;
  b.x += nx * o * (1 - wa); b.y += ny * o * (1 - wa);
  return true;
}

function updateSquad(dt) {
  const ball = G.ball;
  for (const p of G.squad) {
    p.kickCd -= dt;
    let tx, ty, spd = 45;
    if (p.keeper) {
      tx = p.hx;
      ty = clamp(ball.y, CY - GOAL_HALF + 12, CY + GOAL_HALF - 12);
      spd = 70;
    } else {
      // wander on their own: pick a random spot in their zone, go there at a random pace, repeat
      p.wanderT -= dt;
      if (p.tx == null || p.wanderT <= 0 || Math.hypot(p.tx - p.x, p.ty - p.y) < 6) {
        const R = p.team === 'R' ? 220 : 130;
        p.tx = clamp(p.hx + rand(-R, R), P.x + 14, P.r - 14);
        p.ty = clamp(p.hy + rand(-R * 0.8, R * 0.8), P.y + 14, P.b - 14);
        p.pace = Math.random() < 0.3 ? rand(85, 130) : rand(25, 60);
        p.wanderT = rand(1.5, 4.5);
      }
      tx = p.tx; ty = p.ty; spd = p.pace;
    }
    const dx = tx - p.x, dy = ty - p.y, d = Math.hypot(dx, dy);
    if (d > 3) {
      const s = Math.min(spd, d * 3);
      p.vx = dx / d * s; p.vy = dy / d * s;
    } else { p.vx *= 0.8; p.vy *= 0.8; }
    p.x += p.vx * dt; p.y += p.vy * dt;
    p.walk += Math.hypot(p.vx, p.vy) * dt * 0.09;
    const v = Math.hypot(p.vx, p.vy);
    const look = v > 8 ? Math.atan2(p.vy, p.vx) : Math.atan2(ball.y - p.y, ball.x - p.x);
    p.face += angleDiff(p.face, look) * Math.min(1, dt * 5);
  }
}

function angleDiff(a, b) { let d = b - a; while (d > Math.PI) d -= TAU; while (d < -Math.PI) d += TAU; return d; }

function updateBall(dt) {
  const b = G.ball;
  if (G.goalReset > 0) {
    G.goalReset -= dt;
    if (G.goalReset <= 0) resetBall();
  }
  b.x += b.vx * dt; b.y += b.vy * dt;
  const f = Math.pow(0.42, dt);
  b.vx *= f; b.vy *= f;
  b.spin += Math.hypot(b.vx, b.vy) * dt * 0.15;
  const inGoalX = b.x < P.x || b.x > P.r;
  if (inGoalX) {
    b.y = clamp(b.y, CY - GOAL_HALF + b.r, CY + GOAL_HALF - b.r);
    if (b.x < P.x - GOAL_DEPTH + b.r) { b.x = P.x - GOAL_DEPTH + b.r; b.vx = Math.abs(b.vx) * 0.15; }
    if (b.x > P.r + GOAL_DEPTH - b.r) { b.x = P.r + GOAL_DEPTH - b.r; b.vx = -Math.abs(b.vx) * 0.15; }
    if (G.goalReset <= 0 && (b.x < P.x - 6 || b.x > P.r + 6)) goal(b.x < CX ? -1 : 1);
  } else {
    const mouth = Math.abs(b.y - CY) < GOAL_HALF - b.r;
    if (b.y < P.y + b.r) { b.y = P.y + b.r; b.vy = Math.abs(b.vy) * 0.6; }
    if (b.y > P.b - b.r) { b.y = P.b - b.r; b.vy = -Math.abs(b.vy) * 0.6; }
    if (!mouth) {
      if (b.x < P.x + b.r) { b.x = P.x + b.r; b.vx = Math.abs(b.vx) * 0.6; }
      if (b.x > P.r - b.r) { b.x = P.r - b.r; b.vx = -Math.abs(b.vx) * 0.6; }
    }
  }

  // contacts
  const pl = G.player;
  if (pl && G.mode === 'play') {
    const dx = b.x - pl.x, dy = b.y - pl.y, d = Math.hypot(dx, dy);
    if (d < pl.r + b.r && d > 0) {
      const nx = dx / d, ny = dy / d;
      const pv = Math.hypot(pl.vx, pl.vy);
      const mvx = pv > 1 ? pl.vx / pv : nx, mvy = pv > 1 ? pl.vy / pv : ny;
      let kx = nx * 0.45 + mvx * 0.55, ky = ny * 0.45 + mvy * 0.55;
      const km = Math.hypot(kx, ky) || 1; kx /= km; ky /= km;
      const power = Math.max(160, pv * (pl.sprinting ? 2.1 : 1.6));
      b.vx = kx * power; b.vy = ky * power;
      b.x = pl.x + nx * (pl.r + b.r + 1); b.y = pl.y + ny * (pl.r + b.r + 1);
      audio.kick();
    }
  }
  for (const p of G.squad) {
    const dx = b.x - p.x, dy = b.y - p.y, d = Math.hypot(dx, dy);
    if (d < p.r + b.r && d > 0) {
      const nx = dx / d, ny = dy / d;
      b.x = p.x + nx * (p.r + b.r + 1); b.y = p.y + ny * (p.r + b.r + 1);
      if (p.kickCd <= 0) {
        p.kickCd = 0.6;
        const toX = p.keeper ? CX - b.x : nx * 200, toY = p.keeper ? rand(-160, 160) : ny * 200 + rand(-60, 60);
        const m = Math.hypot(toX, toY) || 1;
        const power = p.keeper ? 380 : 180;
        b.vx = toX / m * power; b.vy = toY / m * power;
      } else {
        const dot = b.vx * nx + b.vy * ny;
        if (dot < 0) { b.vx -= 1.6 * dot * nx; b.vy -= 1.6 * dot * ny; }
      }
    }
  }
  for (const s of G.stewards) {
    const dx = b.x - s.x, dy = b.y - s.y, d = Math.hypot(dx, dy);
    if (d < s.r + b.r && d > 0) {
      const nx = dx / d, ny = dy / d;
      b.x = s.x + nx * (s.r + b.r + 1); b.y = s.y + ny * (s.r + b.r + 1);
      const sv = Math.max(90, Math.hypot(s.vx, s.vy));
      b.vx = nx * sv * 1.1; b.vy = ny * sv * 1.1;
    }
  }
}

function goal(side) {
  G.goalReset = 1.6;
  if (G.mode !== 'play') return;
  G.goals++;
  G.bonus += 5;
  G.excite = 2;
  G.shake = 8;
  popup(side < 0 ? P.x + 60 : P.r - 60, CY - 30, 'GOLO! +5', '#f2e205', 40);
  say(pick(LINES.goal));
  audio.goal(); audio.whistle(0.6, 0.15);
  for (const s of G.stewards) { s.stun = 1.6; }
  for (let i = 0; i < 90; i++) {
    G.particles.push({
      x: side < 0 ? P.x : P.r, y: CY + rand(-40, 40),
      vx: rand(-260, 260) - side * 120, vy: rand(-260, 260), life: rand(0.8, 1.6), t: 0,
      color: pick(['#f2e205', '#e63b2e', '#ffffff', '#3ddc84', '#4ea8ff']), size: rand(3, 6), drag: 0.15,
    });
  }
}

// ---------- update ----------
function updatePlayer(dt, inp) {
  const pl = G.player;
  let sprint = inp.sprint && !pl.tired && (inp.x || inp.y);
  if (sprint) {
    pl.stamina -= dt * 0.34;
    if (pl.stamina <= 0) { pl.stamina = 0; pl.tired = true; sprint = false; }
  } else {
    pl.stamina = Math.min(1, pl.stamina + dt * (inp.x || inp.y ? 0.2 : 0.3));
    if (pl.tired && pl.stamina > 0.35) pl.tired = false;
  }
  pl.sprinting = !!sprint;
  const speed = sprint ? 292 : pl.tired ? 150 : 178;
  const k = Math.min(1, dt * 11);
  pl.vx += (inp.x * speed - pl.vx) * k;
  pl.vy += (inp.y * speed - pl.vy) * k;
  pl.x += pl.vx * dt; pl.y += pl.vy * dt;
  pl.x = clamp(pl.x, P.x - RUNOFF, P.r + RUNOFF);
  pl.y = clamp(pl.y, P.y - RUNOFF, P.b + RUNOFF);
  const v = Math.hypot(pl.vx, pl.vy);
  if (v > 10) pl.face = Math.atan2(pl.vy, pl.vx);
  pl.walk += v * dt * 0.1;
  if (sprint && Math.random() < dt * 40) {
    G.particles.push({ x: pl.x - pl.vx * 0.04, y: pl.y - pl.vy * 0.04 + 6, vx: rand(-30, 30), vy: rand(-30, 30), life: 0.4, t: 0, color: pick(['#2e6b2e', '#5a3d22', '#3f8a3f']), size: rand(2, 4), drag: 0.05 });
  }
}

function updatePlay(dt) {
  G.t += dt;
  const inp = readInput();
  const pl = G.player;
  updatePlayer(dt, inp);

  // spawning
  G.spawnTimer -= dt;
  const maxStewards = Math.min(3 + Math.floor(G.t / 8), 16);
  if (G.spawnTimer <= 0) {
    if (G.stewards.length < maxStewards) spawnSteward();
    G.spawnTimer = Math.max(1.7, 5 - G.t * 0.045);
  }

  let minGap = Infinity;
  for (const s of G.stewards) {
    updateSteward(s, dt, pl, true);
    s.jukeCd -= dt;
    const d = Math.hypot(s.x - pl.x, s.y - pl.y), gap = d - pl.r - s.r;
    if (s.state === 'chase' && s.stun <= 0) {
      minGap = Math.min(minGap, gap);
      if (gap < -3) { caught(s); return; }
      if (gap < 16) s.close = true;
      else if (s.close && gap > 75) {
        s.close = false;
        if (s.jukeCd <= 0) {
          s.jukeCd = 4;
          G.jukes++; G.bonus += 1;
          popup(pl.x, pl.y - 26, 'FINTA! +1', '#ffffff', 20);
          if (Math.random() < 0.6) say(pick(LINES.juke));
          audio.juke();
          G.excite = Math.max(G.excite, 1.1);
        }
      }
    }
  }

  // selfie with the star
  G.selfieCd -= dt;
  const star = G.squad.find(p => p.star);
  if (star && G.selfieCd <= 0 && Math.hypot(star.x - pl.x, star.y - pl.y) < star.r + pl.r + 4) {
    G.selfieCd = 9;
    G.selfies++; G.bonus += 3;
    G.flash = 1;
    popup(star.x, star.y - 30, 'SELFIE! +3', '#ffffff', 26);
    say(pick(LINES.selfie));
    audio.shutter();
    G.excite = Math.max(G.excite, 1.2);
  }

  collide();

  // milestones
  if (G.milestones < MILESTONES.length && G.t >= MILESTONES[G.milestones][0]) {
    say(MILESTONES[G.milestones][1]);
    G.milestones++;
    G.excite = Math.max(G.excite, 1);
  }

  // crowd tension rises when stewards are close
  const tension = minGap < 60 ? (60 - Math.max(0, minGap)) / 60 : 0;
  G.excite = Math.max(G.excite, 0.45 + tension * 0.6);

  hudScore.textContent = fmt(score());
  staminaFill.style.transform = `scaleX(${pl.stamina.toFixed(3)})`;
  staminaFill.classList.toggle('tired', pl.tired);
}

function collide() {
  const pl = G.player;
  for (const p of G.squad) {
    if (pl && G.mode === 'play') separate(pl, p, 0.75);
    for (const s of G.stewards) separate(s, p, 0.8);
  }
  for (let i = 0; i < G.stewards.length; i++) {
    for (let j = i + 1; j < G.stewards.length; j++) separate(G.stewards[i], G.stewards[j], 0.5);
  }
}

function updateCaught(dt) {
  G.caughtT += dt;
  const slow = dt * 0.45;
  const pl = G.player, c = G.catcher;
  // the catcher lands on the invader, everyone else piles on
  c.x += (pl.x - c.x) * Math.min(1, slow * 8);
  c.y += (pl.y - 4 - c.y) * Math.min(1, slow * 8);
  for (const s of G.stewards) if (s !== c) { s.stun = 0; updateSteward(s, slow, pl, false); }
  for (let i = 0; i < G.stewards.length; i++) {
    for (let j = i + 1; j < G.stewards.length; j++) {
      if (G.stewards[i] !== c && G.stewards[j] !== c) separate(G.stewards[i], G.stewards[j], 0.5);
    }
  }
  if (G.caughtT > 1.9) finish();
}

function updateAmbient(dt) {
  updateSquad(dt);
  if (G.mode !== 'caught') updateBall(dt);
  if (G.mode !== 'play') {
    for (const p of G.squad) for (const q of G.squad) if (p !== q) separate(p, q, 0.5);
  }
  for (const p of G.particles) {
    p.t += dt;
    const f = Math.pow(p.drag, dt);
    p.vx *= f; p.vy *= f;
    p.x += p.vx * dt; p.y += p.vy * dt;
  }
  G.particles = G.particles.filter(p => p.t < p.life);
  for (const p of G.popups) p.t += dt;
  G.popups = G.popups.filter(p => p.t < 1.3);
  G.excite = Math.max(0.25, G.excite - dt * 0.35);
  G.shake = Math.max(0, G.shake - dt * 40);
  G.flash = Math.max(0, G.flash - dt * 2.5);
  audio.setCrowd(G.mode === 'menu' ? 0.03 : 0.035 + G.excite * 0.06);

  const c = G.comment;
  c.t += dt;
  const n = Math.min(c.text.length, Math.floor(c.t * 55));
  if (n !== c.shown) { c.shown = n; tickerText.textContent = c.text.slice(0, n); }
}

// ---------- render ----------
const bg = document.createElement('canvas');
bg.width = W * 2; bg.height = H * 2;
drawBackground(bg.getContext('2d'));

function drawBackground(g) {
  g.scale(2, 2);
  g.fillStyle = '#1a2030'; g.fillRect(0, 0, W, H);
  // stand steps
  g.strokeStyle = 'rgba(255,255,255,.04)'; g.lineWidth = 1;
  for (let y = 4; y < P.y - BOARD - 8; y += 8) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); g.beginPath(); g.moveTo(0, H - y); g.lineTo(W, H - y); g.stroke(); }
  // grass surround
  const gx = P.x - BOARD + 6, gy = P.y - BOARD + 6;
  g.fillStyle = '#2d7a31'; g.fillRect(gx, gy, P.w + 2 * (BOARD - 6), P.h + 2 * (BOARD - 6));
  // stripes
  const n = 14, sw = P.w / n;
  for (let i = 0; i < n; i++) { g.fillStyle = i % 2 ? '#368d3a' : '#3d9a41'; g.fillRect(P.x + i * sw, P.y, sw, P.h); }
  // ad boards
  const ads = ['BIFANAS DO TÓ', 'SEGUROS ZÉ', 'TASCA DO RUI', 'CERVEJA FRESCA', 'O MELHOR CAFÉ', 'GINÁSIO FORÇA', 'CHURRASCO MANEL', 'OFICINA DO CARLOS'];
  const colors = ['#e63b2e', '#1d4ed8', '#f2e205', '#0f9d58', '#ffffff', '#ff8a00'];
  g.font = '800 9px Rubik, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  const bw = 120;
  let k = 0;
  for (const yy of [gy - 10, gy + P.h + 2 * (BOARD - 6)]) {
    for (let x = gx; x < gx + P.w + 2 * (BOARD - 6); x += bw) {
      const c = colors[k % colors.length];
      g.fillStyle = c; g.fillRect(x, yy, Math.min(bw, gx + P.w + 2 * (BOARD - 6) - x), 10);
      g.fillStyle = c === '#ffffff' || c === '#f2e205' ? '#111' : '#fff';
      g.fillText(ads[k % ads.length], x + bw / 2, yy + 5.5);
      k++;
    }
  }
  for (const xx of [gx - 10, gx + P.w + 2 * (BOARD - 6)]) {
    for (let y = gy - 10, i = 0; y < gy + P.h + 2 * (BOARD - 6) + 10; y += 70, i++) {
      g.fillStyle = colors[(i + k) % colors.length];
      g.fillRect(xx, y, 10, Math.min(70, gy + P.h + 2 * (BOARD - 6) + 10 - y));
    }
  }
  // lines
  g.strokeStyle = 'rgba(255,255,255,.92)'; g.lineWidth = 2.5;
  g.strokeRect(P.x, P.y, P.w, P.h);
  g.beginPath(); g.moveTo(CX, P.y); g.lineTo(CX, P.b); g.stroke();
  g.beginPath(); g.arc(CX, CY, 70, 0, TAU); g.stroke();
  g.fillStyle = '#fff';
  g.beginPath(); g.arc(CX, CY, 3.5, 0, TAU); g.fill();
  for (const side of [-1, 1]) {
    const lx = side < 0 ? P.x : P.r;
    const pd = 150, ph = 330, sd = 52, sh = 150;
    g.strokeRect(side < 0 ? lx : lx - pd, CY - ph / 2, pd, ph);
    g.strokeRect(side < 0 ? lx : lx - sd, CY - sh / 2, sd, sh);
    const spot = lx - side * 105;
    g.beginPath(); g.arc(spot, CY, 3, 0, TAU); g.fill();
    g.beginPath();
    if (side < 0) g.arc(spot, CY, 70, -0.93, 0.93); else g.arc(spot, CY, 70, Math.PI - 0.93, Math.PI + 0.93);
    g.stroke();
    // goal
    const gx0 = side < 0 ? lx - GOAL_DEPTH : lx;
    g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(gx0, CY - GOAL_HALF, GOAL_DEPTH, GOAL_HALF * 2);
    g.save(); g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 0.8;
    for (let y = CY - GOAL_HALF; y <= CY + GOAL_HALF; y += 6) { g.beginPath(); g.moveTo(gx0, y); g.lineTo(gx0 + GOAL_DEPTH, y); g.stroke(); }
    for (let x = gx0; x <= gx0 + GOAL_DEPTH; x += 6) { g.beginPath(); g.moveTo(x, CY - GOAL_HALF); g.lineTo(x, CY + GOAL_HALF); g.stroke(); }
    g.restore();
    g.strokeStyle = '#fff'; g.lineWidth = 4;
    g.beginPath();
    g.moveTo(lx, CY - GOAL_HALF); g.lineTo(lx - side * GOAL_DEPTH, CY - GOAL_HALF);
    g.lineTo(lx - side * GOAL_DEPTH, CY + GOAL_HALF); g.lineTo(lx, CY + GOAL_HALF);
    g.stroke();
    g.lineWidth = 2.5;
  }
  // corner arcs
  for (const [x, y, a] of [[P.x, P.y, 0], [P.r, P.y, Math.PI / 2], [P.r, P.b, Math.PI], [P.x, P.b, -Math.PI / 2]]) {
    g.beginPath(); g.arc(x, y, 10, a, a + Math.PI / 2); g.stroke();
  }
}

// crowd seats, grouped by colour for cheap drawing
const crowd = (() => {
  const palette = ['#d62828', '#d62828', '#1d4ed8', '#f6f3ea', '#e9c46a', '#2a2a2a', '#f4a261', '#8d99ae'];
  const groups = palette.map(c => ({ c, seats: [] }));
  const add = (x, y) => groups[Math.floor(Math.random() * groups.length)].seats.push({ x, y, ph: Math.random() * TAU, sp: rand(6, 11) });
  const top = P.y - BOARD - 14;
  for (let y = 4; y < top; y += 9) for (let x = 4; x < W - 4; x += 9) if (Math.random() < 0.88) add(x + rand(-1, 1), y);
  for (let y = H - 10; y > P.b + BOARD + 10; y -= 9) for (let x = 4; x < W - 4; x += 9) if (Math.random() < 0.88) add(x + rand(-1, 1), y);
  for (let x = 4; x < P.x - BOARD - 14; x += 9) for (let y = top + 6; y < P.b + BOARD + 4; y += 9) if (Math.random() < 0.88) { add(x, y); }
  for (let x = W - 10; x > P.r + BOARD + 10; x -= 9) for (let y = top + 6; y < P.b + BOARD + 4; y += 9) if (Math.random() < 0.88) { add(x, y); }
  return groups;
})();

function drawCrowd() {
  const amp = Math.min(4, G.excite * 2.2);
  const t = G.time;
  for (const g of crowd) {
    ctx.fillStyle = g.c;
    for (const s of g.seats) {
      const b = Math.max(0, Math.sin(t * s.sp + s.ph)) * amp;
      ctx.fillRect(s.x, s.y - b, 6, 6);
    }
  }
  ctx.fillStyle = 'rgba(232,190,150,.9)';
  for (const g of crowd) {
    for (let i = 0; i < g.seats.length; i += 3) {
      const s = g.seats[i];
      const b = Math.max(0, Math.sin(t * s.sp + s.ph)) * amp;
      ctx.fillRect(s.x + 1.5, s.y - b - 2, 3, 3);
    }
  }
}

function circle(x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
function ellipse(x, y, rx, ry) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU); ctx.fill(); }

function shadow(x, y, r) {
  ctx.fillStyle = 'rgba(0,0,0,.25)';
  ctx.beginPath(); ctx.ellipse(x + 2, y + r * 0.6, r * 1.05, r * 0.55, 0, 0, TAU); ctx.fill();
}

// Top-down person. Local +x is "forward".
function drawPerson(x, y, r, face, walk, moving, o) {
  shadow(x, y, r);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(face);
  const sw = Math.sin(walk) * r * 0.55 * moving;
  ctx.fillStyle = o.legs; circle(sw, -r * 0.42, r * 0.3); circle(-sw, r * 0.42, r * 0.3);
  ctx.fillStyle = o.arms;
  if (o.armsUp) { circle(r * 0.2, -r * 1.05, r * 0.28); circle(r * 0.2, r * 1.05, r * 0.28); }
  else { circle(-sw * 0.8, -r * 0.95, r * 0.27); circle(sw * 0.8, r * 0.95, r * 0.27); }
  ctx.fillStyle = o.body; ellipse(0, 0, r * 0.62, r * 0.95);
  if (o.stripe) { ctx.fillStyle = o.stripe; ctx.fillRect(-r * 0.1, -r * 0.9, r * 0.2, r * 1.8); }
  ctx.fillStyle = o.hair; circle(-r * 0.12, 0, r * 0.5);
  ctx.fillStyle = o.head; circle(r * 0.08, 0, r * 0.42);
  if (o.cap) { ctx.fillStyle = o.cap; circle(-r * 0.02, 0, r * 0.44); ctx.fillRect(r * 0.2, -r * 0.3, r * 0.35, r * 0.6); }
  ctx.restore();
}

function drawSquadMember(p) {
  const moving = Math.min(1, Math.hypot(p.vx, p.vy) / 30);
  let body = '#d62828', arms = '#d62828', legs = '#f6f3ea';
  if (p.team === 'B') { body = arms = '#1d4ed8'; legs = '#0b1b4a'; }
  if (p.keeper) { body = arms = p.team === 'A' ? '#2bb673' : '#9b5de5'; legs = '#111'; }
  if (p.team === 'R') { body = arms = '#111'; legs = '#111'; }
  if (p.star) {
    ctx.fillStyle = `rgba(255,215,0,${0.25 + 0.15 * Math.sin(G.time * 5)})`;
    circle(p.x, p.y, p.r + 7);
  }
  drawPerson(p.x, p.y, p.r, p.face, p.walk, moving, { body, arms, legs, head: '#d9a47a', hair: p.num % 3 ? '#2b1a10' : '#e0c27a' });
  if (p.team !== 'R') {
    ctx.fillStyle = p.star ? '#ffd700' : 'rgba(255,255,255,.85)';
    ctx.font = '800 8px Rubik, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(p.num, p.x, p.y + p.r + 8);
  }
}

function drawSteward(s) {
  const def = STEWARD[s.type];
  const v = Math.hypot(s.vx, s.vy);
  const moving = Math.min(1, v / 40);
  if (s.type === 'dog') {
    shadow(s.x, s.y, s.r);
    ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(s.face);
    const wag = Math.sin(G.time * 20) * 0.6;
    ctx.strokeStyle = '#5c3b1e'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(-s.r, 0); ctx.lineTo(-s.r - 7, wag * 6); ctx.stroke();
    const sw = Math.sin(s.walk * 1.4) * 3 * moving;
    ctx.fillStyle = '#3b2512';
    circle(s.r * 0.6 + sw, -4, 2.2); circle(s.r * 0.6 - sw, 4, 2.2); circle(-s.r * 0.6 - sw, -4, 2.2); circle(-s.r * 0.6 + sw, 4, 2.2);
    ctx.fillStyle = '#7a4e2a'; ellipse(0, 0, s.r * 1.3, s.r * 0.7);
    ctx.fillStyle = '#8b5a31'; circle(s.r * 1.25, 0, s.r * 0.6);
    ctx.fillStyle = '#3b2512'; ellipse(s.r * 1.1, -s.r * 0.55, 3, 2); ellipse(s.r * 1.1, s.r * 0.55, 3, 2);
    ctx.fillStyle = '#111'; circle(s.r * 1.8, 0, 1.6);
    ctx.fillStyle = '#e63b2e'; ctx.fillRect(s.r * 0.4, -s.r * 0.65, 2, s.r * 1.3);
    ctx.restore();
  } else {
    drawPerson(s.x, s.y, s.r, s.face, s.walk, moving, {
      body: def.vest, arms: '#1b1b1b', legs: '#111', stripe: def.stripe,
      head: s.type === 'gordo' ? '#e8b38f' : '#c98d64', hair: '#111', cap: s.type === 'normal' ? '#111' : null,
      armsUp: s.stun > 0 || (G.mode === 'caught' && s === G.catcher),
    });
  }
  // status marks
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  if (s.state === 'alert') {
    ctx.fillStyle = '#e63b2e'; ctx.font = '800 20px Bungee, sans-serif';
    ctx.fillText('!', s.x, s.y - s.r - 14 - Math.abs(Math.sin(G.time * 12)) * 4);
  } else if (s.stun > 0) {
    ctx.fillStyle = '#f2e205'; ctx.font = '800 16px Rubik, sans-serif';
    ctx.fillText('♪', s.x + Math.sin(G.time * 8) * 6, s.y - s.r - 12);
  } else if (s.tired) {
    ctx.fillStyle = '#7cc6ff';
    circle(s.x + s.r * 0.9, s.y - s.r - 2 + (G.time * 30 % 8), 2);
    circle(s.x - s.r * 0.7, s.y - s.r + (G.time * 25 % 8), 1.6);
  }
}

function drawPlayer() {
  const pl = G.player;
  const v = Math.hypot(pl.vx, pl.vy);
  if (G.mode === 'caught') {
    shadow(pl.x, pl.y, pl.r);
    ctx.save(); ctx.translate(pl.x, pl.y); ctx.rotate(pl.face + Math.PI / 2);
    ctx.fillStyle = '#e0a57d'; ellipse(0, 0, pl.r * 1.3, pl.r * 0.55);
    ctx.fillStyle = '#c84a1a'; circle(pl.r * 1.3, 0, pl.r * 0.42);
    ctx.restore();
    ctx.fillStyle = '#f2e205'; ctx.font = '800 12px Rubik, sans-serif'; ctx.textAlign = 'center';
    for (let i = 0; i < 3; i++) {
      const a = G.time * 4 + i * TAU / 3;
      ctx.fillText('★', pl.x + Math.cos(a) * 16, pl.y - 18 + Math.sin(a) * 5);
    }
    return;
  }
  drawPerson(pl.x, pl.y, pl.r, pl.face, pl.walk, Math.min(1, v / 40), {
    body: '#e0a57d', arms: '#e0a57d', legs: '#2d3a8c', head: '#e8b38f', hair: '#c84a1a',
  });
  // swinging shirt over the head
  const a = G.time * 13;
  const sx = pl.x + Math.cos(a) * 15, sy = pl.y - 6 + Math.sin(a) * 9;
  ctx.strokeStyle = '#e8b38f'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(pl.x, pl.y - 4); ctx.lineTo(sx, sy); ctx.stroke();
  ctx.save(); ctx.translate(sx, sy); ctx.rotate(a + Math.PI / 2);
  ctx.fillStyle = '#d62828'; ctx.fillRect(-6, -4, 12, 8);
  ctx.fillStyle = '#fff'; ctx.fillRect(-1, -4, 2, 8);
  ctx.restore();
  // name tag
  ctx.font = '800 11px Rubik, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,.7)';
  ctx.strokeText(G.name, pl.x, pl.y - 26);
  ctx.fillStyle = '#fff'; ctx.fillText(G.name, pl.x, pl.y - 26);
  if (pl.sprinting) {
    ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 2;
    for (let i = -1; i <= 1; i++) {
      const px = -Math.sin(pl.face) * i * 6, py = Math.cos(pl.face) * i * 6;
      ctx.beginPath();
      ctx.moveTo(pl.x - Math.cos(pl.face) * 14 + px, pl.y - Math.sin(pl.face) * 14 + py);
      ctx.lineTo(pl.x - Math.cos(pl.face) * 26 + px, pl.y - Math.sin(pl.face) * 26 + py);
      ctx.stroke();
    }
  }
}

function drawBall() {
  const b = G.ball;
  shadow(b.x, b.y - 2, b.r * 0.8);
  ctx.fillStyle = '#fff'; circle(b.x, b.y, b.r);
  ctx.fillStyle = '#222';
  for (let i = 0; i < 3; i++) {
    const a = b.spin + i * TAU / 3;
    circle(b.x + Math.cos(a) * b.r * 0.5, b.y + Math.sin(a) * b.r * 0.5, 1.4);
  }
}

function render() {
  const k = scale * dpr;
  ctx.setTransform(k, 0, 0, k, 0, 0);
  if (G.shake > 0) ctx.translate(rand(-1, 1) * G.shake * 0.4, rand(-1, 1) * G.shake * 0.4);
  ctx.drawImage(bg, 0, 0, W, H);
  drawCrowd();

  for (const p of G.particles) {
    ctx.globalAlpha = 1 - p.t / p.life;
    ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, p.size, p.size);
  }
  ctx.globalAlpha = 1;
  drawBall();

  const ents = [];
  for (const p of G.squad) ents.push([p.y, 0, p]);
  for (const s of G.stewards) ents.push([s.y + (G.mode === 'caught' && s === G.catcher ? 20 : 0), 1, s]);
  if (G.player && G.mode !== 'menu') ents.push([G.player.y, 2, G.player]);
  ents.sort((a, b) => a[0] - b[0]);
  for (const [, kind, e] of ents) {
    if (kind === 0) drawSquadMember(e);
    else if (kind === 1) drawSteward(e);
    else drawPlayer();
  }

  for (const p of G.popups) {
    const a = 1 - p.t / 1.3;
    ctx.globalAlpha = a;
    ctx.font = `${p.size}px Bungee, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(0,0,0,.6)';
    const y = p.y - p.t * 40;
    ctx.strokeText(p.text, p.x, y);
    ctx.fillStyle = p.color; ctx.fillText(p.text, p.x, y);
  }
  ctx.globalAlpha = 1;

  if (joy.active) {
    const ox = joy.ox / scale, oy = joy.oy / scale;
    ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(ox, oy, 55 / scale, 0, TAU); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.5)';
    circle(ox + joy.dx * 55 / scale, oy + joy.dy * 55 / scale, 20 / scale);
  }

  if (G.flash > 0) {
    ctx.setTransform(k, 0, 0, k, 0, 0);
    ctx.fillStyle = `rgba(255,255,255,${G.flash * 0.7})`;
    ctx.fillRect(0, 0, W, H);
  }
}

// ---------- loop ----------
let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (G.mode !== 'paused') {
    G.time += dt;
    if (G.mode === 'play') updatePlay(dt);
    else if (G.mode === 'caught') updateCaught(dt);
    updateAmbient(dt);
  }
  render();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

if (!isTouch) nameInput.focus();

// test hook (read-only snapshot)
if (params.has('debug')) window.__G = G;
window.__pitch = { get state() { return { mode: G.mode, t: G.t, score: score(), stewards: G.stewards.length, goals: G.goals, best: G.best }; } };
})();
