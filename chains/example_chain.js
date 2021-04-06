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
    backgroundColor: "#151525",
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: "matter",
        matter: {
            debug: false,
        }
    }
};



var block;
var cursors;

var game = new Phaser.Game(config);

const opt = {
    rings: 12,
    x: game.config.width / 2,
    //    y: game.config.height / 2,
    y: 120,
    //    frictionAir: 0.01,
    scaledown: 6,
    //    scaleinc: 0.3,
    scaleinc: 0,
    headmass: 5000,
    distBlock: 64,
    distLink: 36,
    isTinting: false,
    //    collideSelf: false,
}

var rotlinks = [];
var depth = 4;

function preload() {
    this.load.image('block', '../sprites/ball_white.png');
    this.load.image('ball', '../sprites/ring.png');
    this.load.image('link', '../sprites/link.png');
}

function create() {
    this.matter.world.setBounds(0, 0, game.config.width, game.config.height);
    // grouping chain together for no collision jitter.

    const group = this.matter.world.nextGroup(true);
    // block chain is fixed to:
    block = this.matter.add.image(opt.x, opt.y, 'block', null, {
        shape: 'circle',
        ignoreGravity: true,
        collisionFilter: {
            group: group
        }
    });
    block.setFixedRotation();
    block.setMass(opt.headmass);
    block.setScale(8);
    //    block.height = 32;

    if (opt.isTinting) {
        block.tint = Math.random() * 0xffffff;
    } else {
        block.tint = 0x111111;
    }


    block.body.isStatic = true;
    block.setDepth(depth - 2);

    var y = opt.y + opt.distLink;
    var prev = block;




    for (var i = 0; i < opt.rings; i++) {

        if (i % 2 == 0) {
            var ball = this.matter.add.image(opt.x, y, 'ball', null, {
                shape: 'circle',
                mass: 1,
                collisionFilter: {
                    group: group
                },
            });

            ball.tint = 0x222222;
        } else {
            var ball = this.matter.add.image(opt.x, y, 'link', null, {
                shape: 'circle',
                mass: 1,
                collisionFilter: {
                    group: group
                },
            });

            ball.tint = 0x444444;

        }

        // keeping array of items in chain for comparing.
        rotlinks.push(ball);


        this.matter.add.joint(prev, ball, (i === 0) ? opt.distBlock : opt.distLink, 1);

        prev = ball;

        if (opt.isTinting) {
            ball.tint = Math.random() * 0xffffff;
        }


        ball.setScale(opt.scaledown -= opt.scaleinc);

        // the lower the link; the closer to front
        // while alternating links above rings below.
        if (i % 2 == 1) {
            ball.setDepth(depth++);
        } else {
            ball.setDepth(depth - 2);
        }

        y += opt.distLink;
    }

    this.matter.add.mouseSpring();


}


let framex = 0;

function update() {

    // swing gravity on x.
    framex += 0.03;
    this.matter.world.engine.world.gravity.x = (Math.sin(framex) / 4);

    function rotateLinksProper() {
        // weak approximation done with little thought
        // if you know the correct way please enlighten me.
        for (let i = 1; i < rotlinks.length; i++) {
            if (rotlinks[i - 1].y < rotlinks[i].y) {
                //below y axis   
                rotlinks[i].rotation = ((rotlinks[i].x - rotlinks[i - 1].x) * -1) / (opt.distLink);
            } else {
                //above y axis
                rotlinks[i].rotation = ((rotlinks[i].x - rotlinks[i - 1].x) * 1) / (opt.distLink);
            }
        }
    }

    rotateLinksProper();


}
