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

var game = new Phaser.Game(config);

function preload() {
    this.load.image('bin', 'sprites/wastebin.png');
    this.load.image('ball', 'sprites/ball_white.png');
}


function create() {



    const opt = {
        columns: 20,
        rows: 12,
        rGap: 5,
        cGap: 5,
        brace: false,
        pRad: 8,

    }

    var w = game.config.width - 64;
    //    opt.cGap = (w/opt.columns+1)

    var col = 50;

    this.matter.world.setBounds(0, 0, game.config.width, game.config.height);

    for (var i = 0; i < 16; i++) {
        var ball = this.matter.add.image(Phaser.Math.Between(0, 640), Phaser.Math.Between(0, 100), 'ball');
        ball.setCircle(5);
        ball.setBounce(1);
        ball.setScale(2);
        ball.tint = Math.random() * 0xffffff;
        ball.setMass(1 + Math.random() * 50);
    }

    for (var i = 0; i < 5; i++) {
        var bin = this.matter.add.image(Phaser.Math.Between(32, 640), Phaser.Math.Between(0, 100), 'bin');
        bin.setScale(2);
        bin.tint = Math.random() * 0xffffff;
        bin.setMass(1 + Math.random() * 100);
    }

    this.matter.add.mouseSpring();


    //    this.blitter = this.add.blitter(0, 0, 'ball');



    const newBall = (x, y) => {
        return this.matter.add
            .image(x, y, 'ball')
            .setBody({
                type: 'circle'
            }, {
                collisionFilter: {
                    group: group,
                },
                chamfer: 5,
                density: 0.005,
                frictionAir: 0.05
            });
    }




    const group = this.matter.world.nextGroup(true);

    const particleOptions = {
        friction: 0.00001,
//        frame: 0,
        collisionFilter: {
            group: group
        },
        render: {
            visible: false
        }
    };
    const constraintOptions = {
        stiffness: 0.06,
        render: {
            lineColor: 0xff0000,
            lineOpacity: 1,
            visible: true,
            lineThickness: 4,
        }
    };

    // softBody: function (x, y, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions)



    this.cloth = this.matter.add.softBody(64, 64, opt.columns, opt.rows, opt.cGap, 5, false, 8, particleOptions, constraintOptions);
    let f = 0;
    for (let i = 0; i < this.cloth.bodies.length; i++) {
        const body = this.cloth.bodies[i];

        if (i < opt.columns) {
            body.isStatic = true;
//            newBall(body.x,body.y);
//            this.matter.add.image(body.x, body.y, ball);
        }

        body.ignoreGravity = true;

        if (this.cloth.bodies.length - i - 1 < opt.columns) {
            body.isStatic = true;
        }

        //         if (i % 20 === 0) {
        //             f++;
        //
        //             if (f > 5) {
        //                 f = 0;
        //             }
        //         }
        //
        //         body.gameObject = this.blitter.create(body.position.x, body.position.y, f);
    }
    
    
    
}

let framex = 0;
let framey = 0;

function update() {
    //    framea += 0.01;
    //    frameb += 0.01;   
    framey += 0.01;
    framex += 0.05;
    this.matter.world.engine.world.gravity.x = (Math.sin(framex) * 2);
    this.matter.world.engine.world.gravity.y = (Math.cos(framey) * 2);
}

window.addEventListener('resize', () => {
    game.resize(window.innerWidth, window.innerHeight);
});
//
//Events.on(engine, 'beforeUpdate', function () {
//    var gravity = engine.world.gravity;
//
//    if (true) {
//        for (let i = 0; i < this.cloth.bodies.length; i++) {
//            const body = this.cloth.bodies[i];
//
//            Body.applyForce(body, body.position, {
//                x: -gravity.x * gravity.scale * body.mass,
//                y: -gravity.y * gravity.scale * body.mass
//            });
//        }
//    }
//});
