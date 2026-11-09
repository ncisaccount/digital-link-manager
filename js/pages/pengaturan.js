/* ============================================================================
   HALAMAN PENGATURAN — Profil, Tampilan, Notifikasi, Backup, Kategori, Pengguna
   ============================================================================ */
const PengTabs = ['profil', 'tampilan', 'notifikasi', 'kategori', 'backup', 'pengguna', 'tentang'];
let PengActiveTab = 'profil';

Router.register('pengaturan', { render: renderPengaturan });

function renderPengaturan(el, param, query) {
  if (query && query.tab && PengTabs.includes(query.tab)) PengActiveTab = query.tab;
  el.innerHTML = `
    <div class="breadcrumb">${ic('home')}<a href="#/dashboard">Dashboard</a><span class="sep">/</span><span>Pengaturan</span></div>
    <h1 class="h-lg" style="margin:0 0 1.25rem;">Pengaturan</h1>
    <div class="bento-grid">
      <div class="span-3 card card-pad" style="height:fit-content;">
        <nav style="display:flex;flex-direction:column;gap:.2rem;" id="peng-tabs">
          ${tabBtn('profil','user','Profil & Akun')}
          ${tabBtn('tampilan','palette','Tampilan')}
          ${tabBtn('notifikasi','mail','Notifikasi')}
          ${tabBtn('kategori','grid','Kelola Kategori')}
          ${tabBtn('backup','folder','Backup & Restore')}
          ${Auth.isOwner() ? tabBtn('pengguna','user','Pengelolaan Pengguna') : ''}
          ${tabBtn('tentang','shield','Tentang Aplikasi')}
        </nav>
      </div>
      <div class="span-9 card card-pad-lg" id="peng-content"></div>
    </div>
  `;
  document.querySelectorAll('#peng-tabs button').forEach(b => b.onclick = () => { PengActiveTab = b.dataset.tab; paintPengTabs(); paintPengContent(); });
  paintPengTabs();
  paintPengContent();
}

function tabBtn(key, icon, label) {
  return `<button class="btn btn-ghost" data-tab="${key}" style="justify-content:flex-start;width:100%;">${ic(icon)} ${label}</button>`;
}
function paintPengTabs() {
  document.querySelectorAll('#peng-tabs button').forEach(b => {
    const active = b.dataset.tab === PengActiveTab;
    b.style.background = active ? 'var(--surface-container)' : 'transparent';
    b.style.color = active ? 'var(--secondary)' : 'var(--on-surface)';
    b.style.fontWeight = active ? '700' : '600';
  });
}

async function paintPengContent() {
  const c = document.getElementById('peng-content');
  c.innerHTML = '<div class="skeleton" style="height:260px"></div>';
  if (PengActiveTab === 'profil') return paintProfilTab(c);
  if (PengActiveTab === 'tampilan') return paintTampilanTab(c);
  if (PengActiveTab === 'notifikasi') return paintNotifTab(c);
  if (PengActiveTab === 'kategori') return paintKategoriTab(c);
  if (PengActiveTab === 'backup') return paintBackupTab(c);
  if (PengActiveTab === 'pengguna') return paintPenggunaTab(c);
  if (PengActiveTab === 'tentang') return paintTentangTab(c);
}

function paintProfilTab(c) {
  c.innerHTML = `
    <h3 class="h-sm" style="margin-bottom:1.25rem;">Profil &amp; Akun</h3>
    <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;">
      <div class="avatar-fallback" style="width:72px;height:72px;font-size:24px;">${initials(Auth.nama||Auth.email)}</div>
      <div><div style="font-weight:700;font-size:16px;">${escapeHtml(Auth.nama||'-')}</div><div class="t-muted t-body-sm">${escapeHtml(Auth.email)}</div><span class="pill status-aktif" style="margin-top:.4rem;">${Auth.role}</span></div>
    </div>
    <div class="bento-grid">
      <div class="span-6 field"><label>Nama Tampilan</label><input class="input" value="${escapeHtml(Auth.nama||'')}" disabled></div>
      <div class="span-6 field"><label>Email Google</label><input class="input" value="${escapeHtml(Auth.email||'')}" disabled></div>
    </div>
    <p class="t-body-sm t-muted" style="margin-top:1rem;">Profil diambil langsung dari akun Google Anda. Untuk mengganti akun, keluar lalu masuk kembali dengan akun lain.</p>
    <button class="btn btn-danger" style="margin-top:1rem;" onclick="logout()">${ic('logout')} Keluar dari Akun</button>
  `;
}

