/* eslint-disable no-undef */
const THEME_STORAGE_KEY = 'site-theme-preference';
const THEME_MEDIA_QUERY = '(prefers-color-scheme: dark)';

const createMatchMedia = (matches = false, media = THEME_MEDIA_QUERY) => {
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
        media,
      };
      mediaQueryList.matches = nextMatches;
      listeners.forEach(listener => listener(event));
    },
    matches,
    media,
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
        if (query === THEME_MEDIA_QUERY) {
          return mediaQueryList;
        }

        return createMatchMedia(false, query);
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

  it('flips between light and dark and persists the choice', () => {
    visitWithThemeStub(false);

    cy.document().its('documentElement.dataset.theme').should('eq', 'light');
    cy.get('.themeToggle').should('have.attr', 'aria-label')
        .and('contain', 'dark');

    cy.get('.themeToggle').click();
    cy.document().its('documentElement.dataset.theme').should('eq', 'dark');
    cy.window().its('localStorage').invoke('getItem', THEME_STORAGE_KEY)
        .should('eq', 'dark');

    cy.get('.themeToggle').click();
    cy.document().its('documentElement.dataset.theme').should('eq', 'light');

    visitWithThemeStub(false);
    cy.document().its('documentElement.dataset.theme').should('eq', 'light');
  });

  it('follows system appearance changes until a choice is made', () => {
    visitWithThemeStub(false);

    cy.document().its('documentElement.dataset.theme').should('eq', 'light');

    cy.window().then((win) => {
      win.__themeMediaQuery.dispatch(true);
    });

    cy.document().its('documentElement.dataset.theme').should('eq', 'dark');
  });

  it('keeps a theme control inside the mobile menu', () => {
    cy.viewport('iphone-x');
    visitWithThemeStub(false);

    cy.get('.siteHeader__burger').click();
    cy.get('.mobileMenu__theme').should('be.visible').click();
    cy.document().its('documentElement.dataset.theme').should('eq', 'dark');
  });
});
