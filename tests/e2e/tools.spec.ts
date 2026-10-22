import { test, expect } from '@playwright/test';
test('tool images and See more open software introductions', async ({page})=>{
 test.setTimeout(120000);
 for (const width of [1440,390]) {
  await page.setViewportSize({width,height:900});await page.goto('/');
  for (const [slug,title,image] of [['kicad','KiCad','kicad-pcb-editor.png'],['altium','Altium Designer','altium-designer.jpg']]) {
   const card=page.locator('.portfolio-card').filter({has:page.getByRole('heading',{name:title,exact:true})});
   await card.scrollIntoViewIfNeeded();
   const photo=card.locator('img');await expect(photo).toHaveAttribute('src',`/assets/tools/${image}`);
   await expect.poll(()=>photo.evaluate(el=>(el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
   await card.getByRole('link',{name:`See more about ${title}`,exact:true}).click();
   await expect(page).toHaveURL(new RegExp(`/portfolio/${slug}/$`));
   await expect(page.getByRole('heading',{name:`What can ${title} do?`,exact:true})).toBeVisible();
   await expect(page.locator('.tool-features article')).toHaveCount(6);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   await page.evaluate(()=>{(document.activeElement as HTMLElement)?.blur();window.scrollTo({top:0,behavior:'instant'});});
   await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(0);
   await page.screenshot({path:`docs/implementation-evidence/tool-${slug}-${width}.jpg`,fullPage:true});
   await page.getByRole('link',{name:'Back to design tools',exact:true}).click();
   await expect(page).toHaveURL(/\/#tools$/);
  }
 }
});

