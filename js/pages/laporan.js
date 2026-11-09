/* ============================================================================
   HALAMAN LAPORAN & GRAFIK — Statistik visual, tabel filter, ekspor, cetak
   ============================================================================ */
const LapState = { kategori: '', status: '' };

Router.register('laporan', { render: renderLaporan });

function renderLaporan(el) {
  el.innerHTML = `
    <div class="breadcrumb no-print">${ic('home')}<a href="#/dashboard">Dashboard</a><span class="sep">/</span><span>Laporan</span></div>
    <div class="flex-between no-print" style="margin-bottom:1.25rem;flex-wrap:wrap;gap:1rem;">
      <div>
        <h1 class="h-lg" style="margin:0 0 .3rem;">Laporan &amp; Statistik</h1>
        <p class="t-muted t-body-md" style="margin:0;">Ringkasan visual seluruh aset digital Anda.</p>
      </div>
      <div class="flex-row">
        <button class="btn btn-secondary" id="lap-print">${ic('print')} Cetak</button>
        <button class="btn btn-secondary" id="lap-export-pdf">${ic('download')} PDF</button>
        <button class="btn btn-primary" id="lap-export-xlsx">${ic('download')} Excel</button>
      </div>
    </div>

    <div class="bento-grid" style="margin-bottom:1.25rem;">
      <div class="span-6 card card-pad">
        <h3 class="h-sm" style="margin-bottom:1rem;">Distribusi per Kategori</h3>
        <div id="chart-kategori"></div>
      </div>
      <div class="span-6 card card-pad">
        <h3 class="h-sm" style="margin-bottom:1rem;">Distribusi per Status</h3>
        <div id="chart-status"></div>
      </div>
    </div>

    <div class="card">
      <div class="card-pad flex-between no-print" style="flex-wrap:wrap;gap:.75rem;">
        <h3 class="h-sm" style="margin:0;">Tabel Laporan</h3>
        <div class="flex-row">
          <select class="input" id="lap-f-kategori" style="width:180px;"><option value="">Semua Kategori</option></select>
          <select class="input" id="lap-f-status" style="width:170px;"><option value="">Semua Status</option><option value="Aktif">Aktif</option><option value="Perlu Diperiksa">Perlu Diperiksa</option><option value="Tidak Aktif">Tidak Aktif</option></select>
        </div>
      </div>
      <div class="table-wrap">
        <table class="dtable">
          <thead><tr><th>Nama Aplikasi</th><th>URL</th><th>Kategori</th><th>Status</th><th>Terakhir Dicek</th></tr></thead>
          <tbody id="lap-tbody">${renderSkeletonRows(6,5)}</tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('lap-print').onclick = () => window.print();
  document.getElementById('lap-export-pdf').onclick = () => doExport({ kategori: LapState.kategori, status: LapState.status, format: 'pdf' });
  document.getElementById('lap-export-xlsx').onclick = () => doExport({ kategori: LapState.kategori, status: LapState.status, format: 'xlsx' });
  document.getElementById('lap-f-kategori').onchange = (e) => { LapState.kategori = e.target.value; loadLaporanTable(); };
  document.getElementById('lap-f-status').onchange = (e) => { LapState.status = e.target.value; loadLaporanTable(); };

  loadKategoriIntoSelect(document.getElementById('lap-f-kategori'));
  loadLaporanCharts();
  loadLaporanTable();
}

async function loadLaporanCharts() {
  const res = await api('laporanRingkasan', {});
  if (!res || !res.success) return;
  paintDonutChart(document.getElementById('chart-kategori'), res.perKategori, catColor);
  paintDonutChart(document.getElementById('chart-status'), res.perStatus.map(s => ({ nama: s.nama, jumlah: s.jumlah })), (n) => n==='Aktif'?'#16A34A':n==='Tidak Aktif'?'#DC2626':'#F59E0B');
}

function paintDonutChart(container, data, colorFn) {
  if (!container) return;
  const total = data.reduce((a,b) => a+b.jumlah, 0);
  if (!total) { container.innerHTML = '<div class="empty-state">Belum ada data.</div>'; return; }
  const r = 70, cx = 90, cy = 90, strokeW = 26;
  const circumference = 2 * Math.PI * r;
  let offset = 0;
  const segs = data.filter(d => d.jumlah > 0).map(d => {
    const frac = d.jumlah / total;
    const seg = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${colorFn(d.nama)}" stroke-width="${strokeW}" stroke-dasharray="${frac*circumference} ${circumference}" stroke-dashoffset="${-offset}" transform="rotate(-90 ${cx} ${cy})"/>`;
    offset += frac*circumference;
    return seg;
  }).join('');
  container.innerHTML = `
    <div style="display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap;">
      <svg width="180" height="180" viewBox="0 0 180 180">${segs}<text x="90" y="86" text-anchor="middle" font-family="Plus Jakarta Sans" font-weight="800" font-size="24" fill="var(--on-surface)">${total}</text><text x="90" y="104" text-anchor="middle" font-family="Inter" font-size="11" fill="var(--on-surface-variant)">Total</text></svg>
      <div style="display:flex;flex-direction:column;gap:.5rem;flex:1;min-width:140px;">
        ${data.filter(d=>d.jumlah>0).map(d => `
          <div class="flex-between">
            <span class="flex-row t-body-sm"><span style="width:9px;height:9px;border-radius:50%;background:${colorFn(d.nama)};display:inline-block;"></span>${escapeHtml(d.nama)}</span>
            <strong class="t-body-sm">${d.jumlah}</strong>
          </div>`).join('')}
      </div>
    </div>`;
}

async function loadLaporanTable() {
  const tbody = document.getElementById('lap-tbody');
  const res = await api('inventarisList', { kategori: LapState.kategori, status: LapState.status, pageSize: 500, sortBy: 'Nama Aplikasi', sortDir: 'asc' });
  if (!res || !res.success) { tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state">Gagal memuat data.</div></td></tr>`; return; }
  if (!res.data.length) { tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state">Tidak ada data untuk filter ini.</div></td></tr>`; return; }
  tbody.innerHTML = res.data.map(a => `
    <tr>
      <td><div class="row-app">${appIconHtml(a,28)}<span class="row-app-name">${escapeHtml(a.nama)}</span></div></td>
      <td class="t-body-sm">${escapeHtml(a.url)}</td>
      <td><span class="kategori-tag">${escapeHtml(a.kategori||'')}</span></td>
      <td>${statusPill(a.status)}</td>
      <td class="t-body-sm t-muted">${timeAgo(a.terakhirDicek)}</td>
    </tr>`).join('');
}
