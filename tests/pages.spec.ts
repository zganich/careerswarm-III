import { test, expect } from '@playwright/test'

test.describe('Terms page', () => {
  test('renders terms of service', async ({ page }) => {
    await page.goto('/terms')
    await expect(page.locator('h1')).toContainText('Terms of Service')
  })

  test('has back link to home', async ({ page }) => {
    await page.goto('/terms')
    await expect(page.locator('a[href="/"]')).toBeVisible()
  })

  test('has all required sections', async ({ page }) => {
    await page.goto('/terms')
    for (const section of ['Acceptance', 'Your Content', 'Subscriptions', 'Contact']) {
      await expect(page.getByText(new RegExp(section, 'i')).first()).toBeVisible()
    }
  })
})

test.describe('Privacy page', () => {
  test('renders privacy policy', async ({ page }) => {
    await page.goto('/privacy')
    await expect(page.locator('h1')).toContainText('Privacy Policy')
  })

  test('has back link to home', async ({ page }) => {
    await page.goto('/privacy')
    await expect(page.locator('a[href="/"]')).toBeVisible()
  })

  test('has all required sections', async ({ page }) => {
    await page.goto('/privacy')
    for (const section of ['What We Collect', 'How We Use', 'Data Storage', 'Contact']) {
      await expect(page.getByText(new RegExp(section, 'i')).first()).toBeVisible()
    }
  })
})

test.describe('Navigation flows', () => {
  test('terms link from signup T&C note navigates correctly', async ({ page }) => {
    await page.goto('/auth/signup')
    await page.locator('a[href="/terms"]').click()
    await expect(page).toHaveURL('/terms')
    await expect(page.locator('h1')).toContainText('Terms of Service')
  })

  test('privacy link from signup T&C note navigates correctly', async ({ page }) => {
    await page.goto('/auth/signup')
    await page.locator('a[href="/privacy"]').click()
    await expect(page).toHaveURL('/privacy')
    await expect(page.locator('h1')).toContainText('Privacy Policy')
  })

  test('forgot password link from login navigates correctly', async ({ page }) => {
    await page.goto('/auth/login')
    await page.locator('a[href="/auth/forgot-password"]').click()
    await expect(page).toHaveURL('/auth/forgot-password')
  })

  test('sign in link from signup navigates correctly', async ({ page }) => {
    await page.goto('/auth/signup')
    await page.locator('a[href="/auth/login"]').click()
    await expect(page).toHaveURL('/auth/login')
  })

  test('sign up link from login navigates correctly', async ({ page }) => {
    await page.goto('/auth/login')
    await page.locator('a[href="/auth/signup"]').click()
    await expect(page).toHaveURL('/auth/signup')
  })
})
