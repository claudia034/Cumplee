import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser = await chromium.launch({channel:'chrome',headless:true});
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5173');
 await page.getByRole('heading',{name:'Para mi persona favorita.'}).waitFor();
 await page.getByRole('button',{name:'Una sorpresa para ti'}).click();
 await page.getByRole('button',{name:'Pausar presentación automática'}).click();
 for(let i=1;i<=4;i++){
  await page.getByRole('button',{name:`Ir a la página ${i+1}`,exact:true}).click();
  const img=page.locator('.slide.active img');
  await img.waitFor({state:'visible'});
  assert(await img.evaluate(el=>el.complete && el.naturalWidth>0));
 }
 await page.getByRole('button',{name:'Ir a la página 6',exact:true}).click();
 await page.waitForFunction(()=>document.querySelector('video').readyState>=1);
 assert(await page.locator('video').evaluate(v=>v.duration>0));
 assert.equal(await page.getByRole('button',{name:'Activar sonido del video'}).count(),0);
 assert.equal(await page.getByRole('button',{name:'Compartir invitación'}).count(),0);
 await page.getByRole('button',{name:'Ir a la página 7',exact:true}).click();
 await page.getByRole('heading',{name:'3 de octubre'}).waitFor({state:'visible'});
 assert(await page.locator('video').evaluate(v=>v.paused));
 await page.getByRole('button',{name:'Importante escuchar'}).click();
 assert.equal(await page.locator('.petal').count(),60);
 await page.waitForFunction(()=>{const a=document.querySelector('audio');return !a.paused && a.currentTime>0 && a.duration>0 && !a.muted && a.volume>0;});
 await page.locator('audio').evaluate(a=>a.pause());
 assert(await page.locator('audio').evaluate(a=>a.paused));
 await page.getByRole('button',{name:'Importante escuchar'}).click();
 await page.waitForFunction(()=>!document.querySelector('audio').paused);
 await page.screenshot({path:'/tmp/ale-react-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});
 await page.getByRole('button',{name:'Ir a la página 1',exact:true}).click();
 await page.waitForTimeout(800);
 assert(await page.locator('audio').evaluate(a=>a.paused));
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.screenshot({path:'/tmp/ale-react-mobile.png',fullPage:true});
 assert.deepEqual(errors,[]);
 console.log('OK: navegación, cuatro fotos, video, audio de cumpleaños, confeti, móvil y ausencia de errores React.');
} finally {await browser.close();}