function paintTampilanTab(c) {
  const cur = document.documentElement.getAttribute('data-theme') || 'otomatis';
  c.innerHTML = `
    <h3 class="h-sm" style="margin-bottom:1.25rem;">Tampilan</h3>
    <div class="field" style="margin-bottom:1.5rem;">
      <label>Mode Tema</label>
      <div class="flex-row" style="gap:.75rem;">
        ${['light','dark','otomatis'].map(t => `
          <button class="btn ${cur===t?'btn-primary':'btn-secondary'}" data-theme-opt="${t}">${t==='light'?ic('sun'):t==='dark'?ic('moon'):ic('settings')} ${t==='light'?'Terang':t==='dark'?'Gelap':'Otomatis'}</button>
        `).join('')}
      </div>
    </div>
    <p class="t-body-sm t-muted">Mode otomatis mengikuti pengaturan sistem operasi perangkat Anda. Warna aplikasi masing-masing tautan tetap konsisten di kedua mode.</p>
  `;
  c.querySelectorAll('[data-theme-opt]').forEach(b => b.onclick = () => {
    const t = b.dataset.themeOpt;
    if (t === 'otomatis') { localStorage.removeItem('dlm:theme'); document.documentElement.removeAttribute('data-theme'); }
    else { document.documentElement.setAttribute('data-theme', t); localStorage.setItem('dlm:theme', t); }
    Theme.updateIcon();
    paintTampilanTab(c);
    Toast.show('Tema diperbarui.', 'success');
  });
}

async function paintNotifTab(c) {
  const res = await api('pengaturanGet', {});
  const d = (res && res.data) || {};
  c.innerHTML = `
    <h3 class="h-sm" style="margin-bottom:1.25rem;">Notifikasi</h3>
    <div class="bento-grid">
      <div class="span-12 field"><label>Email Notifikasi</label><input class="input" id="s-email" value="${escapeHtml(d.emailNotifikasi||'')}" placeholder="nama@gmail.com"></div>
      <div class="span-6 field"><label>Jadwal Pengecekan URL</label>
        <select class="input" id="s-jadwal-cek"><option ${d.jadwalPengecekan==='Mingguan'?'selected':''}>Mingguan</option><option ${d.jadwalPengecekan==='Harian'?'selected':''}>Harian</option></select>
      </div>
      <div class="span-6 field"><label>Jadwal Backup</label>
        <select class="input" id="s-jadwal-backup"><option ${d.jadwalBackup==='Harian'?'selected':''}>Harian</option><option ${d.jadwalBackup==='Mingguan'?'selected':''}>Mingguan</option></select>
      </div>
    </div>
    <p class="t-body-sm t-muted" style="margin:1rem 0;">Email akan dikirim saat status URL berubah menjadi Tidak Aktif, serta ringkasan mingguan tautan yang perlu diperiksa.</p>
    <button class="btn btn-primary" id="s-save">${ic('check')} Simpan Pengaturan</button>
  `;
  document.getElementById('s-save').onclick = async (e) => {
    const btn = e.currentTarget; btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>';
    const r = await api('pengaturanSave', {
      emailNotifikasi: document.getElementById('s-email').value,
      jadwalPengecekan: document.getElementById('s-jadwal-cek').value,
      jadwalBackup: document.getElementById('s-jadwal-backup').value
    });
    btn.disabled = false; btn.innerHTML = ic('check') + ' Simpan Pengaturan';
    Toast.show(r && r.success ? 'Pengaturan disimpan.' : ((r&&r.message)||'Gagal menyimpan.'), r&&r.success?'success':'error');
  };
}

