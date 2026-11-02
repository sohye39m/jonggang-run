// 담당: MinjooSong0708 — 키보드, 터치, 화면 가려짐 감지 (SPEC.md 2절, 7절).
// 입력을 JR.game 의 start / pause / move 로 전달하기만 한다. mode 는 읽기만 한다.
(() => {
  const JR = (window.JR = window.JR || {});

  const MOVE_PX = 30; // 이 거리보다 많이 밀면 레인 이동
  const TAP_PX = 10; // 이 거리보다 적게 움직이고 떼면 탭

  function onKeyDown(e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return; // Cmd+A 같은 단축키는 건드리지 않는다
    const c = e.code;
    const k = e.key;
    // P, Esc (한글 입력 상태에서는 P 자리에 ㅔ 가 들어온다)
    const isPause = c === 'KeyP' || k === 'p' || k === 'P' || k === 'ㅔ' || k === 'Escape';
    const isSpace = c === 'Space' || k === ' ';
    const isEnter = c === 'Enter' || c === 'NumpadEnter';
    const isLeft = c === 'ArrowLeft' || c === 'KeyA';
    const isRight = c === 'ArrowRight' || c === 'KeyD';

    // 방향키와 Space 는 화면이 스크롤되거나 포커스된 버튼이 눌리지 않게 막는다
    if (c === 'ArrowLeft' || c === 'ArrowRight' || c === 'ArrowUp' || c === 'ArrowDown' || isSpace) {
      e.preventDefault();
    }

    const mode = JR.state.mode;
    if (mode === 'play') {
      if (isLeft) JR.game.move(-1);
      else if (isRight) JR.game.move(1);
      else if (isPause && !e.repeat) JR.game.pause(true); // 꾹 눌러도 한 번만
    } else if (mode === 'pause') {
      if ((isPause && !e.repeat) || (isSpace && !e.repeat)) JR.game.pause(false);
    } else if (mode === 'title' || mode === 'over') {
      if (isSpace || isEnter) {
        // 포커스된 버튼이 Enter 로 한 번 더 눌려 start 가 두 번 불리는 것을 막는다.
        // 꾹 누르고 있는 키로 결과 화면에서 바로 재시작되는 것도 막는다.
        e.preventDefault();
        if (!e.repeat) JR.game.start();
      }
    }
  }

  // 화면을 밀면 레인 이동, 좌우 절반을 탭해도 레인 이동 (모바일)
  function bindPointer() {
    const cv = document.getElementById('c');
    let down = null;

    cv.addEventListener('pointerdown', (e) => {
      down = { x: e.clientX, y: e.clientY };
    });
    cv.addEventListener('pointerup', (e) => {
      if (!down || JR.state.mode !== 'play') {
        down = null;
        return;
      }
      const dx = e.clientX - down.x;
      const dy = e.clientY - down.y;
      down = null;
      if (Math.abs(dx) > MOVE_PX && Math.abs(dx) > Math.abs(dy)) {
        JR.game.move(dx > 0 ? 1 : -1);
      } else if (Math.abs(dx) < TAP_PX && Math.abs(dy) < TAP_PX) {
        JR.game.move(e.clientX < window.innerWidth / 2 ? -1 : 1);
      }
    });
    cv.addEventListener('pointercancel', () => {
      down = null;
    });
  }

  JR.input = {
    init() {
      // 캡처 단계에서 받아서, 포커스된 버튼보다 먼저 처리한다
      window.addEventListener('keydown', onKeyDown, true);
      bindPointer();
      // 탭 전환 등으로 화면이 가려지면 자동 일시정지
      document.addEventListener('visibilitychange', () => {
        if (document.hidden && JR.state.mode === 'play') JR.game.pause(true);
      });
    },
  };
})();
