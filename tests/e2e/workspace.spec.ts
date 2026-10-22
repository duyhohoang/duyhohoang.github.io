import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('workspace navigation, responsive theme and project dashboards',async({page})=>{
 test.setTimeout(240000);
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 for(const width of [1440,768,390,320]){
  await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});
  for(const route of ['/','/workspace/','/firmware/','/dashboard/','/dashboard/6-fan-control/']){
   const response=await page.goto(route);expect(response?.status()).toBe(200);
   if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)) console.log(await page.evaluate(()=>Array.from(document.querySelectorAll('*')).map(el=>({tag:el.tagName,cls:el.className,right:el.getBoundingClientRect().right,width:el.getBoundingClientRect().width})).filter(el=>el.right>innerWidth+1)));
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${route} at ${width}`).toBe(true);
   if(width===1440||width===390){
    for(const image of await page.locator('img').all()){await image.scrollIntoViewIfNeeded();await expect.poll(()=>image.evaluate(el=>(el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);}
    await page.evaluate(()=>{(document.activeElement as HTMLElement)?.blur();scrollTo({top:0,behavior:'instant'})});
    await page.screenshot({path:`docs/implementation-evidence/workspace-${width}-${route.replaceAll('/','-')||'home'}.jpg`,fullPage:true});
   }
  }
 }
 await page.setViewportSize({width:1440,height:900});await page.goto('/');
 const navigation=page.getByRole('navigation',{name:'Main navigation',exact:true});
 for(const name of ['Workspace','Firmware','Dashboard'])await expect(navigation.getByRole('link',{name,exact:true})).toBeVisible();
 await navigation.getByRole('link',{name:'Dashboard',exact:true}).click();
 await page.locator('.dashboard-project-card').first().getByRole('link',{name:'Open dashboard'}).click();
 await expect(page).toHaveURL(/dashboard\/iot-board\/$/);
 await page.getByRole('button',{name:'Start simulation'}).click();await expect(page.getByText('Simulation running',{exact:true})).toBeVisible();
 await expect.poll(()=>page.locator('.session-details dd').nth(2).textContent()).not.toBe('0');
 await page.getByRole('button',{name:'Reset',exact:true}).click();await expect(page.getByText('Simulation paused',{exact:true})).toBeVisible();
 await page.goto('/dashboard/esp32-plc/');const output=page.getByRole('button',{name:/Output 01/});await expect(output).toHaveAttribute('aria-pressed','false');await output.click();await expect(output).toHaveAttribute('aria-pressed','true');
 await page.goto('/dashboard/6-fan-control/');await page.getByRole('slider',{name:'Fan 1',exact:false}).fill('80');await expect(page.getByText('2560 RPM · simulated',{exact:true})).toBeVisible();await page.getByRole('button',{name:'Reset',exact:true}).click();await expect(page.getByRole('slider',{name:'Fan 1',exact:false})).toHaveValue('45');
 for(const route of ['/','/firmware/','/dashboard/','/dashboard/6-fan-control/','/boards/','/portfolio/kicad/']){
  await page.goto(route);const results=await new AxeBuilder({page}).analyze();expect(results.violations,route).toEqual([]);
 }
 expect(errors).toEqual([]);
});

