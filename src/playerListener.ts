export class PlayerListener {
  player;

  constructor(player) {
    this.player = player;
    document.onkeydown = this.checkKey;
  }

  private checkKey(e) {
    // key funcinality here
  }
}