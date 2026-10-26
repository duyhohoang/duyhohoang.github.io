import {test,expect} from '@playwright/test';

test('real PCB preview loads lazily, controls real layers, and leaves BOM usable',async({page})=>{
 test.setTimeout(90000);
 const errors:string[]=[];const requests:string[]=[];
 page.on('pageerror',error=>errors.push(error.message));page.on('request',request=>requests.push(request.url()));
 await page.goto('/projects/esp32-devkit/');
 expect(requests.some(url=>new URL(url).pathname.endsWith('/kicanvas.js')||url.endsWith('/MP1.kicad_pcb'))).toBe(false);
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
 expect(requests.filter(url=>new URL(url).pathname.endsWith('/kicanvas.js'))).toHaveLength(1);expect(requests.filter(url=>url.endsWith('/MP1.kicad_pcb'))).toHaveLength(1);
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
 await page.route('**/kicanvas.js*',route=>route.abort());
 await page.goto('/projects/esp32-devkit/');await page.getByRole('tab',{name:'Preview',exact:true}).click();
 await expect(page.locator('.pcb-viewer').getByRole('alert')).toContainText('KiCanvas could not start');
 await expect(page.getByRole('button',{name:'Retry',exact:true})).toBeVisible();
});
import {readFileSync} from 'node:fs';

test('KiCad 10 exposed mains tracks reach B.Cu and their actual B.Mask expansion',async({page})=>{
 test.setTimeout(90000);
 const source=readFileSync('public/assets/projects/personal/esp32-devkit/MP1.kicad_pcb','utf8');
 const blocks=source.match(/^\t\((?:segment|arc)\b[\s\S]*?^\t\)/gm)||[];
 const exposed=blocks.filter(block=>block.includes('(layers "B.Cu" "B.Mask")')).length;
 await page.goto('/projects/esp32-devkit/');await page.getByRole('tab',{name:'Preview',exact:true}).click();
 await expect(page.getByRole('button',{name:'Fit Board',exact:true})).toBeEnabled({timeout:60000});
 const result=await page.locator('kc-board-viewer').evaluate(async element=>{
  type Point={x:number;y:number;add:(point:Point)=>Point;multiply:(scale:number)=>Point};
  type Track={uuid:string;layer?:string;layers?:string[];width:number;solder_mask_margin?:number;start:Point;end:Point};
  type Bounds={grow:(padding:number)=>Bounds};
  type Layer={visible:boolean;bboxes:Map<Track,Bounds>};
  const v=(element as HTMLElement&{viewer:{board:{segments:Track[]};layers:{in_ui_order:()=>Iterable<Layer>;by_name:(name:string)=>Layer};viewport:{camera:{bbox:Bounds;world_to_screen:(point:Point)=>Point}};draw:()=>void}}).viewer;
  const target=v.board.segments.find(track=>track.uuid==='7838a9c8-4339-4e40-9118-216c91626845')!;
  // Magnify the real native track bounds so a 0.2 mm mask expansion spans
  // several physical pixels, avoiding edge antialiasing at whole-board zoom.
  v.viewport.camera.bbox=v.layers.by_name('B.Mask').bboxes.get(target)!.grow(4);
  const canvas=element.shadowRoot!.querySelector('canvas')!;const gl=canvas.getContext('webgl2')!;
  async function sample(layer:string,offset:number){
   for(const item of v.layers.in_ui_order())item.visible=false;
   v.layers.by_name(layer).visible=true;
   const point=target.start.add(target.end).multiply(.5);point.x+=offset;
   const screen=v.viewport.camera.world_to_screen(point);v.draw();
   return await new Promise<number[]>(resolve=>requestAnimationFrame(()=>{const pixel=new Uint8Array(4);gl.readPixels(Math.round(screen.x*devicePixelRatio),Math.round(canvas.height-screen.y*devicePixelRatio),1,1,gl.RGBA,gl.UNSIGNED_BYTE,pixel);resolve(Array.from(pixel));}));
  }
  return {total:v.board.segments.length,missing:v.board.segments.filter(track=>!track.layer).length,exposed:v.board.segments.filter(track=>track.layers?.includes('B.Mask')).length,target:{layer:target.layer,layers:target.layers,width:target.width,margin:target.solder_mask_margin},copperCenter:await sample('B.Cu',0),outsideCopper:await sample('B.Cu',.85),maskExpansion:await sample('B.Mask',.85),maskCenter:await sample('B.Mask',0),maskColor:(v.layers.by_name('B.Mask') as Layer&{color:{to_array:()=>number[]}}).color.to_array()};
 });
 console.log('Mains regression',JSON.stringify(result));
 expect(result.total).toBe(blocks.length);expect(result.missing).toBe(0);expect(result.exposed).toBe(exposed);expect(exposed).toBeGreaterThan(0);
 expect(result.target).toEqual({layer:'B.Cu',layers:['B.Cu','B.Mask'],width:1.5,margin:.2});
 const background=[17,20,31,255];expect(result.copperCenter).not.toEqual(background);expect(result.outsideCopper).toEqual(background);expect(result.maskExpansion).not.toEqual(background);
});
