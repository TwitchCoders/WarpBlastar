class Level1 extends Phaser.Scene {

    constructor() {
        super({ key: 'Level1' });

        this.asteroids = [];
        this.missiles = [];
        this.firing = false;
        this.score = 0;
    }

    preload() {
        this.load.image('sky', 'src/assets/sky.jpg');
        this.load.image('ship', 'src/assets/kenney_spaceshooterextension/PNG/Sprites/Ships/spaceShips_001.png');
        this.load.image('missile', 'src/assets/kenney_spaceshooterextension/PNG/Sprites/Missiles/spaceMissiles_001.png');
        this.load.image('asteroid', 'src/assets/kenney_spaceshooterextension/PNG/Sprites/Meteors/spaceMeteors_001.png');
        this.load.audio('fire', 'src/assets/soundfx/gameburp/TECH WEAPON Gun Shot Phaser Down 02.wav');
        this.load.audio('explode', 'src/assets/soundfx/gameburp/EXPLOSION Bang 04.wav');
        this.load.audio('gameover', 'src/assets/soundfx/gameburp/NEGATIVE Failure Descending Chime 05.wav');
    }

    create() {
        console.log(this);
        this.add.image(0, 100, 'sky');
        this.scoreText = this.add.text(10, 10, 'score: 0', { fontSize: '16px', fill: '#fff' });

        this.player = this.physics.add.sprite(Phaser.Math.RND.integerInRange(50, 750), Phaser.Math.RND.integerInRange(50, 450), 'ship');
        this.player.angle = -90;
        this.player.setDisplaySize(50, 50);
        this.player.setBounce(0.5);
        this.player.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.fire = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.input.keyboard.addKeyCapture([Phaser.Input.Keyboard.KeyCodes.SPACE]);

        this.fireSound = this.sound.add('fire');
        this.fireSound.volume = 0.04;

        this.explosionSound = this.sound.add('explode');
        this.explosionSound.volume = 0.1;

        this.gameoverSound = this.sound.add('gameover');
        this.gameoverSound.volume = 0.2;

        this.createAsteroids();
        // this.time.addEvent({ delay: 2000, callback: this.createAsteroids(), callbackScope: this, loop: true });
    }

    createAsteroids() {
        console.log('adding');
        for(let i = 0; i < Phaser.Math.RND.integerInRange(0, 5); i++) {
            const asteroid = this.physics.add.sprite(850, Phaser.Math.RND.integerInRange(100, 700), 'asteroid');
            asteroid.setVelocityX(-50);
            asteroid.setDisplaySize(100, 100);
            this.missiles.map((missile) => this.physics.add.overlap(missile, asteroid, this.shootAsteroid, null, this));
            this.asteroids.push(asteroid);
        }
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

        this.asteroids.map((asteroid) => this.physics.add.overlap(this.player, asteroid, this.hitAsteroid, null, this));

        if (this.fire.isDown) {
            if (!this.firing) {
                this.firing = true;
                this.fireSound.play();
                const missile = this.physics.add.image(this.player.x + 30, this.player.y, 'missile');
                missile.angle = 90;
                missile.setVelocityX(200);
                this.asteroids.map((asteroid) => this.physics.add.overlap(missile, asteroid, this.shootAsteroid, null, this));
                console.log(missile);
                this.missiles.push(missile);

            }
        } else if (this.fire.isUp) {
            this.firing = false;
        }
    }

    shootAsteroid(missile, asteroid) {
        missile.disableBody(true, true);
        asteroid.disableBody(true, true);
        this.explosionSound.play();
        this.score += 10;
        this.scoreText.setText('score: ' + this.score);
        this.missiles.filter((item) => item !== missile);
    }

    hitAsteroid(player, asteroid) {
        player.disableBody(true, true);
        asteroid.disableBody(true, true);
        this.explosionSound.play();
        this.scoreText = this.add.text(400, 300, 'GAME OVER', { fontSize: '64px', fill: '#f00' });
        this.gameoverSound.play();
    }
}
