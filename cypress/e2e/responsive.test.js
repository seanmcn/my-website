/* eslint-disable no-undef */

// The design stacks its rails below 760px, which is also where the header
// swaps its inline nav for the full-screen menu.
const narrowSizes = [
  'iphone-6',
  'iphone-x',
  'samsung-s10',
];
const wideSizes = [['ipad-2', 'landscape'], 'macbook-11', 'macbook-16'];

describe('Responsive navigation', () => {
  beforeEach(() => {
    cy.visit('/').get('#mainSection');
  });

  narrowSizes.forEach((size) => {
    it(`Shows the menu button on ${size}`, () => {
      cy.viewport(size);
      cy.get('.siteHeader__burger').should('be.visible');
      cy.get('.siteHeader__nav').should('not.be.visible');
    });

    it(`Opens and closes the full-screen menu on ${size}`, () => {
      cy.viewport(size);
      cy.get('.siteHeader__burger').click();
      cy.get('.mobileMenu').should('be.visible');
      cy.get('.mobileMenu__link').should('have.length', 5);
      cy.get('.mobileMenu__close').click();
      cy.get('.mobileMenu').should('not.exist');
    });

    it(`Navigates from the menu on ${size}`, () => {
      cy.viewport(size);
      cy.get('.siteHeader__burger').click();
      cy.contains('.mobileMenu__link', 'Library').click();
      cy.location('pathname').should('eq', '/library/');
      cy.get('.mobileMenu').should('not.exist');
    });

    it(`Stacks the library rail behind a toggle on ${size}`, () => {
      cy.viewport(size);
      cy.visit('/library/');
      cy.get('.rail--collapsible').should('not.be.visible');
      cy.get('.railToggle').click();
      cy.get('.rail--collapsible').should('be.visible');
    });
  });

  wideSizes.forEach((size) => {
    it(`Shows inline navigation instead of the menu button on ${size}`, () => {
      if (Cypress._.isArray(size)) {
        cy.viewport(size[0], size[1]);
      } else {
        cy.viewport(size);
      }
      cy.get('.siteHeader__burger').should('not.be.visible');
      cy.get('.siteHeader__nav').should('be.visible');
    });
  });
});
