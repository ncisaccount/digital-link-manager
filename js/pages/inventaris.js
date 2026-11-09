/* ============================================================================
   HALAMAN INVENTARIS URL — Tabel, pencarian, filter, paginasi
   ============================================================================ */
const InvState = { page: 1, pageSize: 8, q: '', kategori: '', tipe: '', status: '', favorit: false, sortBy: 'Tanggal Diubah', sortDir: 'desc' };

Router.register('inventaris', { render: renderInventaris });

function renderInventaris(el) {
  el.innerHTML = `
    <div class="breadcrumb">
      ${ic('home')}<a href="#/dashboard">Dashboard</a><span class="sep">/</span><span>Inventaris URL</span>
    </div>
    <div class="flex-between" style="margin-bottom:1.25rem;flex-wrap:wrap;gap:1rem;">
      <div>
        <div class="flex-row" style="margin-bottom:.3rem;">
          <h1 class="h-lg" style="margin:0;">Inventaris URL</h1>
          <span class="chip" id="inv-total-chip">…</span>
        </div>
        <p class="t-muted t-body-md" style="margin:0;">Daftar lengkap aplikasi dan website yang Anda kelola dalam satu repositori terpusat.</p>
      </div>
      <div class="flex-row" id="inv-ringkasan"></div>
    </div>

    <div class="card card-pad" style="margin-bottom:1.25rem;">
      <div class="flex-between" style="gap:1rem;flex-wrap:wrap;">
        <div class="input-icon-wrap" style="flex:1;min-width:240px;">
          <span class="icon-left">${ic('search')}</span>
          <input class="input search-input" id="inv-search" placeholder="Cari aplikasi, kategori, atau URL tautan...">
        </div>
        <div class="flex-row">
          <button class="btn btn-secondary" id="inv-filter-btn">${ic('filter')} Filter <span id="inv-filter-count" class="chip" style="display:none;margin-left:4px;"></span></button>
          <button class="btn btn-secondary" id="inv-export-btn">${ic('download')} Ekspor</button>
          <a href="#/tambah-url" class="btn btn-primary">${ic('plus')} Tambah URL</a>
        </div>
      </div>
      <div id="inv-filter-panel" style="display:none;margin-top:1rem;padding-top:1rem;border-top:1px solid var(--border-slate);">
        <div class="bento-grid" style="gap:.9rem;">
          <div class="span-4 field"><label>Kategori</label><select class="input" id="f-kategori"><option value="">Semua Kategori</option></select></div>
          <div class="span-4 field"><label>Tipe</label><select class="input" id="f-tipe"><option value="">Semua Tipe</option><option value="Website">Website</option><option value="WebApp">WebApp</option></select></div>
          <div class="span-4 field"><label>Status URL</label><select class="input" id="f-status"><option value="">Semua Status</option><option value="Aktif">Aktif</option><option value="Perlu Diperiksa">Perlu Diperiksa</option><option value="Tidak Aktif">Tidak Aktif</option></select></div>
        </div>
        <div class="flex-row" style="margin-top:.9rem;">
          <label class="flex-row" style="font-size:13px;font-weight:600;cursor:pointer;"><button type="button" class="toggle" id="f-favorit-toggle"></button> Hanya Favorit</label>
          <button class="btn btn-ghost btn-sm" id="f-reset" style="margin-left:auto;">Reset Filter</button>
          <button class="btn btn-primary btn-sm" id="f-apply">Terapkan</button>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="table-wrap">
        <table class="dtable">
          <thead><tr>
            <th>No</th><th>Nama Aplikasi</th><th>URL Tautan</th><th>Kategori</th><th>Status URL</th><th>Terakhir Dicek</th><th style="text-align:right;">Aksi</th>
          </tr></thead>
          <tbody id="inv-tbody">${renderSkeletonRows(8,7)}</tbody>
        </table>
      </div>
      <div class="flex-between card-pad" style="padding-top:.9rem;padding-bottom:.9rem;">
        <span class="t-body-sm t-muted" id="inv-page-info">Memuat…</span>
        <div class="pagination" id="inv-pagination"></div>
      </div>
    </div>
  `;

  document.getElementById('inv-search').addEventListener('input', debounce((e) => { InvState.q = e.target.value; InvState.page = 1; loadInventaris(); }, 300));
  document.getElementById('inv-filter-btn').onclick = () => {
    const p = document.getElementById('inv-filter-panel');
    p.style.display = p.style.display === 'none' ? 'block' : 'none';
  };
  document.getElementById('f-favorit-toggle').onclick = (e) => e.target.classList.toggle('on');
  document.getElementById('f-apply').onclick = () => {
    InvState.kategori = document.getElementById('f-kategori').value;
    InvState.tipe = document.getElementById('f-tipe').value;
    InvState.status = document.getElementById('f-status').value;
    InvState.favorit = document.getElementById('f-favorit-toggle').classList.contains('on');
    InvState.page = 1;
    updateFilterCount();
    loadInventaris();
  };
  document.getElementById('f-reset').onclick = () => {
    InvState.kategori = InvState.tipe = InvState.status = ''; InvState.favorit = false; InvState.page = 1;
    document.getElementById('f-kategori').value = ''; document.getElementById('f-tipe').value = ''; document.getElementById('f-status').value = '';
    document.getElementById('f-favorit-toggle').classList.remove('on');
    updateFilterCount();
    loadInventaris();
  };
  document.getElementById('inv-export-btn').onclick = () => doExport({ kategori: InvState.kategori, status: InvState.status });

  loadKategoriIntoSelect(document.getElementById('f-kategori'));
  loadInventaris();
}

