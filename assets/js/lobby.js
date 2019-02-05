window.onload = function() {
  Array.from(document.getElementsByClassName('cg-board-wrap'))
    .forEach(Chessground);
}

function resizeBoard() {
  const ev = document.createEvent('Event');
  ev.initEvent('chessground.resize', false, false);
  document.body.dispatchEvent(ev);
}

window.addEventListener('resize', resizeBoard);
