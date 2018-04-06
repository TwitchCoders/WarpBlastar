/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2018 Digitsensitive
 * @license      Digitsensitive
 */

export class MainScene extends Phaser.Scene {
  private phaserSprite: Phaser.GameObjects.Sprite;

  constructor() {
    super({
      key: "MainScene"
    });
  }

  preload(): void {
    this.load.image("player", "../assets/warpblastar/ship-level1.gif");
  }

  create(): void {
    this.phaserSprite = this.add.sprite(25, 22, "player");
  }
}
