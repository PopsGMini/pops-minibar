import { expect, test } from "@playwright/test";

async function rejectOptionalMeasurement(page: import("@playwright/test").Page) {
  const button = page.getByRole("button", { name: "Reject optional" });
  if (await button.isVisible().catch(() => false)) await button.click();
}

async function allowAdvertisingMeasurement(page: import("@playwright/test").Page) {
  const button = page.getByRole("button", { name: "Allow both" });
  if (await button.isVisible().catch(() => false)) await button.click();
}

async function submitEnquiry(page: import("@playwright/test").Page, email: string) {
  await page.getByLabel("Full name").fill("Playwright Operator");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Property location").selectOption({ label: "Dubai Marina / JBR" });
  await page.getByLabel("Number of properties").selectOption("6-20");
  await page.getByLabel("Monthly service budget per unit").selectOption("101-200");
  await page.getByLabel(/I agree that Dragos Popescu/).check();
  await page.waitForTimeout(1900);
  await page.getByRole("button", { name: "Send my enquiry" }).click();
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => { (window as Window & { dataLayer?: unknown[] }).dataLayer = []; });
});

test("visitor can compare setups and save a qualified pilot enquiry", async ({ page }, testInfo) => {
  const email = `qualified-${testInfo.project.name}-${Date.now()}@example.com`;
  await page.goto("/?utm_source=google&utm_campaign=dubai_minibar_pilot&gclid=test-click");
  await allowAdvertisingMeasurement(page);
  await expect(page).toHaveURL(/localhost:4173\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Dubai holiday homes");
  await page.getByRole("tab", { name: /Connected Minibar/ }).click();
  await expect(page.getByRole("heading", { name: "Inventory signals. Human confirmation." })).toBeVisible();
  await page.getByRole("link", { name: /Discuss this setup/ }).click();
  await expect(page.locator("#enquiry")).toBeInViewport();
  await expect(page.getByLabel("Preferred setup")).toHaveValue("connected-minibar");
  await submitEnquiry(page, email);
  await expect(page.getByRole("status")).toContainText("Thank you");
  const conversionEvents = await page.evaluate(() => ((window as Window & { dataLayer?: unknown[] }).dataLayer || []).filter((entry) => typeof entry === "object" && entry && (entry as { event?: string }).event === "generate_lead"));
  expect(conversionEvents).toHaveLength(1);
});

test("duplicate enquiry is not saved or counted as another conversion", async ({ page }, testInfo) => {
  const email = `duplicate-${testInfo.project.name}-${Date.now()}@example.com`;
  await page.goto("/");
  await rejectOptionalMeasurement(page);
  await submitEnquiry(page, email);
  await expect(page.getByRole("status")).toContainText("Thank you");
  await page.goto("/");
  await submitEnquiry(page, email);
  await expect(page.getByRole("status")).toContainText("already on file");
  const conversionEvents = await page.evaluate(() => ((window as Window & { dataLayer?: unknown[] }).dataLayer || []).filter((entry) => typeof entry === "object" && entry && (entry as { event?: string }).event === "generate_lead"));
  expect(conversionEvents).toHaveLength(0);
});

test("privacy notice is reachable and identifies the project initiator", async ({ page }) => {
  await page.goto("/privacy");
  await rejectOptionalMeasurement(page);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Privacy");
  await expect(page.getByText("Dragos Popescu").first()).toBeVisible();
});

test("admin can authenticate, filter, update, export and delete an enquiry", async ({ page, request }, testInfo) => {
  const email = `admin-${testInfo.project.name}-${Date.now()}@example.com`;
  const response = await request.post("/api/leads", { data: {
    fullName: "Admin Flow Lead", email, propertyLocation: "Business Bay", propertyCount: "2-5",
    preferredSetup: "guest-allowance", monthlyBudget: "50-100", contactConsent: true,
    newsletterConsent: false, website: "", formStartedAt: Date.now() - 5000,
  } });
  expect(response.ok()).toBeTruthy();
  await page.goto("/admin/login");
  await rejectOptionalMeasurement(page);
  await page.getByLabel("Admin password").fill("e2e-admin-password");
  await page.getByRole("button", { name: "Open enquiries" }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await page.getByPlaceholder("Search name, email, location").fill(email);
  await page.getByRole("button", { name: "Apply filters" }).click();
  const lead = page.locator(".admin-lead").filter({ hasText: email });
  await expect(lead).toBeVisible();
  await lead.getByLabel("Relevance").selectOption("relevant");
  await expect(lead.getByLabel("Relevance")).toHaveValue("relevant");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("link", { name: "Export CSV" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toContain("pops-minibar-enquiries");
  page.once("dialog", (dialog) => dialog.accept());
  await lead.getByRole("button", { name: "Delete" }).click();
  await expect(lead).toHaveCount(0);
});
