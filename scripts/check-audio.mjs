import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true,ignoreDefaultArgs:['--mute-audio']});
try {
 for (const url of ['http://127.0.0.1:5173/','file:///Users/clau/Desktop/Cumple/Invitacion-Ale.html']) {
  const page=await browser.newPage();
  await page.goto(url);
  await page.getByRole('button',{name:'Ir a la página 7',exact:true}).click();
  await page.evaluate(()=>{
   const audio=document.querySelector('audio');
   const context=new AudioContext();
   const analyser=context.createAnalyser();
   const source=context.createMediaElementSource(audio);
   source.connect(analyser);analyser.connect(context.destination);
   window.audioProbe={context,analyser};
   document.querySelector('.slide.active .primary').addEventListener('click',()=>context.resume());
  });
  await page.getByRole('button',{name:'Importante escuchar'}).click();
  await page.waitForFunction(()=>{
   const audio=document.querySelector('audio');
   const {analyser,context}=window.audioProbe;
   const samples=new Float32Array(analyser.fftSize);analyser.getFloatTimeDomainData(samples);
   return context.state==='running' && !audio.paused && !audio.muted && audio.volume===1 && samples.some(x=>Math.abs(x)>.01);
  },null,{timeout:20000});
  assert.match(await page.locator('.ticket-foot').innerText(),/Importante guardar\s+toda la noche/);
  console.log('Audio con señal audible verificado mediante clic:',url);
  await page.close();
 }
} finally {await browser.close();}
