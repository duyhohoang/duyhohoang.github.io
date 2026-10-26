import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
test('resume-aligned introduction, projects, education and PDF download',async({page,request})=>{
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');
 await expect(page.locator('.ref-hero h1')).toHaveText('Designing PCBs. Developing Embedded Hardware. Connecting Systems.');
 await expect(page.locator('.ref-case')).toHaveCount(2);
 await expect(page.locator('#case-studies')).not.toContainText('ThingsBoard');
 await expect(page.locator('#about .ref-checks li')).toHaveCount(4);
 await page.locator('#about').scrollIntoViewIfNeeded();
 await expect(page.locator('#about')).toContainText(/Embedded\s*Hardware/);
 await page.screenshot({path:'.wrangler/pcb-viewer-qa/cv-about-desktop.png'});
 await page.getByRole('tab',{name:'Education',exact:true}).click();
 await expect(page.locator('#career-panel')).toContainText('Technology and Engineering');
 await page.getByRole('tab',{name:'Experience',exact:true}).click();
 await expect(page.locator('#career-panel article')).toHaveCount(3);
 await expect(page.locator('#career-panel')).toContainText('Industrial Pump Controller');
 await expect(page.locator('#career-panel')).toContainText('Electrical Panel Technician');
 await expect(page.locator('#career-panel')).toContainText('Elevator Maintenance Technician');
 const href=await page.locator('.ref-hero .resume-download a').getAttribute('href');
 const pdf=await request.get(href!);expect(pdf.ok()).toBe(true);
 const hash=(bytes:Buffer)=>createHash('sha256').update(bytes).digest('hex');
 expect(hash(await pdf.body())).toBe(hash(readFileSync('public/assets/resume/ho-hoang-duy-cv.pdf')));
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:950});await page.goto('/');await page.evaluate(()=>document.fonts.ready);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:'.wrangler/pcb-viewer-qa/cv-hero-'+width+'.png'});
  await page.locator('#about').scrollIntoViewIfNeeded();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 await page.goto('/projects/iot-board/');
 await expect(page.locator('.detail-summary h1')).toHaveText('STM32F407-Based Industrial Pump Controller & Data Logger');
 const boardImage=page.locator('.gallery img');await boardImage.evaluate(image=>(image as HTMLImageElement).decode());
 const imageResponse=await request.get('/assets/projects/personal/iot-board.webp');expect(imageResponse.ok()).toBe(true);
 expect(hash(await imageResponse.body())).toBe(hash(readFileSync('public/assets/projects/personal/iot-board.webp')));
 expect(errors).toEqual([]);
});
