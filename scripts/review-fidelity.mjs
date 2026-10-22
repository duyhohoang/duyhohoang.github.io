import { chromium, expect } from '@playwright/test';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
const output = process.env.FIDELITY_OUTPUT || 'docs/fidelity-animation';
const baseURL = 'http://127.0.0.1:3001';
const server = process.argv.includes('--reuse-server') ? null : spawn(process.execPath, ['scripts/serve-export.mjs'], {stdio:'pipe',windowsHide:true});
if(server)await new Promise((resolve,reject)=>{
  const timeout=setTimeout(()=>reject(Error('Preview did not become ready')),20000);
  server.stdout.on('data',chunk=>{if(chunk.toString().includes('Static production preview')){clearTimeout(timeout);resolve();}});
  server.on('error',reject);
  server.on('exit',code=>{if(code)reject(Error('Preview exited with code '+code));});
});
const browser = await chromium.launch({channel:'msedge',headless:true});
const page = await browser.newPage({reducedMotion:'reduce'});
const errors=[], failedResponses=[], metrics=[];
page.on('pageerror',error=>errors.push(error.message));
page.on('response',response=>{if(response.status()>=400)failedResponses.push({url:response.url(),status:response.status()});});
fs.mkdirSync(output,{recursive:true});
const captures=[
  ['01-hero',1479,952,null],['02-trust',1633,859,'.ref-trust'],
  ['03-featured',1336,880,'#case-studies'],['04-secondary',1250,718,'.ref-case-grid'],
  ['05-projects',1282,769,'#projects'],['06-services',1302,874,'#services'],
  ['07-about',1293,715,'#about'],['08-capabilities',1297,856,'.ref-capabilities'],
  ['09-career',1251,867,'#resume'],['10-work',1284,760,'.ref-work'],
  ['11-faq',1413,666,'#faq'],['12-contact',1326,628,'#contact'],
];
async function ready(){
  await expect(page.locator('.reference-home')).toHaveAttribute('data-enhanced','true');
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(image=>{image.loading='eager';return image.decode().catch(()=>{});}));});
}
try{
  for(const [name,width,height,selector] of captures){
    await page.setViewportSize({width,height});
    await page.goto(baseURL,{waitUntil:'networkidle'});
    await ready();
    if(selector)await page.locator(selector).evaluate((element,name)=>{
      if(name==='08-capabilities'||name==='10-work')element=element.closest('section');
      window.scrollTo({top:element.getBoundingClientRect().top+window.scrollY+(name==='07-about'?40:4),behavior:'instant'});
    },name);
    await page.screenshot({path:output+'/'+name+'.png'});
    metrics.push({name,width,height,geometry:await page.evaluate(()=>{
      const targets=['.brand','.ref-lead','.ref-hero h1','.ref-circle','.ref-portrait-window','.ref-projects img','.ref-services h3','.ref-about figure img'];
      return Object.fromEntries(targets.map(selector=>{
        const element=document.querySelector(selector),rect=element.getBoundingClientRect(),style=getComputedStyle(element);
        return [selector,{x:rect.x,y:rect.y,width:rect.width,height:rect.height,font:style.fontFamily,fontSize:style.fontSize,weight:style.fontWeight,objectFit:style.objectFit}];
      }));
    })});
  }
  await page.setViewportSize({width:1440,height:900});await page.goto(baseURL);await ready();
  await page.screenshot({path:output+'/desktop-full.png',fullPage:true});
  await page.getByRole('button',{name:'View 2 more projects'}).click();
  await expect(page.locator('.ref-extra a')).toHaveCount(2);
  await expect(page.locator('.ref-extra img')).toHaveCount(2);
  await page.getByRole('button',{name:'Show fewer projects'}).click();
  await expect(page.locator('#additional-projects')).toHaveJSProperty('inert',true);
  await page.getByRole('tab',{name:'Education',exact:true}).click();
  await expect(page.getByRole('tabpanel').getByRole('heading',{name:'Education details'})).toBeVisible();
  await page.getByRole('tab',{name:'Experience',exact:true}).click();
  await expect(page.locator('.ref-timeline article')).toHaveCount(5);
  const question=page.locator('.ref-faq summary').first(), answer=page.locator('.ref-faq details').first();
  await question.focus();await question.press('Enter');await expect(answer).toHaveAttribute('open','');
  await question.press('Enter');await expect(answer).not.toHaveAttribute('open','');
  await expect(page.locator('#contact form')).toHaveJSProperty('noValidate',false);
  if(await page.locator('#contact form').evaluate(form=>form.checkValidity()))throw Error('Empty contact form accepted');
  await page.getByLabel('Full Name').fill('Visual review');
  await page.getByLabel('Email Address').fill('review@example.com');
  await page.getByLabel('Message',{exact:false}).fill('Local interaction check. No message should be sent.');
  await page.evaluate(()=>document.addEventListener('click',event=>{const link=event.target.closest?.('a[href^="mailto:"]');if(link){event.preventDefault();window.__emailDraft=link.href;}},true));
 await page.getByRole('button',{name:'Send Message'}).click();
 expect(await page.evaluate(()=>window.__emailDraft)).toContain('mailto:hoangduy2206.ute@gmail.com?subject=');
  await expect(page.getByRole('status')).toContainText('Complete sending in your email app');
  const overflow=[];
  for(const width of [1280,1024,768,390,375]){
    await page.setViewportSize({width,height:900});await page.goto(baseURL);await ready();
    const extra=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
    if(extra>0)overflow.push({width,extra});
    if(width===390){
      await page.screenshot({path:output+'/mobile-full.png',fullPage:true});
      await page.getByRole('button',{name:'Open navigation menu'}).click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await page.getByRole('dialog').getByRole('link',{name:'About',exact:false}).click();
      await expect(page.getByRole('dialog')).not.toBeVisible();
      await expect(page).toHaveURL(/#about$/);
    }
  }
  const result={date:new Date().toISOString(),errors,failedResponses,overflow,captures:captures.length,interactions:'project expand/collapse, workflow images, experience/education tabs, keyboard FAQ open/close, form validation/email composition, mobile navigation passed'};
  fs.writeFileSync(output+'/validation.json',JSON.stringify({...result,metrics},null,2));
  console.log(JSON.stringify(result));
  expect(errors).toEqual([]);expect(failedResponses).toEqual([]);expect(overflow).toEqual([]);
}finally{await browser.close();server?.kill();}




