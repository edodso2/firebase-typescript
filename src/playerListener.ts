import * as firebase from 'firebase';
import { Player } from './player';

export class PlayerListener {
  player: Player;

  constructor(player) {
    this.player = player;
    document.addEventListener('keydown', this.checkKey.bind(this));
  }

  private checkKey(e) {
    e = e || window.event;

    let top = this.player.pos.top;
    let left = this.player.pos.left;

    if (e.keyCode == '38') {
      // up arrow
      top -= 5;
    }
    else if (e.keyCode == '40') {
      // down arrow
      top += 5;
    }
    else if (e.keyCode == '37') {
      // left arrow
      left -= 5;
    }
    else if (e.keyCode == '39') {
      // right arrow
      left += 5;
    }

    this.player.setPosition(top, left);
  }
}