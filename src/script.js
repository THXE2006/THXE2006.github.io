// ====== ใส่ของตัวเองตรงนี้ ======
const PASS='2005';     // รหัสผ่าน 4 หลัก
const TAPS=5;          // จำนวนครั้งที่ต้องกด "เปิด" ในหน้าแรก
const PHOTOS=[         // รูปในฟิล์ม ใส่ทีละบรรทัด เช่น 'photos/1.jpg',
  '../photos/1.jpg',
  '../photos/2.jpg',
  '../photos/3.jpg',
  '../photos/4.jpg',
  '../photos/5.jpg',
  '../photos/6.jpg'
];
const MUSIC='../music/Stephen Sanchez - Until I Found You (Official Video).mp3';        // เพลงพื้นหลัง เช่น 'music/song.mp3'
const VIDEO='../video/main-video.mp4';        // คลิปในจดหมาย เช่น 'video/hello.mp4'
// ================================
const N=PHOTOS.length||6;
const $=s=>document.querySelector(s), b=document.body, s1=$('#s1'), s2=$('#s2'), panel=$('#panel');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

function show(n){
  if(n===3){s2.classList.remove('on');setTimeout(()=>{b.dataset.s=3;scrollTo(0,0);watch();rain()},reduce?0:600);return}
  b.dataset.s=n;s1.classList.toggle('on',n===1);s2.classList.toggle('on',n===2);
}
let taps=0,busy=false,base=null,pos=null;
const inset=k=>parseFloat(getComputedStyle(document.documentElement)[k])||0;
$('#open').onclick=e=>{
  if(busy)return;
  sync();
  if(++taps>=TAPS){busy=true;$('#mail').classList.add('pop');setTimeout(()=>show(2),reduce?0:550);return}
  const o=e.currentTarget;
  if(!base){const r=o.getBoundingClientRect();base={x:r.left,y:r.top,w:r.width,h:r.height};pos={x:r.left,y:r.top}}
  const m=16,x0=m,x1=innerWidth-base.w-m,y0=inset('paddingTop')+m,y1=innerHeight-base.h-inset('paddingBottom')-50;
  let x,y,i=0;
  do{x=x0+Math.random()*(x1-x0);y=y0+Math.random()*(y1-y0)}while(Math.hypot(x-pos.x,y-pos.y)<110&&++i<12);
  pos={x,y};o.style.transform=`translate(${x-base.x}px,${y-base.y}px)`;
};

let code='',lock=false;
const dg=[...document.querySelectorAll('#dg span')];
const paint=()=>dg.forEach((d,i)=>d.textContent=code[i]||'');
[1,2,3,4,5,6,7,8,9,'',0,'⌫'].forEach(k=>{
  const e=document.createElement('button');e.textContent=k;
  if(k==='')e.className='ghost',e.disabled=true; else e.onclick=()=>press(k);
  if(k==='⌫')e.setAttribute('aria-label','ลบ');
  $('#pad').append(e);
});
function press(k){
  if(lock)return;
  if(k==='⌫')code=code.slice(0,-1); else if(code.length<4)code+=k;
  paint();
  if(code.length===4){
    lock=true;
    if(code===PASS)setTimeout(()=>show(3),350);
    else{panel.classList.add('shake');setTimeout(()=>{panel.classList.remove('shake');code='';paint();lock=false},600)}
  }
}
addEventListener('keydown',e=>{if(b.dataset.s!=='2')return;if(/^\d$/.test(e.key))press(e.key);if(e.key==='Backspace')press('⌫')});

const film=$('#film');
for(let i=0;i<N;i++){
  const d=document.createElement('div');d.className='slot';
  d.innerHTML=PHOTOS[i]?`<img src="${PHOTOS[i]}" alt="">`:`<span>♡<br>รูปที่ ${i+1}</span>`;
  film.append(d);
}
function watch(){
  const els=[...film.children];
  if(!('IntersectionObserver' in window)){els.forEach(e=>e.classList.add('in'));return}
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.2});
  els.forEach(e=>io.observe(e));
}
function rain(){
  if(reduce)return;
  const set=['💖','💗','🎂','✨','💕'];
  for(let i=0;i<22;i++){
    const h=document.createElement('i');h.className='fall';h.textContent=set[i%5];
    h.style.cssText=`left:${Math.random()*100}vw;animation-delay:${Math.random()*1.6}s;font-size:${16+Math.random()*16}px`;
    document.body.append(h);setTimeout(()=>h.remove(),5200);
  }
}
const vid=$('#vid'),L=$('#letter');
$('#env').onclick=()=>{
  L.classList.add('on');
  if(!VIDEO){vid.hidden=true;$('#empty').hidden=false;return}
  if(!vid.getAttribute('src'))vid.src=VIDEO;
  vid.play().catch(()=>{vid.muted=true;vid.play()});
};
function shut(){L.classList.remove('on');vid.pause();vid.currentTime=0;inVideo=false;sync()}
$('#close').onclick=shut;
L.onclick=e=>{if(e.target===L)shut()};

const bgm=$('#bgm'),disc=$('#disc');
let want=true,inVideo=false;
function sync(){
  disc.classList.toggle('off',!want);
  if(!MUSIC)return;
  if(want&&!inVideo&&!document.hidden){
    if(!bgm.getAttribute('src')){bgm.src=MUSIC;bgm.volume=.6}
    bgm.play().catch(()=>{});
  }else bgm.pause();
}
disc.onclick=()=>{want=!want;disc.setAttribute('aria-pressed',want);sync()};
vid.onplay=()=>{inVideo=true;sync()};
vid.onended=()=>{inVideo=false;sync()};
document.addEventListener('visibilitychange',sync);
