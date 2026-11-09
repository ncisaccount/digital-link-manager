/* ============================================================================
   HALAMAN DASHBOARD — Bento Grid
   ============================================================================ */
const QUICK_ACCESS = [
  { key: 'tambah', label: 'Tambah URL', icon: 'plus', route: 'tambah-url', accent: '#1E63E9', solid:true },
  { key: 'katalog', label: 'Katalog', icon: 'grid', route: 'katalog', accent: '#1E63E9' },
  { key: 'favorit', label: 'Favorit', icon: 'star', route: 'favorit', accent: '#F59E0B' },
  { key: 'laporan', label: 'Laporan', icon: 'report', route: 'laporan', accent: '#22C5E8' },
  { key: 'backup', label: 'Backup', icon: 'folder', route: 'pengaturan?tab=backup', accent: '#16A34A' },
  { key: 'pengaturan', label: 'Pengaturan', icon: 'settings', route: 'pengaturan', accent: '#64748B' }
];

function dashboardSkeleton() {
  return `
    <div class="bento-grid">
      <div class="span-7 card card-pad-lg"><div class="skeleton" style="height:220px"></div></div>
      <div class="span-5" style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;">
        ${Array(4).fill('<div class="card card-pad"><div class="skeleton" style="height:90px"></div></div>').join('')}
      </div>
    </div>`;
}

Router.register('dashboard', { render: renderDashboard });

function renderDashboard(el) {
  if (!el.dataset.inited) {
    el.dataset.inited = '1';
    el.innerHTML = dashboardSkeleton();
  }
  loadDashboardData(el);
}

async function loadDashboardData(el) {
  await swr('dashboard', 'dashboard', {}, 60000, (res, fromCache) => {
    if (!res) { el.innerHTML = emptyStateHtml('Gagal memuat dashboard', 'Periksa koneksi internet Anda dan coba lagi.'); return; }
    paintDashboard(el, res);
  });
}

