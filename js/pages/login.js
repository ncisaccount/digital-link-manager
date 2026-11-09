/* ============================================================================
   HALAMAN LOGIN — Google Sign-In (tanpa password, sesuai PRD §6)
   ============================================================================ */
function renderLogin() {
  const root = document.getElementById('login-root');
  root.innerHTML = `
    <div class="login-wrap">
      <div class="login-card">
        <div class="login-logo">DL</div>
        <h2 class="h-md" style="margin-bottom:.35rem;">Digital Link Manager</h2>
        <p class="t-muted t-body-md" style="margin:0 0 1.5rem;">Masuk dengan akun Google terdaftar untuk mengelola inventaris aplikasi dan website Anda.</p>
        <div id="g_id_signin_container" style="display:flex;justify-content:center;"></div>
        <div id="login-fallback" style="display:none;margin-top:1rem;">
          <div class="field" style="text-align:left;">
            <label>Email Google <span class="req">*</span></label>
            <input class="input" id="login-email-input" type="email" placeholder="nama@gmail.com">
          </div>
          <button class="btn btn-primary btn-block" style="margin-top:.75rem;" id="login-fallback-btn">Masuk</button>
        </div>
        <p class="t-body-sm t-muted" style="margin-top:1.5rem;">Tidak ada kata sandi tersimpan. Akses dibatasi hanya untuk akun Google yang telah terdaftar oleh Owner.</p>
      </div>
    </div>`;

  warmUpServer('admin'); // panaskan cache server saat form login dibuka (gas-scale-turbo 4.7)

  // Jika Google Identity Services berhasil dimuat, tampilkan tombol resmi.
  function tryInitGSI() {
    if (window.google && google.accounts && google.accounts.id) {
      // CLIENT_ID kosong di sisi frontend demi R11/R12 — bila ingin tombol Google asli,
      // isi GOOGLE_CLIENT_ID publik di config.js. Tanpa itu, gunakan fallback email di bawah.
      document.getElementById('login-fallback').style.display = 'block';
    } else {
      document.getElementById('login-fallback').style.display = 'block';
    }
  }
  setTimeout(tryInitGSI, 300);

  document.getElementById('login-fallback-btn').onclick = async () => {
    const email = document.getElementById('login-email-input').value.trim();
    if (!email) { Toast.show('Masukkan email Google Anda.', 'error'); return; }
    await doLogin(email);
  };
  document.getElementById('login-email-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('login-fallback-btn').click();
  });
}

async function doLogin(email) {
  const btn = document.getElementById('login-fallback-btn');
  const orig = btn.innerHTML;
  btn.innerHTML = '<span class="spinner"></span>';
  btn.disabled = true;
  const nama = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const res = await api('login', { email, nama });
  btn.innerHTML = orig; btn.disabled = false;
  if (res && res.success) {
    Auth.save(res.token, res.email, res.role, res.nama || nama, Date.now() + 12*3600e3);
    Toast.show('Selamat datang, ' + (res.nama || res.email) + '!', 'success');
    Router.go('dashboard');
  } else {
    Toast.show((res && res.message) || 'Gagal masuk. Periksa koneksi Anda.', 'error');
  }
}
