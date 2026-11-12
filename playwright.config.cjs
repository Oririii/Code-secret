const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.cjs',
  use: { browserName: 'chromium', screenshot: 'only-on-failure', trace: 'retain-on-failure' },
});