function paintDashboard(el, res) {
  const s = res.stats || {};
  el.innerHTML = `
    <div class="bento-grid">

      <!-- HERO -->
      <div class="span-7 card card-pad-lg" style="background:linear-gradient(135deg,#0B2A6B,#0E3A8F);color:#fff;border:none;position:relative;overflow:hidden;">
        <span class="pill" style="background:rgba(255,255,255,0.15);color:#fff;margin-bottom:1rem;">${ic('wifi')} Sistem Terpadu v${APP_VERSION_FE}</span>
        <h1 class="h-hero" style="color:#fff;margin-bottom:.6rem;">Kelola Semua Tautan Digital Anda Dalam Satu Tempat</h1>
        <p style="color:rgba(255,255,255,0.75);max-width:480px;margin:0 0 1.5rem;line-height:1.6;">Akses lebih cepat, terorganisir rapi, produktivitas semakin meningkat. Pantau status seluruh aset web Anda secara otomatis.</p>
        <div style="display:flex;gap:.75rem;flex-wrap:wrap;">
          <button class="btn btn-primary" id="hero-jelajahi" style="background:#fff;color:#0B2A6B;">Jelajahi Sekarang ${ic('chevronRight')}</button>
          <button class="btn" id="hero-tambah" style="background:rgba(255,255,255,0.12);color:#fff;">${ic('plus')} Tambah URL</button>
        </div>
      </div>

      <!-- STAT TILES -->
      <div class="span-5" style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;">
        ${statTile(ic('globe'), '#DBEAFE', '#1E63E9', s.totalUrl, 'Total URL', 'tautan aktif', '+' + Math.max(0, s.totalUrl - (s.totalUrl)) , null)}
        ${statTile(ic('grid'), '#DCFCE7', '#16A34A', s.totalKategori, 'Kategori', 'sektor terdata', null, null)}
        ${statTile(ic('star'), '#FEF3C7', '#F59E0B', s.favorit, 'Favorit', 'pin terpilih', null, 'Akses cepat')}
        ${statTile(ic('check'), '#DCFCE7', '#16A34A', s.aktif, 'Status Aktif', 'dari ' + s.totalUrl + ' link', null, (s.persenSehat||0) + '% Sehat')}
      </div>

      <!-- KATEGORI POPULER -->
      <div class="span-4 card card-pad">
        <div class="flex-between" style="margin-bottom:1rem;">
          <div class="section-title"><h3 class="h-sm">${ic('grid')} Kategori Populer</h3></div>
          <a href="#/katalog" class="t-body-sm" style="color:var(--secondary);font-weight:700;">Lihat Semua</a>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.6rem;">
          ${(res.kategoriPopuler||[]).slice(0,8).map(k => `
            <div class="card hoverable" style="padding:.75rem;cursor:pointer;" onclick="Router.go('katalog'); setTimeout(()=>filterKatalogByCategory && filterKatalogByCategory('${escapeHtml(k.nama)}'),50);">
              <div class="t-body-sm" style="font-weight:700;margin-bottom:.2rem;">${escapeHtml(k.nama)}</div>
              <div class="t-body-sm t-muted">${k.jumlah} Tautan</div>
            </div>`).join('') || '<div class="t-muted t-body-sm">Belum ada kategori.</div>'}
        </div>
        <div class="flex-between" style="margin-top:1rem;font-size:12px;" class="t-muted">
          <span class="t-muted">${(res.kategoriPopuler||[]).length} Kategori terdaftar di Sheets</span>
        </div>
      </div>

      <!-- AKTIVITAS 30 HARI -->
      <div class="span-8 card card-pad">
        <div class="flex-between" style="margin-bottom:1rem;">
          <div class="section-title"><h3 class="h-sm">${ic('report')} Aktivitas 30 Hari Terakhir</h3></div>
          <span class="t-body-sm t-muted">Frekuensi klik tautan dan pembukaan web</span>
        </div>
        <div id="activity-chart"></div>
      </div>

      <!-- AKSES CEPAT -->
      <div class="span-4 card card-pad">
        <div class="flex-between" style="margin-bottom:1rem;">
          <h3 class="h-sm">Akses Cepat</h3><span class="t-body-sm t-muted">Pintasan Utama</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;">
          ${QUICK_ACCESS.map(q => `
            <button class="card hoverable" data-qa="${q.route}" style="padding:1rem .75rem;display:flex;flex-direction:column;align-items:center;gap:.5rem;border:none;background:${q.solid?'var(--secondary)':'var(--bg-surface-white)'};color:${q.solid?'#fff':'var(--on-surface)'};">
              <span style="color:${q.solid?'#fff':q.accent}">${ic(q.icon)}</span>
              <span style="font-size:12px;font-weight:700;">${q.label}</span>
            </button>`).join('')}
        </div>
      </div>

      <div class="span-12 card card-pad-lg" style="background:var(--primary);color:#fff;border:none;">
        <p style="font-style:italic;font-size:15px;line-height:1.6;max-width:640px;margin:0;">“Organisasi yang baik berawal dari pengelolaan data yang rapi dan terukur.”</p>
        <p style="margin:.5rem 0 0;color:rgba(255,255,255,0.6);font-size:12px;">— Executive Motto</p>
      </div>

      <!-- APP LAUNCHER -->
      <div class="span-12 card card-pad">
        <div class="flex-between" style="margin-bottom:1.1rem;">
          <div>
            <h3 class="h-sm">${ic('rocket')} App Launcher &amp; Tautan Cepat</h3>
            <p class="t-body-sm t-muted" style="margin:.2rem 0 0;">Buka langsung aplikasi utama dalam satu klik</p>
          </div>
          <a href="#/katalog" class="btn btn-secondary btn-sm">Lihat Semua ${ic('chevronRight')}</a>
        </div>
        <div class="mini-launcher-grid" id="dash-launcher-grid">
          ${renderSkeletonRows(1,1)}
        </div>
      </div>

      <!-- INVENTARIS TERBARU -->
      <div class="span-12 card card-pad">
        <div class="flex-between" style="margin-bottom:1rem;">
          <div>
            <h3 class="h-sm">Inventaris URL Terbaru</h3>
            <p class="t-body-sm t-muted" style="margin:.2rem 0 0;">Pratinjau cepat status tautan yang baru diverifikasi</p>
          </div>
          <div class="flex-row">
            <a href="#/inventaris" class="btn btn-secondary btn-sm">${ic('filter')} Filter Kategori</a>
            <button class="btn btn-secondary btn-sm" id="dash-export-btn">${ic('download')} Ekspor (.xlsx)</button>
          </div>
        </div>
        <div class="table-wrap">
          <table class="dtable">
            <thead><tr><th>No</th><th>Nama Aplikasi</th><th>Tipe</th><th>Kategori</th><th>Status</th><th>Terakhir Dicek</th><th></th></tr></thead>
            <tbody id="dash-inv-tbody">${renderSkeletonRows(5,7)}</tbody>
          </table>
        </div>
      </div>
    </div>`;

  document.getElementById('hero-jelajahi').onclick = () => Router.go('katalog');
  document.getElementById('hero-tambah').onclick = () => Router.go('tambah-url');
  document.getElementById('dash-export-btn').onclick = () => doExport({});
  el.querySelectorAll('[data-qa]').forEach(b => b.onclick = () => Router.go(b.dataset.qa));

  paintActivityChart(document.getElementById('activity-chart'), res.aktivitas || []);
  paintDashLauncher(document.getElementById('dash-launcher-grid'), res.terbaru || []);
  paintDashInvTable(document.getElementById('dash-inv-tbody'), res.terbaru || []);
}

