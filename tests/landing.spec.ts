import { test, expect } from '@playwright/test'

test.describe('Landing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('renders page title and hero', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Stop rewriting your resume')
  })

  test('nav has Sign In link', async ({ page }) => {
    const signIn = page.locator('nav a[href="/auth/login"]')
    await expect(signIn).toBeVisible()
    await expect(signIn).toContainText('Sign In')
  })

  test('nav has Get Early Access link to signup', async ({ page }) => {
    const cta = page.locator('nav a[href="/auth/signup"]')
    await expect(cta).toBeVisible()
    await expect(cta).toContainText('Get Early Access')
  })

  test('founding spots urgency badge is visible', async ({ page }) => {
    await expect(page.getByText(/17 of 20 founding spots/i)).toBeVisible()
  })

  test('footer is visible', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible()
  })

  test('Sign In nav link navigates to login', async ({ page }) => {
    await page.locator('nav a[href="/auth/login"]').click()
    await expect(page).toHaveURL('/auth/login')
  })

  test('Get Early Access nav link navigates to signup', async ({ page }) => {
    await page.locator('nav a[href="/auth/signup"]').click()
    await expect(page).toHaveURL('/auth/signup')
  })
})
