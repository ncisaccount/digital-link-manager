/* ============================================================================
   CORE — Digital Link Manager
   Lapisan: API client (SWR, dedupe, retry, idempoten), Store, Router, Shell UI
   Mengikuti prinsip gas-instant-ux-pro & gas-scale-turbo (frontend side)
   ============================================================================ */

// ---------------------------------------------------------------------------
// 0. ICONS (subset SVG ringan — Prinsip 9: tidak memuat seluruh library ikon)
// ---------------------------------------------------------------------------
const Icon = {
  dashboard: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>',
  grid: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
  star: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  starFill: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  report: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  settings: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  sun: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
  moon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
  search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  plus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  external: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
  eye: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  edit: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  trash: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>',
  download: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  upload: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
  globe: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  x: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  filter: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',
  chevronDown: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  chevronLeft: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
  chevronRight: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
  menu: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>',
  home: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  rocket: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',
  shield: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  wifi: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>',
  pen: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>',
  logout: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  link: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  folder: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
  image: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
  palette: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10c.93 0 1.68-.75 1.68-1.68 0-.44-.17-.84-.44-1.14-.27-.3-.44-.7-.44-1.14 0-.93.75-1.68 1.68-1.68h1.97c3.21 0 5.75-2.54 5.75-5.75C22 6.49 17.51 2 12 2z"/></svg>',
  mail: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><polyline points="22 6 12 13 2 6"/></svg>',
  clock: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  user: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  print: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>',
  refresh: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>'
};
function ic(name, cls) { return `<span class="${cls||''}" style="display:inline-flex">${Icon[name]||''}</span>`; }

