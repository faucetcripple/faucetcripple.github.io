var config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
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
var sprite1;

let items = {
    ball: undefined,
};

function preload() {
    this.load.image('bin', 'sprites/wastebin.png');
    this.load.image('background', 'sprites/gym_bright.png');
    this.load.image('sky', 'sprites/sky_bright.png');
}

function create() {
    var sky = this.add.image(640, 20, 'sky');
    sky.setScale(2);
    var bg = this.add.image(640, 360, 'background');
    bg.setScale(2);
    this.matter.world.setBounds(0, 0, game.config.width, game.config.height - 25);
    for (var i = 0; i < 128; i++) {
        var bin = this.matter.add.image(Phaser.Math.Between(32, 1248), Phaser.Math.Between(0, 100), 'bin');
        bin.setBounce(0.2);
        bin.setScale(2);
        bin.tint = Math.random() * 0xffffff;
    }
    this.matter.add.mouseSpring();
}