async function paintKategoriTab(c) {
  c.innerHTML = `
    <div class="flex-between" style="margin-bottom:1.25rem;">
      <h3 class="h-sm" style="margin:0;">Kelola Kategori</h3>
      <button class="btn btn-primary btn-sm" id="k-add">${ic('plus')} Kategori Baru</button>
    </div>
    <div id="k-list"><div class="skeleton" style="height:200px"></div></div>
  `;
  document.getElementById('k-add').onclick = () => openKategoriModal();
  loadKategoriTab();
}
async function loadKategoriTab() {
  const wrap = document.getElementById('k-list');
  const res = await api('kategoriList', {});
  if (!res || !res.success) { wrap.innerHTML = emptyStateHtml('Gagal memuat kategori','Periksa koneksi Anda.'); return; }
  wrap.innerHTML = `<div class="table-wrap"><table class="dtable"><thead><tr><th>Nama Kategori</th><th>Keterangan</th><th>Jumlah</th><th></th></tr></thead><tbody>
    ${res.data.map(k => `<tr>
      <td><span class="kategori-tag">${escapeHtml(k.nama)}</span></td>
      <td class="t-body-sm t-muted">${escapeHtml(k.keterangan||'-')}</td>
      <td>${k.jumlah}</td>
      <td><div class="action-icons">
        <button class="icon-btn" onclick='openKategoriModal(${JSON.stringify(k.nama)}, ${JSON.stringify(k.keterangan||"")})'>${ic('edit')}</button>
        <button class="icon-btn danger" onclick="deleteKategoriRow(${JSON.stringify(k.nama)})">${ic('trash')}</button>
      </div></td>
    </tr>`).join('')}
  </tbody></table></div>`;
}
function openKategoriModal(namaLama, keteranganLama) {
  const isEdit = !!namaLama;
  Modal.open({
    title: isEdit ? 'Ubah Kategori' : 'Kategori Baru',
    body: `
      <div class="field" style="margin-bottom:.8rem;"><label>Nama Kategori</label><input class="input" id="km-nama" value="${escapeHtml(namaLama||'')}"></div>
      <div class="field"><label>Keterangan</label><textarea class="input" id="km-ket">${escapeHtml(keteranganLama||'')}</textarea></div>
    `,
    actions: [
      { label: 'Batal', className: 'btn-secondary', onClick: () => Modal.close() },
      { label: 'Simpan', className: 'btn-primary', onClick: async () => {
        const nama = document.getElementById('km-nama').value.trim();
        const keterangan = document.getElementById('km-ket').value.trim();
        if (!nama) { Toast.show('Nama kategori wajib diisi.', 'error'); return; }
        const r = isEdit ? await api('kategoriUpdate', { namaLama, nama, keterangan }) : await api('kategoriAdd', { nama, keterangan });
        if (r && r.success) { Modal.close(); Toast.show(r.message, 'success'); loadKategoriTab(); }
        else Toast.show((r&&r.message)||'Gagal menyimpan kategori.', 'error');
      }}
    ]
  });
}
function deleteKategoriRow(nama) {
  confirmDelete(`Hapus kategori "${nama}"?`, async () => {
    const r = await api('kategoriDelete', { nama });
    if (r && r.success) { Toast.show(r.message, 'success'); loadKategoriTab(); }
    else Toast.show((r&&r.message)||'Gagal menghapus kategori.', 'error');
  });
}

async function paintBackupTab(c) {
  const res = await api('pengaturanGet', {});
  const d = (res && res.data) || {};
  c.innerHTML = `
    <h3 class="h-sm" style="margin-bottom:1.25rem;">Backup &amp; Restore</h3>
    <div class="card card-pad" style="background:var(--bg-canvas);margin-bottom:1.25rem;">
      <div class="flex-between">
        <div>
          <div class="t-body-sm t-muted" style="margin-bottom:.2rem;">Backup Terakhir</div>
          <div style="font-weight:700;">${d.backupTerakhir ? timeAgo(d.backupTerakhir) : 'Belum pernah'}</div>
        </div>
        <button class="btn btn-primary" id="b-now">${ic('folder')} Backup Sekarang</button>
      </div>
    </div>
    <p class="t-body-sm t-muted">Backup otomatis berjalan harian dan disimpan sebagai berkas CSV di folder <code>Backup/</code> pada Google Drive. Hanya tiga salinan terbaru yang disimpan secara otomatis.</p>
  `;
  document.getElementById('b-now').onclick = async (e) => {
    const btn = e.currentTarget; btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>';
    const r = await api('backupNow', {});
    btn.disabled = false; btn.innerHTML = ic('folder') + ' Backup Sekarang';
    Toast.show(r && r.success ? r.message : ((r&&r.message)||'Gagal membuat backup.'), r&&r.success?'success':'error');
    if (r && r.success) paintBackupTab(c);
  };
}

