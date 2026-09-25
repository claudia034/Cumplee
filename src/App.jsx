import React, { useCallback, useEffect, useRef, useState } from 'react';

const colors = ['#df745c','#eab85c','#78b6ad','#779ebc','#cf8fa1','#97b978','#e79458'];
const balloons = [4,6,7,7,6,4].flatMap((count,row) => Array.from({length:count},(_,col) => ({x:220+(col-(count-1)/2)*39+(row%2?8:0), y:45+row*43})));
function Balloons() {
  return <g>
    {balloons.map(({x,y},i)=><path key={`string-${i}`} d={`M${x} ${y+29}Q${x+8} 295 222 369`} stroke="#c1bea877" strokeWidth="1" fill="none" />)}
    {balloons.map(({x,y},i)=><g key={i}>
      <ellipse cx={x} cy={y} rx="26" ry="33" fill={colors[(i*3+Math.floor(i/5))%colors.length]} />
      <ellipse cx={x} cy={y} rx="26" ry="33" fill="url(#shine)" />
      <ellipse cx={x-9} cy={y-12} rx="6" ry="10" fill="#fff" opacity=".22" transform={`rotate(25 ${x-9} ${y-12})`} />
      <path d={`M${x} ${y+31}l-3 5h6z`} fill={colors[(i*3+Math.floor(i/5))%colors.length]} />
    </g>)}
  </g>;
}

