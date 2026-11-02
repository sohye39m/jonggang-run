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

  JR.audio = {
    unlock,
    // 음소거를 전환하고 현재 상태를 돌려준다 (true = 꺼짐)
    toggleMute() {
      muted = !muted;
      return muted;
    },
    playStart() {
      tone(392, 0.16, 'sine', 0.05);
      tone(523, 0.16, 'sine', 0.05, 1, 0.12);
      tone(659, 0.22, 'sine', 0.05, 1, 0.24);
    },
    playFinish() {
      tone(523, 0.2, 'sine', 0.06);
      tone(659, 0.2, 'sine', 0.06, 1, 0.12);
      tone(784, 0.2, 'sine', 0.06, 1, 0.24);
      tone(1047, 0.5, 'sine', 0.06, 1, 0.36);
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
