// 담당: inayun059-afk — 와우, 교수님 등 그림 (SPEC.md 4절, 7절).
// 프로토타입의 SPRITES 구역을 옮긴 파일.
// player는 노트북을 탄 와우(뒷모습). 콩알이는 쓰지 않는다. 과제 더미(pile)는 옮기지 않는다.
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

  // ---------------------------------------------------------------
  // 와우(홍익대 마스코트) 뒷모습 + 노트북. 형태와 색은 공식 캐릭터 도안을 따른다.
  // 흰 머리, 휘어진 뿔 2개, 넓고 납작한 귀, 머리 위 네이비 무늬, 네이비 점퍼, 긴 흰 소매.
  // 질감: 굵은 외곽선 + 부드러운 입체 음영(툰 셰이딩 3D 장난감 느낌).
  // 좌표는 280×320 기준이고, 선명하게 보이도록 SCALE배 크기로 그린다(player).
  // ---------------------------------------------------------------
  const SCALE = 2;
  const WOW_OL = '#1d1c31';     // 외곽선
  const WOW_NAVY = '#222741';
  const WOW_WHITE = '#fffffe';
  const WOW_RIM = 'rgba(150,232,255,.5)';   // 은하수에서 오는 림라이트

  // 도형 안쪽에 입체 음영(왼쪽 위 빛)을 얹는다
  function wowShade(g, path, x, y, r, dark, lite) {
    g.save(); path(); g.clip();
    const d = g.createRadialGradient(x - r * 0.3, y - r * 0.4, r * 0.3, x - r * 0.3, y - r * 0.4, r * 1.5);
    d.addColorStop(0, 'rgba(0,0,0,0)'); d.addColorStop(1, dark);
    g.fillStyle = d; g.fillRect(x - r * 3, y - r * 3, r * 6, r * 6);
    const l = g.createRadialGradient(x - r * 0.45, y - r * 0.5, 0, x - r * 0.45, y - r * 0.5, r * 0.75);
    l.addColorStop(0, lite); l.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = l; g.fillRect(x - r * 3, y - r * 3, r * 6, r * 6);
    // 왼쪽 가장자리의 림라이트
    g.translate(3, 2); path(); g.lineWidth = 2; g.strokeStyle = WOW_RIM; g.stroke();
    g.restore();
  }
  // 채우기 → 음영 → 외곽선 순서로 한 부품을 그린다
  function wowPart(g, path, fill, x, y, r, navy, lw) {
    path(); g.fillStyle = fill; g.fill();
    wowShade(g, path, x, y, r, navy ? 'rgba(0,0,14,.5)' : 'rgba(112,126,196,.30)', navy ? 'rgba(130,160,240,.40)' : 'rgba(255,255,255,.95)');
    path(); g.strokeStyle = WOW_OL; g.lineWidth = lw || 4.5; g.stroke();
  }

  // 곡선을 따라 굵기가 변하는 관 모양(소매)
  function wowTube(g, p0, p1, p2, w0, w1) {
    const L = [], R = [];
    for (let i = 0; i <= 16; i++) {
      const t = i / 16, u = 1 - t;
      const x = u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0];
      const y = u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1];
      const dx = 2 * u * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]);
      const dy = 2 * u * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]);
      const n = Math.hypot(dx, dy) || 1, w = (w0 + (w1 - w0) * t) / 2;
      L.push([x - dy / n * w, y + dx / n * w]); R.push([x + dy / n * w, y - dx / n * w]);
    }
    g.beginPath();
    L.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])));
    for (let i = R.length - 1; i >= 0; i--) g.lineTo(R[i][0], R[i][1]);
    g.closePath();
  }

  // 글자를 호 모양으로 배치
  function arcText(g, text, cx, cy, r, span) {
    const n = text.length;
    for (let i = 0; i < n; i++) {
      const a = (i - (n - 1) / 2) * (span / (n - 1));
      g.save(); g.translate(cx + r * Math.sin(a), cy - r * Math.cos(a)); g.rotate(a); g.fillText(text[i], 0, 0); g.restore();
    }
  }

  function drawLaptop(g, cx) {
    const B = SCALE;   // shadowBlur는 변환의 영향을 받지 않아 직접 곱한다
    // 뒤에서 퍼지는 화면 빛과 뚜껑
    g.save(); g.shadowColor = 'rgba(110,200,255,.9)'; g.shadowBlur = 34 * B;
    const lg = g.createLinearGradient(0, 120, 0, 252); lg.addColorStop(0, '#e3eaf7'); lg.addColorStop(0.5, '#b3bfd8'); lg.addColorStop(1, '#8190ae');
    g.fillStyle = lg; g.beginPath(); g.moveTo(cx - 92, 122); g.lineTo(cx + 92, 122); g.lineTo(cx + 98, 252); g.lineTo(cx - 98, 252); g.closePath(); g.fill();
    g.restore();
    // 뚜껑 두께감: 위 모서리 하이라이트, 양옆 그늘
    g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(cx - 90, 124); g.lineTo(cx + 90, 124); g.stroke();
    const sd = g.createLinearGradient(cx - 98, 0, cx + 98, 0);
    sd.addColorStop(0, 'rgba(20,40,90,.28)'); sd.addColorStop(0.12, 'rgba(20,40,90,0)'); sd.addColorStop(0.88, 'rgba(20,40,90,0)'); sd.addColorStop(1, 'rgba(20,40,90,.34)');
    g.fillStyle = sd; g.beginPath(); g.moveTo(cx - 92, 122); g.lineTo(cx + 92, 122); g.lineTo(cx + 98, 252); g.lineTo(cx - 98, 252); g.closePath(); g.fill();
    // 별 로고
    g.save(); g.translate(cx, 214); g.fillStyle = 'rgba(120,220,255,.95)'; g.shadowColor = '#7fd8ff'; g.shadowBlur = 14 * B;
    g.beginPath(); for (let i = 0; i < 8; i++) { const r = i % 2 ? 5 : 14, a = i * Math.PI / 4 - Math.PI / 2; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); g.fill(); g.restore();
    // 아래판: 윗면, 앞쪽 두께, 터치패드 홈
    const bg = g.createLinearGradient(0, 248, 0, 284); bg.addColorStop(0, '#dfe7f5'); bg.addColorStop(1, '#8794b3');
    g.fillStyle = bg; g.beginPath(); g.moveTo(cx - 104, 250); g.lineTo(cx + 104, 250); g.lineTo(cx + 126, 282); g.lineTo(cx - 126, 282); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 2; g.beginPath(); g.moveTo(cx - 104, 250.5); g.lineTo(cx + 104, 250.5); g.stroke();
    g.fillStyle = 'rgba(60,75,115,.22)'; g.beginPath(); g.roundRect(cx - 34, 272, 68, 7, 3); g.fill();
    const fg = g.createLinearGradient(0, 282, 0, 293); fg.addColorStop(0, '#6a7899'); fg.addColorStop(1, '#3c4663');
    g.fillStyle = fg; g.beginPath(); g.moveTo(cx - 126, 282); g.lineTo(cx + 126, 282); g.lineTo(cx + 124, 292); g.lineTo(cx - 124, 292); g.closePath(); g.fill();
    g.fillStyle = 'rgba(120,220,255,.9)'; g.fillRect(cx - 40, 288, 80, 3);
  }

  function drawWowBack(g, cx) {
    g.lineJoin = 'round'; g.lineCap = 'round';

    // 노트북 뚜껑에 지는 부드러운 그림자와 발 밑 접촉 그림자
    const lidAo = g.createRadialGradient(cx, 205, 10, cx, 205, 84); lidAo.addColorStop(0, 'rgba(8,20,70,.42)'); lidAo.addColorStop(1, 'rgba(8,20,70,0)');
    g.fillStyle = lidAo; g.fillRect(cx - 100, 120, 200, 140);
    g.fillStyle = 'rgba(10,20,60,.4)'; g.beginPath(); g.ellipse(cx, 270, 58, 10, 0, 0, 6.283); g.fill();

    // 다리: 길고 얇은 흰 다리
    for (const s of [-1, 1]) {
      const x0 = s > 0 ? cx + 2 : cx - 26;
      const leg = () => { g.beginPath(); g.roundRect(x0, 238, 24, 31, [2, 2, 10, 10]); };
      wowPart(g, leg, WOW_WHITE, x0 + 12, 254, 22, false, 4);
    }
    // 흰 반바지 밑단
    const trunk = () => { g.beginPath(); g.roundRect(cx - 29, 232, 58, 14, 6); };
    wowPart(g, trunk, WOW_WHITE, cx, 240, 30, false, 4);

    // 점퍼(몸통)
    const body = () => {
      g.beginPath(); g.moveTo(cx - 18, 166);
      g.bezierCurveTo(cx - 31, 182, cx - 35, 212, cx - 38, 231);
      g.quadraticCurveTo(cx - 39, 240, cx - 29, 240); g.lineTo(cx + 29, 240);
      g.quadraticCurveTo(cx + 39, 240, cx + 38, 231);
      g.bezierCurveTo(cx + 35, 212, cx + 31, 182, cx + 18, 166); g.closePath();
    };
    wowPart(g, body, WOW_NAVY, cx, 202, 44, true, 4.5);
    g.save(); body(); g.clip();
    // 밑단 골지와 흰 줄, 등 가운데 솔기
    g.fillStyle = 'rgba(150,175,235,.25)'; g.fillRect(cx - 45, 228, 90, 14);
    g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 2; g.beginPath(); g.moveTo(cx - 45, 228); g.lineTo(cx + 45, 228); g.stroke();
    g.strokeStyle = 'rgba(0,0,14,.4)'; g.lineWidth = 1.3;
    for (let x = -34; x <= 34; x += 7) { g.beginPath(); g.moveTo(cx + x, 230); g.lineTo(cx + x, 241); g.stroke(); }
    g.strokeStyle = 'rgba(0,0,14,.5)'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(cx, 180); g.lineTo(cx, 227); g.stroke();
    g.strokeStyle = 'rgba(130,160,240,.35)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(cx + 2, 180); g.lineTo(cx + 2, 227); g.stroke();
    g.restore();
    // 등판 글자
    g.fillStyle = '#f4f7ff'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = "800 10px 'Gothic A1',sans-serif"; arcText(g, 'HONGIK', cx, 216, 19, 1.25);
    g.font = "800 6.5px 'Gothic A1',sans-serif"; g.fillText('UNIV.', cx, 213);
    g.fillRect(cx - 14, 219, 28, 1.2);
    // 머리가 점퍼에 드리우는 그림자
    const ao = g.createRadialGradient(cx, 172, 3, cx, 174, 40); ao.addColorStop(0, 'rgba(4,8,36,.6)'); ao.addColorStop(1, 'rgba(4,8,36,0)');
    g.save(); body(); g.clip(); g.fillStyle = ao; g.fillRect(cx - 50, 150, 100, 60); g.restore();

    // 소매: 어깨에서 바깥 아래로 늘어진 두툼한 흰 소매, 네이비 소맷단, 흰 손
    for (const s of [-1, 1]) {
      const sleeve = () => wowTube(g, [cx + s * 20, 176], [cx + s * 62, 178], [cx + s * 62, 214], 36, 29);
      wowPart(g, sleeve, WOW_WHITE, cx + s * 52, 192, 34, false, 4.5);
      const cuff = () => { g.save(); g.translate(cx + s * 62, 218); g.rotate(s * 0.05); g.beginPath(); g.roundRect(-15, -5, 30, 11, 5); g.restore(); };
      wowPart(g, cuff, WOW_NAVY, cx + s * 62, 218, 16, true, 3.5);
      const hand = () => { g.beginPath(); g.ellipse(cx + s * 62, 229, 12, 11, 0, 0, 6.283); };
      wowPart(g, hand, WOW_WHITE, cx + s * 62, 229, 13, false, 4);
    }

    // 뿔: 머리 위로 휘어 올라간 흰 뿔
    for (const s of [-1, 1]) {
      const horn = () => {
        g.beginPath(); g.moveTo(cx + s * 52, 78);
        g.bezierCurveTo(cx + s * 55, 58, cx + s * 52, 43, cx + s * 43, 40);
        g.bezierCurveTo(cx + s * 34, 38, cx + s * 28, 52, cx + s * 14, 64);
        g.lineTo(cx + s * 14, 84); g.closePath();
      };
      wowPart(g, horn, WOW_WHITE, cx + s * 38, 56, 22, false, 4);
    }
    // 귀: 양옆으로 길고 납작하게 뻗은 귀
    for (const s of [-1, 1]) {
      const ear = () => {
        g.beginPath(); g.moveTo(cx + s * 38, 66);
        g.bezierCurveTo(cx + s * 62, 76, cx + s * 86, 80, cx + s * 92, 82);
        g.bezierCurveTo(cx + s * 103, 86, cx + s * 105, 107, cx + s * 94, 111);
        g.bezierCurveTo(cx + s * 80, 115, cx + s * 56, 113, cx + s * 38, 108); g.closePath();
      };
      wowPart(g, ear, WOW_WHITE, cx + s * 70, 92, 38, false, 4.5);
    }

    // 머리: 아래쪽 볼이 살짝 넓은 모양
    const head = () => {
      g.beginPath(); g.moveTo(cx, 58);
      g.bezierCurveTo(cx + 34, 58, cx + 56, 72, cx + 63, 96);
      g.bezierCurveTo(cx + 66, 110, cx + 62, 122, cx + 67, 134);
      g.bezierCurveTo(cx + 68, 152, cx + 38, 171, cx, 171);
      g.bezierCurveTo(cx - 38, 171, cx - 68, 152, cx - 67, 134);
      g.bezierCurveTo(cx - 62, 122, cx - 66, 110, cx - 63, 96);
      g.bezierCurveTo(cx - 56, 72, cx - 34, 58, cx, 58); g.closePath();
    };
    head(); g.fillStyle = WOW_WHITE; g.fill();
    wowShade(g, head, cx, 114, 70, 'rgba(112,126,196,.34)', 'rgba(255,255,255,.95)');
    // 머리 위 네이비 무늬(중절모 모양)
    g.save(); head(); g.clip();
    const patch = () => {
      g.beginPath(); g.moveTo(cx - 25, 54);
      g.bezierCurveTo(cx - 27, 70, cx - 27, 77, cx - 31, 82);
      g.bezierCurveTo(cx - 41, 85, cx - 39, 95, cx - 29, 101);
      g.bezierCurveTo(cx - 16, 109, cx + 16, 109, cx + 29, 101);
      g.bezierCurveTo(cx + 39, 95, cx + 41, 85, cx + 31, 82);
      g.bezierCurveTo(cx + 27, 77, cx + 27, 70, cx + 25, 54); g.closePath();
    };
    patch(); g.fillStyle = WOW_NAVY; g.fill();
    wowShade(g, patch, cx, 82, 36, 'rgba(0,0,14,.5)', 'rgba(130,160,240,.28)');
    patch(); g.strokeStyle = WOW_OL; g.lineWidth = 3; g.stroke();
    g.restore();
    head(); g.strokeStyle = WOW_OL; g.lineWidth = 5; g.stroke();
    // 하이라이트(반짝임)
    g.fillStyle = 'rgba(255,255,255,.9)'; g.beginPath(); g.ellipse(cx - 40, 98, 12, 5.5, -0.7, 0, 6.283); g.fill();
  }

  // <BLENDER_IMAGES> — Blender에서 렌더한 와우(노트북에 앉은 뒷모습). 자동 생성, 직접 고치지 말 것.
  const BLENDER = {
    player: 'data:image/webp;base64,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',
  };
  // </BLENDER_IMAGES>

  // ---------------------------------------------------------------
  // Blender 렌더 그림 적용. 위의 Canvas 그림은 이미지가 준비되기 전과 실패했을 때의 대체 그림이다.
  // ---------------------------------------------------------------
  function useImage(cv, src) {
    const img = new Image();
    img.onload = () => {
      const g = cv.getContext('2d');
      g.setTransform(1, 0, 0, 1, 0, 0);   // 대체 그림을 그릴 때 남은 확대를 지운다
      g.clearRect(0, 0, cv.width, cv.height);
      g.drawImage(img, 0, 0, cv.width, cv.height);
    };
    img.src = src;
  }
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
    // 5) player: 와우 뒷모습이 노트북을 탄 모습
    JR.sprites.player = mk(280 * SCALE, 320 * SCALE, (g) => {
      g.scale(SCALE, SCALE);
      drawLaptop(g, 140);
      drawWowBack(g, 140);
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

    // 와우는 Blender 렌더로 교체한다(이미지가 준비되기 전과 실패했을 때는 위의 Canvas 그림이 대체한다)
    useImage(JR.sprites.player, BLENDER.player);
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
