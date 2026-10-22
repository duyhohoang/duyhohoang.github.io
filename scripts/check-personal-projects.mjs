import {chromium,expect} from '@playwright/test';
import fs from 'node:fs';
const base=process.argv[2]||'http://127.0.0.1:3001';
const output=base.startsWith('http://127.')?'docs/personal-projects':'.wrangler/personal-projects-live';
fs.mkdirSync(output,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
const errors=[],failed=[];
const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
// Delay application JavaScript: first-paint motion must finish without hydration.
let releaseScripts;
const scriptGate=new Promise(resolve=>{releaseScripts=resolve;});
await context.route('**/_next/static/**/*.js',async route=>{await scriptGate;await route.continue();});
await context.addInitScript(()=>{
 window.__heroStarts=[];
 document.addEventListener('animationstart',event=>{if(event.animationName.includes('first-paint'))window.__heroStarts.push({name:event.animationName,time:performance.now()});},true);
});
const page=await context.newPage();
page.on('pageerror',error=>errors.push(error.message));
page.on('response',response=>{if(response.status()>=400)failed.push(response.url());});
try{
 await page.goto(base,{waitUntil:'commit'});
 await expect(page.locator('.ref-hero-art')).toHaveCSS('animation-name','portrait-first-paint');
 await expect(page.locator('.ref-hero-art')).toHaveCSS('opacity','1');
 const before=await page.evaluate(()=>({starts:window.__heroStarts.length,enhanced:document.querySelector('.reference-home').dataset.enhanced||null}));
 expect(before.enhanced).toBe(null);releaseScripts();
 await expect(page.locator('.reference-home')).toHaveAttribute('data-enhanced','true',{timeout:20000});
 await page.waitForLoadState('networkidle');
 await page.waitForTimeout(700);
 const after=await page.evaluate(()=>({starts:window.__heroStarts.length,active:document.querySelectorAll('.ref-hero [data-motion-active]').length}));
 expect(after.starts).toBe(before.starts);expect(after.active).toBe(0);
 await expect(page.locator('.ref-hero-art')).toHaveCSS('opacity','1');
 await page.screenshot({path:output+'/hero.png'});
 await expect(page.getByText('ENGINEERING PRINCIPLES',{exact:true})).toHaveCount(0);
 await expect(page.locator('.ref-quotes')).toHaveCount(0);
 const featured=page.locator('.ref-projects:not(.ref-extra) h3');
 await expect(featured).toHaveText(['ESP32 Devkit','IoT Board','ESP32 Datalogger']);
 await page.locator('#projects').scrollIntoViewIfNeeded();
 await page.locator('#projects img').evaluateAll(images=>Promise.all(images.map(image=>{image.loading='eager';return image.decode();})));
 await expect(page.locator('#projects .ref-heading')).toHaveCSS('opacity','1');
 await expect(page.locator('.ref-projects:not(.ref-extra)>a').first()).toHaveCSS('opacity','1');
 await page.screenshot({path:output+'/featured.png'});
 await page.getByRole('button',{name:'View 2 more projects'}).click();
 await expect(page.locator('.ref-extra h3')).toHaveText(['ESP32 PLC','6 Fan Control']);
 await page.waitForTimeout(600);
 await page.screenshot({path:output+'/five-projects.png'});
 const links=await page.locator('#projects .ref-projects>a').evaluateAll(anchors=>anchors.map(a=>a.getAttribute('href')));
 for(const href of links){
  await page.goto(new URL(href,base).href,{waitUntil:'networkidle'});
  await expect(page.locator('h1')).toBeVisible();
  await page.locator('.gallery img').evaluate(image=>image.decode());
  await expect(page.locator('.gallery figcaption')).toContainText('PERSONAL PROJECT');
 }
 const overflow=[];
 for(const width of [1440,1280,1024,768,390,375]){
  await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width,height:900});
  await page.goto(base,{waitUntil:'networkidle'});
  await expect(page.locator('.reference-home')).toHaveAttribute('data-enhanced','true');
  const extra=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);if(extra>0)overflow.push({width,extra});
  await page.locator('.ref-hero-art').scrollIntoViewIfNeeded();
  expect(await page.locator('.ref-portrait-window').evaluate(e=>getComputedStyle(e).maskImage)).not.toBe('none');
  if(width===375)await page.screenshot({path:output+'/portrait-mobile.png'});
 }
 expect(overflow).toEqual([]);expect(errors).toEqual([]);expect(failed).toEqual([]);
 const result={base,coldStart:{before,after,noHydrationRestart:true},featured:['ESP32 Devkit','IoT Board','ESP32 Datalogger'],totalProjects:links.length,detailPagesVerified:links,principlesRemoved:true,widths:[1440,1280,1024,768,390,375],overflow,errors,failed};
 fs.writeFileSync(output+'/checks.json',JSON.stringify(result,null,2));console.log(result);
}finally{await browser.close();}
