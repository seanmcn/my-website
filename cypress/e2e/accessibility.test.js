/* eslint-disable no-undef */
const THEME_STORAGE_KEY = 'site-theme-preference';

const pages = [
  {label: 'home', path: '/'},
  {label: 'library', path: '/library/'},
  {label: 'library posts filter', path: '/library/posts/'},
  {label: 'tag index', path: '/library/tags/'},
  {
    label: 'world models post',
    path: '/library/2026/04/what-are-world-models-in-ai/',
  },
  {label: 'projects', path: '/projects/'},
  {label: 'chinwag project', path: '/projects/chinwag/'},
  {label: 'about', path: '/about/'},
  {label: 'contact', path: '/contact/'},
  {label: 'search', path: '/search/'},
];

const themes = ['light', 'dark'];

const visitPageWithTheme = (path, theme) => {
  cy.visit(path, {
    onBeforeLoad: (win) => {
      win.localStorage.setItem(THEME_STORAGE_KEY, theme);
    },
  });

  cy.document().its('documentElement.dataset.theme').should('eq', theme);
  cy.get('#mainSection').injectAxe();
};

describe('Accessibility tests', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  pages.forEach(({label, path}) => {
    themes.forEach((theme) => {
      const name =
        `Checks ${label} for accessibility violations in ${theme} mode`;

      it(name, () => {
        visitPageWithTheme(path, theme);
        cy.checkA11y();
      });
    });
  });
});
