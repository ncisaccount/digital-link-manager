/* ============================================================================
   HALAMAN TAMBAH / EDIT URL
   Thumbnail dibuat di browser (canvas) sebelum diunggah — PRD §4.2
   ============================================================================ */
const PALET_STANDAR = ['#0B2A6B', '#1E63E9', '#22C5E8', '#F4F8FF'];
let FormState = { editId: null, logoBase64: null, logoMime: null, thumbBase64: null, warnaUtama: '#0B2A6B', paletWarna: [...PALET_STANDAR], favorit: false, statusAktif: true };

Router.register('tambah-url', { render: (el) => renderFormUrl(el, null) });
Router.register('edit-url', { render: (el, param) => renderFormUrl(el, param) });

async function renderFormUrl(el, editId) {
  FormState = { editId, logoBase64: null, logoMime: null, thumbBase64: null, warnaUtama: '#0B2A6B', paletWarna: [...PALET_STANDAR], favorit: false, statusAktif: true };
  let data = {};
  if (editId) {
    const res = await api('inventarisDetail', { id: editId });
    if (res && res.success) {
      data = res.data;
      FormState.warnaUtama = data['Warna Utama'] || '#0B2A6B';
      FormState.paletWarna = (data['Palet Warna']||'').split(',').filter(Boolean);
      if (FormState.paletWarna.length < 4) FormState.paletWarna = [...PALET_STANDAR];
      FormState.favorit = data['Favorit'] === 'Ya';
      FormState.statusAktif = data['Status URL'] !== 'Tidak Aktif';
      FormState.thumbBase64 = data['Thumbnail Logo'] || null;
    }
  }

  el.innerHTML = `
    <div class="breadcrumb">
      ${ic('home')}<a href="#/dashboard">Dashboard</a><span class="sep">/</span><a href="#/inventaris">Inventaris URL</a><span class="sep">/</span><span>${editId?'Edit URL':'Tambah URL Baru'}</span>
    </div>
    <div class="flex-between" style="margin-bottom:1.25rem;flex-wrap:wrap;gap:.75rem;">
      <div>
        <h1 class="h-lg" style="margin:0 0 .3rem;">${editId?'Edit URL':'Tambah URL Baru'}</h1>
        <p class="t-muted t-body-md" style="margin:0;">Simpan informasi aplikasi atau website baru ke dalam pusat inventarisasi korporat.</p>
      </div>
      <span class="pill status-aktif"><span class="pill-dot"></span>Sheet: Inventaris (GAS Active)</span>
    </div>

    <div class="bento-grid">
      <div class="span-4" style="display:flex;flex-direction:column;gap:1.25rem;">
        <div class="card card-pad">
          <div class="flex-between" style="margin-bottom:.9rem;">
            <h3 class="h-sm">${ic('image')} Aset Visual Logo</h3><span class="chip">Batas 5 MB</span>
          </div>
          <div class="dropzone" id="f-dropzone">
            ${FormState.thumbBase64 ? `<img class="preview" src="${escapeHtml(FormState.thumbBase64)}" alt="">` : `
              ${ic('upload')}<div style="font-weight:700;font-size:13px;">Upload Logo atau Drag &amp; Drop</div>
              <div class="t-body-sm t-muted">Format PNG, JPG, SVG atau WEBP (Maksimal 5MB)</div>`}
            <input type="file" id="f-file-input" accept="image/png,image/jpeg,image/svg+xml,image/webp" style="display:none;">
          </div>
          <p class="t-body-sm t-muted" style="margin-top:.8rem;line-height:1.6;">Thumbnail 128×128 px digenerate otomatis di peramban pengguna sebelum diunggah ke Google Drive untuk menghemat kuota GAS.</p>
        </div>

        <div class="card card-pad">
          <div class="flex-between" style="margin-bottom:.9rem;"><h3 class="h-sm">${ic('palette')} Warna &amp; Aksen Kartu</h3><span class="chip">HEX Code</span></div>
          <div class="field" style="margin-bottom:1rem;">
            <label>Warna Utama Aplikasi</label>
            <div class="flex-row">
              <input class="input" id="f-warna-hex" value="${FormState.warnaUtama}" style="font-family:monospace;">
              <input type="color" id="f-warna-picker" value="${FormState.warnaUtama}" style="width:44px;height:44px;border:1px solid var(--border-slate);border-radius:8px;padding:2px;background:none;">
            </div>
          </div>
          <label class="t-body-sm" style="font-weight:600;">Palet Standar Digital Link Manager</label>
          <div class="swatch-row" style="margin-top:.5rem;">
            ${PALET_STANDAR.map(c => `<div><div class="swatch" style="background:${c}" data-swatch="${c}"></div><div class="swatch-label">${c}</div></div>`).join('')}
          </div>
          <div class="card card-pad" style="margin-top:1rem;background:var(--bg-canvas);display:flex;align-items:center;gap:.75rem;">
            <div class="row-app-icon" id="f-preview-icon" style="width:44px;height:44px;background:${FormState.warnaUtama};">GD</div>
            <div style="flex:1;"><div style="font-weight:700;font-size:13px;" id="f-preview-nama">Nama Aplikasi</div><div class="t-body-sm t-muted" id="f-preview-sub">Kategori • Tipe</div></div>
            ${ic('check')}
          </div>
        </div>
      </div>

      <div class="span-8" style="display:flex;flex-direction:column;gap:1.25rem;">
        <div class="card card-pad-lg">
          <h3 class="h-sm section-title" style="margin-bottom:1.1rem;"><span style="width:4px;height:18px;background:var(--secondary);border-radius:2px;display:inline-block;"></span>Informasi Utama Aplikasi</h3>
          <div class="bento-grid">
            <div class="span-12 field"><label>Nama Aplikasi <span class="req">*</span></label><input class="input" id="f-nama" placeholder="contoh: Google Drive" value="${escapeHtml(data['Nama Aplikasi']||'')}"></div>
            <div class="span-12 field"><label>URL Tautan Lengkap <span class="req">*</span> <span class="hint">Wajib diawali https://</span></label><input class="input" id="f-url" placeholder="https://drive.google.com" value="${escapeHtml(data['URL']||'')}"></div>
            <div class="span-6 field"><label>Tipe Aplikasi</label>
              <div class="flex-row" style="gap:.6rem;">
                <button type="button" class="btn ${(!data['Tipe']||data['Tipe']==='Website')?'btn-secondary':'btn-secondary'}" data-tipe="Website" id="tipe-website" style="flex:1;">${ic('globe')} Website</button>
                <button type="button" class="btn btn-primary" data-tipe="WebApp" id="tipe-webapp" style="flex:1;">${ic('grid')} WebApp</button>
              </div>
            </div>
            <div class="span-6 field"><label>Kategori <span class="req">*</span></label><select class="input" id="f-kategori"></select></div>
          </div>
        </div>

        <div class="card card-pad-lg">
          <h3 class="h-sm section-title" style="margin-bottom:1.1rem;"><span style="width:4px;height:18px;background:var(--secondary);border-radius:2px;display:inline-block;"></span>Deskripsi &amp; Identitas Pengelola</h3>
          <div class="bento-grid">
            <div class="span-12 field"><label>Deskripsi / Fungsi Aplikasi</label><textarea class="input" id="f-deskripsi" placeholder="Tuliskan fungsi, kegunaan, atau catatan alur kerja utama aplikasi ini...">${escapeHtml(data['Deskripsi']||'')}</textarea></div>
            <div class="span-6 field"><label>Nama Pemilik / Penyedia</label><input class="input" id="f-pemilik" placeholder="contoh: Google LLC" value="${escapeHtml(data['Nama Pemilik']||'')}"></div>
            <div class="span-6 field"><label>Username / Email Terkait <span class="hint">Hanya referensi</span></label><input class="input" id="f-email-terkait" placeholder="contoh: user@gmail.com" value="${escapeHtml(data['Username Email']||'')}"></div>
            <div class="span-12 field"><label>Tag <span class="hint">pisahkan dengan koma</span></label><input class="input" id="f-tag" placeholder="produktivitas, cloud, dokumen" value="${escapeHtml(data['Tag']||'')}"></div>
            <div class="span-12 field"><label>Catatan Tambahan</label><textarea class="input" id="f-catatan">${escapeHtml(data['Catatan Tambahan']||'')}</textarea></div>
          </div>
        </div>

        <div class="card card-pad-lg">
          <h3 class="h-sm section-title" style="margin-bottom:1.1rem;"><span style="width:4px;height:18px;background:var(--secondary);border-radius:2px;display:inline-block;"></span>Preferensi Akses</h3>
          <div class="bento-grid">
            <div class="span-6 card card-pad" style="background:var(--bg-canvas);flex-direction:row;display:flex;align-items:center;justify-content:space-between;">
              <div class="flex-row">${ic('star')}<div><div style="font-weight:700;font-size:13px;">Tandai sebagai Favorit</div><div class="t-body-sm t-muted">Prioritaskan di baris atas launcher</div></div></div>
              <button type="button" class="toggle ${FormState.favorit?'on':''}" id="f-favorit-toggle"></button>
            </div>
            <div class="span-6 card card-pad" style="background:var(--bg-canvas);flex-direction:row;display:flex;align-items:center;justify-content:space-between;">
              <div class="flex-row">${ic('check')}<div><div style="font-weight:700;font-size:13px;">Status URL Aktif</div><div class="t-body-sm" style="color:var(--success-green);">Aktif dan Siap Diakses</div></div></div>
              <button type="button" class="toggle ${FormState.statusAktif?'on':''}" id="f-status-toggle"></button>
            </div>
          </div>
        </div>

        <div class="flex-between" style="flex-wrap:wrap;gap:1rem;">
          <span class="t-body-sm t-muted flex-row">${ic('globe')} Data tersinkron otomatis ke Google Drive / Logo &amp; Thumbnail</span>
          <div class="flex-row">
            <a href="#/inventaris" class="btn btn-secondary">${ic('x')} Batal</a>
            <button class="btn btn-primary" id="f-submit">${ic('check')} Simpan URL</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Isi select kategori
  const katSel = document.getElementById('f-kategori');
  const katRes = await api('kategoriList', {});
  if (katRes && katRes.success) {
    katSel.innerHTML = katRes.data.map(k => `<option value="${escapeHtml(k.nama)}" ${data['Kategori']===k.nama?'selected':''}>${escapeHtml(k.nama)}</option>`).join('');
  }

  // Tipe toggle
  const tipeWebsiteBtn = document.getElementById('tipe-website'), tipeWebappBtn = document.getElementById('tipe-webapp');
  let currentTipe = data['Tipe'] || 'WebApp';
  function paintTipe() {
    tipeWebsiteBtn.className = 'btn ' + (currentTipe==='Website'?'btn-primary':'btn-secondary');
    tipeWebappBtn.className = 'btn ' + (currentTipe==='WebApp'?'btn-primary':'btn-secondary');
  }
  paintTipe();
  tipeWebsiteBtn.onclick = () => { currentTipe = 'Website'; paintTipe(); };
  tipeWebappBtn.onclick = () => { currentTipe = 'WebApp'; paintTipe(); };

  // Warna
  const hexInput = document.getElementById('f-warna-hex'), colorPicker = document.getElementById('f-warna-picker'), previewIcon = document.getElementById('f-preview-icon');
  function setWarna(hex) {
    FormState.warnaUtama = hex; hexInput.value = hex; colorPicker.value = hex; previewIcon.style.background = hex;
    document.querySelectorAll('.swatch').forEach(s => s.classList.toggle('selected', s.dataset.swatch.toLowerCase() === hex.toLowerCase()));
  }
  hexInput.addEventListener('input', () => { if (/^#[0-9a-fA-F]{6}$/.test(hexInput.value)) setWarna(hexInput.value); });
  colorPicker.addEventListener('input', () => setWarna(colorPicker.value));
  document.querySelectorAll('.swatch').forEach(s => s.onclick = () => setWarna(s.dataset.swatch));
  setWarna(FormState.warnaUtama);

  // Live preview nama/kategori
  const namaInput = document.getElementById('f-nama');
  function updatePreview() {
    const nama = namaInput.value || 'Nama Aplikasi';
    document.getElementById('f-preview-nama').textContent = nama;
    document.getElementById('f-preview-sub').textContent = (katSel.value||'Kategori') + ' • ' + currentTipe;
    if (!FormState.thumbBase64) previewIcon.textContent = initials(nama);
  }
  namaInput.addEventListener('input', updatePreview);
  katSel.addEventListener('change', updatePreview);
  updatePreview();

  // Toggles
  document.getElementById('f-favorit-toggle').onclick = (e) => { e.target.classList.toggle('on'); FormState.favorit = e.target.classList.contains('on'); };
  document.getElementById('f-status-toggle').onclick = (e) => { e.target.classList.toggle('on'); FormState.statusAktif = e.target.classList.contains('on'); };

  // Upload logo (thumbnail dibuat di browser via canvas — PRD §4.2)
  const dropzone = document.getElementById('f-dropzone'), fileInput = document.getElementById('f-file-input');
  dropzone.onclick = () => fileInput.click();
  dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
  dropzone.addEventListener('drop', (e) => { e.preventDefault(); dropzone.classList.remove('dragover'); if (e.dataTransfer.files[0]) handleLogoFile(e.dataTransfer.files[0], dropzone, previewIcon); });
  fileInput.addEventListener('change', (e) => { if (e.target.files[0]) handleLogoFile(e.target.files[0], dropzone, previewIcon); });

  document.getElementById('f-submit').onclick = () => submitFormUrl(editId, currentTipe);
}

async function handleLogoFile(file, dropzone, previewIcon) {
  if (file.size > 5 * 1024 * 1024) { Toast.show('Ukuran berkas melebihi 5 MB.', 'error'); return; }
  const allowed = ['image/png','image/jpeg','image/svg+xml','image/webp'];
  if (!allowed.includes(file.type)) { Toast.show('Format berkas tidak didukung.', 'error'); return; }

  const reader = new FileReader();
  reader.onload = async () => {
    const dataUrl = reader.result;
    FormState.logoBase64 = dataUrl.split(',')[1];
    FormState.logoMime = file.type;

    // Buat thumbnail 128x128 di browser via canvas (beban server tetap ringan)
    const thumbDataUrl = await makeThumbnail_(dataUrl, 128, 128);
    FormState.thumbBase64 = thumbDataUrl;
    FormState.thumbMime = 'image/png';

    dropzone.innerHTML = `<img class="preview" src="${thumbDataUrl}" alt=""><input type="file" id="f-file-input-hidden" style="display:none;">`;
    dropzone.onclick = () => document.getElementById('f-file-input').click();
    previewIcon.innerHTML = `<img src="${thumbDataUrl}" style="width:100%;height:100%;object-fit:cover;">`;
    Toast.show('Logo berhasil dimuat. Thumbnail dibuat otomatis.', 'success');
  };
  reader.readAsDataURL(file);
}

function makeThumbnail_(dataUrl, w, h) {
  return new Promise((resolve) => {
    if (dataUrl.startsWith('data:image/svg+xml')) { resolve(dataUrl); return; } // SVG tidak perlu rasterisasi
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      const scale = Math.max(w / img.width, h / img.height);
      const sw = w / scale, sh = h / scale;
      const sx = (img.width - sw) / 2, sy = (img.height - sh) / 2;
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
      resolve(canvas.toDataURL('image/png', 0.9));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

async function submitFormUrl(editId, tipe) {
  const nama = document.getElementById('f-nama').value.trim();
  const url = document.getElementById('f-url').value.trim();
  if (!nama) { Toast.show('Nama aplikasi wajib diisi.', 'error'); return; }
  if (!url) { Toast.show('URL wajib diisi.', 'error'); return; }
  if (!/^https:\/\//i.test(url)) { Toast.show('URL wajib diawali https://', 'error'); return; }

  const btn = document.getElementById('f-submit');
  const orig = btn.innerHTML;
  btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Menyimpan…';

  let thumbnailUrl = FormState.thumbBase64 && FormState.thumbBase64.startsWith('data:') ? null : FormState.thumbBase64;
  let logoUrl = null;

  try {
    // Unggah logo asli + thumbnail ke Drive bila ada file baru
    if (FormState.logoBase64) {
      const upLogo = await api('uploadFile', { base64: FormState.logoBase64, mimeType: FormState.logoMime, fileName: nama + '-logo', jenis: 'Logo' });
      if (upLogo && upLogo.success) logoUrl = upLogo.url;

      const thumbB64 = FormState.thumbBase64.split(',')[1];
      const upThumb = await api('uploadFile', { base64: thumbB64, mimeType: 'image/png', fileName: nama + '-thumb', jenis: 'Thumbnail' });
      if (upThumb && upThumb.success) thumbnailUrl = upThumb.directUrl;
    }

    const payload = {
      nama, url, tipe, kategori: document.getElementById('f-kategori').value,
      deskripsi: document.getElementById('f-deskripsi').value.trim(),
      namaPemilik: document.getElementById('f-pemilik').value.trim(),
      usernameEmail: document.getElementById('f-email-terkait').value.trim(),
      tag: document.getElementById('f-tag').value.trim(),
      catatan: document.getElementById('f-catatan').value.trim(),
      warnaUtama: FormState.warnaUtama, paletWarna: FormState.paletWarna,
      favorit: FormState.favorit,
      status: FormState.statusAktif ? 'Aktif' : 'Tidak Aktif'
    };
    if (thumbnailUrl) payload.thumbnailLogo = thumbnailUrl;
    if (logoUrl) payload.logo = logoUrl;
    if (editId) payload.id = editId;

    const res = await api(editId ? 'inventarisUpdate' : 'inventarisAdd', payload);
    if (res && res.success) {
      Toast.show(res.message, 'success');
      Router.go(editId ? 'detail/' + editId : 'inventaris');
    } else {
      Toast.show((res && res.message) || 'Gagal menyimpan data.', 'error');
    }
  } finally {
    btn.disabled = false; btn.innerHTML = orig;
  }
}