function updateFilterCount() {
  const n = [InvState.kategori, InvState.tipe, InvState.status, InvState.favorit].filter(Boolean).length;
  const chip = document.getElementById('inv-filter-count');
  chip.style.display = n ? 'inline-flex' : 'none';
  chip.textContent = n;
}

async function loadKategoriIntoSelect(select, placeholder) {
  if (!select) return;
  const res = await api('kategoriList', {});
  if (res && res.success) {
    const cur = select.value;
    select.innerHTML = `<option value="">${placeholder || 'Semua Kategori'}</option>` +
      res.data.map(k => `<option value="${escapeHtml(k.nama)}">${escapeHtml(k.nama)} (${k.jumlah})</option>`).join('');
    select.value = cur;
  }
}

async function loadInventaris() {
  const tbody = document.getElementById('inv-tbody');
  if (!tbody) return;
  const params = {
    q: InvState.q, kategori: InvState.kategori, tipe: InvState.tipe, status: InvState.status,
    favorit: InvState.favorit ? 'true' : '', page: InvState.page, pageSize: InvState.pageSize,
    sortBy: InvState.sortBy, sortDir: InvState.sortDir
  };
  const res = await api('inventarisList', params);
  if (!res || !res.success) { tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state">Gagal memuat data.</div></td></tr>`; return; }

  document.getElementById('inv-total-chip').textContent = res.total + ' Tautan Terdata';
  document.getElementById('inv-ringkasan').innerHTML = `
    <span class="pill status-aktif"><span class="pill-dot"></span>${res.ringkasan.aktif} Aktif</span>
    <span class="pill status-perlu"><span class="pill-dot"></span>${res.ringkasan.perluDiperiksa} Perlu Diperiksa</span>
    <span class="pill status-tidak"><span class="pill-dot"></span>${res.ringkasan.tidakAktif} Tidak Aktif</span>`;

  if (!res.data.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state">${ic('search')}<h3 class="h-sm">Tidak ada hasil</h3><p class="t-body-sm">Coba ubah kata kunci pencarian atau filter.</p></div></td></tr>`;
  } else {
    tbody.innerHTML = res.data.map((a, i) => `
      <tr>
        <td>${(res.page-1)*res.pageSize + i + 1}</td>
        <td>
          <div class="row-app">
            ${appIconHtml(a, 36)}
            <div><div class="row-app-name">${escapeHtml(a.nama)} ${a.favorit ? '<span style="color:var(--warning-amber)">★</span>' : ''}</div><div class="row-app-sub">${escapeHtml(a.tipe||'')}</div></div>
          </div>
        </td>
        <td><a href="${escapeHtml(a.url)}" target="_blank" rel="noopener" style="color:var(--secondary);font-weight:600;font-size:13px;">${escapeHtml(a.url)}</a></td>
        <td><span class="kategori-tag">${escapeHtml(a.kategori||'')}</span></td>
        <td>${statusPill(a.status)}</td>
        <td class="t-body-sm t-muted">${timeAgo(a.terakhirDicek)}</td>
        <td>
          <div class="action-icons">
            <a class="icon-btn" href="#/detail/${encodeURIComponent(a.id)}" title="Lihat">${ic('eye')}</a>
            <a class="icon-btn" href="#/edit-url/${encodeURIComponent(a.id)}" title="Edit">${ic('edit')}</a>
            <button class="icon-btn danger" title="Hapus" onclick="deleteInventarisRow('${a.id}','${escapeHtml(a.nama).replace(/'/g,"\\'")}')">${ic('trash')}</button>
          </div>
        </td>
      </tr>`).join('');
  }

  document.getElementById('inv-page-info').textContent = `Menampilkan ${res.data.length ? (res.page-1)*res.pageSize+1 : 0}-${(res.page-1)*res.pageSize+res.data.length} dari ${res.total} data`;
  paintPagination(document.getElementById('inv-pagination'), res.page, res.totalPages, (p) => { InvState.page = p; loadInventaris(); });
}

function paintPagination(container, page, totalPages, onGo) {
  if (!container) return;
  if (totalPages <= 1) { container.innerHTML = ''; return; }
  let html = `<button class="page-btn" ${page<=1?'disabled':''} data-p="${page-1}">${ic('chevronLeft')}</button>`;
  const pages = [];
  for (let p=1;p<=totalPages;p++) {
    if (p===1 || p===totalPages || Math.abs(p-page)<=1) pages.push(p);
    else if (pages[pages.length-1] !== '…') pages.push('…');
  }
  pages.forEach(p => {
    if (p === '…') html += `<span class="page-btn" style="border:none;">…</span>`;
    else html += `<button class="page-btn ${p===page?'active':''}" data-p="${p}">${p}</button>`;
  });
  html += `<button class="page-btn" ${page>=totalPages?'disabled':''} data-p="${page+1}">${ic('chevronRight')}</button>`;
  container.innerHTML = html;
  container.querySelectorAll('button[data-p]').forEach(b => b.onclick = () => onGo(Number(b.dataset.p)));
}

function deleteInventarisRow(id, nama) {
  confirmDelete(`Hapus "${nama}" dari inventaris? Tindakan ini tidak dapat dibatalkan.`, async () => {
    const res = await api('inventarisDelete', { id });
    if (res && res.success) { Toast.show('Aplikasi berhasil dihapus.', 'success'); loadInventaris(); }
    else Toast.show((res && res.message) || 'Gagal menghapus.', 'error');
  });
}