const CATEGORY_COLORS = {
  'Administrasi Pemerintahan': '#0B2A6B', 'Sistem Informasi Desa': '#1E63E9', 'Keuangan dan Pelaporan': '#16A34A',
  'Pendidikan dan Pelatihan': '#F59E0B', 'Desain dan Kreativitas': '#A855F7', 'AI Tools': '#0F172A',
  'Produktivitas': '#22C5E8', 'Website Pribadi dan Bisnis': '#DC2626', 'Media Sosial': '#16A34A', 'Lainnya': '#64748B'
};
function catColor(name) { return CATEGORY_COLORS[name] || '#1E63E9'; }
function initials(name) { return (name||'?').trim().split(/\s+/).map(w=>w[0]).slice(0,2).join('').toUpperCase(); }
function escapeHtml(s) { return String(s==null?'':s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function timeAgo(iso) {
  if (!iso) return '-';
  const d = new Date(iso); if (isNaN(d)) return '-';
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs/60000);
  if (mins < 1) return 'Baru saja';
  if (mins < 60) return mins + ' menit lalu';
  const hrs = Math.floor(mins/60);
  if (hrs < 24) return hrs + ' jam lalu';
  const days = Math.floor(hrs/24);
  if (days === 1) return 'Kemarin, ' + d.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'});
  if (days < 7) return days + ' hari lalu';
  return d.toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'});
}
function fmtDateShort(iso) { if(!iso) return '-'; const d = new Date(iso); if(isNaN(d)) return '-'; return d.toLocaleDateString('id-ID',{day:'2-digit',month:'short'}); }

// ---------------------------------------------------------------------------
// 1. TOAST
// ---------------------------------------------------------------------------
const Toast = {
  stack: null,
  init() { this.stack = document.getElementById('toast-stack'); },
  show(msg, type) {
    type = type || 'info';
    const el = document.createElement('div');
    el.className = 'toast ' + type;
    const iconName = type === 'success' ? 'check' : type === 'error' ? 'x' : 'clock';
    el.innerHTML = ic(iconName) + '<span>' + escapeHtml(msg) + '</span>';
    this.stack.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .25s'; setTimeout(() => el.remove(), 250); }, 3200);
  }
};

// ---------------------------------------------------------------------------
// 2. STORE (localStorage SWR cache, namespaced per-user, versi skema)
// ---------------------------------------------------------------------------
const SCHEMA_V = 'dlm:v1:';
const Store = {
  ns() { return SCHEMA_V + (Auth.email || 'guest') + ':'; },
  get(key) {
    try { const raw = localStorage.getItem(this.ns() + key); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
  },
  set(key, val) {
    try { localStorage.setItem(this.ns() + key, JSON.stringify({ at: Date.now(), val })); } catch (e) {}
  },
  getFresh(key, ttlMs) {
    const rec = this.get(key);
    if (!rec) return null;
    return { data: rec.val, stale: (Date.now() - rec.at) > ttlMs };
  }
};

// ---------------------------------------------------------------------------
// 3. AUTH
// ---------------------------------------------------------------------------
const Auth = {
  token: null, email: null, role: null, nama: null,
  load() {
    try {
      const raw = localStorage.getItem('dlm:session');
      if (!raw) return false;
      const s = JSON.parse(raw);
      if (!s.token || !s.exp || s.exp < Date.now()) { this.clear(); return false; }
      this.token = s.token; this.email = s.email; this.role = s.role; this.nama = s.nama;
      return true;
    } catch (e) { return false; }
  },
  save(token, email, role, nama, exp) {
    this.token = token; this.email = email; this.role = role; this.nama = nama;
    localStorage.setItem('dlm:session', JSON.stringify({ token, email, role, nama, exp: exp || (Date.now() + 12*3600e3) }));
  },
  clear() {
    this.token = this.email = this.role = this.nama = null;
    localStorage.removeItem('dlm:session');
  },
  isOwner() { return this.role === 'Owner'; }
};

// ---------------------------------------------------------------------------
// 4. API CLIENT — Prinsip 8 (ketahanan jaringan), P6 idempoten, dedupe in-flight
// ---------------------------------------------------------------------------
const _inflight = {};
let _writeEpoch = 0;
const READ_ACTIONS = /^(dashboard|inventarisList|inventarisDetail|kategoriList|penggunaList|laporanRingkasan|pengaturanGet|logList|whoami|drain)$/;

function uuidLite() { return 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }

async function gasFetch_(method, action, dataOrParams, opts) {
  opts = opts || {};
  const timeoutMs = opts.timeoutMs || (method === 'POST' ? 90000 : 25000);
  const maxRetry = opts.retry != null ? opts.retry : (method === 'GET' ? 2 : 0);
  let attempt = 0, lastErr;

  while (attempt <= maxRetry) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      let res;
      if (method === 'GET') {
        const qs = new URLSearchParams(Object.assign({ action }, dataOrParams || {}, Auth.token ? { token: Auth.token } : {}));
        res = await fetch(GAS_URL + '?' + qs.toString(), { method: 'GET', signal: controller.signal, redirect: 'follow' });
      } else {
        const body = { action, data: dataOrParams || {}, token: Auth.token, reqId: opts.reqId };
        res = await fetch(GAS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // wajib agar tidak memicu CORS preflight
          body: JSON.stringify(body),
          signal: controller.signal, redirect: 'follow'
        });
      }
      clearTimeout(timer);
      if (!res.ok && (res.status === 500 || res.status === 429) && attempt < maxRetry) { attempt++; await sleep_(400 * attempt); continue; }
      const json = await res.json();
      return json;
    } catch (err) {
      clearTimeout(timer);
      lastErr = err;
      if (attempt < maxRetry) { attempt++; await sleep_(400 * attempt); continue; }
      break;
    }
  }
  return { success: false, message: (lastErr && lastErr.name === 'AbortError') ? 'Waktu permintaan habis. Periksa koneksi internet Anda.' : 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.', offline: true };
}
function sleep_(ms) { return new Promise(r => setTimeout(r, ms)); }

async function api(action, data, opts) {
  opts = opts || {};
  if (!READ_ACTIONS.test(action)) {
    _writeEpoch++;
    if (!opts.reqId) opts.reqId = uuidLite();
    const result = await gasFetch_('POST', action, data, opts);
    if (result && result.nq) scheduleDrain();
    return result;
  }
  const key = _writeEpoch + '|' + action + '|' + JSON.stringify(data || {});
  if (_inflight[key]) return _inflight[key];
  const p = gasFetch_('GET', action, data, opts);
  _inflight[key] = p;
  p.then(() => delete _inflight[key], () => delete _inflight[key]);
  return p;
}

let _drainTimer = null, _drainTries = 0;
function scheduleDrain() {
  if (_drainTimer) return;
  _drainTimer = setTimeout(async () => {
    _drainTimer = null;
    const r = await api('drain', {});
    _drainTries++;
    if (r && r.drained > 0 && _drainTries < 3) scheduleDrain(); else _drainTries = 0;
  }, 400);
}

