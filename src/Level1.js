class Level1 extends Phaser.Scene {

    constructor() {
        super({ key: 'Level1' });
    }


    preload() {
        this.load.image('sky', 'src/assets/sky.jpg');
        this.load.spritesheet('ship', 'src/assets/ships.gif', { frameWidth: 34, frameHeight: 65 });
    }

    create() {
        this.add.image(0, 100, 'sky');

        this.platforms = this.physics.add.staticGroup();

        this.player = this.physics.add.sprite(100, 450, 'ship');
        this.player.setBounce(0.5);
        this.player.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard.createCursorKeys();
    }


    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
        }
        else {
            this.player.setVelocityX(0);
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-160);
        }
        else if (this.cursors.down.isDown) {
            this.player.setVelocityY(160);
        }
        else {
            this.player.setVelocityY(0);
        }

        // if (cursors.up.isDown && player.body.touching.down)
        // {
        //     player.setVelocityY(-330);
        // }
    }
}
