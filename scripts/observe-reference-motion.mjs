import {chromium} from '@playwright/test';
import fs from 'node:fs';
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
const output='docs/animation-reference';fs.mkdirSync(output,{recursive:true});
const observations={url:'https://www.wilsonkinyua.com/',samples:[],interactions:[]};
async function sample(label){observations.samples.push({label,scrollY:await page.evaluate(()=>scrollY),data:await page.evaluate(()=>({
  animations:document.getAnimations().map(a=>({target:a.effect?.target?.tagName,className:a.effect?.target?.className,timing:a.effect?.getTiming(),keyframes:a.effect?.getKeyframes()})),
  elements:[...document.querySelectorAll('header,h1,h2,section,button,summary,details')].slice(0,70).map(e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return{tag:e.tagName,text:e.textContent.trim().slice(0,65),className:e.className,opacity:s.opacity,transform:s.transform,transition:s.transition,animation:s.animation,height:r.height,y:r.y}}),
  scripts:[...document.scripts].map(s=>s.src).filter(Boolean),
}))});}
try{
await page.goto(observations.url,{waitUntil:'domcontentloaded',timeout:60000});await sample('DOMContentLoaded');
await page.screenshot({path:output+'/hero-initial.png'});await page.waitForTimeout(1200);await sample('hero-settled');
await page.screenshot({path:output+'/hero-settled.png'});
const sections=await page.locator('section').evaluateAll(es=>es.map(e=>({id:e.id,cls:e.className,heading:e.querySelector('h2')?.textContent})));observations.sections=sections;
for(const [index,heading] of ['Recent Projects','Productized Services','Frequently Asked Questions'].entries()){
 const h=page.getByRole('heading',{name:heading,exact:false}).first();if(await h.count()){await h.scrollIntoViewIfNeeded();await sample(heading+' entering');await page.waitForTimeout(800);await page.screenshot({path:output+'/section-'+index+'.png'});}
}
const expand=page.getByText('View 12 more projects',{exact:false}).first();
if(await expand.count()){await expand.scrollIntoViewIfNeeded();await expand.click();await page.waitForTimeout(60);await sample('projects opening');await page.waitForTimeout(700);observations.interactions.push('Project disclosure clicked; label after: '+await page.getByText('Show fewer projects',{exact:false}).count());}
const faq=page.getByText('What industries do you specialize in?',{exact:false}).first();
if(await faq.count()){await faq.scrollIntoViewIfNeeded();await faq.click();await page.waitForTimeout(70);await sample('FAQ opening');await page.waitForTimeout(600);await page.screenshot({path:output+'/faq-open.png'});observations.interactions.push('FAQ opened');}
const education=page.getByRole('tab',{name:'Education',exact:true});
if(await education.count()){await education.scrollIntoViewIfNeeded();await education.click();await page.waitForTimeout(80);await sample('education changing');await page.waitForTimeout(600);observations.interactions.push('Education tab switched');}
const service=page.getByRole('heading',{name:'Frontend Performance Audit'}).first();
if(await service.count()){
 const target=service.locator('..');await target.scrollIntoViewIfNeeded();
 observations.hoverBefore=await target.evaluate(e=>{const s=getComputedStyle(e);return{className:e.className,transform:s.transform,background:s.backgroundColor,border:s.borderColor,transition:s.transition}});
 await target.hover();await page.waitForTimeout(350);
 observations.hoverAfter=await target.evaluate(e=>{const s=getComputedStyle(e);return{transform:s.transform,background:s.backgroundColor,border:s.borderColor,transition:s.transition}});
}
await page.setViewportSize({width:390,height:844});await page.goto(observations.url,{waitUntil:'networkidle'});observations.mobileButtons=await page.getByRole('button').allTextContents();
observations.nativeScroll=await page.evaluate(()=>({html:getComputedStyle(document.documentElement).scrollBehavior,bodyClasses:document.body.className,globals:['gsap','Lenis','ScrollTrigger'].filter(k=>k in window)}));
fs.writeFileSync(output+'/observations.json',JSON.stringify(observations,null,2));
console.log(JSON.stringify({sections,interactions:observations.interactions,hoverBefore:observations.hoverBefore,hoverAfter:observations.hoverAfter,nativeScroll:observations.nativeScroll,sampleAnimationCounts:observations.samples.map(s=>[s.label,s.data.animations.length]),mobileButtons:observations.mobileButtons.slice(0,8)}));
}finally{await browser.close();}
