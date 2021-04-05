var global = {
    scene: undefined
};

var config = {
    type: Phaser.AUTO,
    width: innerWidth,
    height: innerHeight,
    scale: {
        mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    parent: 'game',
    pixelArt: true,
    backgroundColor: "#150000",
    scene: {
        preload: preload,
        create: create,
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

    global.scene = this;

    for (var i = 0; i < 64; i++) {
        var ball = this.matter.add.image(Phaser.Math.Between(0, game.config.width), Phaser.Math.Between(0, game.config.height), 'ball');
        ball.setCircle(5);
        ball.setBounce(1);
        ball.setScale(2);
        ball.setMass(1 + Math.random() * 10);
        ball.tint = Math.random() * 0xffffff;
    }

    for (var i = 0; i < 32; i++) {
        var bin = this.matter.add.image(Phaser.Math.Between(0, game.config.width), Phaser.Math.Between(0, game.config.height), 'bin');
        bin.setScale(2);
        bin.tint = Math.random() * 0xffffff;
        bin.setMass(1 + Math.random() * 100);
    }

    this.matter.add.mouseSpring();


    // Orientation Check
    var supportsOrientation = "No"
    if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", deviceOrientationListener);
        var supportsOrientation = "Yes";

        //            screen.orientation.lock('portrait');
    } else {
        document.getElementById("readoutE").innerHTML = "No Support!"
    }
    //END Check to see if browser supports motion

    function deviceOrientationListener(event) {
        document.getElementById('readoutA').textContent = Math.round(event.alpha);
        document.getElementById('readoutB').textContent = Math.round(event.beta);
        global.scene.matter.world.engine.world.gravity.y = (Math.round(event.beta) / 180)*-1.2;
        document.getElementById('readoutG').textContent = Math.round(event.gamma);
        global.scene.matter.world.engine.world.gravity.x = (Math.round(event.gamma) / 90)*-1.2;
    }


}
