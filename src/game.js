let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'container',
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
    scene: {
        preload: preload,
        create: create,
        update: update,
        extend: {
            checkBoundaries: checkBoundaries,
            createAsteroids: createAsteroids,
            shootAsteroid: shootAsteroid,
            hitAsteroid: hitAsteroid,
            updateDebugInfo: updateDebugInfo,
            displayHealth: displayHealth,
            createPowerUp: createPowerUp,
            gainPower: gainPower
        }
    }
};

let game = new Phaser.Game(config);

let asteroids = [];
let missiles = [];
let healthBar = [];
let firing = false;
let score = 0;
let scoreText;
let debugText;

function preload() {
    this.load.image('space', 'src/assets/space.jpg');
    this.load.image('ship', 'src/assets/kenney_spaceshooterextension/PNG/Sprites/Ships/spaceShips_001.png');
    this.load.image('missile', 'src/assets/kenney_spaceshooterextension/PNG/Sprites/Missiles/spaceMissiles_001.png');
    this.load.image('asteroid', 'src/assets/kenney_spaceshooterextension/PNG/Sprites/Meteors/spaceMeteors_001.png');
    this.load.image('powerUp', 'src/assets/kenney_spaceshooterextension/PNG/Sprites/Astronauts/spaceAstronauts_016.png');
    this.load.image('heart', 'src/assets/custom/heart.png');
    this.load.image('shield', 'src/assets/custom/heart-shield.png');
    this.load.audio('background', 'src/assets/Magna_Ingress_-_10_-_Letting_Go.mp3');
    this.load.audio('fire', 'src/assets/soundfx/gameburp/TECH WEAPON Gun Shot Phaser Down 02.wav');
    this.load.audio('explode', 'src/assets/soundfx/gameburp/EXPLOSION Bang 04.wav');
    this.load.audio('gameover', 'src/assets/soundfx/gameburp/NEGATIVE Failure Descending Chime 05.wav');
}

function create() {
    this.backgroundMusic = this.sound.add('background');
    this.backgroundMusic.volume = 0.05;
    this.backgroundMusic.play();

    this.add.image(0, 100, 'space');
    scoreText = this.add.text(10, 10, 'score: 0', { fontSize: '16px', fill: '#fff' });
    debugText = this.add.text(800, 600, 'Asteroids --- | Missiles ---').setDepth(1000).setFont('14px Arial').setColor('#66ff66').setShadow(2, 2, '#333333', 2).setAlign('right');
    debugText.setOrigin(1);

    this.player = this.physics.add.sprite(Phaser.Math.RND.integerInRange(50, 100), Phaser.Math.RND.integerInRange(50, 450), 'ship');
    this.player.powers = [];
    this.player.depth = 20;
    this.player.angle = -90;
    this.player.health = 5;
    this.player.setDisplaySize(50, 50);
    this.player.setBounce(0.5);
    this.player.setCollideWorldBounds(true);
    this.displayHealth();

    this.cursors = this.input.keyboard.createCursorKeys();

    this.fire = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.input.keyboard.addKeyCapture([Phaser.Input.Keyboard.KeyCodes.SPACE]);

    this.fireSound = this.sound.add('fire');
    this.fireSound.volume = 0.04;

    this.explosionSound = this.sound.add('explode');
    this.explosionSound.volume = 0.1;

    this.gameoverSound = this.sound.add('gameover');
    this.gameoverSound.volume = 0.2;

    this.time.addEvent({ delay: 2000, callback: this.createAsteroids, callbackScope: this, loop: true });
    this.time.addEvent({ delay: 1000, callback: this.checkBoundaries, callbackScope: this, loop: true });
    this.time.addEvent({ delay: 100, callback: this.updateDebugInfo, callbackScope: this, loop: true });
    this.time.addEvent({ delay: 5000, callback: this.createPowerUp, callbackScope: this, loop: true });
}

function update() {
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

    if (this.fire.isDown) {
        if (!firing) {
            firing = true;
            this.fireSound.play();
            const missile = this.physics.add.image(this.player.x + 30, this.player.y, 'missile');
            missile.angle = 90;
            missile.setVelocityX(300);
            asteroids.map((asteroid) => this.physics.add.overlap(missile, asteroid, this.shootAsteroid, null, this));
            missiles.push(missile);

        }
    } else if (this.fire.isUp) {
        firing = false;
    }

    asteroids.forEach((asteroid) => {
        this.physics.add.overlap(this.player, asteroid, this.hitAsteroid, null, this);
        asteroid.rotation += asteroid.rotationValue;
    });
}

