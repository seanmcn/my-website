/* eslint-disable no-undef */
const THEME_STORAGE_KEY = 'site-theme-preference';

const pages = [
  {label: 'home', path: '/'},
  {label: 'blog landing', path: '/blog/'},
  {
    label: 'world models blog post',
    path: '/blog/2026/04/what-are-world-models-in-ai/',
  },
  {label: 'about', path: '/about/'},
  {label: 'contact', path: '/contact/'},
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
      it(`Checks ${label} page for accessibility violations in ${theme} mode`, () => {
        visitPageWithTheme(path, theme);
        cy.checkA11y();
      });
    });
  });
});
