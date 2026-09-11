import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser", timeout: 90_000, workers: 1,
  expect: { timeout: 20_000 },
  use: {
    baseURL: "http://127.0.0.1:3000",
    channel: process.env.PLAYWRIGHT_CHANNEL || (process.platform === "win32" ? "msedge" : undefined),
    trace: "retain-on-failure", screenshot: "only-on-failure",
  },
  webServer: { command: "pnpm start", url: "http://127.0.0.1:3000", reuseExistingServer: !process.env.CI, timeout: 120_000 },
});