async function paintPenggunaTab(c) {
  c.innerHTML = `
    <div class="flex-between" style="margin-bottom:1.25rem;">
      <h3 class="h-sm" style="margin:0;">Pengelolaan Pengguna</h3>
      <button class="btn btn-primary btn-sm" id="u-add">${ic('plus')} Undang Pengguna</button>
    </div>
    <div id="u-list"><div class="skeleton" style="height:160px"></div></div>
  `;
  document.getElementById('u-add').onclick = () => openUserModal();
  loadPenggunaTab();
}
async function loadPenggunaTab() {
  const wrap = document.getElementById('u-list');
  const res = await api('penggunaList', {});
  if (!res || !res.success) { wrap.innerHTML = emptyStateHtml('Gagal memuat pengguna', (res&&res.message)||'Periksa koneksi Anda.'); return; }
  wrap.innerHTML = `<div class="table-wrap"><table class="dtable"><thead><tr><th>Email</th><th>Peran</th><th>Status</th><th></th></tr></thead><tbody>
    ${res.data.map(u => `<tr>
      <td>${escapeHtml(u['Email'])}</td>
      <td><span class="chip">${escapeHtml(u['Peran'])}</span></td>
      <td>${u['Status']==='Aktif' ? '<span class="pill status-aktif"><span class="pill-dot"></span>Aktif</span>' : '<span class="pill status-tidak"><span class="pill-dot"></span>Nonaktif</span>'}</td>
      <td><div class="action-icons">
        <button class="icon-btn" title="${u['Status']==='Aktif'?'Nonaktifkan':'Aktifkan'}" onclick="togglePenggunaRow(${JSON.stringify(u['Email'])})">${ic(u['Status']==='Aktif'?'x':'check')}</button>
      </div></td>
    </tr>`).join('')}
  </tbody></table></div>`;
}
function openUserModal() {
  Modal.open({
    title: 'Undang Pengguna Baru',
    body: `
      <div class="field" style="margin-bottom:.8rem;"><label>Email Google</label><input class="input" id="um-email" placeholder="nama@gmail.com"></div>
      <div class="field"><label>Peran</label><select class="input" id="um-peran"><option>Pengguna</option><option>Owner</option></select></div>
    `,
    actions: [
      { label: 'Batal', className: 'btn-secondary', onClick: () => Modal.close() },
      { label: 'Tambahkan', className: 'btn-primary', onClick: async () => {
        const email = document.getElementById('um-email').value.trim();
        const peran = document.getElementById('um-peran').value;
        if (!email) { Toast.show('Email wajib diisi.', 'error'); return; }
        const r = await api('penggunaAdd', { email, peran });
        if (r && r.success) { Modal.close(); Toast.show(r.message, 'success'); loadPenggunaTab(); }
        else Toast.show((r&&r.message)||'Gagal menambahkan pengguna.', 'error');
      }}
    ]
  });
}
async function togglePenggunaRow(email) {
  const r = await api('penggunaToggle', { email });
  if (r && r.success) { Toast.show('Status pengguna diperbarui.', 'success'); loadPenggunaTab(); }
  else Toast.show((r&&r.message)||'Gagal memperbarui status.', 'error');
}

function paintTentangTab(c) {
  c.innerHTML = `
    <h3 class="h-sm" style="margin-bottom:1.25rem;">Tentang Aplikasi</h3>
    <div class="flex-row" style="margin-bottom:1rem;">
      <div class="login-logo" style="margin:0;width:48px;height:48px;font-size:18px;">DL</div>
      <div><div style="font-weight:700;">Digital Link Manager</div><div class="t-body-sm t-muted">Versi ${APP_VERSION_FE}</div></div>
    </div>
    <p class="t-body-sm t-muted" style="line-height:1.7;">Aplikasi web pribadi berbasis Google Apps Script dan Google Sheets untuk menyimpan, mengelompokkan, mencari, dan mengelola seluruh alamat website maupun WebApp Anda.</p>
    <hr class="divider" style="margin:1.25rem 0;">
    <div class="t-body-sm t-muted">Arsitektur: Frontend statis (GitHub Pages) + Backend REST API (Google Apps Script) · Tanpa password, akses dibatasi akun Google terdaftar.</div>
  `;
}
