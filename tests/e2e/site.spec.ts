import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('catalog filters compose and survive hard refresh', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main navigation', exact: true }).getByRole('link', { name: 'Boards', exact: true }).click();
  await expect(page).toHaveURL(/\/boards\/$/);
  await page.getByRole('searchbox').fill('ESP32');
  await expect(page.getByRole('status')).toHaveText('3 of 5 boards');
  await page.getByRole('combobox', { name: 'Category', exact: true }).selectOption('power');
  await expect(page.getByRole('heading', { name: 'No matching boards' })).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters', exact: true }).click();
  await page.getByRole('combobox', { name: 'Status', exact: true }).selectOption('design');
  await page.reload();
  await expect(page.getByRole('status')).toHaveText('5 of 5 boards');
  await expect(page).toHaveURL(/status=design/);
});
test('detail gallery, keyboard tabs and missing data are truthful', async ({ page }) => {
  for (const slug of ['iot-board', 'esp32-plc', '6-fan-control']) {
    const response = await page.goto(`/boards/${slug}/`); expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Components', exact: true })).toHaveCount(0);
    await expect(page.getByRole('tab', { name: 'Stackup', exact: true })).toHaveCount(0);
  }
  await expect(page.locator('.gallery figcaption')).toContainText('PERSONAL PROJECT');
  await page.getByRole('tab', { name: 'Overview', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Features', exact: true })).toBeFocused();
  await page.keyboard.press('End');
  await expect(page.getByRole('tab', { name: 'Files', exact: true })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel')).toContainText('No project files have been released');
  await expect(page.locator('a[download]')).toHaveCount(0);
  const response = await page.goto('/boards/unknown-board/'); expect(response?.status()).toBe(404);
});
test('mobile menu traps focus, closes with Escape and restores focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Open navigation' }); await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close', exact: true })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('dialog').getByRole('link', { name: /Contact/ })).toBeFocused();
  await page.keyboard.press('Escape'); await expect(trigger).toBeFocused();
  expect(await page.locator('body').evaluate(body => body.style.overflow)).toBe('');
});
test('all routes have no overflow or broken images across required widths', async ({ page }) => {
  test.setTimeout(180000);
  const failures: string[] = []; page.on('pageerror', error => failures.push(error.message));
  page.on('console', message => { if (message.type() === 'error') failures.push(message.text()); });
  for (const width of [1440, 1024, 390, 375, 320]) {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 900 });
    for (const route of ['/', '/boards/', '/boards/iot-board/', '/capabilities/', '/workflow/', '/about/', '/contact/', '/privacy/']) {
      const response = await page.goto(route); expect(response?.status()).toBe(200);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${route} at ${width}`).toBe(true);
      if (['/', '/boards/', '/boards/iot-board/'].includes(route)) {
        await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
        await page.screenshot({ path: `docs/implementation-evidence/production-${width}-${route === '/' ? 'home' : route.replace(/\//g, '-').replace(/^-|-$/g, '')}.jpg`, type: 'jpeg', quality: 85 });
      }
      const images = page.locator('img');
      for (const image of await images.all()) { await image.scrollIntoViewIfNeeded(); await expect(image).toHaveJSProperty('complete', true); expect(await image.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0); }
    }
  }
  expect(failures).toEqual([]);
});
test('automated accessibility checks on key routes', async ({ page }) => {
  for (const route of ['/', '/boards/', '/boards/iot-board/', '/contact/']) {
    await page.goto(route);
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    expect(result.violations, route).toEqual([]);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
  const labels = await new AxeBuilder({ page }).withRules(['label-content-name-mismatch']).analyze();
  expect(labels.violations).toEqual([]);
  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  const mobile = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(mobile.violations).toEqual([]);
});
