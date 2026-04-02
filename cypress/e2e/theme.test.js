/* eslint-disable no-undef */
const THEME_STORAGE_KEY = 'site-theme-preference';

const createMatchMedia = (matches = false) => {
  const listeners = new Set();

  return {
    addEventListener: (eventName, listener) => {
      if (eventName === 'change') {
        listeners.add(listener);
      }
    },
    addListener: (listener) => {
      listeners.add(listener);
    },
    dispatch: (nextMatches) => {
      const event = {
        matches: nextMatches,
        media: '(prefers-color-scheme: dark)',
      };
      mediaQueryList.matches = nextMatches;
      listeners.forEach(listener => listener(event));
    },
    matches,
    media: '(prefers-color-scheme: dark)',
    onchange: null,
    removeEventListener: (eventName, listener) => {
      if (eventName === 'change') {
        listeners.delete(listener);
      }
    },
    removeListener: (listener) => {
      listeners.delete(listener);
    },
  };
};

let mediaQueryList;

const visitWithThemeStub = (matches, options = {}) => {
  cy.visit('/', {
    ...options,
    onBeforeLoad: (win) => {
      mediaQueryList = createMatchMedia(matches);
      win.matchMedia = cy.stub().callsFake((query) => {
        expect(query).to.eq('(prefers-color-scheme: dark)');
        return mediaQueryList;
      });
      win.__themeMediaQuery = mediaQueryList;

      if (options.onBeforeLoad) {
        options.onBeforeLoad(win);
      }
    },
  });
};

describe('Theme selection', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('respects the system theme when there is no saved preference', () => {
    visitWithThemeStub(true, {
      onBeforeLoad: (win) => {
        win.localStorage.removeItem(THEME_STORAGE_KEY);
      },
    });

    cy.document().its('documentElement.dataset.themePreference')
        .should('eq', 'system');
    cy.document().its('documentElement.dataset.theme').should('eq', 'dark');
  });

  it('persists an explicit theme selection across reloads', () => {
    visitWithThemeStub(false);

    cy.get('.siteThemeSelect').select('dark');
    cy.document().its('documentElement.dataset.themePreference')
        .should('eq', 'dark');
    cy.document().its('documentElement.dataset.theme').should('eq', 'dark');
    cy.window().its('localStorage').invoke('getItem', THEME_STORAGE_KEY)
        .should('eq', 'dark');

    visitWithThemeStub(false);

    cy.get('.siteThemeSelect').should('have.value', 'dark');
    cy.document().its('documentElement.dataset.theme').should('eq', 'dark');
  });

  it('reacts to system appearance changes while system is selected', () => {
    visitWithThemeStub(false);

    cy.get('.siteThemeSelect').select('system');
    cy.document().its('documentElement.dataset.theme').should('eq', 'light');

    cy.window().then((win) => {
      win.__themeMediaQuery.dispatch(true);
    });

    cy.document().its('documentElement.dataset.theme').should('eq', 'dark');
  });

  it('keeps the theme selector usable inside the mobile menu', () => {
    cy.viewport('iphone-x');
    visitWithThemeStub(false);

    cy.get('.navbar-brand > .button').click();
    cy.get('.siteThemeSelect').should('be.visible').select('dark');
    cy.document().its('documentElement.dataset.theme').should('eq', 'dark');
  });
});
