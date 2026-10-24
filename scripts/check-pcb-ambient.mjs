import {chromium,expect} from '@playwright/test';
import fs from 'node:fs';
const base=process.argv[2]||'http://127.0.0.1:3001';
const output=base.startsWith('http://127.')?'docs/pcb-ambient':'.wrangler/pcb-ambient-live';
fs.mkdirSync(output,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1479,height:952}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const traces=['M-10 54 H135 L176 95 H390 L430 55 H620','M-10 200 H105 L151 154 H310 L365 209 H620','M480 -10 V80 L448 112 V180 L510 242','M220 -10 V45 L262 87 V260','M-10 116 H60 L91 147'];
try{
 await page.goto(base,{waitUntil:'networkidle'});
 const bg=page.locator('.pcb-ambient');await expect(bg).toHaveCount(1);
 await expect(bg).toHaveCSS('position','fixed');await expect(bg).toHaveCSS('pointer-events','none');
 await expect(bg).toHaveCSS('background-color','rgb(17, 17, 22)');
 await expect(page.locator('.circuit-background')).toHaveCount(0);
 await expect(page.locator('.ref-capabilities,.ref-work')).toHaveCount(0);
 await expect(page.getByText('WHY THOUGHTFUL ENGINEERING MATTERS',{exact:true})).toHaveCount(0);
 await expect(page.getByRole('heading',{name:'Work With Me'})).toHaveCount(0);
 await expect(page.locator('#resume + #technical-skills + #faq')).toHaveCount(1);
 await expect(bg.locator('svg')).toHaveAttribute('viewBox','0 0 600 260');
 await expect(bg.locator('svg')).toHaveAttribute('preserveAspectRatio','xMidYMid slice');
 expect(await bg.locator('.pcb-ambient-traces path').evaluateAll(paths=>paths.map(p=>p.getAttribute('d')))).toEqual(traces);
 expect(await bg.locator('circle').evaluateAll(nodes=>nodes.map(n=>[+n.getAttribute('cx'),+n.getAttribute('cy'),+n.getAttribute('r')]))).toEqual([[176,95,3],[390,95,3],[151,154,3],[448,112,3]]);
 const styles=await bg.evaluate(root=>Object.fromEntries(['grid','glow','pulse','pulse-second'].map(name=>{const s=getComputedStyle(root.querySelector('.pcb-ambient-'+name));return[name,{duration:s.animationDuration,delay:s.animationDelay,timing:s.animationTimingFunction,direction:s.animationDirection,dash:s.strokeDasharray}];})));
 expect(styles.grid.duration).toBe('25s');expect(styles.glow.duration).toBe('9s');expect(styles.glow.direction).toBe('alternate');
 expect(styles.pulse.duration).toBe('5s');expect(styles['pulse-second'].duration).toBe('7s');expect(styles['pulse-second'].delay).toBe('-2.5s');
 const gridSizes=await bg.locator('.pcb-ambient-grid').evaluate(e=>getComputedStyle(e).backgroundSize.split(',').map(size=>size.trim()));
 expect(gridSizes.every(size=>size==='32px 32px')).toBe(true);
 await expect(bg.locator('.pcb-ambient-glow')).toHaveCSS('width','260px');
 const movement=await bg.evaluate(async root=>{
  const values=()=>({grid:getComputedStyle(root.querySelector('.pcb-ambient-grid')).transform,glow:getComputedStyle(root.querySelector('.pcb-ambient-glow')).transform,pulses:[...root.querySelectorAll('.pcb-ambient-pulse')].map(p=>getComputedStyle(p).strokeDashoffset)});
  const before=values();await new Promise(resolve=>setTimeout(resolve,250));return{before,after:values()};
 });
 expect(movement.after.grid).not.toBe(movement.before.grid);expect(movement.after.glow).not.toBe(movement.before.glow);
 for(let i=0;i<2;i++)expect(movement.after.pulses[i]).not.toBe(movement.before.pulses[i]);
 await page.screenshot({path:output+'/hero.png'});
 await page.locator('.vision-marquee').scrollIntoViewIfNeeded();await page.screenshot({path:output+'/ticker.png'});
 expect(await page.locator('.vision-marquee-group').first().locator('span').allTextContents()).toEqual(Array(2).fill(['PCB DESIGN·','IOT·','FIRMWARE·','WEARABLE TECH·','AI·','EMBEDDED SYSTEMS·']).flat());
 const ticker=page.locator('.vision-marquee-track');const x=()=>ticker.evaluate(e=>new DOMMatrix(getComputedStyle(e).transform).m41);
 const start=await x();await page.waitForTimeout(200);expect(await x()).toBeLessThan(start);
 const initial=await bg.boundingBox();await page.locator('.site-footer').scrollIntoViewIfNeeded();expect(await bg.boundingBox()).toEqual(initial);
 await page.screenshot({path:output+'/footer.png'});
 await bg.evaluate(e=>{e.dataset.persistenceProbe='same-layout';});
 await page.locator('.desktop-nav').getByRole('link',{name:'Boards',exact:true}).click();await expect(page).toHaveURL(/\/boards\//);
 await expect(bg).toHaveCount(1);await expect(bg).toHaveAttribute('data-persistence-probe','same-layout');
 await page.locator('.project-card').first().click();await expect(page).toHaveURL(/\/boards\/esp32-devkit\//);
 await expect(bg).toHaveAttribute('data-persistence-probe','same-layout');
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});
 await expect(bg).toHaveAttribute('data-paused','true');await expect(bg.locator('.pcb-ambient-grid')).toHaveCSS('animation-play-state','paused');
 await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});
 await expect(bg).toHaveAttribute('data-paused','false');
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const selector of ['.pcb-ambient-grid','.pcb-ambient-glow','.pcb-ambient-pulse'])for(const e of await bg.locator(selector).all())await expect(e).toHaveCSS('animation-name','none');
 const widths=[1479,1280,1024,800,768,390,375];
 for(const width of widths){
  await page.setViewportSize({width,height:900});await page.goto(base,{waitUntil:'networkidle'});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBe(0);
  await expect(bg).toBeVisible();
  if(width===375){await page.screenshot({path:output+'/mobile-hero.png'});await page.getByRole('button',{name:'Open navigation menu'}).click();await expect(page.locator('dialog')).toBeVisible();await page.keyboard.press('Escape');await expect(page.locator('dialog')).not.toBeVisible();await page.locator('.vision-marquee').scrollIntoViewIfNeeded();await page.screenshot({path:output+'/mobile-ticker.png'});}
 }
 expect(errors).toEqual([]);fs.writeFileSync(output+'/checks.json',JSON.stringify({base,styles,movement,widths,continuousAcrossRoutes:true,hiddenTabPaused:true,reducedMotion:true,removedSections:true,errors},null,2));
 console.log('PCB ambient, ticker and section checks passed:',base);
}finally{await browser.close();}
