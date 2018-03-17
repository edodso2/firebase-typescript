export class PlayerListener {
  player;

  constructor(player) {
    this.player = player;
    document.onkeydown = this.checkKey;
  }

  private checkKey(e) {
    e = e || window.event;

    if (e.keyCode == '38') {
      // up arrow
      up -= 5;
      this.player.element.style.top = `${up}px`;
    }
    else if (e.keyCode == '40') {
      // down arrow
      up += 5;
      this.player.element.style.top = `${up}px`;
    }
    else if (e.keyCode == '37') {
      // left arrow
      left -= 5;
      this.player.element.style.left = `${left}px`;
    }
    else if (e.keyCode == '39') {
      // right arrow
      left += 5;
      this.player.element.style.left = `${left}px`;
    }

    updatePos(left, up);
  }
}