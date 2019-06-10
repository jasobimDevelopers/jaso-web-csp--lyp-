window.addEventListener('load', () => {
  const addEventListener = 'addEventListener';
  const elems = document.getElementsByClassName('dragscroll');
  for (let i = 0; i < elems.length;) {
    ((elem, lastClientX, lastClientY, pushed) => {
      elem[addEventListener]('mousedown', (e) => {
        pushed = 1;
        lastClientX = e.clientX;
        lastClientY = e.clientY;

        e.preventDefault();
        e.stopPropagation();
      }, 0);

      window[addEventListener]('mousemove', (e) => {
        if (pushed) {
          elem.scrollLeft -=
            (-lastClientX + (lastClientX = e.clientX));
          elem.scrollTop -=
            (-lastClientY + (lastClientY = e.clientY));
        }
      }, 0);

      window[addEventListener]('mouseup', () => {
        pushed = 0;
      }, 0);
    })(elems[i += 1]);
  }
}, 0);
