let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            // gravity: { y: 10 },
            debug: false,
            setBounds: {
                x: 0,
                y: 0,
                height: 600,
                width: 800,
                thickness: 16
            }
        }
    },
    scene: [ Level1 ]
};

let game = new Phaser.Game(config);
