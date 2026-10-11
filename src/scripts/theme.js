/*
 * The theme toggle, as a plain module script instead of a React context. The
 * inline boot script in Layout.astro has already set data-theme before first
 * paint; this only handles changes after that, so there is no hydration step
 * that could disagree with it.
 */
const STORAGE_KEY = 'site-theme-preference';
const root = document.documentElement;
const media = window.matchMedia('(prefers-color-scheme: dark)');

function apply(preference) {
  const resolved = preference === 'system' ?
    (media.matches ? 'dark' : 'light') :
    preference;
  const next = resolved === 'dark' ? 'light' : 'dark';

  root.dataset.theme = resolved;
  root.dataset.themePreference = preference;
  root.style.colorScheme = resolved;

  document.querySelectorAll('.theme-toggle').forEach((button) => {
    button.setAttribute('aria-label', `Switch to ${next} mode`);
    button.title = `Switch to ${next} mode`;
    button.querySelector('span').textContent = resolved === 'dark' ? '☀︎' : '◐';
  });
  document.querySelectorAll('.mobile-menu__theme').forEach((button) => {
    button.querySelector('span').textContent = resolved === 'dark' ? '☀︎' : '◐';
    button.lastChild.textContent = resolved === 'dark' ? 'Light' : 'Dark';
  });
}

function choose(preference) {
  try {
    window.localStorage.setItem(STORAGE_KEY, preference);
  } catch (error) {
    console.warn('Unable to write theme preference to localStorage', error);
  }
  root.dataset.themePersisted = 'true';
  apply(preference);
}

document.addEventListener('click', (event) => {
  if (event.target.closest('.theme-toggle, .mobile-menu__theme')) {
    choose(root.dataset.theme === 'dark' ? 'light' : 'dark');
  }
});

// Follow the system until the reader picks a theme themselves.
media.addEventListener('change', () => {
  if (root.dataset.themePreference === 'system') {
    apply('system');
  }
});

apply(root.dataset.themePreference || 'system');
