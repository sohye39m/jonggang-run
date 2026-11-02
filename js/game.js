// 담당: uoona-svg — 진행, 등장, 충돌, 학점 (SPEC.md 2절, 7절).
// mode는 이 파일에서만 바꾼다.
(() => {
  const JR = (window.JR = window.JR || {});

  // 한 줄을 ZFAR에 등장시킨다. attract는 타이틀 데모(따봉만)
  function spawnRow(attract) {
    const { config: C, state: S } = JR;
    const run = S.run;
    const z = C.ZFAR;
    const hard = Math.min(1, run.time / 30);
    const order = [0, 1, 2].sort(() => Math.random() - 0.5);
    let free = order;
    if (!attract && run.time < 36.5) {
      // 한 줄에 교수님 1~2명, 3개 레인을 모두 막지는 않는다
      const n = Math.random() < 0.2 + hard * 0.35 ? 2 : 1;
      free = order.slice(n);
      for (const li of order.slice(0, n)) {
        run.objs.push({ t: 'angry', lx: C.LANES[li], z, seed: Math.random(), done: false });
      }
    }
    if ((attract || run.time < 37.5) && Math.random() < (attract ? 0.9 : 0.7)) {
      const li = free[Math.floor(Math.random() * free.length)];
      const n = 4 + Math.floor(Math.random() * 3);
      for (let i = 0; i < n; i++) {
        run.objs.push({ t: 'coin', lx: C.LANES[li], z: z + 2 + i * 2.3, seed: Math.random(), done: false });
      }
    }
    run.nextRow = run.speed * (0.95 - 0.25 * hard) + Math.random() * 4;
  }

  // 결승 후 결과: 최고 기록을 저장하고 결과 카드를 띄운다
  function finishRun() {
    const S = JR.state;
    const run = S.run;
    S.mode = 'over';
    const isNewBest = run.thumbs > S.best;
    if (isNewBest) S.saveBest(run.thumbs);
    const g = JR.game.gradeOf(run.thumbs);
    JR.ui.showResult({
      grade: g[1],
      comment: g[2],
      thumbs: run.thumbs,
      scold: run.scold,
      best: S.best,
      isNewBest,
      low: run.thumbs < 50,
    });
  }

  JR.game = {
    update(dt) {
      const { config: C, state: S } = JR;
      const run = S.run;
      if (S.mode === 'pause') return;
      const playing = S.mode === 'play';

      if (S.mode === 'title') run.speed = 12;
      if (playing && !run.finish) {
        run.time += dt;
        run.speed = 11 + 29 * Math.pow(Math.min(1, run.time / 38), 1.6);
      }
      if (playing && run.finish) {
        // 결승이 가까워지면 감속하고 가운데 레인에 고정한다
        if (!run.finish.braking && run.finish.z <= C.ZP + 12) {
          run.finish.braking = true;
          run.lane = 1;
        }
        if (run.finish.braking) {
          run.speed *= Math.pow(0.03, dt);
          if (run.speed < 0.4) {
            run.speed = 0;
            if (run.endT < 0) run.endT = 0;
          }
        }
        run.time = Math.min(C.TOTAL, run.time + dt);
      }
      if (run.endT >= 0) {
        run.endT += dt;
        if (!run.confettiDone && run.endT > 0.15) {
          run.confettiDone = true;
          JR.world.fxFinish();
          JR.audio.playFinish();
        }
        if (run.endT > 2.1 && playing) finishRun();
      }

      const step = run.speed * dt;
      run.dist += step;
      // 타이틀 데모: 앞의 따봉 줄로 자동 이동
      if (S.mode === 'title') {
        const coin = run.objs.find((o) => o.t === 'coin' && o.z > C.ZP + 4 && o.z < C.ZP + 20);
        if (coin) run.lane = C.LANES.indexOf(coin.lx);
      }
      run.x += (C.LANES[run.lane] - run.x) * Math.min(1, dt * 14);

      if (!run.finish) {
        run.nextRow -= step;
        if (run.nextRow <= 0) spawnRow(!playing);
      }
      if (playing && !run.finish && run.time >= 38) {
        run.finish = { t: 'finish', lx: 0, z: C.ZFAR, braking: false };
        run.objs.push(run.finish);
      }

      run.inv = Math.max(0, run.inv - dt);
      for (const o of run.objs) {
        const pz = o.z;
        o.z -= step;
        if (o.done || !playing || o.t === 'finish') continue;
        // 플레이어 깊이 ZP ± 0.55 구간을 지나면서 레인 차이가 0.3 미만일 때
        if (pz > C.ZP - 0.55 && o.z < C.ZP + 0.55 && Math.abs(o.lx - run.x) < 0.3) {
          if (o.t === 'coin') {
            o.done = true;
            run.thumbs++;
            JR.world.fxCoin(o.lx, o.z);
            JR.audio.playCoin(run.thumbs);
          } else if (o.t === 'angry' && run.inv <= 0) {
            o.done = true;
            run.thumbs = Math.max(0, run.thumbs - 5);
            run.scold++;
            run.inv = 1.1;
            JR.world.fxHit(run.x);
            JR.audio.playHit();
          }
        }
      }
      run.objs = run.objs.filter((o) => o.z > C.ZNEAR && !(o.t === 'coin' && o.done));

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
      // 결승 접근 중에는 입력을 잠근다
      if (S.mode !== 'play' || (S.run.finish && S.run.finish.braking)) return;
      const lane = Math.max(0, Math.min(JR.config.LANES.length - 1, S.run.lane + d));
      if (lane === S.run.lane) return;
      S.run.lane = lane;
      JR.audio.playLane(d);
    },

    // GRADES의 해당 줄 [최소 따봉, 학점, 코멘트]
    gradeOf(n) {
      return JR.config.GRADES.find((g) => n >= g[0]);
    },
  };
})();
