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
            debug: true,
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
    this.load.image('ball', 'sprites/ring.png');
    this.load.image('link', 'sprites/link.png');

    this.load.json('outlines', 'sprites/mult3.json');
}

function create() {

    var junkamount = 4;

    var shapes = this.cache.json.get('outlines');
        for (var i = 0; i < junkamount; i++) {
            var head = this.matter.add.sprite(10, 10, 'head', null, {
                shape: shapes.head
            });

            head.setScale(4);
            //        head.setMass(10);

        }

        //    var shapes = this.cache.json.get('outlines');
        for (var i = 0; i < junkamount; i++) {
            var head = this.matter.add.sprite(10, 10, 'shirt', null, {
                shape: shapes.shirt
            });
            head.tint = Math.random() * 0xffffff;
            head.setScale(4);

        }


        //    var shapes = this.cache.json.get('outlines');
        for (var i = 0; i < junkamount; i++) {
            var head = this.matter.add.sprite(10, 10, 'leg', null, {
                shape: shapes.legstand // the fucking filename
            });

            head.setScale(4);
            head.tint = Math.random() * 0xffffff;

        }
        //    var shapes = this.cache.json.get('outlines');
        for (var i = 0; i < junkamount; i++) {
            var head = this.matter.add.sprite(10, 10, 'rhand', null, {
                shape: shapes.rhand // the fucking filename
            });

            head.setScale(4);

        }
        //    var shapes = this.cache.json.get('outlines');
        for (var i = 0; i < junkamount; i++) {
            var head = this.matter.add.sprite(10, 10, 'lhand', null, {
                shape: shapes.lhand // the fucking filename
            });

            head.setScale(4);

        }//
//    let xoff = 10;
//    for (var i = 0; i < junkamount; i++) {
//        head = this.matter.add.sprite(xoff += 32, 10, 'logo', null, {
//            shape: shapes.logo // the fucking filename
//        });
//        head.setScale(.5);
//    }
//
//




    this.matter.world.setBounds(0, 0, game.config.width, game.config.height);

    function tentacle() {

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
        //    block.tint = Math.random() * 0xffffff;
        //    block.tint = Math.random() * 0x111111;;
        block.tint = 0x111111;
        block.body.isStatic = false;
        block.setDepth(depth - 2);
        //    block.body.shape = 'circle';

        var y = opt.y;
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

            rotlinks.push(ball);

            this.matter.add.joint(prev, ball, (i === 0) ? 30 : 16, 1);

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


    this.matter.add.mouseSpring();

    cursors = this.input.keyboard.createCursorKeys();
}


let framex = 0;
let framey = 0;

function update() {

    // works well
    //    for (let i = 1; i < rotlinks.length; i++){
    //        rotlinks[i].rotation = ((rotlinks[i].x - rotlinks[i-1].x)*-1)/22;
    //    }

    framex += 0.01;
    //    framey += 0.01;
    this.matter.world.engine.world.gravity.x = (Math.sin(framex) * 4);
    this.matter.world.engine.world.gravity.y = (Math.cos(framey) * 2);


    //    for (let i = 1; i < rotlinks.length; i++) {
    //
    //        if (rotlinks[i - 1].y < rotlinks[i].y) {
    //            //below y    
    //            rotlinks[i].rotation = ((rotlinks[i].x - rotlinks[i - 1].x) * -1) / 16;
    //        } else {
    //            //above y
    //            rotlinks[i].rotation = ((rotlinks[i].x - rotlinks[i - 1].x) * 1) / 16;
    //        }
    //    }

    /*if (cursors.left.isDown) {
        console.log('left is down');
        block.setVelocityX(-20);
    } else if (cursors.right.isDown) {
        block.setVelocityX(20);
    } else {
        block.setVelocityX(0);
    }

    if (cursors.up.isDown) {
        block.setVelocityY(-20);
    } else if (cursors.down.isDown) {
        block.setVelocityY(20);
    } else {
        block.setVelocityY(0);
    }*/
}
