/* ============================================================================
   HALAMAN DETAIL APLIKASI
   ============================================================================ */
Router.register('detail', { render: renderDetail });

async function renderDetail(el, id) {
  el.innerHTML = `<div class="skeleton" style="height:360px;border-radius:16px;"></div>`;
  if (!id) { el.innerHTML = emptyStateHtml('Aplikasi tidak ditemukan', 'ID aplikasi tidak valid.'); return; }

  const res = await api('inventarisDetail', { id });
  if (!res || !res.success) { el.innerHTML = emptyStateHtml('Aplikasi tidak ditemukan', (res&&res.message)||'Data mungkin telah dihapus.'); return; }
  const a = res.data;
  const palet = (a['Palet Warna']||'').split(',').filter(Boolean);

  el.innerHTML = `
    <div class="breadcrumb">
      ${ic('home')}<a href="#/dashboard">Dashboard</a><span class="sep">/</span><a href="#/inventaris">Inventaris URL</a><span class="sep">/</span><span>${escapeHtml(a['Nama Aplikasi'])}</span>
    </div>

    <div class="bento-grid">
      <div class="span-12 card card-pad-lg" style="background:linear-gradient(135deg, ${a['Warna Utama']||'#0B2A6B'}, ${shadeColor_(a['Warna Utama']||'#0B2A6B', -20)});color:#fff;border:none;">
        <div class="flex-between" style="flex-wrap:wrap;gap:1.25rem;align-items:flex-start;">
          <div class="flex-row" style="align-items:flex-start;gap:1.1rem;">
            <div class="row-app-icon" style="width:72px;height:72px;font-size:24px;background:rgba(255,255,255,0.15);">
              ${a['Thumbnail Logo'] ? `<img src="${escapeHtml(a['Thumbnail Logo'])}" alt="">` : initials(a['Nama Aplikasi'])}
            </div>
            <div>
              <h1 class="h-lg" style="color:#fff;margin-bottom:.3rem;">${escapeHtml(a['Nama Aplikasi'])} ${a['Favorit']==='Ya'?'<span style="color:#F59E0B">★</span>':''}</h1>
              <div class="flex-row" style="flex-wrap:wrap;">
                <span class="chip" style="background:rgba(255,255,255,0.15);color:#fff;">${escapeHtml(a['Tipe']||'')}</span>
                <span class="chip" style="background:rgba(255,255,255,0.15);color:#fff;">${escapeHtml(a['Kategori']||'')}</span>
                ${statusPillLight(a['Status URL'])}
              </div>
            </div>
          </div>
          <div class="flex-row">
            <a href="${escapeHtml(a['URL'])}" target="_blank" rel="noopener" class="btn" style="background:#fff;color:${a['Warna Utama']||'#0B2A6B'};">${ic('external')} Buka Situs</a>
            <a href="#/edit-url/${encodeURIComponent(a['ID'])}" class="btn" style="background:rgba(255,255,255,0.15);color:#fff;">${ic('edit')} Edit</a>
            <button class="btn" style="background:rgba(255,255,255,0.15);color:#fff;" onclick="deleteFromDetail('${a['ID']}','${escapeHtml(a['Nama Aplikasi']).replace(/'/g,"\\'")}')">${ic('trash')} Hapus</button>
          </div>
        </div>
      </div>

      <div class="span-8 card card-pad-lg">
        <h3 class="h-sm" style="margin-bottom:1rem;">Deskripsi</h3>
        <p class="t-body-md" style="line-height:1.7;color:var(--on-surface-variant);margin-bottom:1.5rem;">${escapeHtml(a['Deskripsi']) || '<em>Tidak ada deskripsi.</em>'}</p>

        <h3 class="h-sm" style="margin-bottom:1rem;">Informasi Lengkap</h3>
        <div class="bento-grid" style="gap:1rem;">
          ${infoRow('URL', a['URL'])}
          ${infoRow('Nama Pemilik / Penyedia', a['Nama Pemilik'] || '-')}
          ${infoRow('Username / Email', a['Username Email'] || '-')}
          ${infoRow('Tag', a['Tag'] || '-')}
          ${infoRow('Catatan Tambahan', a['Catatan Tambahan'] || '-')}
          ${infoRow('Terakhir Dicek', a['Terakhir Dicek'] ? timeAgo(a['Terakhir Dicek']) : 'Belum pernah')}
          ${infoRow('Tanggal Ditambahkan', a['Tanggal Ditambahkan'] ? new Date(a['Tanggal Ditambahkan']).toLocaleDateString('id-ID',{day:'2-digit',month:'long',year:'numeric'}) : '-')}
          ${infoRow('Tanggal Diubah', a['Tanggal Diubah'] ? new Date(a['Tanggal Diubah']).toLocaleDateString('id-ID',{day:'2-digit',month:'long',year:'numeric'}) : '-')}
        </div>

        <h3 class="h-sm" style="margin:1.5rem 0 1rem;">Lampiran</h3>
        <div id="detail-lampiran">
          ${(res.lampiran && res.lampiran.length) ? res.lampiran.map(l => `
            <a href="${escapeHtml(l['Tautan Drive'])}" target="_blank" rel="noopener" class="card hoverable" style="display:flex;align-items:center;gap:.7rem;padding:.8rem;margin-bottom:.6rem;">
              ${ic('folder')}<div><div style="font-weight:600;font-size:13.5px;">${escapeHtml(l['Nama Berkas'])}</div><div class="t-body-sm t-muted">${escapeHtml(l['Jenis'])}</div></div>
            </a>`).join('') : '<p class="t-body-sm t-muted">Belum ada lampiran untuk aplikasi ini.</p>'}
        </div>
      </div>

      <div class="span-4" style="display:flex;flex-direction:column;gap:1.25rem;">
        <div class="card card-pad">
          <h3 class="h-sm" style="margin-bottom:1rem;">Warna Aplikasi</h3>
          <div class="flex-row" style="margin-bottom:.6rem;">
            <div style="width:28px;height:28px;border-radius:8px;background:${a['Warna Utama']};border:1px solid var(--border-slate);"></div>
            <span class="t-body-sm" style="font-family:monospace;">${a['Warna Utama']}</span>
            <span class="t-body-sm t-muted">Warna Utama</span>
          </div>
          <div class="swatch-row">
            ${palet.map(c => `<div><div class="swatch" style="background:${c};"></div></div>`).join('')}
          </div>
        </div>
        <div class="card card-pad">
          <h3 class="h-sm" style="margin-bottom:.8rem;">Status Pemeriksaan</h3>
          ${statusPill(a['Status URL'])}
          <p class="t-body-sm t-muted" style="margin-top:.6rem;">Diperiksa otomatis setiap minggu melalui trigger terjadwal.</p>
        </div>
      </div>
    </div>
  `;
}