export default function App() {
  const [current,setCurrent] = useState(0);
  const [playing,setPlaying] = useState(false);
  const [status,setStatus] = useState('');
  const [confetti,setConfetti] = useState([]);
  const [visible,setVisible] = useState(!document.hidden);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const confettiTimer = useRef(null);
  const go = useCallback((index) => {
    if(index<0 || index>6) return;
    setCurrent(index);
    if(index===6) setPlaying(false);
  },[]);
  useEffect(() => {
    if(!playing || !visible || current===5 || current===6) return;
    const timer=setTimeout(()=>go(current+1),8000);
    return ()=>clearTimeout(timer);
  },[current,playing,visible,go]);
  useEffect(() => {
    const video=videoRef.current;
    if(current===5 && playing && visible) video.play().catch(()=>{});
    else video.pause();
  },[current,playing,visible]);
  useEffect(() => { if(current!==5) videoRef.current.currentTime=0; },[current]);
  useEffect(() => {
    const onVisibility=()=>setVisible(!document.hidden);
    const onKey=(event)=>{
      if(event.target.closest('video,button,a')) return;
      if(event.key==='ArrowRight') go(current+1);
      if(event.key==='ArrowLeft') go(current-1);
    };
    document.addEventListener('visibilitychange',onVisibility);
    document.addEventListener('keydown',onKey);
    return ()=>{
      document.removeEventListener('visibilitychange',onVisibility);
      document.removeEventListener('keydown',onKey);
    };
  },[current,go]);
  useEffect(()=>()=>clearTimeout(confettiTimer.current),[]);
  useEffect(()=>{if(current!==6) audioRef.current.pause();},[current]);
  const start=()=>{setPlaying(!matchMedia('(prefers-reduced-motion: reduce)').matches);go(1);};
  const togglePlaying=()=>{if(current===6) go(0);setPlaying(value=>!value);};
  const celebrate=()=>{
    videoRef.current.pause();
    const audio=audioRef.current;
    audio.muted=false;
    audio.volume=1;
    if(audio.error) audio.load();
    if(audio.ended) audio.currentTime=0;
    setStatus("Cargando audio…");
    audio.play().then(()=>setStatus('Reproduciendo audio ♫')).catch((error)=>setStatus(error.name==='NotAllowedError' ? 'El navegador bloqueó el sonido. Vuelve a pulsar Importante escuchar.' : 'No se pudo reproducir el audio. Vuelve a intentarlo.'));
    if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    clearTimeout(confettiTimer.current);
    setConfetti(Array.from({length:60},(_,i)=>({id:i,left:`${Math.random()*100}vw`,background:colors[i%colors.length],animationDelay:`${Math.random()*1.3}s`,borderRadius:i%2?'50%':'2px'})));
    confettiTimer.current=setTimeout(()=>setConfetti([]),6500);
  };
  return <>

<div className="sky" aria-hidden="true"><div className="cloud one"></div><div className="cloud two"></div><div className="cloud three"></div></div><div className="grain"></div>

<main className="stage" aria-label="Invitación de cumpleaños de Ale">
<section className={`slide intro ${current === 0 ? "active" : ""}`} aria-hidden={current !== 0} inert={current !== 0} aria-label="Bienvenida">
<div className="text"><h1>Para mi<br />persona<br /><em>favorita.</em></h1><p className="copy">Hoy quiero darte las gracias por estar en mi vida. Que este cumpleaños sea diferente a los demás y esté lleno de cosas bonitas para ti.</p><button className="primary" onClick={start}>Una sorpresa para ti <span aria-hidden="true">↗</span></button></div>
<div className="art"><svg className="house" viewBox="0 0 440 580" role="img" aria-label="Una casita de colores elevada por muchos globos, inspirada en Up"><defs><linearGradient id="shine" x2="1" y2="1"><stop stopColor="white" stopOpacity=".32"/><stop offset="1" stopColor="white" stopOpacity="0"/></linearGradient></defs><Balloons /><g transform="translate(140 345) rotate(-5 85 75)"><path d="M5 70L80 7l85 63" fill="#5a7479" stroke="#42616c" strokeWidth="4"/><path d="M18 68h130v111H18z" fill="#e9cc7c"/><path d="M97 56h56v123H97z" fill="#a8c4ad"/><path d="M92 58l34-32 34 32z" fill="#d08f7d"/><path d="M102 58h47v7h-47" fill="#f9e8c7"/><path d="M-1 75l81-67 22 19" fill="none" stroke="#f7edd5" strokeWidth="7"/><path d="M33 33V2h18v17" fill="#bf7864"/><path d="M32 91h29v36H32zM110 78h25v33h-25z" fill="#709ba8" stroke="#fff3d5" strokeWidth="5"/><path d="M47 92v34m-14-17h27m62-30v30m-10-15h22" stroke="#f7e7c6" strokeWidth="3"/><path d="M69 121h26v58H69z" fill="#be7c68" stroke="#f5e1b1" strokeWidth="4"/><circle cx="87" cy="153" r="2" fill="#ffe9a3"/><path d="M13 141h52v38H13z" fill="#d1b294"/><path d="M9 142h57M14 148h51M22 143v33m17-33v33m17-33v33" stroke="#fff1d2" strokeWidth="4"/><path d="M6 179h152v7H6z" fill="#668b84"/><path d="M68 186h30v7H68zM62 193h42v6H62z" fill="#b1a894"/><path d="M110 132h24v29h-24z" fill="#799fad" stroke="#f9e8c7" strokeWidth="4"/></g></svg></div>
</section>
<section className={`slide ${current === 1 ? "active" : ""}`} aria-hidden={current !== 1} inert={current !== 1} aria-label="Recuerdos con amigos"><div><h2>Gracias<br />por estar<br /><em>a mi lado.</em></h2><p className="copy">Por escucharme, por hacerme compañía y por compartir tu tiempo conmigo. Tenerte cerca significa mucho para mí.</p></div><figure className="photo landscape"><img src="/assets/foto-1.jpeg" alt="Un recuerdo de Ale junto a un grupo de amigos" /></figure></section>
<section className={`slide ${current === 2 ? "active" : ""}`} aria-hidden={current !== 2} inert={current !== 2} aria-label="Momentos compartidos"><div><h2>Gracias<br />por ser<br /><em>tan especial.</em></h2><p className="copy">Por tu forma de ser, por tus detalles y por el cariño que das. Quizá no te lo digo tanto, pero valoro mucho tenerte en mi vida.</p></div><figure className="photo tilt"><img src="/assets/foto-2.jpeg" alt="Ale y sus amigos compartiendo una celebración navideña" /></figure></section>
<section className={`slide ${current === 3 ? "active" : ""}`} aria-hidden={current !== 3} inert={current !== 3} aria-label="Un día especial"><div><h2>Gracias<br />por hacerme<br /><em>sonreír.</em></h2><p className="copy">Por las ocurrencias, las conversaciones y esas risas que salen sin planearlas. Contigo, hasta un día cualquiera tiene algo bonito.</p></div><figure className="photo"><img src="/assets/foto-3.jpeg" alt="Un momento compartido entre Ale y una amiga en una sala de reuniones" /></figure></section>
<section className={`slide ${current === 4 ? "active" : ""}`} aria-hidden={current !== 4} inert={current !== 4} aria-label="Sonrisas"><div><h2>Gracias<br />por los pequeños<br /><em>grandes detalles.</em></h2><p className="copy">Un mensaje, un abrazo o un «¿cómo estás?». Esas cosas que parecen pequeñas hacen la diferencia. Gracias por hacerme sentir que te importo.</p></div><figure className="photo tilt"><img src="/assets/foto-4.jpeg" alt="Una amiga sonríe a la cámara mientras comparte un momento con Ale" /></figure></section>
<section className={`slide ${current === 5 ? "active" : ""}`} aria-hidden={current !== 5} inert={current !== 5} aria-label="Nuestro video"><div><h2>Gracias por ser<br />parte de<br /><em>mi aventura.</em></h2><p className="copy">Me quedo con cada risa y cada momento compartido. Qué suerte que nuestros caminos coincidieran. Ojalá nos esperen muchas aventuras más.</p></div><figure className="photo video-wrap"><video ref={videoRef} onEnded={() => { if (playing) go(6); }} src="/assets/recuerdo.mp4" playsInline muted controls preload="metadata"></video></figure></section>
<section className={`slide ${current === 6 ? "active" : ""}`} aria-hidden={current !== 6} inert={current !== 6} aria-label="Fecha, hora y lugar de la celebración"><div><h2>Ale, este día<br />es para<br /><em>celebrarte.</em></h2><p className="copy">Hoy toca agradecer que estés aquí y celebrar la persona tan especial que eres. Quiero que este cumpleaños te deje un recuerdo muy bonito.</p><div className="actions"><button className="primary" onClick={celebrate}>Importante escuchar <span>✦</span></button></div><audio ref={audioRef} src="/assets/cumple-ale.mp3" hidden onPlaying={() => setStatus('Reproduciendo audio ♫')} onPause={() => setStatus('Audio pausado')} onEnded={() => setStatus('Audio finalizado')} onError={() => setStatus('No se pudo cargar el audio. Vuelve a intentarlo.')} preload="auto" aria-label="Audio de cumpleaños para Ale"  /><p id="audio-status" className="sr-only" role="status">{status}</p></div><div className="ticket"><div className="star">✧</div><div className="ticket-label">TU PASE A UNA NOCHE ESPECIAL</div><h3>3 de octubre</h3><div className="month">GUARDA LA FECHA</div><div className="line"></div><div className="detail"><span>HORA</span><strong>7:30 p. m.</strong></div><div className="detail"><span>DESTINO</span><strong>Pasquale</strong></div><div className="line"></div><div className="ticket-foot">Importante guardar<br />toda la noche</div></div></section>
</main>
<nav className="nav" aria-label="Navegar por la invitación">
<button onClick={() => go(current - 1)} disabled={current === 0} aria-label="Recuerdo anterior">←</button>
<div className="dots">{Array.from({length:7},(_,i)=><button key={i} className={i===current ? 'current' : ''} aria-label={`Ir a la página ${i+1}`} aria-current={i===current ? 'step' : undefined} onClick={()=>go(i)} />)}</div>
<button onClick={() => go(current + 1)} disabled={current === 6} aria-label="Siguiente recuerdo">→</button>
<button onClick={togglePlaying} aria-label={playing ? 'Pausar presentación automática' : 'Iniciar presentación automática'}>{playing ? 'Ⅱ' : '▶'}</button>
<span className="counter">0{current+1} / 07</span>
</nav>

{confetti.map(({id,...style})=><i key={id} className="petal" style={style} aria-hidden="true" />)}
</>;
}
