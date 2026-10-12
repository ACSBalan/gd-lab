const {test,expect}=require('@playwright/test');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{pathToFileURL}=require('node:url');
const {standalone}=require('../../tools/standalone.cjs');
let file;
test.beforeAll(()=>{file=path.join(fs.mkdtempSync(path.join(os.tmpdir(),'gd-html-')),'GD_Lab.html');standalone(path.resolve(__dirname,'../..'),file);});
test('Standalone HTML opens offline with the corrected study data and all 23 3D activities',async({browser})=>{
 const context=await browser.newContext({offline:true,viewport:{width:1280,height:900}});
 try{
 const page=await context.newPage(),errors=[],remote=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url()))remote.push(r.url());});
 await page.goto(pathToFileURL(file).href);await page.waitForFunction(()=>!!window.GD_STUDIO);
 const data=await page.evaluate(()=>({counts:[GD_DATA.cards.length,GD_DATA.exercises.length,GD_EXAM.length,Object.keys(GD_IMAGES).length],card:GD_DATA.cards.find(c=>c.id==='GD-U06-022').back,rad:GD_DATA.cards.find(c=>c.id==='GD-U09-017').back,question:GD_EXAM.find(c=>c.id==='GD-Q-08-05').question}));
 expect(data.counts).toEqual([345,38,50,14]);expect(data.card).toContain('dy=0');expect(data.rad).toContain('radiani');expect(data.question).toContain('axa paralelă cu OZ');
 await page.locator('#nav-main [data-route="lab"]').click();const catalog=await page.evaluate(()=>GD_ACTIVITIES.catalog);let count=0;
 for(let unit=1;unit<=10;unit++){
  await page.locator('#page > .chips [data-unit="'+unit+'"]').click();
  for(const id of catalog[unit-1]){await page.locator('#st-activity').selectOption(id);await expect(page.locator('#st-scene canvas')).toBeVisible();await expect(page.locator('#st-board svg')).toBeVisible();count++;}
 }
 expect(count).toBe(23);expect(errors).toEqual([]);expect(remote).toEqual([]);
 await page.screenshot({path:'test-results/standalone-desktop.png',fullPage:true});
 await page.reload();await page.waitForFunction(()=>!!window.GD_STUDIO);expect(errors).toEqual([]);
 }finally{await context.close();}
});
test('Standalone phone layout and existing progress import/export remain usable',async({browser})=>{
 const context=await browser.newContext({offline:true,viewport:{width:360,height:800},hasTouch:true});
 try{
 const page=await context.newPage();await page.goto(pathToFileURL(file).href);await page.waitForFunction(()=>!!window.GD_STUDIO);
 await page.locator('.mobile-tabs [data-route="lab"]').click();await expect(page.locator('#st-scene canvas')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:'test-results/standalone-phone.png',fullPage:true});
 await page.locator('#top-settings').click();
 const progress={app:'gd-lab',schema:1,progress:{'GD-U06-022':{interval:7,due:'2026-10-20',t:999}},settings:{newPerDay:15}};
 await page.locator('#import-file').setInputFiles({name:'progress.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(progress))});await expect(page.locator('#toast')).toContainText('Progresul a fost importat');
 const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Exportă progresul',exact:true}).click();const download=await downloadPromise;const exported=JSON.parse(fs.readFileSync(await download.path(),'utf8'));
 expect(exported.progress['GD-U06-022'].interval).toBe(7);expect(exported.settings.newPerDay).toBe(15);
 await page.reload();expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('gd-lab-student-state')).cardProgress['GD-U06-022'].interval)).toBe(7);
 }finally{await context.close();}
});
