// 담당: MinjooSong0708 — 코드로 만드는 효과음 (SPEC.md 7절). 프로토타입의 audio()/tone()을 옮김.
(() => {
  const JR = (window.JR = window.JR || {});

  let ac = null;
  let muted = false;
  const SCALE = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];

  // 첫 입력 때 AudioContext를 만들고, 멈춰 있으면 다시 시작한다.
  function unlock() {
    if (!ac) {
      try {
        ac = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {}
    }
    if (ac && ac.state === 'suspended') ac.resume();
  }

  function tone(f, dur, type = 'sine', vol = 0.07, slide = 1, delay = 0) {
    if (muted || !ac) return;
    const t = ac.currentTime + delay;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t);
    if (slide !== 1) o.frequency.exponentialRampToValueAtTime(f * slide, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(ac.destination);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  // 종강 팡파르: assets/finish.mp3 (freesound_community, piglevelwin2).
  // 런이 종강 표지판 교수님 앞에 멈춘 직후 playFinish() 가 재생한다. 음소거 중에는 재생하지 않는다.
  const FANFARE_SRC = 'assets/finish.mp3';
  const FANFARE_VOLUME = 0.7;
  let fanfare = null;
  function getFanfare() {
    if (!fanfare) {
      fanfare = new Audio(FANFARE_SRC);
      fanfare.preload = 'auto';
      fanfare.volume = FANFARE_VOLUME;
      fanfare.muted = muted;
    }
    return fanfare;
  }
  // 새 판이 시작될 때 이전 팡파르가 남아 있으면 멈춘다
  function stopFanfare() {
    if (!fanfare) return;
    fanfare.pause();
    fanfare.currentTime = 0;
  }

  // ---------- 배경음악 ----------
  // 음원: assets/bgm.mp3 (the_mountain-retro-game). <audio> 로 반복 재생한다.
  // file:// 로 열어도 되도록 fetch 대신 HTMLAudioElement 를 쓴다.
  const BGM_SRC = 'assets/bgm.mp3';
  const BGM_VOLUME = 0.2; // 효과음보다 작게. 너무 크면 이 값만 낮춘다
  let bgm = null;
  let fadeTimer = 0;

  function getBgm() {
    if (!bgm) {
      bgm = new Audio(BGM_SRC);
      bgm.loop = true;
      bgm.preload = 'auto';
      bgm.volume = BGM_VOLUME;
      bgm.muted = muted;
    }
    return bgm;
  }

  function playSafe(a) {
    const p = a.play();
    if (p && p.catch) p.catch(() => {}); // 첫 입력 전에는 브라우저가 막을 수 있다
  }

  function cancelFade() {
    clearInterval(fadeTimer);
    fadeTimer = 0;
  }

  JR.audio = {
    unlock,
    // 음소거를 전환하고 현재 상태를 돌려준다 (true = 꺼짐). 배경음악도 함께 꺼진다.
    toggleMute() {
      muted = !muted;
      if (bgm) bgm.muted = muted;
      if (fanfare) fanfare.muted = muted;
      return muted;
    },
    // 새 판 시작: 배경음악을 처음부터 재생
    playBgm() {
      stopFanfare(); // 재수강: 이전 판의 팡파르가 남아 있으면 멈춘다
      getFanfare(); // 종강 팡파르를 미리 불러 둔다
      const a = getBgm();
      cancelFade();
      a.volume = BGM_VOLUME;
      a.currentTime = 0;
      playSafe(a);
    },
    // 일시정지 / 재개: 멈춘 자리에서 이어서
    pauseBgm() {
      if (bgm) bgm.pause();
    },
    resumeBgm() {
      if (!bgm) return;
      cancelFade();
      bgm.volume = BGM_VOLUME;
      playSafe(bgm);
    },
    // 종료: 1.5초 동안 서서히 줄이고 멈춘다 (팡파르는 playFinish 가 이미 재생함)
    stopBgm(sec = 1.5) {
      if (!bgm || bgm.paused) return;
      cancelFade();
      const a = bgm;
      const steps = 30;
      let i = 0;
      fadeTimer = setInterval(() => {
        i++;
        a.volume = Math.max(0, BGM_VOLUME * (1 - i / steps));
        if (i >= steps) {
          cancelFade();
          a.pause();
          a.currentTime = 0;
          a.volume = BGM_VOLUME;
        }
      }, (sec * 1000) / steps);
    },
    playStart() {
      tone(392, 0.16, 'sine', 0.05);
      tone(523, 0.16, 'sine', 0.05, 1, 0.12);
      tone(659, 0.22, 'sine', 0.05, 1, 0.24);
    },
    // 종강 팡파르: 런이 멈춘 직후 game.js 가 부른다
    playFinish() {
      if (muted) return;
      const a = getFanfare();
      a.currentTime = 0;
      playSafe(a);
    },
    // d: -1 왼쪽, 1 오른쪽
    playLane(d) {
      tone(440 + d * 40, 0.06, 'triangle', 0.03);
    },
    // thumbs: 현재 따봉 수 (음계가 따라 올라감)
    playCoin(thumbs) {
      tone(SCALE[thumbs % SCALE.length], 0.16, 'sine', 0.05);
    },
    playHit() {
      tone(150, 0.35, 'sawtooth', 0.07, 0.5);
      tone(90, 0.4, 'square', 0.035, 0.6);
    },
  };
})();
