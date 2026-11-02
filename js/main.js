// 담당: uoona-svg — 폰트 대기, boot, 프레임 반복 (SPEC.md 6절).
// 공개하는 이름 없음. 다른 파일의 호출은 boot 이후에만 한다.
(() => {
  const JR = (window.JR = window.JR || {});

  let last = 0;
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    JR.game.update(dt);
    JR.world.render(now / 1000);
    if (JR.state.mode === 'play') JR.ui.updateHud();
    requestAnimationFrame(frame);
  }

  function boot() {
    JR.sprites.build();
    JR.world.resize();
    JR.ui.init();
    JR.input.init();
    last = performance.now();
    requestAnimationFrame(frame);
  }

  // 폰트가 늦어도 1.5초 뒤에는 시작한다
  const fontsReady = document.fonts
    ? Promise.race([
        Promise.all([
          document.fonts.load("96px 'Black Han Sans'"),
          document.fonts.load("800 22px 'Gothic A1'"),
        ]),
        new Promise((r) => setTimeout(r, 1500)),
      ])
    : Promise.resolve();
  fontsReady.then(boot, boot);
})();
