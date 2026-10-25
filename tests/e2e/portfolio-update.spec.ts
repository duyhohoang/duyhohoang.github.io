import {test,expect} from '@playwright/test';

test('personal CV, social links and integrated projects',async({page})=>{
 await page.goto('/#projects');
 await expect(page.locator('#projects .project-card')).toHaveCount(5);
 await expect(page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'Boards',exact:true})).toHaveCount(0);
 await expect(page.locator('.ref-socials').first().getByRole('link',{name:'LinkedIn',exact:true})).toHaveAttribute('href','https://www.linkedin.com/in/duy-h%E1%BB%93-ho%C3%A0ng-778955433/');
 const cv=page.getByRole('link',{name:/Download Resume/}).first();
 await expect(cv).toHaveAttribute('href','/assets/resume/ho-hoang-duy-cv.pdf');
 expect((await page.request.get('/assets/resume/ho-hoang-duy-cv.pdf')).status()).toBe(200);
 await page.getByRole('searchbox',{name:'Search projects'}).fill('6 Fan');
 await expect(page.locator('#projects .project-card')).toHaveCount(1);
 expect(new URL(page.url()).hash).toBe('#projects');
 await page.getByRole('button',{name:'Clear filters'}).click();
 await expect(page.locator('#projects .project-card')).toHaveCount(5);
 await page.getByRole('tab',{name:'Education'}).click();
 await expect(page.getByRole('tabpanel')).toContainText('HCMUTE');
 for(const width of [1440,768,390]){
  await page.setViewportSize({width,height:900});
  const geometry=await page.evaluate(()=>{
   const ticker=document.querySelector('.vision-marquee')!.getBoundingClientRect();
   const cards=document.querySelector('.ref-case-grid')!.getBoundingClientRect();
   return {left:Math.abs(ticker.left-cards.left),right:Math.abs(ticker.right-cards.right),overflow:document.documentElement.scrollWidth>innerWidth};
  });
  if(width===1440)await page.locator('#projects').screenshot({path:'docs/portfolio-projects-updated.png'});
  expect(geometry.left).toBeLessThan(1);expect(geometry.right).toBeLessThan(1);expect(geometry.overflow).toBe(false);
 }
 await page.locator('#projects .project-card').first().click();
 await expect(page).toHaveURL(/\/projects\/esp32-devkit\//);
 await expect(page.getByRole('heading',{level:1})).toHaveText('ESP32 Devkit');
});
