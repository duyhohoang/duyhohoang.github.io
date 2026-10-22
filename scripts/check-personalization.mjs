import {chromium,expect} from '@playwright/test';
import fs from 'node:fs';
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({reducedMotion:'reduce'});
const output='docs/personalization';fs.mkdirSync(output,{recursive:true});
const errors=[];page.on('pageerror',error=>errors.push(error.message));
try{
 const results=[];
 for(const width of [1479,390,375]){
  await page.setViewportSize({width,height:952});
  await page.goto('http://127.0.0.1:3001',{waitUntil:'networkidle'});
  await expect(page.locator('.reference-home')).toHaveAttribute('data-enhanced','true');
  await page.evaluate(()=>document.fonts.ready);
  await expect(page.locator('.brand')).toHaveText('Hoàng Duy');
  await expect(page.locator('.brand em')).toHaveText(['H','D']);
  await expect(page.locator('.ref-portrait-window img')).toHaveAttribute('src','/assets/portraits/hoang-duy.webp');
  await page.locator('.ref-portrait-window img').evaluate(image=>image.decode());
  await expect(page.locator('.brand')).toHaveCSS('font-family','"Portfolio Script", cursive');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBe(0);
  await page.screenshot({path:`${output}/hero-${width}.png`});
  if(width===1479){
   const baseline=JSON.parse(fs.readFileSync('docs/fidelity-phase4/validation.json','utf8')).metrics[0].geometry;
   for(const selector of ['.ref-circle','.ref-portrait-window','.ref-hero h1']){
    const measured=await page.locator(selector).evaluate(e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height};});
    for(const key of ['x','y','width','height'])expect(Math.abs(measured[key]-baseline[selector][key])).toBeLessThan(.1);
   }
  }
  await page.locator('#about').scrollIntoViewIfNeeded();
  await page.locator('#about figure img').evaluate(image=>image.decode());
  await expect(page.locator('#about figure img')).toHaveAttribute('src','/assets/portraits/hoang-duy-about.webp');
  await page.screenshot({path:`${output}/about-${width}.png`});
  if(width===390){
   await page.getByRole('button',{name:'Open navigation menu'}).click();
   await expect(page.getByRole('dialog')).toBeVisible();
   await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).not.toBeVisible();
  }
  results.push({width,noOverflow:true,portraitLoaded:true,wordmarkVerified:true});
 }
 expect(errors).toEqual([]);
 fs.writeFileSync(`${output}/checks.json`,JSON.stringify({results,errors,portraitFrameGeometryPreserved:true},null,2));
 console.log({results,errors});
}finally{await browser.close();}