// SWR read: render dari cache lokal instan, revalidate jika basi
async function swr(key, action, params, ttlMs, onData) {
  const cached = Store.getFresh(key, ttlMs);
  if (cached && cached.data) onData(cached.data, true);
  if (!cached || cached.stale) {
    const res = await api(action, params);
    if (res && res.success) { Store.set(key, res); onData(res, false); }
    else if (!cached) onData(null, false, res);
  }
}

// ---------------------------------------------------------------------------
// 5. NETWORK STATUS
// ---------------------------------------------------------------------------
const NetStatus = {
  init() {
    window.addEventListener('online', () => Toast.show('Koneksi kembali tersambung.', 'success'));
    window.addEventListener('offline', () => Toast.show('Anda sedang offline. Beberapa data mungkin tidak terkini.', 'error'));
  }
};

// ---------------------------------------------------------------------------
// 6. ACTIVITY (polling adaptif — hanya untuk tampilan yang butuh live update)
// ---------------------------------------------------------------------------
const Activity = {
  at: Date.now(), last: {},
  init() { ['pointerdown','keydown','wheel','touchstart','focus'].forEach(ev => addEventListener(ev, () => this.at = Date.now(), { passive: true })); },
  idle() { return Date.now() - this.at > 120000; },
  due(key, activeMs, idleMs) {
    if (document.visibilityState !== 'visible') return false;
    if (Date.now() - (this.last[key] || 0) < (this.idle() ? idleMs : activeMs) - 500) return false;
    this.last[key] = Date.now(); return true;
  }
};