function createAsteroids(location, generation = 1, scale = 100) {
    if (generation > 2) {
        return null;
    }

    for (let i = 0; i < Phaser.Math.RND.integerInRange(0, 5); i++) {
        scale = Phaser.Math.RND.integerInRange(30, scale);
        const speed = Phaser.Math.RND.integerInRange(1, 5);

        if (!location) {
            location = new Phaser.Geom.Point(850, Phaser.Math.RND.integerInRange(scale, 600 - scale));
        }

        const asteroid = this.physics.add.sprite(location.x, location.y, 'asteroid');
        asteroid.depth = 5;
        asteroid.setVelocityX(-50 * speed);
        asteroid.setVelocityY(Phaser.Math.RND.integerInRange(-20 * generation, 20 * generation) * speed);
        asteroid.setDisplaySize(scale, scale);

        asteroid.scale = scale;
        asteroid.generation = generation;

        const rotate = (120 - scale);
        asteroid.rotationValue = Phaser.Math.RND.integerInRange(-rotate, rotate) / 500;
        asteroid.scoreValue = Phaser.Math.CeilTo(((150 - scale) * (5 * speed)) / 200);

        missiles.map((missile) => this.physics.add.overlap(missile, asteroid, this.shootAsteroid, null, this));
        asteroids.push(asteroid);
    }
}

function checkBoundaries() {
    asteroids = asteroids.filter((asteroid) => {
        if (asteroid.x < 0) {
            asteroid.disableBody(true, true);
            return false;
        }
        return true;
    });

    missiles = missiles.filter((missile) => {
        if (missile.x > 800) {
            missile.disableBody(true, true);
            return false;
        }
        return true;
    });
}

function shootAsteroid(missile, asteroid) {
    missile.disableBody(true, true);
    asteroid.disableBody(true, true);

    this.explosionSound.play();

    const generation = asteroid.generation + 1;
    this.createAsteroids(new Phaser.Geom.Point(asteroid.x, asteroid.y), generation, asteroid.scale);

    score += asteroid.scoreValue;
    scoreText.setText('score: ' + score);
    missiles = missiles.filter((item) => item !== missile);
    asteroids = asteroids.filter((item) => item !== asteroid);
}

function hitAsteroid(player, asteroid) {
    asteroid.disableBody(true, true);

    const shield = player.powers.find((power) => power.name === 'shield');
    if (shield !== undefined) {
        player.powers = player.powers.filter((power) => power.name !== 'shield');
        this.displayHealth();
        return;
    }

    healthBar.pop().disableBody(true, true);
    if (this.player.health > 1) {
        this.player.health -= 1;
        return;
    }

    player.disableBody(true, true);
    this.explosionSound.play();
    this.gameoverSound.play();

    missiles.forEach((missile) => missile.disableBody(true, true));
    missiles = [];

    const gameOver = this.add.text(400, 300, 'GAME OVER').setDepth(1000).setFont('64px Arial').setColor('#ff6666').setShadow(2, 2, '#333333', 2).setAlign('center');
    gameOver.setOrigin(0.5);
}

function updateDebugInfo() {
    debugText.setText(`Asteroids ${asteroids.length} | Missiles ${missiles.length}`);
}

function gainPower(player, power) {
    player.powers.push({ name: 'shield' });
    power.disableBody(true, true);
    this.displayHealth(true);
}

function displayHealth(shield = false) {
    while(healthBar.length > 0) {
        healthBar.pop().disableBody(true, true);
    }

    for (let i = 0; i < this.player.health; i++) {
        const heart = this.physics.add.sprite(25 + (50 * i), 570, shield ? 'shield' : 'heart');
        heart.depth = 10;
        healthBar.push(heart);
    }
}

function createPowerUp() {
    const powerUp = this.physics.add.sprite(800, Phaser.Math.RND.integerInRange(50, 550), 'powerUp');
    powerUp.angle = 180;
    powerUp.setVelocityX(-200);
    powerUp.setVelocityY(Phaser.Math.RND.integerInRange(-200, 200));
    this.physics.add.overlap(this.player, powerUp, this.gainPower, null, this);
}
