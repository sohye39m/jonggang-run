// 담당: uoona-svg — 게임 상태 (SPEC.md 7절).
// mode는 game.js만 바꾸고, run은 game.js만 쓴다. 나머지 파일은 읽기만 한다.
(() => {
  const JR = (window.JR = window.JR || {});

  let best = 0;
  try { best = +localStorage.getItem(JR.config.BEST_KEY) || 0; } catch (e) {}

  const run = {};

  JR.state = {
    mode: 'title',
    best,
    run,
    // 저장에 실패해도 게임은 동작한다
    saveBest(n) {
      JR.state.best = n;
      try { localStorage.setItem(JR.config.BEST_KEY, n); } catch (e) {}
    },
    // run 객체를 새로 만들지 않고 값만 초기화한다
    reset() {
      Object.assign(run, {
        dist: 0, speed: 11, time: 0, lane: 1, x: 0,
        thumbs: 0, scold: 0, inv: 0,
        objs: [], nextRow: 20,
        finish: null, endT: -1, confettiDone: false,
      });
    },
  };

  JR.state.reset();
})();
