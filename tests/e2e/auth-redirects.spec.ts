import { expect, test } from "@playwright/test";

const PROTECTED_ROUTES = [
  "/dashboard",
  "/library",
  "/ask",
  "/capture",
  "/collections",
  "/connections",
  "/timeline",
  "/settings",
];

const supabaseConfigured =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

test.describe("auth redirects", () => {
  test.skip(!supabaseConfigured, "Supabase env not configured");

  for (const route of PROTECTED_ROUTES) {
    test(`redirects unauthenticated ${route} to sign-in`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveURL(/\/sign-in/);
    });
  }

  test("sign-in page renders the credential form", async ({ page }) => {
    await page.goto("/sign-in");
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });
});

test.describe("api auth", () => {
  test.skip(!supabaseConfigured, "Supabase env not configured");

  test("GET on the ask endpoint is not allowed", async ({ request }) => {
    const response = await request.get("/api/ask");
    expect(response.status()).toBe(405);
  });

  test("POST /api/ask without a session is rejected", async ({ request }) => {
    const response = await request.post("/api/ask", {
      data: { query: "anything" },
    });
    expect([401, 403]).toContain(response.status());
  });
});
