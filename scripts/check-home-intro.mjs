import {chromium,expect} from '@playwright/test';
import fs from 'node:fs';
const base=process.argv[2]||'http://127.0.0.1:3001';
const output=base.startsWith('http://127.')?'docs/home-intro':'.wrangler/home-intro-live';
fs.mkdirSync(output,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1479,height:952}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto(base,{waitUntil:'networkidle'});
 await expect(page.locator('.ref-hero h1')).toHaveText('Designing PCBs. Building Embedded Systems. Connecting Hardware.');
 await expect(page.locator('.ref-hero .ref-actions a').first()).toHaveAttribute('href','#projects');
 await expect(page.locator('.ref-hero .ref-actions a').last()).toHaveClass(/outline/);
 const socials=page.locator('.ref-hero .ref-socials');
 await expect(socials.getByRole('link',{name:'GitHub',exact:true})).toHaveAttribute('href','https://github.com/duyhohoang');
 await expect(socials.getByRole('link',{name:'Facebook',exact:true})).toHaveAttribute('href','https://www.facebook.com/hoang.duy.72806/');
 const github=socials.getByRole('link',{name:'GitHub',exact:true});await github.hover();
 await expect(github.getByRole('tooltip')).toBeVisible();
 await expect(github).toHaveCSS('background-color','rgb(255, 0, 85)');
 await page.screenshot({path:output+'/hero-tooltip.png'});
 await github.focus();await expect(github.getByRole('tooltip')).toBeVisible();
 await expect(page.locator('#services')).toHaveCount(0);
 await expect(page.getByText('Productized Services',{exact:true})).toHaveCount(0);
 await expect(page.locator('a[href="#services"],a[href="/#services"]')).toHaveCount(0);
 await expect(page.locator('.ref-domain-grid article')).toHaveCount(4);
 await page.mouse.move(0,0);await page.locator('.ref-domain-grid').scrollIntoViewIfNeeded();await page.waitForTimeout(600);
 await page.screenshot({path:output+'/domain-cards.png'});
 await expect(page.locator('#resume + #technical-skills')).toHaveCount(1);
 await expect(page.locator('.technical-skills-grid article')).toHaveCount(6);
 await page.locator('#technical-skills').scrollIntoViewIfNeeded();await page.waitForTimeout(650);
 await page.screenshot({path:output+'/technical-skills.png'});
 const widths=[1479,1280,1024,800,768,390,375];
 for(const width of widths){
  await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(base,{waitUntil:'networkidle'});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBe(0);
  if(width===375){await page.screenshot({path:output+'/hero-mobile.png'});await page.locator('#technical-skills').scrollIntoViewIfNeeded();await page.screenshot({path:output+'/skills-mobile.png'});}
 }
 expect(errors).toEqual([]);
 fs.writeFileSync(output+'/checks.json',JSON.stringify({base,heroUpdated:true,socialLinksAndTooltips:true,domainCards:4,technicalSkillCards:6,servicesRemoved:true,widths,errors},null,2));
 console.log('Home intro and skills checks passed:',base);
}finally{await browser.close();}
