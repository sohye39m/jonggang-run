// 담당: inayun059-afk — 배경, 도로, 물체 그리기, 효과 (SPEC.md 7절).
// 프로토타입의 그리기 코드를 옮긴 파일. 규칙 값은 JR.state.run에서 읽기만 한다.
// 점프와 과제 더미는 옮기지 않는다. 그림이 아직 없으면 그 그림만 건너뛴다.
(() => {
  const JR = (window.JR = window.JR || {});
  const { ZP, ZNEAR, ZFAR, LANES, reduceMotion } = JR.config;

  let cv = null, ctx = null;
  let S = null; // JR.state.run (읽기만 한다)

  // 효과, 궤적, 흔들림 (프로토타입에서는 S 안에 있던 값)
  let fx = [], trail = [], shake = 0, flash = 0, flashCol = '200,240,255';

  function mulberry(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}

  let sky=null,twinkles=[],SKYW=0;
  function gauss(r){return(r()+r()+r()+r()-2)/2}
  function buildSky(){
    SKYW=Math.ceil(W*1.25);
    sky=document.createElement('canvas');sky.width=Math.round(SKYW*DPR);sky.height=Math.round(H*DPR);
    const s=sky.getContext('2d');s.setTransform(DPR,0,0,DPR,0,0);
    const g=s.createLinearGradient(0,0,0,H);
    g.addColorStop(0,'#02030a');g.addColorStop(.3,'#050a1e');g.addColorStop(.42,'#0b1636');g.addColorStop(.6,'#060c22');g.addColorStop(1,'#020309');
    s.fillStyle=g;s.fillRect(0,0,SKYW,H);
    const r=mulberry(9);
    const blob=(x,y,rad,col,a)=>{const rg=s.createRadialGradient(x,y,0,x,y,rad);rg.addColorStop(0,`rgba(${col},${a})`);rg.addColorStop(1,`rgba(${col},0)`);s.fillStyle=rg;s.fillRect(x-rad,y-rad,rad*2,rad*2)};
    // nebula clouds
    s.globalCompositeOperation='lighter';
    for(let i=0;i<10;i++)blob(SKYW*(.08+r()*.3),H*(.08+r()*.25),H*(.12+r()*.18),'110,90,255',.05);
    for(let i=0;i<10;i++)blob(SKYW*(.6+r()*.35),H*(.05+r()*.22),H*(.1+r()*.16),'255,110,170',.03);
    // milky way band (diagonal)
    const A=[-.1*SKYW,H*.52],B=[1.1*SKYW,H*.02];
    const along=t=>[A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t];
    const nx=-(B[1]-A[1]),ny=(B[0]-A[0]);const nl=Math.hypot(nx,ny);const N=[nx/nl,ny/nl];
    const cols=['87,242,192','70,198,255','130,140,255','255,140,190','255,236,210'];
    for(let i=0;i<260;i++){
      const t=r(),[x,y]=along(t),o=gauss(r)*H*.09;
      const core=Math.exp(-Math.pow((t-.55)/.18,2));
      const c=core>.6&&r()<.5?cols[4]:cols[Math.floor(r()*4)];
      blob(x+N[0]*o,y+N[1]*o,H*(.03+r()*.09),c,.03+core*.04);
    }
    // dust lanes
    s.globalCompositeOperation='source-over';
    for(let i=0;i<120;i++){const t=r(),[x,y]=along(t),o=gauss(r)*H*.025+H*.01;blob(x+N[0]*o,y+N[1]*o,H*(.012+r()*.035),'2,3,10',.35)}
    // stars, concentrated along the band
    s.globalCompositeOperation='lighter';
    const count=Math.floor(SKYW*H/900);
    for(let i=0;i<count;i++){
      let x,y;if(r()<.62){const t=r(),p=along(t),o=gauss(r)*H*.08;x=p[0]+N[0]*o;y=p[1]+N[1]*o}else{x=r()*SKYW;y=r()*H}
      const m=r();s.fillStyle=`rgba(${m>.85?'200,225,255':m>.7?'255,235,215':'235,240,255'},${.15+m*.6})`;
      const sz=m>.97?1.8:m>.8?1.2:.8;s.fillRect(x,y,sz,sz);
    }
    // bright stars with flares
    for(let i=0;i<18;i++){
      const x=r()*SKYW,y=r()*H*.9,L=6+r()*12;
      blob(x,y,L*1.4,'190,220,255',.35);
      s.strokeStyle='rgba(220,235,255,.55)';s.lineWidth=.8;s.beginPath();s.moveTo(x-L,y);s.lineTo(x+L,y);s.moveTo(x,y-L);s.lineTo(x,y+L);s.stroke();
      s.fillStyle='#fff';s.fillRect(x-1,y-1,2,2);
    }
    s.globalCompositeOperation='source-over';
    twinkles=[];for(let i=0;i<60;i++)twinkles.push({x:r()*SKYW,y:r()*H*.95,p:r()*6.28,s:.8+r()*1.6,f:1+r()*2});
  }

  // constellations (design-student themed): laptop, speech bubble, pencil — in unit space
  const CONST=[
    {ox:.06,oy:.1,sc:.16,col:'143,140,255',pts:[[0,.2],[.7,.05],[.85,.6],[.15,.75],[0,.2],[-.08,.95],[.95,.82],[.85,.6]],nodes:[0,1,2,3,5,6]},
    {ox:.33,oy:.06,sc:.12,col:'143,160,255',pts:[[.1,0],[.9,0],[1,.25],[.9,.55],[.4,.55],[.2,.8],[.25,.55],[.1,.55],[0,.3],[.1,0]],nodes:[0,1,2,3,4,5,7,8],dots:[[.35,.28],[.52,.28],[.69,.28]]},
    {ox:.2,oy:.36,sc:.13,col:'110,230,220',pts:[[0,0],[.15,-.08],[.95,.5],[.88,.62],[0,0],[-.04,.14],[.88,.62]],nodes:[0,1,2,3,5]}
  ];
  let shooters=[],shootT=2;

  function drawSky(t){
    const off=-(SKYW-W)/2-camX*W*.06;
    ctx.drawImage(sky,off,0,SKYW,H);
    ctx.save();ctx.globalCompositeOperation='lighter';
    for(const s of twinkles){const a=.25+.6*Math.pow(.5+.5*Math.sin(t*s.f+s.p),3);ctx.fillStyle=`rgba(230,240,255,${a})`;ctx.beginPath();ctx.arc(s.x+off,s.y,s.s*.6,0,6.283);ctx.fill()}
    // constellations
    const u=Math.min(W,H*1.6);
    for(const c of CONST){
      const bx=c.ox*W+off*.3,by=c.oy*H,S=c.sc*u;
      ctx.strokeStyle=`rgba(${c.col},.32)`;ctx.lineWidth=1;ctx.beginPath();
      c.pts.forEach((p,i)=>{const x=bx+p[0]*S,y=by+p[1]*S;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke();
      const nodes=c.nodes.map(i=>c.pts[i]).concat(c.dots||[]);
      nodes.forEach((p,i)=>{const x=bx+p[0]*S,y=by+p[1]*S,pl=.6+.4*Math.sin(t*2+i);
        const g=ctx.createRadialGradient(x,y,0,x,y,7);g.addColorStop(0,`rgba(${c.col},${.9*pl})`);g.addColorStop(1,`rgba(${c.col},0)`);ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,7,0,6.283);ctx.fill();
        ctx.fillStyle=`rgba(240,245,255,${pl})`;ctx.beginPath();ctx.arc(x,y,1.6,0,6.283);ctx.fill()});
    }
    // shooting stars
    for(const s of shooters){
      const tail=90;const a=Math.max(0,s.life);
      const g=ctx.createLinearGradient(s.x,s.y,s.x-s.vx*tail/600,s.y-s.vy*tail/600);g.addColorStop(0,`rgba(255,255,255,${a})`);g.addColorStop(1,'rgba(150,200,255,0)');
      ctx.strokeStyle=g;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(s.x,s.y);ctx.lineTo(s.x-s.vx*tail/600,s.y-s.vy*tail/600);ctx.stroke();
    }
    ctx.restore();
    // planet
    const pr=Math.min(W,H)*.2;if(JR.sprites.planet){ctx.globalAlpha=.92;ctx.drawImage(JR.sprites.planet,W*.8-pr+off*.15,H*.14-pr*.67,pr*2,pr*1.33);ctx.globalAlpha=1}
    // horizon glow
    ctx.save();ctx.translate(W/2,HZ);ctx.scale(1,.3);
    const hg=ctx.createRadialGradient(0,0,0,0,0,W*.6);hg.addColorStop(0,'rgba(90,170,255,.24)');hg.addColorStop(.5,'rgba(120,110,255,.07)');hg.addColorStop(1,'rgba(90,170,255,0)');
    ctx.fillStyle=hg;ctx.beginPath();ctx.arc(0,0,W*.6,0,6.283);ctx.fill();ctx.restore();
  }

  function resize(){
    if(!cv){cv=document.getElementById('c');ctx=cv.getContext('2d')}
    DPR=Math.min(window.devicePixelRatio||1,2);
    W=cv.clientWidth;H=cv.clientHeight;
    cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);
    ctx.setTransform(DPR,0,0,DPR,0,0);
    HZ=H*.44;K=(H*.86-HZ)*ZP;KX=Math.min(W*.4,H*.58)*ZP;
    buildSky();
  }

  let camX=0;
  function P(lx,z,h=0){const s=KX/z;return{x:W/2+(lx-camX)*s,y:HZ+K/z-h*s,s}}

  // 먼지
  let dust=null;
  function newDust(any){return{lx:(Math.random()*2-1)*3,h:Math.random()*1.8-.2,z:any?ZNEAR+Math.random()*ZFAR:ZFAR*(.5+Math.random()*.5),c:Math.random()<.5?'200,225,255':'170,160,255'}}

  // 효과
  function burst(x,y,col,n,spd){for(let i=0;i<n;i++){const a=Math.random()*6.283,v=spd*(.4+Math.random());fx.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-spd*.4,life:1,col,r:1.5+Math.random()*2.5})}}
  function popText(x,y,txt,col){fx.push({x,y,vx:0,vy:-46,life:1.1,txt,col})}
  function confetti(){const cols=['255,207,110','87,242,192','70,198,255','255,120,160','160,150,255'];for(let i=0;i<140;i++){fx.push({x:W*Math.random(),y:-10-Math.random()*H*.3,vx:(Math.random()-.5)*60,vy:60+Math.random()*120,life:2.2,col:cols[i%5],r:2+Math.random()*3,conf:true,rot:Math.random()*6})}}

  function fogT(z){return Math.min(1,Math.max(0,(z-12)/(ZFAR-12)))}
  function fadeA(z){return 1-Math.min(1,Math.max(0,(z-ZFAR*.7)/(ZFAR*.3)))}

  function drawRoad(){
    const N=60,zAt=i=>ZNEAR+(ZFAR-ZNEAR)*Math.pow(i/N,1.9);
    for(let i=N;i>0;i--){
      const z1=zAt(i),z0=zAt(i-1),a=P(-1,z0),b=P(1,z0),c=P(1,z1),d=P(-1,z1);
      const band=Math.floor((z0+S.dist)/3.2)&1,f=fogT(z0);
      const base=band?[16,24,58]:[11,17,44];const fogc=[40,60,120];
      const col=base.map((v,k)=>v+(fogc[k]-v)*f);
      ctx.fillStyle=`rgba(${col[0]|0},${col[1]|0},${col[2]|0},${.86-f*.3})`;
      ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y+.6);ctx.lineTo(d.x,d.y+.6);ctx.closePath();ctx.fill();
    }
    // galaxy reflection on the glass track
    ctx.save();ctx.globalCompositeOperation='lighter';
    const rg=ctx.createLinearGradient(0,HZ,0,H);rg.addColorStop(0,'rgba(120,140,255,.28)');rg.addColorStop(.3,'rgba(70,198,255,.07)');rg.addColorStop(1,'rgba(70,198,255,0)');
    ctx.fillStyle=rg;const fl=P(-1,ZFAR),fr=P(1,ZFAR),nl=P(-1,ZNEAR),nr=P(1,ZNEAR);
    ctx.beginPath();ctx.moveTo(fl.x,fl.y);ctx.lineTo(fr.x,fr.y);ctx.lineTo(nr.x,nr.y);ctx.lineTo(nl.x,nl.y);ctx.closePath();ctx.fill();
    // cross grid lines
    const G=3.2,go=S.dist%G;
    for(let z=ZNEAR+G-go;z<ZFAR;z+=G){const a=P(-1,z),b=P(1,z);ctx.strokeStyle=`rgba(140,170,255,${.12*(1-fogT(z))})`;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}
    ctx.restore();
    // edges
    const eg=ctx.createLinearGradient(0,HZ,0,H);eg.addColorStop(0,'rgba(143,140,255,0)');eg.addColorStop(.15,'rgba(143,140,255,.6)');eg.addColorStop(1,'rgba(120,230,255,1)');
    ctx.save();ctx.strokeStyle=eg;ctx.shadowColor='rgba(110,180,255,.95)';ctx.shadowBlur=14;ctx.lineWidth=2.2;
    for(const s of[-1,1]){ctx.beginPath();for(let i=0;i<=N;i++){const p=P(s,zAt(i));i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y)}ctx.stroke()}
    ctx.restore();
    // lane dashes
    const L=6,off=S.dist%L;
    for(const lx of[-.31,.31])for(let z=ZNEAR+L-off;z<ZFAR;z+=L){const p0=P(lx,z),p1=P(lx,Math.min(ZFAR,z+2.2));ctx.strokeStyle=`rgba(210,225,255,${.34*fadeA(z)*(1-fogT(z)*.6)})`;ctx.lineWidth=Math.max(1,p0.s*.012);ctx.beginPath();ctx.moveTo(p0.x,p0.y);ctx.lineTo(p1.x,p1.y);ctx.stroke()}
    // floating star beacons
    const PL=9,po=S.dist%PL;const zs=[];for(let z=ZNEAR+PL-po;z<ZFAR;z+=PL)zs.push(z);zs.reverse();
    ctx.save();ctx.globalCompositeOperation='lighter';
    zs.forEach((z,i)=>{for(const s of[-1.22,1.22]){const tp=P(s,z,.38),a=fadeA(z),r=Math.max(1.5,tp.s*.03);const col=(Math.floor((z+S.dist)/PL)+(s>0?1:0))%2?'87,242,192':'143,140,255';
      const g=ctx.createRadialGradient(tp.x,tp.y,0,tp.x,tp.y,r*6);g.addColorStop(0,`rgba(255,255,255,${a})`);g.addColorStop(.18,`rgba(${col},${.6*a})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.beginPath();ctx.arc(tp.x,tp.y,r*6,0,6.283);ctx.fill()}});
    ctx.restore();
  }

  function shadow(lx,z,w,a){const p=P(lx,z);ctx.fillStyle=`rgba(0,2,10,${.5*a})`;ctx.beginPath();ctx.ellipse(p.x,p.y,w*p.s,w*p.s*.22,0,0,6.283);ctx.fill()}
  function sprite(img,lx,z,h,lift=0,alpha=1){const p=P(lx,z,lift);if(!img)return p;const hp=h*p.s,wp=hp*img.width/img.height;ctx.globalAlpha=alpha;ctx.drawImage(img,p.x-wp/2,p.y-hp,wp,hp);ctx.globalAlpha=1;return p}

  function drawObj(o,t){
    const a=fadeA(o.z);
    if(o.t==='angry'){shadow(o.lx,o.z,.2,a);const wob=Math.sin(t*6+o.seed*9)*.01;sprite(JR.sprites.angry,o.lx+wob,o.z,.78,0,a)}
    else if(o.t==='coin'){shadow(o.lx,o.z,.07,a*.7);const bob=Math.sin(t*3+o.seed*6)*.03;const sp=1+Math.sin(t*5+o.seed*6)*.05;sprite(JR.sprites.coin,o.lx,o.z,.3*sp,.12+bob,a)}
    else if(o.t==='finish'){
      shadow(0,o.z,.4,1);
      // finish gate: arc of light over the track
      const l=P(-1,o.z),r=P(1,o.z),top=P(0,o.z,1.25);
      ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(255,207,110,.9)';ctx.shadowColor='#ffcf6e';ctx.shadowBlur=18;ctx.lineWidth=Math.max(2,l.s*.02);
      ctx.beginPath();ctx.moveTo(l.x,l.y);ctx.bezierCurveTo(l.x,top.y,r.x,top.y,r.x,r.y);ctx.stroke();
      ctx.fillStyle='rgba(255,207,110,.25)';ctx.fillRect(l.x,l.y-l.s*.02,r.x-l.x,l.s*.04);
      ctx.restore();
      sprite(JR.sprites.finish,.08,o.z,1.25,0,1);
    }
  }

  function drawPlayer(t){
    const g0=P(S.x,ZP),sh=1;
    ctx.fillStyle=`rgba(0,2,10,${.55*sh})`;ctx.beginPath();ctx.ellipse(g0.x,g0.y,g0.s*.16*sh+2,g0.s*.035*sh+1,0,0,6.283);ctx.fill();
    ctx.save();ctx.globalCompositeOperation='lighter';
    const lp=ctx.createRadialGradient(g0.x,g0.y,0,g0.x,g0.y,g0.s*.3);lp.addColorStop(0,`rgba(110,190,255,${.3*sh})`);lp.addColorStop(1,'rgba(110,190,255,0)');
    ctx.fillStyle=lp;ctx.beginPath();ctx.ellipse(g0.x,g0.y,g0.s*.3,g0.s*.08,0,0,6.283);ctx.fill();
    // trail
    const pts=trail.map(q=>{const z=ZP-(S.dist-q.d);return z>ZNEAR?P(q.lx,z,q.h):null}).filter(Boolean);
    for(let i=1;i<pts.length;i++){const f=i/pts.length,a=pts[i-1],b=pts[i];ctx.strokeStyle=`rgba(${f>.5?'120,210,255':'143,140,255'},${.22*f})`;ctx.lineWidth=Math.max(1,b.s*.035*f);ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}
    // jet flame from under the laptop (toward camera)
    const lift=.03;const base=P(S.x,ZP,lift);const fl=S.speed>1?1:0;
    if(fl){const L=base.s*(.1+.03*Math.sin(t*40))*(.6+S.speed/36*.5);
      for(const dx of[-.08,.08]){const fx=base.x+dx*base.s,fy=base.y;const g=ctx.createLinearGradient(fx,fy,fx,fy+L);g.addColorStop(0,'rgba(220,245,255,.95)');g.addColorStop(.35,'rgba(90,180,255,.7)');g.addColorStop(1,'rgba(90,120,255,0)');
        ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(fx-base.s*.03,fy);ctx.quadraticCurveTo(fx,fy+L*1.2,fx+base.s*.03,fy);ctx.closePath();ctx.fill()}}
    ctx.restore();
    const blink=S.inv>0&&Math.floor(S.inv*12)%2===0;
    const tilt=(LANES[S.lane]-S.x)*.5;
    const img=JR.sprites.player;if(!img)return;
    const p=P(S.x,ZP,lift),hp=.44*p.s,wp=hp*img.width/img.height;
    ctx.save();ctx.globalAlpha=blink?.35:1;ctx.translate(p.x,p.y);ctx.rotate(tilt);ctx.drawImage(img,-wp/2,-hp,wp,hp);ctx.restore();
  }
  function drawDust(){
    ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';
    for(const d of dust){const a=P(d.lx,d.z,d.h),b=P(d.lx,d.z+Math.max(.4,S.speed*.03),d.h);const al=(1-fogT(d.z))*.55;if(al<=.02)continue;
      ctx.strokeStyle=`rgba(${d.c},${al})`;ctx.lineWidth=Math.max(.6,a.s*.006);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}
    ctx.restore();
  }
  function drawFx(){
    for(const f of fx){
      const a=Math.max(0,Math.min(1,f.life));
      if(f.txt){ctx.globalAlpha=a;ctx.fillStyle=`rgb(${f.col})`;ctx.font="800 17px 'Gothic A1', sans-serif";ctx.textAlign='center';ctx.lineWidth=4;ctx.strokeStyle='rgba(3,5,12,.7)';ctx.strokeText(f.txt,f.x,f.y);ctx.fillText(f.txt,f.x,f.y);ctx.globalAlpha=1;continue}
      if(f.conf){ctx.save();ctx.translate(f.x,f.y);ctx.rotate(f.rot);ctx.fillStyle=`rgba(${f.col},${a})`;ctx.fillRect(-f.r,-f.r*.5,f.r*2,f.r);ctx.restore();continue}
      ctx.fillStyle=`rgba(${f.col},${a})`;ctx.beginPath();ctx.arc(f.x,f.y,f.r,0,6.283);ctx.fill();
    }
  }

  function render(t){
    ctx.save();
    if(shake>0){const m=shake*10;ctx.translate((Math.random()-.5)*m,(Math.random()-.5)*m)}
    drawSky(t);
    drawRoad();
    const list=S.objs.filter(o=>!o.done).sort((a,b)=>b.z-a.z);
    let drawn=false;
    for(const o of list){if(!drawn&&o.z<ZP){drawPlayer(t);drawn=true}drawObj(o,t)}
    if(!drawn)drawPlayer(t);
    drawDust();drawFx();
    const v=ctx.createRadialGradient(W/2,H*.55,Math.min(W,H)*.35,W/2,H*.55,Math.max(W,H)*.8);
    v.addColorStop(0,'rgba(2,3,10,0)');v.addColorStop(1,'rgba(2,3,10,.62)');ctx.fillStyle=v;ctx.fillRect(-20,-20,W+40,H+40);
    if(flash>0){ctx.fillStyle=`rgba(${flashCol},${flash*.28})`;ctx.fillRect(-20,-20,W+40,H+40)}
    ctx.restore();
  }

  dust = [];
  for (let i = 0; i < 80; i++) dust.push(newDust(true));
  addEventListener('resize', resize); // 창 크기가 바뀌면 다시 계산한다


  JR.world = {
    resize,
    // 효과, 궤적, 흔들림 초기화
    reset() {
      fx = [];
      trail = [];
      shake = 0;
      flash = 0;
      flashCol = '200,240,255';
    },
    // 먼지, 유성, 효과, 궤적, 카메라 진행. 일시정지 중에는 호출되지 않는다
    tick(dt, step) {
      S = JR.state.run;
      camX += (S.x * 0.55 - camX) * Math.min(1, dt * 5);
      trail.push({ lx: S.x, h: 0.12, d: S.dist });
      while (trail.length && S.dist - trail[0].d > 0.95) trail.shift();
      for (const d of dust) {
        d.z -= step * 1.1;
        if (d.z < ZNEAR) Object.assign(d, newDust(false));
      }
      for (const f of fx) {
        f.life -= dt * (f.conf ? 0.45 : f.txt ? 1 : 1.6);
        f.x += f.vx * dt;
        f.y += f.vy * dt;
        if (f.conf) {
          f.rot += dt * 6;
          f.vx += Math.sin(f.y * 0.02) * 10 * dt;
        } else if (!f.txt) f.vy += 260 * dt;
      }
      fx = fx.filter((f) => f.life > 0 && f.y < H + 40);
      shake = Math.max(0, shake - dt * 2.2);
      flash = Math.max(0, flash - dt * 2.5);
      shootT -= dt;
      if (shootT <= 0) {
        shootT = 2.5 + Math.random() * 4;
        const a = 0.55 + Math.random() * 0.3;
        shooters.push({ x: W * (0.3 + Math.random() * 0.8), y: H * (0.02 + Math.random() * 0.18), vx: -Math.cos(a) * 600, vy: Math.sin(a) * 600, life: 1 });
      }
      for (const s of shooters) {
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.life -= dt * 1.4;
      }
      shooters = shooters.filter((s) => s.life > 0);
    },
    // 한 프레임 그리기 (t는 초)
    render(t) {
      S = JR.state.run;
      render(t);
    },
    // 따봉 획득 효과와 +1 👍
    fxCoin(lx, z) {
      const p = P(lx, z, 0.3);
      burst(p.x, p.y, '255,207,110', 10, 120);
      popText(p.x, p.y - 24, '+1 👍', '255,226,163');
    },
    // 충돌 효과: 붉은 번쩍임, 흔들림, 파편, 잔소리 −5
    fxHit(x) {
      flash = 1;
      flashCol = '255,90,110';
      shake = reduceMotion ? 0 : 1;
      const p = P(x, ZP, 0.3);
      burst(p.x, p.y, '255,120,140', 26, 220);
      popText(p.x, p.y - 40, '잔소리 −5', '255,140,160');
    },
    // 색종이
    fxFinish() {
      confetti();
    },
  };
})();
