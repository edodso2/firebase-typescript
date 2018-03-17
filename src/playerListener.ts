import * as firebase from 'firebase';

export class PlayerListener {
  player;

  constructor(player) {
    this.player = player;
   // document.onkeydown = this.checkKey;
   let _this = this;
   document.addEventListener('keydown', this.checkKey.bind(this));
  }

  private checkKey(e) {
    e = e || window.event;

    if (e.keyCode == '38') {
      // up arrow
      this.player.pos.top -= 5;
    }
    else if (e.keyCode == '40') {
      // down arrow
      this.player.pos.top += 5;
    }
    else if (e.keyCode == '37') {
      // left arrow
      this.player.pos.left -= 5;
    }
    else if (e.keyCode == '39') {
      // right arrow
      this.player.pos.left += 5;
    }

    this.player.element.style.left = this.player.pos.left + 'px';
    this.player.element.style.top = this.player.pos.top + 'px';

    this.updatePos(this.player.pos.left, this.player.pos.top);
  }

  // update position in database. when the position
  // is updated the above 'on' function is called.
  private updatePos(left, top) {
    firebase.database().ref('/' + this.player.identifier).set({
      left,
      top
    });
  }
}