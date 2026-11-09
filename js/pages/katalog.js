/* ============================================================================
   HALAMAN KATALOG — App Launcher Grid/Daftar
   ============================================================================ */
const KatState = { q: '', kategori: '', view: 'grid', page: 1, pageSize: 12 };

Router.register('katalog', { render: renderKatalog });

function renderKatalog(el) {
  el.innerHTML = `
    <div class="breadcrumb">${ic('home')}<a href="#/dashboard">Dashboard</a><span class="sep">/</span><span>Katalog</span></div>
    <div class="flex-between" style="margin-bottom:1.1rem;flex-wrap:wrap;gap:1rem;">
      <div class="input-icon-wrap" style="flex:1;min-width:240px;max-width:460px;">
        <span class="icon-left">${ic('search')}</span>
        <input class="input search-input" id="kat-search" placeholder="Cari aplikasi atau kategori...">
      </div>
      <div class="flex-row">
        <span class="pill status-aktif" id="kat-count"><span class="pill-dot"></span>…</span>
        <div class="flex-row" style="background:var(--surface-container);padding:3px;border-radius:10px;">
          <button class="btn btn-sm" id="view-grid" style="background:var(--bg-surface-white);box-shadow:var(--shadow-card);">${ic('grid')} Grid</button>
          <button class="btn btn-sm btn-ghost" id="view-list">${ic('report')} Daftar</button>
        </div>
      </div>
    </div>
    <div class="flex-row" id="kat-chips" style="overflow-x:auto;padding-bottom:.5rem;margin-bottom:1.1rem;flex-wrap:nowrap;"></div>
    <div id="kat-grid" class="grid-auto-fit">${renderSkeletonRows(1,1)}</div>
    <div class="flex-between" style="margin-top:1.25rem;">
      <span></span>
      <div class="pagination" id="kat-pagination"></div>
    </div>
  `;

  document.getElementById('kat-search').addEventListener('input', debounce((e) => { KatState.q = e.target.value; KatState.page = 1; loadKatalog(); }, 300));
  document.getElementById('view-grid').onclick = () => setKatView('grid');
  document.getElementById('view-list').onclick = () => setKatView('list');

  loadKatalogChips();
  loadKatalog();
}

function setKatView(v) {
  KatState.view = v;
  document.getElementById('view-grid').className = 'btn btn-sm ' + (v==='grid' ? '' : 'btn-ghost');
  document.getElementById('view-grid').style.background = v==='grid' ? 'var(--bg-surface-white)' : 'transparent';
  document.getElementById('view-grid').style.boxShadow = v==='grid' ? 'var(--shadow-card)' : 'none';
  document.getElementById('view-list').className = 'btn btn-sm ' + (v==='list' ? '' : 'btn-ghost');
  document.getElementById('view-list').style.background = v==='list' ? 'var(--bg-surface-white)' : 'transparent';
  document.getElementById('view-list').style.boxShadow = v==='list' ? 'var(--shadow-card)' : 'none';
  loadKatalog();
}

async function loadKatalogChips() {
  const res = await api('kategoriList', {});
  const wrap = document.getElementById('kat-chips');
  if (!wrap) return;
  const chips = [{ nama: '', label: 'Semua Kategori' }].concat((res && res.data) || []);
  wrap.innerHTML = chips.map(k => `<button class="chip chip-filter ${KatState.kategori===k.nama?'active':''}" data-k="${escapeHtml(k.nama)}">${escapeHtml(k.label || k.nama)}</button>`).join('');
  wrap.querySelectorAll('button[data-k]').forEach(b => b.onclick = () => { KatState.kategori = b.dataset.k; KatState.page = 1; loadKatalogChips(); loadKatalog(); });
}
function filterKatalogByCategory(nama) { KatState.kategori = nama; KatState.page = 1; loadKatalogChips(); loadKatalog(); }

