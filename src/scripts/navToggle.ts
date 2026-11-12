// 768px 以下で出るハンバーガーメニューの開閉(ポートフォリオの navToggle.js を元にしている)
export function setupNavToggle(): void {
  const toggle = document.getElementById('navToggle');
  const sideNav = document.getElementById('sideNav');
  const overlay = document.getElementById('navOverlay');
  if (!toggle || !sideNav || !overlay) return;

  const mobileQuery = window.matchMedia('(max-width: 768px)');

  const setOpen = (isOpen: boolean) => {
    sideNav.classList.toggle('is-open', isOpen);
    overlay.classList.toggle('is-open', isOpen);
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  toggle.addEventListener('click', () => setOpen(!sideNav.classList.contains('is-open')));
  overlay.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });
  // 広い幅に戻ったら、開いたままにしない
  mobileQuery.addEventListener('change', (event) => {
    if (!event.matches) setOpen(false);
  });
}
