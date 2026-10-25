import {test,expect} from '@playwright/test';

test('real PCB preview loads lazily, controls real layers, and leaves BOM usable',async({page})=>{
 test.setTimeout(90000);
 const errors:string[]=[];const requests:string[]=[];
 page.on('pageerror',error=>errors.push(error.message));page.on('request',request=>requests.push(request.url()));
 await page.goto('/projects/esp32-devkit/');
 expect(requests.some(url=>url.endsWith('/kicanvas.js')||url.endsWith('/MP1.kicad_pcb'))).toBe(false);
 await page.getByRole('tab',{name:'Preview',exact:true}).click();
 await expect(page.getByRole('button',{name:'Fit Board',exact:true})).toBeEnabled({timeout:60000});
 await expect(page.locator('kc-board-viewer canvas')).toBeVisible();
 const layer=page.locator('kc-board-layer-control[layer-name="F.Cu"]');
 await layer.locator('button').click();
 const visible=()=>page.locator('kc-board-viewer').evaluate(element=>(element as HTMLElement&{viewer:{layers:{by_name:(name:string)=>{visible:boolean}}}}).viewer.layers.by_name('F.Cu').visible);
 expect(await visible()).toBe(false);
 await page.getByRole('button',{name:'Fit Board',exact:true}).click();expect(await visible()).toBe(false);
 await page.getByRole('tab',{name:'BOM',exact:true}).click();
 const bom=page.frameLocator('.interactive-bom iframe');await expect(bom.locator('#title')).toHaveText('MP1');await bom.locator('#filter').fill('RV1');await expect(bom.locator('#bomtable tbody')).toContainText('RV1');
 await page.getByRole('tab',{name:'Preview',exact:true}).click();
 expect(await visible()).toBe(false);await expect(page.locator('kicanvas-embed')).toHaveCount(1);
 expect(requests.filter(url=>url.endsWith('/kicanvas.js'))).toHaveLength(1);expect(requests.filter(url=>url.endsWith('/MP1.kicad_pcb'))).toHaveLength(1);
 expect(requests.some(url=>url.includes('fonts.googleapis.com')||url.includes('fonts.gstatic.com'))).toBe(false);
 expect(errors).toEqual([]);
});

test('missing PCB has a clear error and Retry recovers without a second module',async({page})=>{
 test.setTimeout(90000);
 await page.route('**/MP1.kicad_pcb',route=>route.fulfill({status:404,body:'Not found'}));
 await page.goto('/projects/esp32-devkit/');await page.getByRole('tab',{name:'Preview',exact:true}).click();
 await expect(page.locator('.pcb-viewer').getByRole('alert')).toContainText('PCB file was not found');
 await expect(page.locator('.pcb-viewer-stage img')).toHaveCount(0);
 await page.unroute('**/MP1.kicad_pcb');await page.getByRole('button',{name:'Retry',exact:true}).click();
 await expect(page.getByRole('button',{name:'Fit Board',exact:true})).toBeEnabled({timeout:60000});
 await expect(page.locator('script#portfolio-kicanvas-module')).toHaveCount(1);
});

test('unsupported source content is an explicit error, never an image fallback',async({page})=>{
 await page.route('**/MP1.kicad_pcb',route=>route.fulfill({status:200,contentType:'text/html',body:'<!DOCTYPE html><h1>Not a PCB</h1>'}));
 await page.goto('/projects/esp32-devkit/');await page.getByRole('tab',{name:'Preview',exact:true}).click();
 await expect(page.locator('.pcb-viewer').getByRole('alert')).toContainText('not a supported KiCad PCB');
 await expect(page.locator('.pcb-viewer-stage img')).toHaveCount(0);
});

test('KiCanvas module load failure is visible and retryable',async({page})=>{
 await page.route('**/kicanvas.js',route=>route.abort());
 await page.goto('/projects/esp32-devkit/');await page.getByRole('tab',{name:'Preview',exact:true}).click();
 await expect(page.locator('.pcb-viewer').getByRole('alert')).toContainText('KiCanvas could not start');
 await expect(page.getByRole('button',{name:'Retry',exact:true})).toBeVisible();
});
