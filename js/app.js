/* ============================================================================
   BOOTSTRAP APLIKASI — Digital Link Manager
   ============================================================================ */
Router.register('notfound', { render: (el) => { el.innerHTML = emptyStateHtml('Halaman tidak ditemukan', 'Periksa kembali alamat yang Anda tuju.'); } });

document.addEventListener('DOMContentLoaded', () => {
  Toast.init();
  Theme.init();
  NetStatus.init();
  Activity.init();

  if (Auth.load()) {
    buildShell();
  } else {
    renderLogin();
  }

  Router.start();

  // Jika login setelah shell belum dibangun
  const origGo = Router.go.bind(Router);
  Router.go = function (path) {
    if (Auth.token && !document.getElementById('topnav').innerHTML) buildShell();
    origGo(path);
  };

  // Polling adaptif ringan untuk status koneksi dashboard (hanya saat tab aktif)
  setInterval(() => {
    if (Router.current === 'dashboard' && Activity.due('dash-refresh', 60000, 300000)) {
      loadDashboardData(document.getElementById('page-dashboard'));
    }
  }, 20000);
});