function statTile(iconHtml, bg, fg, value, label, sub, deltaText, badgeText) {
  return `
    <div class="card card-pad stat-tile">
      <div class="stat-tile-top">
        <div class="stat-icon" style="background:${bg};color:${fg}">${iconHtml}</div>
        ${badgeText ? `<span class="stat-delta pos">${badgeText}</span>` : (deltaText ? `<span class="stat-delta neutral">${deltaText}</span>` : '')}
      </div>
      <div>
        <div class="stat-label">${label}</div>
        <div class="stat-value">${value != null ? value : '–'}</div>
        <div class="stat-sub">${sub}</div>
      </div>
    </div>`;
}

function paintActivityChart(container, aktivitas) {
  if (!container) return;
  if (!aktivitas.length) { container.innerHTML = '<div class="empty-state">Belum ada data aktivitas.</div>'; return; }
  const max = Math.max(1, ...aktivitas.map(a => a.jumlah));
  const w = 760, h = 200, pad = 28;
  const stepX = (w - pad*2) / (aktivitas.length - 1 || 1);
  const pts = aktivitas.map((a,i) => {
    const x = pad + i*stepX;
    const y = h - pad - (a.jumlah/max) * (h - pad*2);
    return [x,y];
  });
  const path = pts.map((p,i) => (i===0?'M':'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const areaPath = path + ` L${pts[pts.length-1][0]},${h-pad} L${pts[0][0]},${h-pad} Z`;
  const avg = Math.round((aktivitas.reduce((a,b)=>a+b.jumlah,0) / aktivitas.length) * 10) / 10;

  container.innerHTML = `
    <svg viewBox="0 0 ${w} ${h}" style="width:100%;height:200px;overflow:visible;">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#1E63E9" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#1E63E9" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path d="${areaPath}" fill="url(#areaGrad)"/>
      <path d="${path}" fill="none" stroke="#1E63E9" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      ${pts.map((p,i) => `<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="#fff" stroke="#1E63E9" stroke-width="2"/>`).join('')}
    </svg>
    <div class="flex-between" style="margin-top:.5rem;">
      <span class="t-body-sm t-muted">${fmtDateShort(new Date(Date.now()-29*864e5))} — ${fmtDateShort(new Date())}</span>
      <span class="t-body-sm" style="color:var(--success-green);font-weight:700;">${ic('report')} Rata-rata ${avg} klik per hari</span>
    </div>`;
}

function paintDashLauncher(container, apps) {
  if (!container) return;
  if (!apps.length) { container.innerHTML = '<div class="empty-state">Belum ada aplikasi. <a href="#/tambah-url" style="color:var(--secondary);font-weight:700;">Tambah sekarang</a></div>'; return; }
  container.innerHTML = apps.slice(0,10).map(a => `
    <a class="mini-launcher" href="${escapeHtml(a.url)}" target="_blank" rel="noopener">
      <div class="mini-launcher-icon" style="background:${a.warnaUtama||catColor(a.kategori)}">
        ${a.thumbnail ? `<img src="${escapeHtml(a.thumbnail)}" alt="">` : initials(a.nama)}
        <span class="dot" style="background:${a.status==='Aktif'?'#16A34A':a.status==='Tidak Aktif'?'#DC2626':'#F59E0B'}"></span>
      </div>
      <div class="mini-launcher-name">${escapeHtml(a.nama)}</div>
      <div class="mini-launcher-cat">${escapeHtml(a.kategori||'')}</div>
    </a>`).join('');
}

function paintDashInvTable(tbody, apps) {
  if (!tbody) return;
  if (!apps.length) { tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state">Belum ada data inventaris.</div></td></tr>`; return; }
  tbody.innerHTML = apps.map((a,i) => `
    <tr>
      <td>${i+1}</td>
      <td>
        <div class="row-app">
          ${appIconHtml(a, 32)}
          <div><div class="row-app-name">${escapeHtml(a.nama)}</div><div class="row-app-sub">${escapeHtml(a.url)}</div></div>
        </div>
      </td>
      <td><span class="chip">${escapeHtml(a.tipe||'')}</span></td>
      <td><span class="kategori-tag">${escapeHtml(a.kategori||'')}</span></td>
      <td>${statusPill(a.status)}</td>
      <td class="t-body-sm t-muted">${timeAgo(a.terakhirDicek)}</td>
      <td>
        <div class="action-icons">
          <a class="icon-btn" href="#/detail/${encodeURIComponent(a.id)}">${ic('eye')}</a>
          <button class="icon-btn star ${a.favorit?'active':''}" onclick="quickToggleFavorit('${a.id}', this)">${ic(a.favorit?'starFill':'star')}</button>
        </div>
      </td>
    </tr>`).join('');
}

async function quickToggleFavorit(id, btn) {
  btn.disabled = true;
  const res = await api('inventarisToggleFavorit', { id });
  btn.disabled = false;
  if (res && res.success) {
    btn.classList.toggle('active', res.favorit);
    btn.innerHTML = ic(res.favorit ? 'starFill' : 'star');
    Toast.show(res.favorit ? 'Ditambahkan ke favorit.' : 'Dihapus dari favorit.', 'success');
  } else {
    Toast.show((res && res.message) || 'Gagal memperbarui favorit.', 'error');
  }
}

function emptyStateHtml(title, sub) {
  return `<div class="card card-pad-lg"><div class="empty-state">${ic('globe')}<h3 class="h-sm">${escapeHtml(title)}</h3><p class="t-body-sm">${escapeHtml(sub)}</p></div></div>`;
}

async function doExport(opts) {
  Toast.show('Menyiapkan berkas ekspor…', 'info');
  const res = await api('exportRequest', Object.assign({ format: 'xlsx' }, opts));
  if (res && res.success) {
    Toast.show(res.jumlahBaris + ' baris berhasil diekspor.', 'success');
    window.open(res.url, '_blank');
  } else {
    Toast.show((res && res.message) || 'Gagal mengekspor data.', 'error');
  }
}
