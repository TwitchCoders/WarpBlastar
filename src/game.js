let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            // gravity: { y: 10 },
            debug: false
        }
    },
    scene: [ Level1 ]
};

let game = new Phaser.Game(config);
