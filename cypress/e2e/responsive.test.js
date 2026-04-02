/* eslint-disable no-undef */
const touchSizes = [
  'ipad-2',
  'iphone-6',
  ['iphone-6', 'landscape'],
  'iphone-x',
  ['iphone-x', 'landscape'],
  'samsung-s10',
];
const fullSizes = [['ipad-2', 'landscape'], 'macbook-11', 'macbook-16'];

describe('Responsive menu', () => {
  beforeEach(() => {
    cy.visit('/').get('#mainSection');
  });
  touchSizes.forEach((size) => {
    it(`Should display navbar burger on ${size} screen`, () => {
      if (Cypress._.isArray(size)) {
        cy.viewport(size[0], size[1]);
      } else {
        cy.viewport(size);
      }
      cy.get('.navbar-brand > .button').should('be.visible');
    });
    it(`Can open and close navigation menu using navbar burger on
    ${size} screen`, () => {
      if (Cypress._.isArray(size)) {
        cy.viewport(size[0], size[1]);
      } else {
        cy.viewport(size);
      }
      cy.get('.navbar-brand > .button').click();
      cy.get('.siteNavbarDrawer').should('have.class', 'is-active')
          .and('be.visible');
      cy.get('.siteNavbarDrawerBackdrop').should('have.class', 'is-active');
      cy.get('.siteNavbarDrawerClose').click();
      cy.get('.siteNavbarDrawer').should('not.have.class', 'is-active');
    });

    it(`Can close navigation drawer via backdrop on ${size} screen`, () => {
      if (Cypress._.isArray(size)) {
        cy.viewport(size[0], size[1]);
      } else {
        cy.viewport(size);
      }
      cy.get('.navbar-brand > .button').click();
      cy.get('.siteNavbarDrawer').should('have.class', 'is-active');
      cy.get('.siteNavbarDrawerBackdrop').click({force: true});
      cy.get('.siteNavbarDrawer').should('not.have.class', 'is-active');
    });
  });
  fullSizes.forEach((size) => {
    // make assertions on the logo using
    // an array of different viewports
    it(`Should not display navbar burger on ${size} screen`, () => {
      if (Cypress._.isArray(size)) {
        cy.viewport(size[0], size[1]);
      } else {
        cy.viewport(size);
      }
      cy.get('.navbar-brand > .button').should('not.be.visible');
    });
  });
});
