import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  workers: 1,
  use: { baseURL: "http://localhost:4173", trace: "on-first-retry" },
  webServer: {
    command: "pnpm exec next dev -p 4173",
    url: "http://localhost:4173",
    reuseExistingServer: false,
    timeout: 120000,
    env: {
      DATABASE_PATH: ".data/pops-minibar-e2e.sqlite",
      ADMIN_PASSWORD: "e2e-admin-password",
      ADMIN_SESSION_SECRET: "e2e-session-secret-at-least-thirty-two-characters",
      RATE_LIMIT_SECRET: "e2e-rate-limit-secret",
    },
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
