/* eslint-disable import/no-extraneous-dependencies */
import 'cypress-axe';
import '@testing-library/cypress/add-commands';

// Disable CSS transitions and animations so axe doesn't capture intermediate
// colour values during theme switches, which would otherwise produce flaky
// color-contrast violations.
beforeEach(() => {
  cy.on('window:before:load', (win) => {
    const style = win.document.createElement('style');
    style.innerHTML = `
      *, *::before, *::after {
        transition: none !important;
        animation: none !important;
      }
    `;
    win.document.documentElement.appendChild(style);
  });
});
