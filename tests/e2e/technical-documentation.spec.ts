import {test,expect} from '@playwright/test';

const sectionIds=['architecture','schematics','layout','stackup','tools','decisions','status'];

test('case studies link to evidence-based documentation without loading native tools',async({page})=>{
 const requests:string[]=[];page.on('request',request=>requests.push(request.url()));
 await page.goto('/');
 const links=page.getByRole('link',{name:'View technical documentation ↗'});
 await expect(links).toHaveCount(2);
 expect(await links.evaluateAll(elements=>elements.map(element=>element.getAttribute('href')))).toEqual(['/projects/esp32-devkit/','/projects/iot-board/']);
 for(const slug of ['iot-board','esp32-devkit']){
  await page.goto('/projects/'+slug+'/');
  const ids=await page.locator('.technical-documentation>.technical-section').evaluateAll(elements=>elements.map(element=>element.id));
  expect(ids).toEqual(sectionIds.map(id=>'documentation-'+id));
  await expect(page.locator('#documentation-schematics .technical-pending')).toContainText('Actual schematic exports');
  await expect(page.locator('.technical-metadata')).toContainText(slug==='iot-board'?'Altium Designer':'KiCad');
  if(slug==='iot-board'){
   await expect(page.locator('#documentation-architecture')).toContainText('Documentation pending');
   await expect(page.locator('#documentation-stackup')).toContainText('Documentation pending');
   await expect(page.locator('#documentation-status [data-state="completed"]')).toHaveCount(2);
   await page.getByRole('tab',{name:'BOM',exact:true}).click();
   await expect(page.locator('.project-documentation')).toContainText('An Interactive BOM has not been supplied');
   await expect(page.locator('.project-documentation')).not.toContainText('Sample parts');
  }else{
   await expect(page.locator('#documentation-stackup tbody tr')).toHaveCount(9);
   await expect(page.locator('#documentation-status [data-state="completed"]')).toHaveCount(0);
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 expect(requests.some(url=>new URL(url).pathname.endsWith('/kicanvas.js')||url.endsWith('.kicad_pcb'))).toBe(false);
});

test('technical image viewer supports zoom pan reset gallery keys Escape and focus restoration',async({page})=>{
 await page.goto('/projects/esp32-devkit/');
 const trigger=page.getByRole('button',{name:'Enlarge System architecture',exact:true});
 await trigger.click();
 const dialog=page.getByRole('dialog');await expect(dialog).toBeVisible();
 await expect(dialog.getByRole('heading',{name:'System architecture',exact:true})).toBeVisible();
 await dialog.locator('img').evaluate(image=>(image as HTMLImageElement).decode());
 await dialog.getByRole('button',{name:'Zoom in',exact:true}).click();
 await expect(dialog.getByLabel('Image zoom')).toHaveText('125%');
 const viewport=dialog.locator('.technical-image-viewport');const bounds=(await viewport.boundingBox())!;
 await page.mouse.move(bounds.x+bounds.width/2,bounds.y+bounds.height/2);
 await page.mouse.down();await page.mouse.move(bounds.x+bounds.width/2+45,bounds.y+bounds.height/2+25);await page.mouse.up();
 expect(await dialog.locator('img').evaluate(image=>image.style.transform)).toContain('translate(45px, 25px)');
 await dialog.getByRole('button',{name:'Fit to screen',exact:true}).click();
 await expect(dialog.getByLabel('Image zoom')).toHaveText('100%');
 await dialog.getByRole('button',{name:'Next image',exact:true}).click();
 await expect(dialog.getByRole('heading',{name:'Integrated ESP32 board render',exact:true})).toBeVisible();
 await page.keyboard.press('ArrowLeft');await expect(dialog.getByRole('heading',{name:'System architecture',exact:true})).toBeVisible();
 await page.keyboard.press('+');await expect(dialog.getByLabel('Image zoom')).toHaveText('125%');
 await page.keyboard.press('0');await expect(dialog.getByLabel('Image zoom')).toHaveText('100%');
 await page.screenshot({path:'.wrangler/technical-docs/viewer-desktop.png'});
 await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);await expect(trigger).toBeFocused();
});

test('unavailable technical images have readable gallery and viewer states',async({page})=>{
 await page.route('**/documentation/block-diagram.svg',route=>route.fulfill({status:404,body:'Not found'}));
 await page.goto('/projects/esp32-devkit/');
 await expect(page.locator('#documentation-architecture')).toContainText('Image unavailable');
 await expect(page.locator('#documentation-architecture img')).toHaveCount(0);
 await page.getByRole('button',{name:'Enlarge System architecture',exact:true}).click();
 await expect(page.getByRole('dialog')).toContainText('This technical image is unavailable');
 await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);
});

test.describe('mobile technical documentation',()=>{
 test.use({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
 test('single-column layout and native touch pinch remain usable',async({page,context})=>{
  await page.goto('/projects/esp32-devkit/');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.getByRole('button',{name:'Enlarge System architecture',exact:true}).tap();
  const dialog=page.getByRole('dialog');await expect(dialog).toBeVisible();
  const bounds=(await dialog.locator('.technical-image-viewport').boundingBox())!;
  const x=Math.round(bounds.x+bounds.width/2),y=Math.round(bounds.y+bounds.height/2);
  const cdp=await context.newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x-35,y,id:1},{x:x+35,y,id:2}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-70,y,id:1},{x:x+70,y,id:2}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await expect(dialog.getByLabel('Image zoom')).not.toHaveText('100%');
  await dialog.getByRole('button',{name:'Reset zoom',exact:true}).tap();await expect(dialog.getByLabel('Image zoom')).toHaveText('100%');
  await page.screenshot({path:'.wrangler/technical-docs/viewer-mobile.png'});
  await dialog.getByRole('button',{name:'Close image viewer',exact:true}).tap();await expect(dialog).toHaveCount(0);
  await page.goto('/projects/iot-board/');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 });
});