function infoRow(label, value) {
  return `<div class="span-6"><div class="t-body-sm t-muted" style="margin-bottom:.2rem;">${escapeHtml(label)}</div><div class="t-body-md" style="font-weight:600;word-break:break-word;">${escapeHtml(value)}</div></div>`;
}
function statusPillLight(status) {
  return `<span class="chip" style="background:rgba(255,255,255,0.2);color:#fff;">${escapeHtml(status||'')}</span>`;
}
function shadeColor_(hex, percent) {
  try {
    let num = parseInt(hex.replace('#',''), 16);
    let r = (num >> 16) + percent, g = (num >> 8 & 0x00FF) + percent, b = (num & 0x0000FF) + percent;
    r = Math.min(255, Math.max(0, r)); g = Math.min(255, Math.max(0, g)); b = Math.min(255, Math.max(0, b));
    return '#' + (0x1000000 + r*0x10000 + g*0x100 + b).toString(16).slice(1);
  } catch (e) { return hex; }
}
function deleteFromDetail(id, nama) {
  confirmDelete(`Hapus "${nama}" dari inventaris? Tindakan ini tidak dapat dibatalkan.`, async () => {
    const res = await api('inventarisDelete', { id });
    if (res && res.success) { Toast.show('Aplikasi berhasil dihapus.', 'success'); Router.go('inventaris'); }
    else Toast.show((res && res.message) || 'Gagal menghapus.', 'error');
  });
}
