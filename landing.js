(() => {
  const menu = document.querySelector('[data-menu]');
  const drawer = document.querySelector('[data-menu-drawer]');
  menu?.addEventListener('click', () => { drawer.hidden = !drawer.hidden; });
  drawer?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => { drawer.hidden = true; }));
  document.querySelectorAll('a[href^="studio.html?"]').forEach((link) => {
    link.addEventListener('click',() => sessionStorage.setItem('trixlab-studio-query',link.search));
  });
})();
