var config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    parent: 'game',
    pixelArt: true,
    scene: {
        preload: preload,
        create: create
    },
    physics: {
        default: "matter",
        matter: {
            debug: false
        }
    }
};

var game = new Phaser.Game(config);

function preload() {

    this.load.image('ball', 'sprites/ball_white.png');
    this.load.image('background', 'sprites/gym_bright.png');
    this.load.image('sky', 'sprites/sky_bright.png');

}

function create() {

    this.add.image(320, 10, 'sky');
    this.add.image(320, 180, 'background');

    this.matter.world.setBounds(0, 0, game.config.width, game.config.height - 25);

    for (var i = 0; i < 255; i++) {
        var ball = this.matter.add.image(Phaser.Math.Between(0, 640), Phaser.Math.Between(0, 100), 'ball');
        ball.setCircle(5);
        ball.setBounce(1);
        ball.setScale(2);
        ball.tint = Math.random() * 0xffffff;
    }

    this.matter.add.mouseSpring();

}
