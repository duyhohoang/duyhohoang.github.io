import {chromium,expect} from '@playwright/test';
import fs from 'node:fs';
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
const output='docs/phase4';fs.mkdirSync(output,{recursive:true});
try{
 await page.goto('http://127.0.0.1:3001',{waitUntil:'networkidle'});
 await expect(page.locator('.reference-home')).toHaveAttribute('data-enhanced','true');
 const hero=page.locator('.circuit-hero');
 await expect(hero).toHaveAttribute('data-running','true');
 await expect(hero).toHaveCSS('pointer-events','none');
 await expect(page.locator('.circuit-contact')).toHaveAttribute('data-running','false');
 await page.locator('#contact').scrollIntoViewIfNeeded();
 await expect(hero).toHaveAttribute('data-running','false');
 await expect(page.locator('.circuit-contact')).toHaveAttribute('data-running','true');
 await page.evaluate(()=>{
   document.addEventListener('click',event=>{const link=event.target.closest?.('a[href^="mailto:"]');if(link){event.preventDefault();window.__mailto=link.href;}},true);
 });
 await page.getByRole('link',{name:'Send Email',exact:false}).click();
 expect(await page.evaluate(()=>window.__mailto)).toBe('mailto:hoangduy2206.ute@gmail.com');
 await page.getByLabel('Full Name').fill('Duy & Team');
 await page.getByLabel('Email Address').fill('qa@example.com');
 await page.getByLabel('Phone Number').fill('+84 123');
 await page.getByLabel('Subject',{exact:true}).fill('PCB & IoT #1?');
 await page.getByLabel('Message',{exact:false}).fill('Xin chào\nA&B + 50%?');
 await page.getByRole('button',{name:'Send Message'}).click();
 const mailto=new URL(await page.evaluate(()=>window.__mailto));
 expect(mailto.searchParams.get('subject')).toBe('PCB & IoT #1?');
 expect(mailto.searchParams.get('body')).toBe('Name: Duy & Team\nEmail: qa@example.com\nPhone: +84 123\n\nXin chào\nA&B + 50%?');
 await expect(page.getByRole('status')).toContainText('Complete sending in your email app');
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(page.locator('.circuit-contact')).toHaveAttribute('data-running','false');
 expect(await page.locator('.circuit-signals').first().evaluate(e=>getComputedStyle(e).display)).toBe('none');
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.setViewportSize({width:375,height:900});
 await expect(page.locator('.circuit-background[data-running="true"]')).toHaveCount(0);
 // Visibility lifecycle uses the real visibilitychange event with a controlled hidden getter.
 await page.setViewportSize({width:1440,height:900});
 await page.locator('#contact').scrollIntoViewIfNeeded();
 await expect(page.locator('.circuit-contact')).toHaveAttribute('data-running','true');
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});
 await expect(page.locator('.circuit-background[data-running="true"]')).toHaveCount(0);
 await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});
 await expect(page.locator('.circuit-contact')).toHaveAttribute('data-running','true');
 // Bounded real-browser frame sample, not an estimate of end-user performance.
 const frames=await page.evaluate(async()=>{
   const gaps=[];let previous;
   await new Promise(resolve=>{function frame(time){if(previous!==undefined)gaps.push(time-previous);previous=time;if(gaps.length<120)requestAnimationFrame(frame);else resolve();}requestAnimationFrame(frame);});
   return {samples:gaps.length,meanMs:gaps.reduce((a,b)=>a+b)/gaps.length,maxMs:Math.max(...gaps),over34ms:gaps.filter(t=>t>34).length};
 });
 const result={date:new Date().toISOString(),directEmail:true,encodedComposition:true,emailDeliveryTested:false,offscreenPause:true,visibilityPauseSimulated:true,reducedMotion:true,mobileNoPulses:true,frames};
 fs.writeFileSync(output+'/checks.json',JSON.stringify(result,null,2));console.log(result);
}finally{await browser.close();}