async function loadKatalog() {
  const grid = document.getElementById('kat-grid');
  if (!grid) return;
  const res = await api('inventarisList', { q: KatState.q, kategori: KatState.kategori, page: KatState.page, pageSize: KatState.pageSize, status: '', sortBy: 'Nama Aplikasi', sortDir: 'asc' });
  if (!res || !res.success) { grid.innerHTML = emptyStateHtml('Gagal memuat katalog', 'Periksa koneksi Anda.'); return; }

  document.getElementById('kat-count').innerHTML = `<span class="pill-dot"></span>${res.total} Aplikasi Terkatalog`;

  if (!res.data.length) {
    grid.innerHTML = `<div class="card card-pad-lg" style="grid-column:1/-1;"><div class="empty-state">${ic('grid')}<h3 class="h-sm">Tidak ada aplikasi</h3><p class="t-body-sm">Coba kategori lain atau tambahkan aplikasi baru.</p></div></div>`;
  } else if (KatState.view === 'grid') {
    grid.className = 'grid-auto-fit';
    grid.innerHTML = res.data.map(a => launcherCardHtml(a)).join('');
  } else {
    grid.className = '';
    grid.innerHTML = `<div class="card"><div class="table-wrap"><table class="dtable"><thead><tr><th>Aplikasi</th><th>Kategori</th><th>Status</th><th></th></tr></thead><tbody>${
      res.data.map(a => `<tr>
        <td><div class="row-app">${appIconHtml(a,36)}<div><div class="row-app-name">${escapeHtml(a.nama)}</div><div class="row-app-sub">${escapeHtml(a.url)}</div></div></div></td>
        <td><span class="kategori-tag">${escapeHtml(a.kategori||'')}</span></td>
        <td>${statusPill(a.status)}</td>
        <td><div class="action-icons"><a class="btn btn-sm btn-primary" href="${escapeHtml(a.url)}" target="_blank" rel="noopener">Buka ${ic('external')}</a></div></td>
      </tr>`).join('')
    }</tbody></table></div></div>`;
  }

  paintPagination(document.getElementById('kat-pagination'), res.page, res.totalPages, (p) => { KatState.page = p; loadKatalog(); });
}

function launcherCardHtml(a) {
  return `
    <div class="card hoverable launcher-card">
      <div class="launcher-top">
        <div class="launcher-icon" style="background:${a.warnaUtama||catColor(a.kategori)}">
          ${a.thumbnail ? `<img src="${escapeHtml(a.thumbnail)}" alt="">` : initials(a.nama)}
        </div>
        <div class="flex-row" style="gap:.3rem;">
          ${statusPillDot(a.status)}
          <button class="icon-btn star ${a.favorit?'active':''}" onclick="event.stopPropagation();quickToggleFavoritKat('${a.id}', this)">${ic(a.favorit?'starFill':'star')}</button>
        </div>
      </div>
      <div>
        <div class="launcher-title">${escapeHtml(a.nama)}</div>
        <div class="launcher-sub">${escapeHtml(a.kategori||'')}</div>
      </div>
      <div class="launcher-desc">${escapeHtml(a.deskripsi || 'Tidak ada deskripsi.')}</div>
      <div class="launcher-footer">
        <span class="chip">${escapeHtml(a.tipe||'')}</span>
        <a class="btn btn-primary btn-sm" href="${escapeHtml(a.url)}" target="_blank" rel="noopener">Buka ${ic('external')}</a>
      </div>
    </div>`;
}
function statusPillDot(status) {
  const color = status==='Aktif' ? '#16A34A' : status==='Tidak Aktif' ? '#DC2626' : '#F59E0B';
  return `<span class="pill" style="background:${color}1a;color:${color};padding:3px 8px;"><span class="pill-dot" style="background:${color}"></span>${escapeHtml(status||'')}</span>`;
}
async function quickToggleFavoritKat(id, btn) { await quickToggleFavorit(id, btn); }
