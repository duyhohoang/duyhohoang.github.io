import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('personal portfolio sections, links and responsive visuals', async ({ page }) => {
 test.setTimeout(180000);
 for (const width of [1440, 768, 390]) {
  await page.setViewportSize({width,height:900});
  await page.goto('/');
  await expect(page.getByRole('heading',{name:'Good design starts with a clear layout.'})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  for (const slug of ['layout','bom','schematics','kicad','altium','firmware','dashboard']) {
   await expect(page.locator('.layout-workbench, .portfolio-card').locator(`a[href="${slug === 'firmware' ? '/firmware/' : slug === 'dashboard' ? '/dashboard/' : `/portfolio/${slug}/`}"]`)).toHaveCount(1);
  }
  await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){scrollTo(0,y);await new Promise(resolve=>setTimeout(resolve,70));}scrollTo(0,0);});
  for (const image of await page.locator('img').all()) { await image.scrollIntoViewIfNeeded(); await expect(image).toHaveJSProperty('complete',true); expect(await image.evaluate(element=>(element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0); }
  await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path:`docs/implementation-evidence/portfolio-${width}.jpg`,fullPage:true});
 }
 const accessibility=await new AxeBuilder({page}).analyze();
 expect(accessibility.violations).toEqual([]);
 for (const slug of ['layout','bom','schematics','kicad','altium','firmware','dashboard']) {
  const response=await page.goto(`/portfolio/${slug}/`);expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading',{level:1})).toBeVisible();
 }
});



