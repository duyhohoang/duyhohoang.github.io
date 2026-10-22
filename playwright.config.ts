import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e', fullyParallel: false, workers: 1, timeout: 60000,
  reporter: [['list'], ['json', { outputFile: 'docs/e2e-results.json' }]],
  use: { baseURL: 'http://127.0.0.1:3001', trace: 'retain-on-failure', screenshot: 'only-on-failure', channel: 'msedge' },
  projects: [{ name: 'edge-desktop', use: { ...devices['Desktop Edge'], viewport: { width: 1440, height: 900 } } }],
  webServer: { command: 'node scripts/serve-export.mjs', url: 'http://127.0.0.1:3001', reuseExistingServer: true, timeout: 30000 },
});
