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
    rings: 24,
    x: game.config.width / 2,
    y: game.config.height / 2,
    frictionAir: 0.01,
    scaledown: 8,
    //    scaleinc: 0.3,
    scaleinc: 0.2,
    headmass: 500,
}

let shapes = undefined;

let framex = 0;
let framey = 0;

//var scaledown = 8;
//var scaleinc = 0.3;

var rotlinks = [];
var depth = 4;

function preload() {
    this.load.image('head', 'sprites/head.png');
    this.load.image('shirt', 'sprites/shirt.png');
    this.load.image('leg', 'sprites/legstand.png');
    this.load.image('lhand', 'sprites/lhand.png');
    this.load.image('rhand', 'sprites/rhand.png');
    this.load.image('logo', 'sprites/logo.png');
    //    this.load.image('leg', 'sprites/legstand.png');

    this.load.image('block', 'sprites/ball_white.png');
    this.load.image('ring', 'sprites/ring.png');
    this.load.image('link', 'sprites/link.png');

    this.load.json('outlines', 'sprites/mult5.json');
}

function create() {

    shapes = this.cache.json.get('outlines');

    function spawnCrap(dis, imgkey, shapekey, amount = 4, isTint = false) {

        for (var i = 0; i < amount; i++) {
            var obj = dis.matter.add.sprite(opt.x, opt.y, imgkey, null, {
                shape: shapes[shapekey] // the fucking filename
            });

            obj.setScale(4);

            if (isTint) {
                obj.tint = Math.random() * 0xffffff;
            }
        }
        return obj;

    }

    spawnCrap(this, 'head', 'head', 8);
    spawnCrap(this, 'shirt', 'shirt', 6, true);
    spawnCrap(this, 'leg', 'legstand', 6, true);
    spawnCrap(this, 'rhand', 'rhand', 6);
    spawnCrap(this, 'lhand', 'lhand', 6);
    spawnCrap(this, 'ring', 'ring', 6, true);


    this.matter.world.setBounds(0, 0, game.config.width, game.config.height);

    // grouping chain together for no collision jitter.
    const group = this.matter.world.nextGroup(true);
    // block chain is fixed to:

    function makeTentacle(dis) {
        block = dis.matter.add.image(opt.x, opt.y, 'block', null, {
            shape: shapes.ring,
            ignoreGravity: true,
            collisionFilter: {
                group: group
            }
        });
        block.setFixedRotation();
        block.setMass(opt.headmass);
        block.setScale(8);
        block.tint = 0x111111;
        block.body.isStatic = true;
        block.setDepth(depth - 2);

        var y = opt.y;
        var prev = block;

        for (var i = 0; i < opt.rings; i++) {
            if (i % 2 == 0) {
                var ball = dis.matter.add.image(opt.x, y, 'ring', null, {
                    shape: shapes.ring,
                    mass: 1,
                    collisionFilter: {
                        group: group
                    },
                });

                ball.tint = 0x222222;
            } else {
                var ball = dis.matter.add.image(opt.x, y, 'link', null, {
                    shape: shapes.link,
                    mass: 1,
                    collisionFilter: {
                        group: group
                    },
                });

                ball.tint = 0x444444;

            }

            rotlinks.push(ball);

            dis.matter.add.joint(prev, ball, (i === 0) ? 30 : 16, 1);

            prev = ball;
            ball.setScale(opt.scaledown -= opt.scaleinc);

            if (i % 2 == 1) {
                ball.setDepth(depth++);
            } else {
                ball.setDepth(depth - 2);
            }

            y += 18;
        }
    }

    //    makeTentacle(this);

    this.matter.add.mouseSpring();
    //    cursors = this.input.keyboard.createCursorKeys();
}




function update() {

    framex += 0.01;
    framey += 0.03;
    this.matter.world.engine.world.gravity.x = (Math.sin(framex) * 2);
    this.matter.world.engine.world.gravity.y = (Math.cos(framey) * 2);

    for (let i = 1; i < rotlinks.length; i++) {

        if (rotlinks[i - 1].y < rotlinks[i].y) {
            //below y    
            rotlinks[i].rotation = ((rotlinks[i].x - rotlinks[i - 1].x) * -1) / 16;
        } else {
            //above y
            rotlinks[i].rotation = ((rotlinks[i].x - rotlinks[i - 1].x) * 1) / 16;
        }
    }

}
