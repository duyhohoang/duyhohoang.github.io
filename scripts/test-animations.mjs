import {chromium,expect} from '@playwright/test';
import fs from 'node:fs';
const base=process.argv[2]||'http://127.0.0.1:3000';
const output=process.env.ANIMATION_OUTPUT || (base.endsWith('3000')?'docs/animation-dev':'docs/animation-production');
fs.mkdirSync(output,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
await context.addInitScript(()=>{
  const Native=window.IntersectionObserver, instances=new Set();
  window.IntersectionObserver=class extends Native{
    constructor(callback,options){super(callback,options);this.targets=new Set();instances.add(this);}
    observe(target){this.targets.add(target);super.observe(target);}
    unobserve(target){this.targets.delete(target);super.unobserve(target);}
    disconnect(){this.targets.clear();super.disconnect();}
  };
  window.__observerAudit=()=>({active:[...instances].filter(o=>o.targets.size).length,detached:[...instances].flatMap(o=>[...o.targets]).filter(e=>!e.isConnected).length});
});
const page=await context.newPage();
const errors=[],checks=[],geometry=[];
page.on('pageerror',error=>errors.push(error.message));
page.on('console',message=>{if(message.type()==='error'&&/hydration|did not match/i.test(message.text()))errors.push(message.text());});
async function load(width=1440,motion='no-preference'){
  await page.emulateMedia({reducedMotion:motion});await page.setViewportSize({width,height:900});
  await page.goto(base,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await expect(page.locator('.reference-home')).toHaveAttribute('data-enhanced','true');
  if(motion==='no-preference')await expect(page.locator('.reference-home')).toHaveAttribute('data-motion-ready','true');
}
async function settle(){await expect(page.locator('.ref-hero [data-motion-active]')).toHaveCount(0,{timeout:7000});}
try{
 await load();
 checks.push({heroActive:await page.locator('.ref-hero [data-motion-active]').count()});
 await settle();
 await page.screenshot({path:output+'/hero-settled.png'});
 const heading=page.locator('.ref-hero h1');
 await expect(heading).toHaveCSS('opacity','1');
 await expect(heading).toHaveCSS('translate','0px');
 expect(await page.locator('.ref-stats strong').allTextContents()).toEqual(['PCB','STM32 / ESP32','CAN / RS485']);
 await page.locator('#services').scrollIntoViewIfNeeded();
 await page.waitForTimeout(100);
 const revealCount=await page.locator('#services [data-scroll-state="visible"]').count();
 expect(revealCount).toBeGreaterThan(0);
 await page.waitForTimeout(1000);
 const service=page.locator('.ref-services article').first();
 await service.hover();await page.waitForTimeout(400);
 const hover=await service.evaluate(e=>({transform:getComputedStyle(e).transform,background:getComputedStyle(e).backgroundColor}));
 expect(hover.transform).toContain('-4');
 checks.push({scrollReveals:revealCount,hover});
 await page.mouse.move(0,0);

 const expand=page.locator('.ref-expand'),region=page.locator('#additional-projects');
 await expand.click();await page.waitForTimeout(45);
 const intermediate=await region.evaluate(e=>e.getBoundingClientRect().height);
 await page.waitForTimeout(550);
 const expanded=await region.evaluate(e=>e.getBoundingClientRect().height);
 expect(intermediate).toBeGreaterThan(0);expect(intermediate).toBeLessThan(expanded);
 await expect(expand).toHaveAttribute('aria-expanded','true');
 await expect(page.locator('.ref-extra a')).toHaveCount(2);
 await page.screenshot({path:output+'/projects-expanded.png'});
 await expand.click();await page.waitForTimeout(400);
 await expect(region).toHaveJSProperty('inert',true);
 expect(await region.evaluate(e=>e.getBoundingClientRect().height)).toBeLessThan(1);
 checks.push({projectHeight:{intermediate,expanded,collapsed:0}});

 const summary=page.locator('.ref-faq summary').first(),detail=page.locator('.ref-faq details').first();
 await summary.scrollIntoViewIfNeeded();await page.waitForTimeout(1000);
 const closed=await detail.evaluate(e=>e.getBoundingClientRect().height);
 await summary.focus();await summary.press('Enter');await page.waitForTimeout(40);
 const faqMiddle=await detail.evaluate(e=>e.getBoundingClientRect().height);
 await expect(summary).toHaveAttribute('aria-expanded','true');await page.waitForTimeout(300);
 const opened=await detail.evaluate(e=>e.getBoundingClientRect().height);
 expect(opened).toBeGreaterThan(closed);expect(faqMiddle).toBeGreaterThan(closed);
 expect(await detail.evaluate(e=>e.style.height)).toBe('');
 await page.screenshot({path:output+'/faq-open.png'});
 await summary.press('Enter');await page.waitForTimeout(300);
 await expect(detail).not.toHaveAttribute('open','');await expect(summary).toHaveAttribute('aria-expanded','false');
 await summary.press('Enter');await page.waitForTimeout(25);await summary.press('Enter');await page.waitForTimeout(300);
 await expect(detail).not.toHaveAttribute('open','');
 checks.push({faqHeight:{closed,intermediate:faqMiddle,opened},faqKeyboardAndRapidToggle:true});

 await page.getByRole('tab',{name:'Education',exact:true}).click();
 await expect(page.locator('#career-panel h3').first()).toHaveText('Education details');
 await page.waitForTimeout(450);
 await expect(page.locator('#career-panel')).toHaveCSS('opacity','1');
 await page.getByRole('tab',{name:'Education',exact:true}).focus();
 await page.keyboard.press('ArrowLeft');
 await expect(page.getByRole('tab',{name:'Experience',exact:true})).toHaveAttribute('aria-selected','true');
 await expect(page.locator('.ref-timeline article')).toHaveCount(5);await page.waitForTimeout(450);
 expect(await page.locator('#career-panel').evaluate(e=>e.style.height)).toBe('');
 checks.push({careerTabsAndKeyboard:true});

 await page.locator('#contact').scrollIntoViewIfNeeded();await page.waitForTimeout(1200);
 await page.locator('.ref-form-grid input').first().focus();
 await expect(page.locator('.ref-form-grid input').first()).toHaveCSS('border-top-color','rgb(255, 0, 85)');
 await page.getByLabel('Full Name').fill('Motion review');
 await page.getByLabel('Email Address').fill('motion@example.com');
 await page.getByLabel('Message',{exact:false}).fill('Local motion review; no delivery expected.');
 await page.evaluate(()=>document.addEventListener('click',event=>{const link=event.target.closest?.('a[href^="mailto:"]');if(link){event.preventDefault();window.__emailDraft=link.href;}},true));
 await page.getByRole('button',{name:'Send Message'}).click();
 expect(await page.evaluate(()=>window.__emailDraft)).toContain('mailto:hoangduy2206.ute@gmail.com?subject=');
 await expect(page.getByRole('status')).toContainText('Complete sending in your email app');
 checks.push({formFocusAndEmailComposition:true});

 for(const width of [1440,1280,1024,768,390,375]){
   await load(width);await settle();
   expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBe(0);
   await page.locator('#about').scrollIntoViewIfNeeded();await page.waitForTimeout(1100);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBe(0);
   if(width===390){
     await page.screenshot({path:output+'/mobile-about.png'});
     await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(350);
     await page.getByRole('button',{name:'Open navigation menu'}).click();
     await expect(page.getByRole('dialog')).toBeVisible();await page.waitForTimeout(300);
     await page.getByRole('button',{name:'Close',exact:false}).focus();await page.keyboard.press('Shift+Tab');
     expect(await page.evaluate(()=>document.activeElement.textContent)).toBe('Hire Me');
     await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).not.toBeVisible();
     expect(await page.evaluate(()=>document.body.style.overflow)).toBe('');
     await page.getByRole('button',{name:'Open navigation menu'}).click();await page.waitForTimeout(300);
     await page.getByRole('dialog').getByRole('link',{name:'About',exact:false}).click();
     await expect(page.getByRole('dialog')).not.toBeVisible();await expect(page).toHaveURL(/#about$/);
     await expect.poll(()=>page.locator('#about').evaluate(e=>Math.abs(e.getBoundingClientRect().top-110)),{timeout:6000}).toBeLessThan(80);
          await expect(page.locator('.desktop-nav a[href="/#about"]')).toHaveAttribute('aria-current','location');
     await page.goBack();await expect(page).toHaveURL(/\/$/);
     await page.getByRole('button',{name:'Open navigation menu'}).click();
     await page.setViewportSize({width:1024,height:900});
     await expect(page.getByRole('dialog')).not.toBeVisible();
     expect(await page.evaluate(()=>document.body.style.overflow)).toBe('');
   }
 }
 checks.push({responsiveWidths:[1440,1280,1024,768,390,375],mobileFocusEscapeAndNavigation:true});

 await load(1479,'reduce');
 await page.screenshot({path:output+'/hero-reduced.png'});
 const baseline=JSON.parse(fs.readFileSync('docs/fidelity-final/validation.json','utf8')).metrics[0].geometry;
 for(const selector of ['.ref-lead','.ref-hero h1','.ref-circle','.ref-portrait-window']){
   const measured=await page.locator(selector).first().evaluate(e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height};});
   geometry.push({selector,before:baseline[selector],after:measured});
   for(const dimension of ['x','y','width','height'])expect(Math.abs(measured[dimension]-baseline[selector][dimension])).toBeLessThan(1.2);
 }
 expect(await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length)).toBe(0);
 expect(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
 await expand.click();await expect(expand).toHaveAttribute('aria-expanded','true');
 await expand.click();await expect(region).toHaveJSProperty('inert',true);
 await summary.click();await expect(summary).toHaveAttribute('aria-expanded','true');await summary.click();await expect(summary).toHaveAttribute('aria-expanded','false');
 await page.getByRole('tab',{name:'Education',exact:true}).click();await expect(page.locator('#career-panel h3').first()).toHaveText('Education details');
  await page.emulateMedia({reducedMotion:'no-preference'});
 await expect(page.locator('.reference-home')).toHaveAttribute('data-motion-ready','true');
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(page.locator('.ref-hero [data-motion-active]')).toHaveCount(0);
 await expect(page.locator('.ref-hero h1')).toHaveCSS('opacity','1');
 checks.push({reducedMotionFunctional:true,livePreferenceChange:true,restingGeometryPreserved:true});

 await load();await settle();
 const baselineObservers=await page.evaluate(()=>window.__observerAudit());
 for(let index=0;index<2;index++){
   await page.locator('.ref-projects:not(.ref-extra)>a').first().click();
   await expect(page).toHaveURL(/\/boards\//,{timeout:15000});await expect(page.locator('.reference-home')).toHaveCount(0,{timeout:15000});
   expect((await page.evaluate(()=>window.__observerAudit())).detached).toBe(0);
   await page.locator('.brand').click();await expect(page.locator('.reference-home')).toHaveAttribute('data-motion-ready','true');await settle();
   const after=await page.evaluate(()=>window.__observerAudit());expect(after.detached).toBe(0);expect(after.active).toBe(baselineObservers.active);
 }
 checks.push({routeCleanupAndRemount:true,observerBaseline:baselineObservers});
 if(base.endsWith('3001')){
   const noJS=await browser.newContext({javaScriptEnabled:false,viewport:{width:1440,height:900}}),noPage=await noJS.newPage();
   await noPage.goto(base);await expect(noPage.locator('.ref-hero h1')).toBeVisible();
   await expect(noPage.locator('.ref-hero h1')).toHaveCSS('opacity','1');
   await noPage.locator('.ref-faq summary').first().click();await expect(noPage.locator('.ref-faq details').first()).toHaveAttribute('open','');
   await expect(noPage.locator('.ref-faq details').first().locator('p')).toBeVisible();
   await noJS.close();checks.push({noJavaScriptContentAndFAQ:true});
 }
 expect(errors).toEqual([]);
 const result={base,date:new Date().toISOString(),errors,checks,geometry};
 fs.writeFileSync(output+'/results.json',JSON.stringify(result,null,2));
 console.log(JSON.stringify({base,errors,checks}));
}finally{await browser.close();}





