// 담당: inayun059-afk — 와우, 교수님 등 그림 (SPEC.md 4절, 7절).
// 프로토타입의 SPRITES 구역을 옮긴 파일.
// player는 와우 완성(#12, #15) 전까지 콩알이를 임시로 쓴다. 과제 더미(pile)는 옮기지 않는다.
(() => {
  const JR = (window.JR = window.JR || {});

  function mk(w, h, fn) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const g = c.getContext('2d');
    fn(g, w, h);
    return c;
  }

  const SKIN0='#ffe8d4',SKIN1='#f3c8a4',SKIN2='#d79a74';
  function skinGrad(g,x,y,r){const s=g.createRadialGradient(x-r*.35,y-r*.4,r*.05,x,y,r*1.15);s.addColorStop(0,SKIN0);s.addColorStop(.55,SKIN1);s.addColorStop(1,SKIN2);return s}

  function mirrorHalf(g,cx,fn){fn(1);g.save();g.translate(cx*2,0);g.scale(-1,1);fn(-1);g.restore()}

  function profHead(g,cx,cy,R,mood){
    const RED=mood==='angry';
    const SG=(x,y,r)=>{if(!RED)return skinGrad(g,x,y,r);const s=g.createRadialGradient(x-r*.35,y-r*.4,r*.05,x,y,r*1.15);s.addColorStop(0,'#ffb3a3');s.addColorStop(.5,'#f2574c');s.addColorStop(1,'#a8211f');return s};
    // ears
    for(const s of[-1,1]){
      const ex=cx+s*R*.97,ey=cy+R*.12;
      g.fillStyle=SG(ex,ey,R*.28);g.beginPath();g.ellipse(ex,ey,R*.19,R*.27,0,0,6.283);g.fill();
      g.fillStyle='rgba(190,120,95,.45)';g.beginPath();g.ellipse(ex+s*R*.02,ey,R*.09,R*.15,0,0,6.283);g.fill();
    }
    // face
    g.fillStyle=SG(cx,cy,R);g.beginPath();g.ellipse(cx,cy+R*.06,R,R*.96,0,0,6.283);g.fill();
    if(RED){ // steam puffs from both sides of the head
      for(const s of[-1,1])for(let i=0;i<3;i++){const px=cx+s*R*(1.15+i*.18),py=cy-R*(.25+i*.3),pr=R*(.13+i*.05);
        const sg=g.createRadialGradient(px,py,0,px,py,pr);sg.addColorStop(0,'rgba(255,255,255,.95)');sg.addColorStop(1,'rgba(230,236,255,.55)');g.fillStyle=sg;g.beginPath();g.arc(px,py,pr,0,6.283);g.fill()}
    }
    // hair (pompadour)
    const hg=g.createLinearGradient(cx-R,cy-R*1.5,cx+R,cy-R*.3);hg.addColorStop(0,'#3a3b44');hg.addColorStop(.5,'#16171c');hg.addColorStop(1,'#0a0a0d');
    g.fillStyle=hg;
    g.beginPath();
    g.moveTo(cx-R*1.02,cy+R*.1);
    g.bezierCurveTo(cx-R*1.16,cy-R*.75,cx-R*.6,cy-R*1.28,cx+R*.05,cy-R*1.2);
    g.bezierCurveTo(cx+R*.62,cy-R*1.3,cx+R*1.14,cy-R*.82,cx+R*1.02,cy+R*.1);
    g.bezierCurveTo(cx+R*.92,cy-R*.42,cx+R*.55,cy-R*.56,cx+R*.05,cy-R*.52);
    g.bezierCurveTo(cx-R*.45,cy-R*.56,cx-R*.9,cy-R*.42,cx-R*1.02,cy+R*.1);
    g.fill();
    // swoop
    g.beginPath();
    g.moveTo(cx-R*.62,cy-R*1.02);
    g.bezierCurveTo(cx-R*.25,cy-R*1.62,cx+R*.62,cy-R*1.66,cx+R*.74,cy-R*1.3);
    g.bezierCurveTo(cx+R*.6,cy-R*1.44,cx+R*.38,cy-R*1.42,cx+R*.3,cy-R*1.18);
    g.closePath();g.fill();
    // hair strands
    g.strokeStyle='rgba(255,255,255,.13)';g.lineWidth=R*.035;g.lineCap='round';
    for(let i=0;i<6;i++){const o=i*.16;g.beginPath();g.moveTo(cx-R*(.8-o),cy-R*(.62+o*.25));g.quadraticCurveTo(cx-R*(.3-o),cy-R*(1.25+o*.08),cx+R*(.45+o*.3),cy-R*(1.12+o*.1));g.stroke()}
    // blush
    for(const s of[-1,1]){g.fillStyle=RED?'rgba(140,10,20,.35)':'rgba(255,150,160,.42)';g.beginPath();g.ellipse(cx+s*R*.64,cy+R*.42,R*.17,R*.11,0,0,6.283);g.fill()}
    // eyebrows
    g.strokeStyle='#121216';g.lineCap='round';g.lineWidth=RED?R*.15:R*.1;
    for(const s of[-1,1]){
      g.beginPath();
      if(mood==='angry'){g.moveTo(cx+s*R*.66,cy-R*.42);g.quadraticCurveTo(cx+s*R*.42,cy-R*.32,cx+s*R*.12,cy-R*.08)}
      else{g.moveTo(cx+s*R*.62,cy-R*.24);g.quadraticCurveTo(cx+s*R*.4,cy-R*.4,cx+s*R*.17,cy-R*.3)}
      g.stroke();
    }
    // eyes
    for(const s of[-1,1]){
      const ex=cx+s*R*.38,ey=cy+R*.1;
      if(mood==='happy'){g.strokeStyle='#121216';g.lineWidth=R*.07;g.beginPath();g.arc(ex,ey+R*.04,R*.1,Math.PI*1.1,Math.PI*1.9);g.stroke()}
      else{
        g.fillStyle='#fff';g.beginPath();g.ellipse(ex,ey,R*.15,R*.13,0,0,6.283);g.fill();
        g.fillStyle='#141418';g.beginPath();g.ellipse(ex-s*R*.02,ey+R*.02,R*.085,R*.1,0,0,6.283);g.fill();
        g.fillStyle='#fff';g.beginPath();g.arc(ex-s*R*.02+R*.03,ey-R*.02,R*.025,0,6.283);g.fill();
        if(mood==='angry'){g.fillStyle='#d63a33';g.beginPath();g.moveTo(ex-R*.17,ey-R*.14);g.lineTo(ex+R*.17,ey-R*.14);g.lineTo(ex+s*R*.17,ey-R*.04);g.closePath();g.fill()}
      }
    }
    // glasses
    g.strokeStyle='#3b2216';g.lineWidth=R*.055;
    for(const s of[-1,1]){g.beginPath();g.arc(cx+s*R*.38,cy+R*.1,R*.3,0,6.283);g.stroke();
      g.beginPath();g.moveTo(cx+s*R*.68,cy+R*.06);g.lineTo(cx+s*R*.93,cy+R*.02);g.stroke()}
    g.beginPath();g.moveTo(cx-R*.09,cy+R*.06);g.quadraticCurveTo(cx,cy-R*.02,cx+R*.09,cy+R*.06);g.stroke();
    g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=R*.03;
    for(const s of[-1,1]){g.beginPath();g.arc(cx+s*R*.38,cy+R*.1,R*.24,Math.PI*1.1,Math.PI*1.35);g.stroke()}
    // nose
    const ng=g.createRadialGradient(cx-R*.04,cy+R*.33,0,cx,cy+R*.37,R*.14);ng.addColorStop(0,'#ffd6c4');ng.addColorStop(1,'#e59b86');
    g.fillStyle=ng;g.beginPath();g.ellipse(cx,cy+R*.37,R*.13,R*.11,0,0,6.283);g.fill();
    // mouth
    if(mood==='angry'){g.fillStyle='#4a0d10';g.beginPath();g.ellipse(cx,cy+R*.8,R*.16,R*.08,0,Math.PI,Math.PI*2);g.fill();g.strokeStyle='#4a0d10';g.lineWidth=R*.05;g.stroke()}
    if(mood==='happy'){g.fillStyle='#7a2f2b';g.beginPath();g.ellipse(cx,cy+R*.72,R*.15,R*.1,0,0,Math.PI);g.fill()}
    // mustache
    const my=cy+R*.55;
    const mg=g.createLinearGradient(0,my-R*.15,0,my+R*.2);mg.addColorStop(0,'#2d2e35');mg.addColorStop(1,'#08080a');g.fillStyle=mg;
    mirrorHalf(g,cx,()=>{
      g.beginPath();g.moveTo(cx,my-R*.07);
      g.bezierCurveTo(cx+R*.14,my-R*.18,cx+R*.38,my-R*.14,cx+R*.46,my-R*.01);
      g.bezierCurveTo(cx+R*.52,my+R*.08,cx+R*.64,my+R*.03,cx+R*.66,my-R*.1);
      g.bezierCurveTo(cx+R*.66,my+R*.14,cx+R*.48,my+R*.22,cx+R*.3,my+R*.15);
      g.bezierCurveTo(cx+R*.18,my+R*.11,cx+R*.06,my+R*.09,cx,my+R*.1);
      g.closePath();g.fill();
    });
    g.strokeStyle='rgba(255,255,255,.14)';g.lineWidth=R*.025;
    for(const s of[-1,1]){g.beginPath();g.moveTo(cx+s*R*.08,my-R*.04);g.quadraticCurveTo(cx+s*R*.28,my-R*.1,cx+s*R*.42,my);g.stroke()}
  }

  function thumbsUp(g,x,y,S){
    // fist
    g.fillStyle=skinGrad(g,x,y,S*.7);
    g.beginPath();g.roundRect(x-S*.42,y-S*.22,S*.84,S*.72,S*.24);g.fill();
    // thumb
    g.beginPath();g.roundRect(x-S*.38,y-S*.72,S*.32,S*.62,S*.16);g.fill();
    g.strokeStyle='rgba(170,100,80,.35)';g.lineWidth=S*.035;g.lineCap='round';
    for(let i=0;i<3;i++){const yy=y-S*.02+i*S*.16;g.beginPath();g.moveTo(x+S*.1,yy);g.lineTo(x+S*.38,yy);g.stroke()}
    g.beginPath();g.moveTo(x-S*.06,y-S*.2);g.quadraticCurveTo(x-S*.02,y-S*.05,x-S*.18,y+S*.02);g.stroke();
    // sparkle ticks
    g.fillStyle='#ffc93d';
    for(const [dx,dy,a] of[[.42,-.62,.5],[.58,-.36,1.0]]){g.save();g.translate(x+S*dx,y+S*dy);g.rotate(a);g.beginPath();g.roundRect(-S*.06,-S*.16,S*.12,S*.3,S*.06);g.fill();g.restore()}
  }

  function coatBody(g,cx,top,bot,wTop,wBot,arms){
    // arms first (behind body edges)
    const cg=g.createLinearGradient(cx-wBot,0,cx+wBot,0);
    cg.addColorStop(0,'#0b0c10');cg.addColorStop(.35,'#2a2c33');cg.addColorStop(.6,'#22242a');cg.addColorStop(1,'#0a0b0e');
    g.strokeStyle=cg;g.lineCap='round';g.lineJoin='round';
    for(const a of arms){g.lineWidth=a.w;g.beginPath();g.moveTo(a.p[0][0],a.p[0][1]);for(let i=1;i<a.p.length;i++)g.lineTo(a.p[i][0],a.p[i][1]);g.stroke()}
    // coat
    g.fillStyle=cg;
    g.beginPath();
    g.moveTo(cx-wTop*.55,top);
    g.bezierCurveTo(cx-wTop,top+8,cx-wTop*1.05,top+40,cx-wBot*.98,bot-30);
    g.quadraticCurveTo(cx-wBot,bot,cx-wBot*.8,bot);
    g.lineTo(cx+wBot*.8,bot);
    g.quadraticCurveTo(cx+wBot,bot,cx+wBot*.98,bot-30);
    g.bezierCurveTo(cx+wTop*1.05,top+40,cx+wTop,top+8,cx+wTop*.55,top);
    g.closePath();g.fill();
    // rim light from galaxy
    g.strokeStyle='rgba(120,200,255,.35)';g.lineWidth=3;g.beginPath();g.moveTo(cx-wTop*.9,top+20);g.bezierCurveTo(cx-wTop*1.05,top+60,cx-wBot,bot-60,cx-wBot*.95,bot-10);g.stroke();
    // shirt collar
    g.fillStyle='#f2efe8';g.beginPath();g.ellipse(cx,top+4,wTop*.38,14,0,0,6.283);g.fill();
    g.fillStyle='#1a1b20';g.beginPath();g.moveTo(cx-wTop*.25,top+10);g.lineTo(cx,top+70);g.lineTo(cx+wTop*.25,top+10);g.closePath();g.fill();
    // lapels
    g.strokeStyle='rgba(0,0,0,.6)';g.lineWidth=3;
    for(const s of[-1,1]){g.beginPath();g.moveTo(cx+s*wTop*.3,top+8);g.lineTo(cx+s*wTop*.62,top+70);g.lineTo(cx+s*8,top+120);g.stroke()}
    g.strokeStyle='rgba(255,255,255,.08)';g.lineWidth=2;
    for(const s of[-1,1]){g.beginPath();g.moveTo(cx+s*wTop*.32,top+12);g.lineTo(cx+s*wTop*.6,top+68);g.stroke()}
    // center seam + buttons
    g.strokeStyle='rgba(0,0,0,.5)';g.lineWidth=2;g.beginPath();g.moveTo(cx+4,top+120);g.lineTo(cx+4,bot-4);g.stroke();
    for(const yy of[top+150,top+205]){g.fillStyle='#050506';g.beginPath();g.arc(cx-6,yy,5,0,6.283);g.fill();g.fillStyle='rgba(255,255,255,.25)';g.beginPath();g.arc(cx-7.5,yy-1.5,1.5,0,6.283);g.fill()}
  }
  function legs(g,cx,y,gap){
    for(const s of[-1,1]){
      const lg=g.createLinearGradient(cx+s*gap-20,0,cx+s*gap+20,0);lg.addColorStop(0,'#08090b');lg.addColorStop(.5,'#202227');lg.addColorStop(1,'#08090b');
      g.fillStyle=lg;g.beginPath();g.roundRect(cx+s*gap-20,y,40,44,8);g.fill();
      const sg=g.createLinearGradient(0,y+38,0,y+62);sg.addColorStop(0,'#2a2a2e');sg.addColorStop(1,'#050506');
      g.fillStyle=sg;g.beginPath();g.ellipse(cx+s*(gap+6),y+50,30,13,0,0,6.283);g.fill();
      g.fillStyle='rgba(255,255,255,.35)';g.beginPath();g.ellipse(cx+s*(gap+2)-6,y+45,10,3,-.2,0,6.283);g.fill();
    }
  }
  function hand(g,x,y,r){g.fillStyle=skinGrad(g,x,y,r);g.beginPath();g.ellipse(x,y,r,r*.85,0,0,6.283);g.fill()}

  // 모든 그림을 한 번 생성한다. 폰트 대기 후 main이 호출한다.
  function build() {
      // 1) coin: professor face + thumbs up
      JR.sprites.coin=mk(300,280,(g)=>{
        const halo=g.createRadialGradient(140,150,20,140,150,140);halo.addColorStop(0,'rgba(255,214,120,.55)');halo.addColorStop(.6,'rgba(255,190,90,.18)');halo.addColorStop(1,'rgba(255,190,90,0)');
        g.fillStyle=halo;g.fillRect(0,0,300,280);
        g.strokeStyle='rgba(255,220,140,.9)';g.lineWidth=6;g.beginPath();g.arc(130,160,112,0,6.283);g.stroke();
        profHead(g,130,170,78,'happy');
        thumbsUp(g,232,214,74);
      });
      // 2) angry professor, hands on hips (obstacle)
      JR.sprites.angry=mk(320,560,(g)=>{
        const cx=160;
        coatBody(g,cx,232,470,96,112,[
          {w:46,p:[[cx-88,262],[cx-140,330],[cx-96,380]]},
          {w:46,p:[[cx+88,262],[cx+140,330],[cx+96,380]]}
        ]);
        hand(g,cx-92,382,20);hand(g,cx+92,382,20);
        legs(g,cx,466,38);
        profHead(g,cx,150,82,'angry');
        // anger mark
        g.strokeStyle='#ff2d45';g.lineCap='round';
        for(const [ax,ay,k] of[[cx+96,40,1.4],[cx-104,70,1]]){g.lineWidth=7*k;
          for(const [a,b,c2,d] of[[-14,-4,-4,-14],[4,-14,14,-4],[14,4,4,14],[-4,14,-14,4]]){g.beginPath();g.moveTo(ax+a*k,ay+b*k);g.quadraticCurveTo(ax,ay,ax+c2*k,ay+d*k);g.stroke()}}
      });
      // 3) finish professor holding the 종강 sign + thumbs up
      JR.sprites.finish=mk(480,700,(g)=>{
        const cx=200;
        // sign stick + board
        g.fillStyle='#b7854f';g.fillRect(366,190,14,250);
        g.save();g.translate(373,120);g.rotate(.05);
        g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.roundRect(-96,-80,200,160,14);g.fill();
        const bg=g.createLinearGradient(0,-86,0,76);bg.addColorStop(0,'#fffaf0');bg.addColorStop(1,'#e8ddc8');
        g.fillStyle=bg;g.beginPath();g.roundRect(-100,-86,200,160,14);g.fill();
        g.strokeStyle='#ffcf6e';g.lineWidth=6;g.stroke();
        g.fillStyle='#14204a';g.font="96px 'Black Han Sans','Gothic A1',sans-serif";g.textAlign='center';g.textBaseline='middle';
        g.fillText('종강',0,-6);
        g.fillStyle='#ff5d79';g.font="800 22px 'Gothic A1',sans-serif";g.fillText('수고했어요!',0,52);
        g.restore();
        coatBody(g,cx,372,610,96,112,[
          {w:46,p:[[cx+88,400],[cx+150,420],[cx+172,370]]},
          {w:46,p:[[cx-88,400],[cx-150,440],[cx-160,380]]}
        ]);
        hand(g,cx+173,360,22);
        thumbsUp(g,cx-160,368,60);
        legs(g,cx,606,38);
        profHead(g,cx,290,82,'happy');
      });
      // 5) player: 임시 콩알이 (와우 완성 전까지)
      JR.sprites.player=mk(280,320,(g)=>{
        const cx=140;
        // laptop lid (screen faces away), glow spill
        g.save();g.shadowColor='rgba(110,200,255,.9)';g.shadowBlur=30;
        const lg=g.createLinearGradient(0,120,0,250);lg.addColorStop(0,'#d9e2f2');lg.addColorStop(1,'#8e9bb8');
        g.fillStyle=lg;g.beginPath();g.moveTo(cx-92,122);g.lineTo(cx+92,122);g.lineTo(cx+98,252);g.lineTo(cx-98,252);g.closePath();g.fill();
        g.restore();
        g.strokeStyle='rgba(255,255,255,.7)';g.lineWidth=2;g.beginPath();g.moveTo(cx-90,124);g.lineTo(cx+90,124);g.stroke();
        // generic glowing star logo on lid
        g.save();g.translate(cx,200);g.fillStyle='rgba(120,220,255,.95)';g.shadowColor='#7fd8ff';g.shadowBlur=14;
        g.beginPath();for(let i=0;i<8;i++){const r=i%2?5:14,a=i*Math.PI/4-Math.PI/2;g.lineTo(Math.cos(a)*r,Math.sin(a)*r)}g.closePath();g.fill();g.restore();
        // base slab
        const bg=g.createLinearGradient(0,248,0,290);bg.addColorStop(0,'#c9d3e6');bg.addColorStop(1,'#6f7c99');
        g.fillStyle=bg;g.beginPath();g.moveTo(cx-104,250);g.lineTo(cx+104,250);g.lineTo(cx+126,282);g.lineTo(cx-126,282);g.closePath();g.fill();
        g.fillStyle='#4b5672';g.beginPath();g.moveTo(cx-126,282);g.lineTo(cx+126,282);g.lineTo(cx+124,292);g.lineTo(cx-124,292);g.closePath();g.fill();
        g.fillStyle='rgba(120,220,255,.9)';g.fillRect(cx-40,288,80,3);
        // back thruster pack + body: an original lavender "space bean" seen from behind
        const bd=g.createRadialGradient(cx-26,150,10,cx,180,96);bd.addColorStop(0,'#e3dbff');bd.addColorStop(.55,'#a996ff');bd.addColorStop(1,'#5d4bc4');
        // stubby arms reaching to the lid corners
        g.strokeStyle='#8f7ef0';g.lineCap='round';g.lineWidth=24;
        for(const s of[-1,1]){g.beginPath();g.moveTo(cx+s*58,178);g.quadraticCurveTo(cx+s*94,166,cx+s*90,132);g.stroke()}
        for(const s of[-1,1]){const mg=g.createRadialGradient(cx+s*90-3,122,1,cx+s*90,126,14);mg.addColorStop(0,'#f2edff');mg.addColorStop(1,'#a996ff');g.fillStyle=mg;g.beginPath();g.arc(cx+s*90,126,13,0,6.283);g.fill()}
        // body
        g.fillStyle=bd;g.beginPath();g.moveTo(cx,72);
        g.bezierCurveTo(cx+52,72,cx+80,120,cx+82,180);g.bezierCurveTo(cx+84,232,cx+62,262,cx,262);
        g.bezierCurveTo(cx-62,262,cx-84,232,cx-82,180);g.bezierCurveTo(cx-80,120,cx-52,72,cx,72);g.fill();
        // soft rim + freckle dots
        g.strokeStyle='rgba(140,230,255,.55)';g.lineWidth=3;g.beginPath();g.moveTo(cx-70,120);g.bezierCurveTo(cx-84,170,cx-80,230,cx-50,256);g.stroke();
        g.fillStyle='rgba(255,255,255,.35)';for(const [dx,dy,r] of[[-30,110,6],[-12,98,4],[34,122,5],[-44,150,4]]){g.beginPath();g.arc(cx+dx,dy,r,0,6.283);g.fill()}
        // little feet on the laptop
        for(const s of[-1,1]){g.fillStyle='#6f5ed8';g.beginPath();g.ellipse(cx+s*44,262,20,9,0,0,6.283);g.fill()}
        // mini jetpack
        const jp=g.createLinearGradient(cx-34,0,cx+34,0);jp.addColorStop(0,'#2e9e7c');jp.addColorStop(.5,'#8fffd9');jp.addColorStop(1,'#2e9e7c');
        g.fillStyle=jp;g.beginPath();g.roundRect(cx-34,150,68,72,16);g.fill();
        g.fillStyle='#1d2a4a';g.beginPath();g.roundRect(cx-24,214,18,14,4);g.fill();g.beginPath();g.roundRect(cx+6,214,18,14,4);g.fill();
        g.fillStyle='#ffffff';g.beginPath();g.arc(cx,176,9,0,6.283);g.fill();g.fillStyle='#57f2c0';g.beginPath();g.arc(cx,176,5,0,6.283);g.fill();
        g.strokeStyle='#1d2a4a';g.lineWidth=5;for(const s of[-1,1]){g.beginPath();g.moveTo(cx+s*30,156);g.quadraticCurveTo(cx+s*44,130,cx+s*30,108);g.stroke()}
        // antenna with glowing star tip
        g.strokeStyle='#8f7ef0';g.lineWidth=6;g.beginPath();g.moveTo(cx+4,78);g.quadraticCurveTo(cx+10,46,cx+26,28);g.stroke();
        g.save();g.translate(cx+28,24);g.shadowColor='#ffe28a';g.shadowBlur=18;g.fillStyle='#ffe28a';
        g.beginPath();for(let i=0;i<10;i++){const r=i%2?6:15,an=i*Math.PI/5-Math.PI/2;g.lineTo(Math.cos(an)*r,Math.sin(an)*r)}g.closePath();g.fill();g.restore();
      });
      // 6) planet with rings
      JR.sprites.planet=mk(360,240,(g)=>{
        const cx=180,cy=120,r=70;
        const ring=(front)=>{g.save();g.translate(cx,cy);g.rotate(-.32);g.beginPath();
          if(front)g.ellipse(0,0,150,34,0,0,Math.PI);else g.ellipse(0,0,150,34,0,Math.PI,Math.PI*2);
          g.strokeStyle='rgba(170,190,255,.55)';g.lineWidth=8;g.stroke();g.strokeStyle='rgba(120,240,210,.35)';g.lineWidth=3;
          g.beginPath();if(front)g.ellipse(0,0,128,28,0,0,Math.PI);else g.ellipse(0,0,128,28,0,Math.PI,Math.PI*2);g.stroke();g.restore()};
        ring(false);
        const pg=g.createRadialGradient(cx-26,cy-30,8,cx,cy,r);pg.addColorStop(0,'#9fe8ff');pg.addColorStop(.45,'#4a72d6');pg.addColorStop(1,'#1a1d55');
        g.fillStyle=pg;g.beginPath();g.arc(cx,cy,r,0,6.283);g.fill();
        g.save();g.beginPath();g.arc(cx,cy,r,0,6.283);g.clip();g.globalAlpha=.25;
        for(let i=0;i<5;i++){g.fillStyle=i%2?'#c8b8ff':'#7ff0d0';g.fillRect(cx-r,cy-r+i*30+8,r*2,8)}
        g.globalAlpha=1;const sh=g.createLinearGradient(cx-r,cy-r,cx+r,cy+r);sh.addColorStop(.45,'rgba(3,5,20,0)');sh.addColorStop(1,'rgba(3,5,20,.75)');g.fillStyle=sh;g.fillRect(cx-r,cy-r,r*2,r*2);g.restore();
        ring(true);
      });
  }

  JR.sprites = {
    build,
    player: null,
    coin: null,
    angry: null,
    finish: null,
    planet: null,
  };
})();
