(() => {
  const header = document.querySelector(".site-header");

  if (!header) {
    return;
  }

  const syncHeaderState = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  syncHeaderState();
  window.addEventListener("scroll", syncHeaderState, { passive: true });
})();
