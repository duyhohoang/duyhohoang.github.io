import {chromium,expect} from '@playwright/test';
import fs from 'node:fs';
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1479,height:952},reducedMotion:'no-preference'});
const errors=[];page.on('pageerror',error=>errors.push(error.message));
fs.mkdirSync('docs/scroll-refinement',{recursive:true});
try{
 await page.goto('http://127.0.0.1:3001',{waitUntil:'networkidle'});
 await expect(page.locator('.reference-home')).toHaveAttribute('data-motion-ready','true');
 await expect(page.locator('.ref-hero [data-motion-active]')).toHaveCount(0);
 expect(await page.locator('.ref-portrait-window').evaluate(e=>getComputedStyle(e).maskImage)).not.toBe('none');
 await page.screenshot({path:'docs/scroll-refinement/hero.png'});
 const card=page.locator('.ref-services article').first();
 await expect(card).toHaveAttribute('data-scroll-state','hidden');
 await card.evaluate(e=>window.scrollTo({top:e.getBoundingClientRect().top+scrollY-innerHeight+150,behavior:'instant'}));
 await expect(card).toHaveAttribute('data-scroll-state','visible');
 await expect(card).toHaveCSS('opacity','1');
 const nested=await card.locator('[data-scroll-reveal]').count();expect(nested).toBe(0);
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
 await expect(card).toHaveAttribute('data-scroll-state','hidden');
 await expect(card).toHaveCSS('opacity','0');
 await card.scrollIntoViewIfNeeded();
 await expect(card).toHaveAttribute('data-scroll-state','visible');
 await expect(card).toHaveCSS('opacity','1');
 await expect(card).toHaveCSS('translate','none');
 await page.locator('#about').scrollIntoViewIfNeeded();
 await expect(page.locator('#about figure')).toHaveCSS('opacity','1');
 await page.locator('#about figure img').evaluate(e=>e.decode());
 await page.screenshot({path:'docs/scroll-refinement/about.png'});
 const borders=[];
 for(const stat of await page.locator('.ref-stats>div').all()){
  await stat.hover();await expect(stat).toHaveCSS('border-top-color','rgb(255, 0, 85)');
  borders.push(await stat.evaluate(e=>({text:e.textContent,border:getComputedStyle(e).borderTopColor,width:e.getBoundingClientRect().width})));
 }
 await page.screenshot({path:'docs/scroll-refinement/stat-hover.png'});
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(page.locator('[data-scroll-state=hidden]')).toHaveCount(0);
 await page.setViewportSize({width:375,height:900});
 await page.locator('.ref-hero-art').scrollIntoViewIfNeeded();
 await page.screenshot({path:'docs/scroll-refinement/portrait-mobile.png'});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBe(0);
 expect(errors).toEqual([]);
 const result={repeatReveal:true,hiddenAfterScrollingUp:true,noNestedCardReveals:true,portraitClip:true,reducedMotionVisible:true,noOverflow375:true,borders,errors};
 fs.writeFileSync('docs/scroll-refinement/checks.json',JSON.stringify(result,null,2));console.log(result);
}finally{await browser.close();}
