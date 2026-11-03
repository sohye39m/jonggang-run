// 담당: MinjooSong0708 — HUD, 카드, 버튼 (SPEC.md 3절, 7절).
// 화면에 보이는 것만 다룬다. 규칙(mode 변경, 점수 계산)은 game.js 몫이다.
(() => {
  const JR = (window.JR = window.JR || {});

  const $ = (id) => document.getElementById(id);
  let el = null; // init 에서 요소를 한 번만 찾아 둔다
  const last = {}; // 매 프레임 같은 값을 다시 쓰지 않으려고 마지막 값을 기억

  function setText(key, node, text) {
    if (last[key] === text) return;
    last[key] = text;
    node.textContent = text;
  }

  // 따봉 수에 맞는 [최소 따봉, 학점, 코멘트]. game.gradeOf 가 아직 없으면 config 로 대신한다.
  function gradeOf(n) {
    const g = JR.game && JR.game.gradeOf && JR.game.gradeOf(n);
    return g || JR.config.GRADES.find((row) => n >= row[0]);
  }

  // 카드와 HUD 의 보임/숨김을 한곳에서 정한다
  function view({ title = false, pause = false, over = false, hud = false, pauseBtn = false }) {
    el.titleView.hidden = !title;
    el.pauseView.hidden = !pause;
    el.overView.hidden = !over;
    el.hud.dataset.off = hud ? '0' : '1';
    el.pauseBtn.hidden = !pauseBtn;
  }

  // HTML 의 <canvas data-spr="coin"> 자리에 게임 그림(JR.sprites)을 그려 넣는다.
  // data-crop="sx,sy,sw,sh" 가 있으면 그 부분만 잘라서 쓴다. 값은 그림 크기에 대한 비율(0~1)이라서,
  // 그림 크기가 바뀌어도(예: 320×560 → 640×1120) 자르는 위치가 어긋나지 않는다.
  function paintIcons() {
    document.querySelectorAll('canvas[data-spr]').forEach((c) => {
      const src = JR.sprites && JR.sprites[c.dataset.spr];
      if (!src) return;
      const g = c.getContext('2d');
      g.clearRect(0, 0, c.width, c.height);
      if (c.dataset.crop) {
        const [fx, fy, fw, fh] = c.dataset.crop.split(',').map(Number);
        g.drawImage(src, fx * src.width, fy * src.height, fw * src.width, fh * src.height, 0, 0, c.width, c.height);
      } else {
        g.drawImage(src, 0, 0, c.width, c.height);
      }
    });
  }

  // 렌더 이미지(WebP)는 sprites.build() 뒤에 비동기로 불러와 같은 canvas 에 다시 그려진다.
  // init 에서 한 번만 복사하면 불러오기 전의 대체 그림이 남으므로, 시작 직후 몇 초 동안은
  // 매 프레임 다시 그려서 새 그림으로 바뀌는 순간을 따라간다.
  function syncIcons(ms = 6000) {
    const t0 = performance.now();
    const tick = () => {
      paintIcons();
      if (performance.now() - t0 < ms) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // 배경음악은 화면이 바뀌는 때에 맞춰 켜고 끈다 (SPEC 7절: 부르는 곳은 ui).
  // JR.audio 에 해당 함수가 없는 빌드에서도 오류 없이 지나간다.
  function bgm(name, ...args) {
    const a = JR.audio;
    if (a && typeof a[name] === 'function') a[name](...args);
  }

  // 버튼을 누른 뒤 포커스가 남으면 Space/Enter 가 버튼을 또 누르게 되므로 포커스를 푼다
  function click(node, fn) {
    node.addEventListener('click', () => {
      fn();
      node.blur();
    });
  }

  JR.ui = {
    init() {
      el = {
        hud: $('hud'),
        timer: $('timer'),
        prog: $('prog'),
        liveGrade: $('liveGrade'),
        thumbs: $('thumbs'),
        titleView: $('titleView'),
        overView: $('overView'),
        pauseView: $('pauseView'),
        pauseBtn: $('pauseBtn'),
        muteBtn: $('muteBtn'),
        startBtn: $('startBtn'),
        againBtn: $('againBtn'),
        resumeBtn: $('resumeBtn'),
        newBest: $('newBest'),
        rGrade: $('rGrade'),
        rComment: $('rComment'),
        rThumbs: $('rThumbs'),
        rScold: $('rScold'),
        rBest: $('rBest'),
      };

      paintIcons();
      syncIcons();

      click(el.startBtn, () => JR.game.start());
      click(el.againBtn, () => JR.game.start());
      click(el.resumeBtn, () => JR.game.pause(false));
      click(el.pauseBtn, () => JR.game.pause(JR.state.mode === 'play'));
      click(el.muteBtn, () => {
        const muted = JR.audio.toggleMute();
        el.muteBtn.textContent = muted ? '소리 꺼짐' : '소리 켜짐';
      });

      view({ title: true });
      el.startBtn.focus();
    },

    // 카드를 닫고 HUD 와 일시정지 버튼을 보여 준다
    showPlay() {
      view({ hud: true, pauseBtn: true });
      for (const k in last) delete last[k]; // 새 판이므로 HUD 를 처음부터 다시 쓴다
      JR.ui.updateHud();
      if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
      paintIcons(); // HUD 따봉 아이콘이 새 그림인지 확인
      bgm('playBgm'); // 새 판(재수강 포함): 처음부터 재생
    },

    // 쉬는 시간 카드 표시/숨김. HUD 는 그대로 둔다
    showPause(on) {
      el.pauseView.hidden = !on;
      if (on) el.resumeBtn.focus();
      else el.resumeBtn.blur();
      bgm(on ? 'pauseBgm' : 'resumeBgm'); // 멈춘 자리에서 이어서
    },

    // r = { grade, comment, thumbs, scold, best, isNewBest, low }
    showResult(r) {
      el.rGrade.textContent = r.grade;
      el.rGrade.classList.toggle('low', !!r.low); // 따봉 50개 미만이면 분홍색
      el.rComment.textContent = r.comment;
      el.rThumbs.textContent = r.thumbs + '개';
      el.rScold.textContent = r.scold + '번';
      el.rBest.textContent = r.best + '개';
      el.newBest.hidden = !r.isNewBest;
      view({ over: true });
      el.againBtn.focus();
      bgm('stopBgm'); // 1.5초 페이드 후 팡파르
    },

    // play 중 매 프레임: JR.state.run 을 읽어 표시만 한다
    updateHud() {
      const run = JR.state.run;
      const total = JR.config.TOTAL;
      const braking = run.finish && run.finish.braking;
      setText('timer', el.timer, braking ? '종강!' : Math.max(0, total - run.time).toFixed(1));
      const pct = Math.min(1, run.time / total) * 100;
      if (last.pct !== pct.toFixed(1)) {
        last.pct = pct.toFixed(1);
        el.prog.style.width = pct.toFixed(1) + '%';
      }
      setText('thumbs', el.thumbs, String(run.thumbs));
      setText('grade', el.liveGrade, gradeOf(run.thumbs)[1]);
    },
  };
})();
