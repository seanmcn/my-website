const { defineConfig } = require('cypress')

module.exports = defineConfig({
  fixturesFolder: false,
  projectId: 'm1uz2r',
  viewportWidth: 1200,
  viewportHeight: 660,
  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: 'http://localhost:8000/',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
})
