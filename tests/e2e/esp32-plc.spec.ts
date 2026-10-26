import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
test('PLC documentation, real four-layer PCB and interactive BOM',async({page})=>{
 test.setTimeout(90000);
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/projects/esp32-plc/');
 await expect(page.locator('.board-overview')).toContainText('ESP32-S3');
 await expect(page.locator('.board-feature-cards article')).toHaveCount(6);
 await page.getByRole('tab',{name:'Stackup',exact:true}).click();
 await expect(page.locator('.stackup-table tbody tr')).toHaveCount(13);
 await expect(page.locator('.stackup-table')).toContainText('1.065 mm');
 await expect(page.locator('.stackup-summary')).toContainText('4 copper layers');
 await page.getByRole('tab',{name:'Preview',exact:true}).click();
 await expect(page.getByRole('button',{name:'Fit Board',exact:true})).toBeEnabled({timeout:60000});
 const model=await page.locator('kc-board-viewer').evaluate(element=>{const v=(element as HTMLElement&{viewer:{board:{segments:{layer?:string}[];footprints:unknown[]};layers:{in_ui_order:()=>Iterable<{name:string}>}}}).viewer;return {layers:Array.from(v.layers.in_ui_order()).map(l=>l.name),segments:v.board.segments.length,missing:v.board.segments.filter(t=>!t.layer).length,footprints:v.board.footprints.length};});
 const source=readFileSync('public/assets/projects/personal/esp32-plc/ESP32PLC.kicad_pcb','utf8');
 expect(model.segments).toBe((source.match(/^\t\((?:segment|arc)\b/gm)||[]).length);expect(model.missing).toBe(0);expect(model.footprints).toBe((source.match(/^\t\(footprint\b/gm)||[]).length);
 for(const layer of ['F.Cu','In1.Cu','In2.Cu','B.Cu'])expect(model.layers).toContain(layer);
 await page.getByRole('tab',{name:'BOM',exact:true}).click();
 const bom=page.frameLocator('.interactive-bom iframe');await expect(bom.locator('#bomtable')).toBeVisible();await bom.locator('#filter').fill('R');
 await page.getByRole('tab',{name:'Preview',exact:true}).click();await expect(page.locator('kc-board-viewer canvas')).toBeVisible();
 expect(errors).toEqual([]);
 console.log('PLC model',JSON.stringify(model));
});

test('six-fan controller documents supplied specifications on desktop and mobile',async({page})=>{
 await page.goto('/projects/6-fan-control/');
 await expect(page.locator('.detail-summary h1')).toHaveText('6 Fan Controller');
 await expect(page.locator('.board-overview')).toContainText('STM32F070');
 await expect(page.locator('.board-feature-cards article')).toHaveCount(20);
 for(const text of ['128 steps','up to 4A','16 DS18B20','32.768kHz','5–18V','2.5-inch'])await expect(page.locator('.board-feature-cards')).toContainText(text);
 await page.setViewportSize({width:390,height:844});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
