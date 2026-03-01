import { test, expect } from '@playwright/test'

test.describe('Login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login')
  })

  test('renders sign in heading', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Sign in')
  })

  test('CareerSwarm logo links to home', async ({ page }) => {
    const logo = page.locator('a[href="/"]').first()
    await expect(logo).toBeVisible()
    await expect(logo).toContainText('CareerSwarm')
  })

  test('has email and password fields', async ({ page }) => {
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('password show/hide toggle works', async ({ page }) => {
    const pwInput = page.locator('input[type="password"]')
    const toggle = page.getByRole('button', { name: /show/i })
    await expect(pwInput).toHaveAttribute('type', 'password')
    await toggle.click()
    await expect(page.locator('input[type="text"]').first()).toBeVisible()
    const hideBtn = page.getByRole('button', { name: /hide/i })
    await hideBtn.click()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('has forgot password link', async ({ page }) => {
    await expect(page.locator('a[href="/auth/forgot-password"]')).toBeVisible()
  })

  test('has link to sign up', async ({ page }) => {
    await expect(page.locator('a[href="/auth/signup"]')).toBeVisible()
  })

  test('shows loading state when form is submitted', async ({ page }) => {
    // Note: real error response requires outbound Supabase network access.
    // We verify the loading state appears immediately on submit.
    await page.fill('input[type="email"]', 'notreal@example.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page.getByRole('button', { name: /signing in/i })).toBeVisible()
  })
})

test.describe('Signup page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/signup')
  })

  test('renders create account heading', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Create account')
  })

  test('CareerSwarm logo links to home', async ({ page }) => {
    const logo = page.locator('a[href="/"]').first()
    await expect(logo).toBeVisible()
  })

  test('has name, email, password fields', async ({ page }) => {
    await expect(page.locator('input[placeholder="Full Name"]')).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('password show/hide toggle works', async ({ page }) => {
    const toggle = page.getByRole('button', { name: /show/i })
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await toggle.click()
    await expect(page.locator('input[type="text"]').first()).toBeVisible()
  })

  test('has T&C links to /terms and /privacy', async ({ page }) => {
    await expect(page.locator('a[href="/terms"]')).toBeVisible()
    await expect(page.locator('a[href="/privacy"]')).toBeVisible()
  })

  test('has link to sign in', async ({ page }) => {
    await expect(page.locator('a[href="/auth/login"]')).toBeVisible()
  })
})

test.describe('Forgot password page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/forgot-password')
  })

  test('renders reset password heading', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Reset password')
  })

  test('CareerSwarm logo links to home', async ({ page }) => {
    await expect(page.locator('a[href="/"]').first()).toBeVisible()
  })

  test('has email input and submit button', async ({ page }) => {
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.getByRole('button', { name: /send reset/i })).toBeVisible()
  })

  test('has back to sign in link', async ({ page }) => {
    await expect(page.locator('a[href="/auth/login"]')).toBeVisible()
  })
})

test.describe('Reset password page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/reset-password')
  })

  test('renders new password heading', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('New password')
  })

  test('CareerSwarm logo links to home', async ({ page }) => {
    await expect(page.locator('a[href="/"]').first()).toBeVisible()
  })

  test('has two password fields with show/hide toggles', async ({ page }) => {
    const passwordInputs = page.locator('input[type="password"]')
    await expect(passwordInputs).toHaveCount(2)
    const toggles = page.getByRole('button', { name: /show/i })
    await expect(toggles).toHaveCount(2)
  })

  test('shows error when passwords do not match', async ({ page }) => {
    await page.locator('input[type="password"]').first().fill('password123')
    await page.locator('input[type="password"]').nth(1).fill('different456')
    await page.getByRole('button', { name: /set new password/i }).click()
    await expect(page.getByText(/do not match/i)).toBeVisible()
  })
})

test.describe('Auth error page', () => {
  test('renders link expired by default', async ({ page }) => {
    await page.goto('/auth/error')
    await expect(page.locator('h1')).toContainText('Link expired')
  })

  test('shows contextual message for expired token', async ({ page }) => {
    await page.goto('/auth/error?error=access_denied&error_description=Email+link+is+invalid+or+has+expired')
    await expect(page.locator('h1')).toContainText('Link expired')
    await expect(page.getByText(/24 hours/i)).toBeVisible()
  })

  test('has sign in and reset password buttons', async ({ page }) => {
    await page.goto('/auth/error')
    await expect(page.locator('a[href="/auth/login"]')).toBeVisible()
    await expect(page.locator('a[href="/auth/forgot-password"]')).toBeVisible()
  })

  test('has contact support link', async ({ page }) => {
    await page.goto('/auth/error')
    await expect(page.locator('a[href^="mailto:"]')).toBeVisible()
  })
})
