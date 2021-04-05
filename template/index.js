var config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    parent: 'game',
    pixelArt: true,
    backgroundColor: "#151525",
    scene: {
        preload: preload,
        create: create,
        update: update
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
    this.load.image('bin', 'sprites/wastebin.png');
    this.load.image('ball', 'sprites/ball_white.png');
}


function create() {
    this.matter.world.setBounds(0, 0, game.config.width, game.config.height);

    for (var i = 0; i < 164; i++) {
        var ball = this.matter.add.image(Phaser.Math.Between(0, 640), Phaser.Math.Between(0, 100), 'ball');
        ball.setCircle(5);
        ball.setBounce(1);
        ball.setScale(2);
        ball.tint = Math.random() * 0xffffff;
    }

    for (var i = 0; i < 32; i++) {
        var bin = this.matter.add.image(Phaser.Math.Between(32, 640), Phaser.Math.Between(0, 100), 'bin');
        bin.setScale(2);
        bin.tint = Math.random() * 0xffffff;
        ball.setMass(1+Math.random()*100);
    }

    this.matter.add.mouseSpring();
    
}

let framea = 0;
let frameb = 0;

function update() {
//    framea += 0.01;
//    frameb += 0.01;   
    framea += 0.04;
    frameb += 0.005;
    this.matter.world.engine.world.gravity.x = (Math.sin(framea) * 2);
    this.matter.world.engine.world.gravity.y = (Math.cos(frameb) * 2);
}