// ---------------------------------------------------------------------------
// 7. THEME
// ---------------------------------------------------------------------------
const Theme = {
  init() {
    const saved = localStorage.getItem('dlm:theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);
    this.updateIcon();
  },
  toggle() {
    const cur = document.documentElement.getAttribute('data-theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('dlm:theme', next);
    this.updateIcon();
  },
  updateIcon() {
    const btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;
    const cur = document.documentElement.getAttribute('data-theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    btn.innerHTML = ic(cur === 'dark' ? 'sun' : 'moon');
  }
};

// ---------------------------------------------------------------------------
// 8. ROUTER — hash based SPA, halaman tetap hidup, tanpa rebuild DOM berulang
// ---------------------------------------------------------------------------
const Router = {
  routes: {},
  current: null,
  register(path, def) { this.routes[path] = def; },
  start() {
    window.addEventListener('hashchange', () => this.resolve());
    this.resolve();
  },
  parse() {
    const hash = location.hash.replace(/^#\/?/, '');
    const [path, qs] = hash.split('?');
    const parts = path.split('/').filter(Boolean);
    const query = {};
    if (qs) qs.split('&').forEach(kv => { const [k,v] = kv.split('='); query[decodeURIComponent(k)] = decodeURIComponent(v||''); });
    return { name: parts[0] || 'dashboard', param: parts[1] || null, query };
  },
  go(path) { location.hash = '#/' + path; },
  resolve() {
    if (!Auth.load() && this.parse().name !== 'login') { this.go('login'); return; }
    const { name, param, query } = this.parse();
    const def = this.routes[name] || this.routes['notfound'];
    if (!def) return;
    this.current = name;
    renderShellVisibility(name !== 'login');
    highlightNav(name);
    document.querySelectorAll('.page-view').forEach(el => el.classList.remove('active'));
    let el = document.getElementById('page-' + name);
    if (!el) {
      el = document.createElement('div');
      el.id = 'page-' + name;
      el.className = 'page-view';
      document.getElementById('page-root').appendChild(el);
    }
    el.classList.add('active');
    def.render(el, param, query);
    window.scrollTo(0, 0);
  }
};

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { key: 'katalog', label: 'Katalog', icon: 'grid' },
  { key: 'favorit', label: 'Favorit', icon: 'star' },
  { key: 'laporan', label: 'Laporan', icon: 'report' },
  { key: 'pengaturan', label: 'Pengaturan', icon: 'settings' }
];
const BOTTOM_NAV_ITEMS = [
  { key: 'dashboard', label: 'Beranda', icon: 'dashboard' },
  { key: 'katalog', label: 'Katalog', icon: 'grid' },
  { key: 'inventaris', label: 'Inventaris', icon: 'link' },
  { key: 'favorit', label: 'Favorit', icon: 'star' },
  { key: 'pengaturan', label: 'Atur', icon: 'settings' }
];

function highlightNav(name) {
  document.querySelectorAll('.topnav-menu a, .mobile-drawer-panel a, .bottom-nav a').forEach(a => {
    a.classList.toggle('active', a.dataset.route === name);
  });
}
function renderShellVisibility(show) {
  const shell = document.getElementById('app-shell');
  shell.style.display = show ? '' : 'none';
  document.getElementById('login-root').style.display = show ? 'none' : '';
}

// ---------------------------------------------------------------------------
// 9. SHELL (top nav, mobile drawer, bottom nav, profile)
// ---------------------------------------------------------------------------
function buildShell() {
  const topnav = document.getElementById('topnav');
  topnav.innerHTML = `
    <div class="topnav-inner">
      <div class="topnav-brand" data-route-link="dashboard">
        <div class="brand-mark">DL</div>
        <div class="brand-text">
          <div class="brand-title">DIGITAL LINK MANAGER</div>
          <div class="brand-sub">Pusat Inventarisasi Aplikasi &amp; Website</div>
        </div>
      </div>
      <nav class="topnav-menu">
        ${NAV_ITEMS.map(n => `<a href="#/${n.key}" data-route="${n.key}">${n.label}</a>`).join('')}
      </nav>
      <div class="topnav-actions">
        <button class="theme-toggle" id="theme-toggle-btn" title="Ganti tema"></button>
        <div class="topnav-profile" id="profile-menu-btn">
          <div class="avatar-fallback" id="profile-avatar"></div>
          <div class="topnav-profile-text">
            <div class="topnav-profile-name" id="profile-name"></div>
            <div class="topnav-profile-role" id="profile-role"></div>
          </div>
          ${ic('chevronDown')}
        </div>
        <button class="hamburger-btn" id="hamburger-btn">${ic('menu')}</button>
      </div>
    </div>
  `;
  document.getElementById('theme-toggle-btn').onclick = () => Theme.toggle();
  document.getElementById('hamburger-btn').onclick = () => openDrawer();
  document.getElementById('profile-menu-btn').onclick = () => openProfileMenu();
  topnav.querySelector('.topnav-brand').onclick = () => Router.go('dashboard');

  document.getElementById('bottom-nav').innerHTML = BOTTOM_NAV_ITEMS.map(n =>
    `<a href="#/${n.key}" data-route="${n.key}">${ic(n.icon)}<span>${n.label}</span></a>`).join('');

  document.getElementById('mobile-drawer').innerHTML = `
    <div class="mobile-drawer-panel">
      <div class="flex-between" style="margin-bottom:1rem;">
        <strong style="font-family:var(--font-display)">Menu</strong>
        <button class="icon-btn" id="drawer-close">${ic('x')}</button>
      </div>
      ${NAV_ITEMS.map(n => `<a href="#/${n.key}" data-route="${n.key}">${n.label}</a>`).join('')}
    </div>`;
  document.getElementById('drawer-close').onclick = closeDrawer;
  document.getElementById('mobile-drawer').onclick = (e) => { if (e.target.id === 'mobile-drawer') closeDrawer(); };
  document.querySelectorAll('.mobile-drawer-panel a').forEach(a => a.onclick = closeDrawer);

  updateProfileUI();
}
function openDrawer() { document.getElementById('mobile-drawer').classList.add('open'); }
function closeDrawer() { document.getElementById('mobile-drawer').classList.remove('open'); }

function updateProfileUI() {
  const nameEl = document.getElementById('profile-name');
  const roleEl = document.getElementById('profile-role');
  const avEl = document.getElementById('profile-avatar');
  if (!nameEl) return;
  nameEl.textContent = Auth.nama || (Auth.email || '').split('@')[0];
  roleEl.textContent = Auth.role === 'Owner' ? 'Personal / Owner' : 'Pengguna';
  avEl.textContent = initials(Auth.nama || Auth.email || '?');
}

function openProfileMenu() {
  Modal.open({
    title: 'Akun Saya',
    body: `
      <div style="display:flex;flex-direction:column;align-items:center;gap:.6rem;padding:.5rem 0 1.25rem;">
        <div class="avatar-fallback" style="width:64px;height:64px;font-size:22px;">${initials(Auth.nama||Auth.email)}</div>
        <div style="text-align:center;">
          <div style="font-weight:700;font-size:15px;">${escapeHtml(Auth.nama || Auth.email)}</div>
          <div class="t-muted t-body-sm">${escapeHtml(Auth.email)}</div>
          <span class="pill status-aktif" style="margin-top:.4rem;">${Auth.role}</span>
        </div>
      </div>`,
    actions: [
      { label: 'Pengaturan', className: 'btn-secondary', onClick: () => { Modal.close(); Router.go('pengaturan'); } },
      { label: 'Keluar', className: 'btn-danger', onClick: () => { Modal.close(); logout(); } }
    ]
  });
}
function logout() { Auth.clear(); Router.go('login'); Toast.show('Anda telah keluar.', 'info'); }

// ---------------------------------------------------------------------------
// 10. MODAL / CONFIRM
// ---------------------------------------------------------------------------
const Modal = {
  open({ title, body, actions }) {
    this.close();
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.id = 'active-modal';
    backdrop.innerHTML = `
      <div class="modal-card">
        <div class="flex-between" style="margin-bottom:.9rem;">
          <h3 class="h-sm">${escapeHtml(title)}</h3>
          <button class="icon-btn" id="modal-x">${ic('x')}</button>
        </div>
        <div id="modal-body">${body}</div>
        <div style="display:flex;gap:.6rem;justify-content:flex-end;margin-top:1.4rem;" id="modal-actions"></div>
      </div>`;
    document.body.appendChild(backdrop);
    document.getElementById('modal-x').onclick = () => this.close();
    backdrop.onclick = (e) => { if (e.target === backdrop) this.close(); };
    const actWrap = document.getElementById('modal-actions');
    (actions || []).forEach(a => {
      const btn = document.createElement('button');
      btn.className = 'btn ' + (a.className || 'btn-secondary');
      btn.textContent = a.label;
      btn.onclick = a.onClick;
      actWrap.appendChild(btn);
    });
  },
  close() { const m = document.getElementById('active-modal'); if (m) m.remove(); }
};
function confirmDelete(message, onConfirm) {
  Modal.open({
    title: 'Konfirmasi Hapus',
    body: `<p class="t-body-md t-muted" style="margin:0;line-height:1.6;">${escapeHtml(message)}</p>`,
    actions: [
      { label: 'Batal', className: 'btn-secondary', onClick: () => Modal.close() },
      { label: 'Hapus', className: 'btn-danger-solid', onClick: async () => { Modal.close(); await onConfirm(); } }
    ]
  });
}

// ---------------------------------------------------------------------------
// 11. HELPERS UI UMUM
// ---------------------------------------------------------------------------
function statusPill(status) {
  const map = { 'Aktif': ['status-aktif','Aktif'], 'Tidak Aktif': ['status-tidak','Tidak Aktif'], 'Perlu Diperiksa': ['status-perlu','Perlu Diperiksa'] };
  const m = map[status] || map['Perlu Diperiksa'];
  return `<span class="pill ${m[0]}"><span class="pill-dot"></span>${m[1]}</span>`;
}
function appIconHtml(app, size) {
  size = size || 36;
  const bg = app.warnaUtama || app.warna_utama || catColor(app.kategori);
  if (app.thumbnail || app.thumbnailLogo) {
    return `<div class="row-app-icon" style="width:${size}px;height:${size}px;background:${bg}"><img src="${escapeHtml(app.thumbnail||app.thumbnailLogo)}" alt=""></div>`;
  }
  return `<div class="row-app-icon" style="width:${size}px;height:${size}px;background:${bg}">${initials(app.nama)}</div>`;
}
function debounce(fn, wait) { let t; return function(...a) { clearTimeout(t); t = setTimeout(() => fn.apply(this, a), wait); }; }

function renderSkeletonRows(n, cols) {
  let out = '';
  for (let i=0;i<n;i++) out += `<tr>${Array(cols).fill('<td><div class="skeleton" style="height:14px;width:80%"></div></td>').join('')}</tr>`;
  return out;
}

// ---------------------------------------------------------------------------
// 12. WARMUP (Prinsip 7, gas-scale-turbo 4.7) — panggil saat login dibuka
// ---------------------------------------------------------------------------
function warmUpServer(scope) {
  try {
    const key = 'dlm:warm:' + scope;
    const last = Number(sessionStorage.getItem(key) || 0);
    if (Date.now() - last < 4 * 60000) return;
    sessionStorage.setItem(key, String(Date.now()));
    fetch(GAS_URL + '?w=' + scope, { method: 'GET', mode: 'no-cors' }).catch(() => {});
  } catch (e) {}
}
