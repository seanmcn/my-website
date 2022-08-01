/* eslint-disable no-undef */
describe('Accessibility tests', () => {
  beforeEach(() => {
    cy.visit('/').get('#mainSection').injectAxe();
  });
  it('Checks home page for accessibility violations', () => {
    cy.visit('/').get('#mainSection').injectAxe();
    cy.checkA11y();
  });
  it('Checks blog page for accessibility violations', () => {
    cy.visit('/blog').get('#mainSection').injectAxe();
    cy.checkA11y();
  });
  it('Checks about page for accessibility violations', () => {
    cy.visit('/about').get('#mainSection').injectAxe();
    cy.checkA11y();
  });
  it('Checks contact page for accessibility violations', () => {
    cy.visit('/contact').get('#mainSection').injectAxe();
    cy.checkA11y();
  });
});
