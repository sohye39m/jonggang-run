// 담당: uoona-svg — 진행, 등장, 충돌, 학점 (SPEC.md 2절, 7절).
// mode는 이 파일에서만 바꾼다.
(() => {
  const JR = (window.JR = window.JR || {});

  JR.game = {
    update(dt) {
      const { config: C, state: S } = JR;
      const run = S.run;
      if (S.mode === 'pause') return;
      const playing = S.mode === 'play';

      if (S.mode === 'title') run.speed = 12;
      if (playing) {
        run.time += dt;
        run.speed = 11 + 29 * Math.pow(Math.min(1, run.time / 38), 1.6);
      }

      const step = run.speed * dt;
      run.dist += step;
      run.x += (C.LANES[run.lane] - run.x) * Math.min(1, dt * 14);
      run.inv = Math.max(0, run.inv - dt);

      JR.world.tick(dt, step);
    },

    // 새 판 시작 (재수강도 동일)
    start() {
      JR.audio.unlock();
      JR.state.reset();
      JR.world.reset();
      JR.state.mode = 'play';
      JR.ui.showPlay();
      JR.audio.playStart();
    },

    pause(on) {
      const S = JR.state;
      if (on && S.mode === 'play') {
        S.mode = 'pause';
        JR.ui.showPause(true);
      } else if (!on && S.mode === 'pause') {
        S.mode = 'play';
        JR.ui.showPause(false);
      }
    },

    // d: -1 왼쪽, 1 오른쪽
    move(d) {
      const S = JR.state;
      if (S.mode !== 'play') return;
      const lane = Math.max(0, Math.min(JR.config.LANES.length - 1, S.run.lane + d));
      if (lane === S.run.lane) return;
      S.run.lane = lane;
      JR.audio.playLane(d);
    },

    gradeOf(n) {},
  };
})();
