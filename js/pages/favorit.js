/* ============================================================================
   HALAMAN FAVORIT
   ============================================================================ */
Router.register('favorit', { render: renderFavorit });

function renderFavorit(el) {
  el.innerHTML = `
    <div class="breadcrumb">${ic('home')}<a href="#/dashboard">Dashboard</a><span class="sep">/</span><span>Favorit</span></div>
    <div class="flex-between" style="margin-bottom:1.25rem;">
      <div>
        <h1 class="h-lg" style="margin:0 0 .3rem;">${ic('star')} Aplikasi Favorit</h1>
        <p class="t-muted t-body-md" style="margin:0;">Tautan yang paling sering Anda akses, selalu di depan.</p>
      </div>
    </div>
    <div id="fav-grid" class="grid-auto-fit">${renderSkeletonRows(1,1)}</div>
  `;
  loadFavorit();
}

async function loadFavorit() {
  const grid = document.getElementById('fav-grid');
  const res = await api('inventarisList', { favorit: 'true', pageSize: 100, sortBy: 'Nama Aplikasi', sortDir: 'asc' });
  if (!res || !res.success) { grid.innerHTML = emptyStateHtml('Gagal memuat favorit', 'Periksa koneksi Anda.'); return; }
  if (!res.data.length) {
    grid.innerHTML = `<div class="card card-pad-lg" style="grid-column:1/-1;"><div class="empty-state">${ic('star')}<h3 class="h-sm">Belum ada favorit</h3><p class="t-body-sm">Tandai bintang pada aplikasi di Katalog atau Inventaris untuk menampilkannya di sini.</p><a href="#/katalog" class="btn btn-primary btn-sm" style="margin-top:.5rem;">Jelajahi Katalog</a></div></div>`;
    return;
  }
  grid.innerHTML = res.data.map(a => launcherCardHtml(a)).join('');
}
