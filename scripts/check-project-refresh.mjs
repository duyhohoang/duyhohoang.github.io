import {chromium,expect} from '@playwright/test';
import fs from 'node:fs';
const base=process.argv[2]||'http://127.0.0.1:3001';
const output=base.startsWith('http://127.')?'docs/project-refresh':'.wrangler/project-refresh-live';
fs.mkdirSync(output,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto(base,{waitUntil:'networkidle'});
 await expect(page.locator('.desktop-nav').getByRole('link',{name:'Boards',exact:true})).toHaveAttribute('href','/boards/');
 const resume=page.getByRole('link',{name:'Download Resume'}).first();
 await expect(resume).toHaveAttribute('download','');
 const pdf=await page.request.get(new URL(await resume.getAttribute('href'),base).href);
 expect(pdf.status()).toBe(200);expect((await pdf.body()).subarray(0,4).toString()).toBe('%PDF');
 await expect(page.getByText('Demo CV · Ngô Triệu Vy').first()).toBeVisible();
 await page.locator('.vision-marquee').scrollIntoViewIfNeeded();
 const x=()=>page.locator('.vision-marquee-track').evaluate(e=>new DOMMatrix(getComputedStyle(e).transform).m41);
 const before=await x();await page.waitForTimeout(180);expect(await x()).toBeLessThan(before);
 await page.screenshot({path:output+'/marquee.png'});
 await page.locator('#projects').scrollIntoViewIfNeeded();
 await page.locator('#projects img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode())));
 await page.waitForTimeout(600);
 await page.screenshot({path:output+'/home-projects.png'});
 const styles=()=>page.locator('.project-card').first().evaluate(e=>{const s=getComputedStyle(e);return {background:s.backgroundColor,border:s.borderColor,radius:s.borderRadius};});
 const home=await styles();
 await page.goto(base+'/boards/',{waitUntil:'networkidle'});
 await expect(page.getByRole('searchbox')).toHaveCSS('color','rgb(245, 245, 245)');
 await expect(page.locator('.project-card h3')).toHaveText(['ESP32 Devkit','IoT Board','ESP32 Datalogger','ESP32 PLC','6 Fan Control']);
 await page.locator('.board-project-grid').scrollIntoViewIfNeeded();await page.waitForTimeout(600);
 expect(await styles()).toEqual(home);
 await page.locator('.project-card').first().hover();await page.waitForTimeout(350);
 await expect(page.locator('.project-card').first()).toHaveCSS('border-color','rgb(255, 0, 85)');
 await page.screenshot({path:output+'/boards.png'});
 await page.getByRole('searchbox').fill('Devkit');await expect(page.locator('.project-card')).toHaveCount(1);
 await page.getByRole('button',{name:'Clear filters'}).click();await expect(page.locator('.project-card')).toHaveCount(5);
 for(const width of [1440,1280,1024,800,768,390,375]){
  await page.setViewportSize({width,height:900});
  for(const route of ['/','/boards/']){
   await page.goto(base+route,{waitUntil:'networkidle'});
   expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBe(0);
  }
 }
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base,{waitUntil:'networkidle'});
 await expect(page.locator('.vision-marquee-track')).toHaveCSS('animation-name','none');
 expect(errors).toEqual([]);
 fs.writeFileSync(output+'/checks.json',JSON.stringify({base,errors,sharedCardStyles:home,marqueeRTL:true,resumePDF:true,responsive:true},null,2));
 console.log('Project refresh checks passed:',base);
}finally{await browser.close();}
