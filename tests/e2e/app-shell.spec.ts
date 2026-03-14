import { expect, test } from '@playwright/test';

test('loads the product shell and guided dashboard', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Operations Home' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Start Here' })).toBeVisible();
  await expect(page.getByRole('main').getByRole('button', { name: 'Create Run' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Live Timeline' })).toHaveCount(0);
  await expect(page.getByLabel('Primary').getByRole('button', { name: 'Settings' })).toBeVisible();

  await page.getByLabel('Primary').getByRole('button', { name: 'Create Run' }).click();
  await expect(page.getByRole('heading', { name: 'Create Run' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Choose Outcome' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Choose outcome' })).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('heading', { name: 'Confirm Scope' })).toBeVisible();
  await expect(page.getByText('Multi-Agent Mode')).toBeVisible();

  await page.getByLabel('Primary').getByRole('button', { name: 'Settings' }).click();
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save Current Browser Login' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Verify Current Session' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Current Account Health' })).toBeVisible();

  await page.getByLabel('Primary').getByRole('button', { name: 'Agents' }).click();
  await expect(page.getByRole('heading', { name: 'Agents' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Current Run Fleet' })).toBeVisible();
  await expect(page.getByText('No coordinated run loaded.')).toBeVisible();
});
