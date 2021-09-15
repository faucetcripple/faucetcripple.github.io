var config = {
    type: Phaser.AUTO,
    //    width: innerWidth,
    width: 640,
    height: 360,
    //    height: innerHeight,
    scale: {
        mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    parent: 'game',
    pixelArt: true,
    backgroundColor: "#151525",
    //    backgroundColor: "#FFFF00",
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: "matter",
        matter: {
            enableSleeping: true,
            debug: {

                showAxes: true,
                showAngleIndicator: true,
                angleColor: 0xffffff,

                showBroadphase: false,
                broadphaseColor: 0xff00ff,

                showBounds: false,
                boundsColor: 0xffffff,

                showVelocity: true,
                velocityColor: 0x00aeef,

                showCollisions: true,
                collisionColor: 0xf5950c,

                showSeparations: true,
                separationColor: 0xffa500,

                showBody: true,
                showStaticBody: false,
                showInternalEdges: true,

                renderFill: false,
                renderLine: true,

                fillColor: 0x106909,
                fillOpacity: 1,
                lineColor: 0xff0000,
                lineOpacity: 1,
                lineThickness: 1,

                staticFillColor: 0x0d177b,
                staticLineColor: 0x1327e4,

                showSleeping: true,
                staticBodySleepOpacity: 1,
                sleepFillColor: 0x464646,
                sleepLineColor: 0x000000,

                showSensors: true,
                sensorFillColor: 0x0d177b,
                sensorLineColor: 0x1327e4,

                showPositions: true,
                positionSize: 4,
                positionColor: 0xe042da,

                showJoint: true,
                jointColor: 0xe0e042,
                jointLineOpacity: 1,
                jointLineThickness: 2,

                pinSize: 4,
                pinColor: 0x42e0e0,

                springColor: 0xe042e0,

                anchorColor: 0xefefef,
                anchorSize: 4,

                showConvexHulls: false,
                hullColor: 0xd703d0
            }
        }
    }
};


var cursors;
var game = new Phaser.Game(config);

const opt = {
    x: game.config.width / 2,
    y: game.config.height / 2,
}

let shapes = undefined;

let framex = 0;
let framey = 0;

//var scaledown = 8;
//var scaleinc = 0.3;

var emitter;
var particles;
var physicsContainer;

let head = undefined;

function preload() {
    this.load.image('head', '../sprites/head.png');
    this.load.image('shirt', '../sprites/shirt.png');
    this.load.image('leg', '../sprites/legstand.png');
    this.load.image('lhand', '../sprites/lhand.png');
    this.load.image('rhand', '../sprites/rhand.png');
    this.load.image('logo', '../sprites/logo.png');
    this.load.image('gym', '../sprites/gym_bright.png');
    this.load.image('sky', '../sprites/sky_bright.png');

    this.load.image('block', '../sprites/ball_white.png');

    //    this.load.image('ring', 'sprites/ring.png');
    //    this.load.image('ring', 'particles/blue-flare.png');
    //    this.load.image('ring', 'particles/blue.png');
    //    this.load.image('ring', 'particles/bubble.png');
    //    this.load.image('ring', 'particles/cloud.png');
    //    this.load.image('ring', 'particles/glass.png');
    //    this.load.image('ring', 'particles/sparkle1.png');
    //    this.load.image('ring', 'particles/smoke0.png');
    //    this.load.image('ring', 'particles/fire3.png');
    this.load.image('ring', 'particles/rising-smoke.png');


    this.load.image('link', 'sprites/link.png');

    this.load.json('outlines', 'sprites/mult5.json');
}

function tintcorner(obj, topleft, topright, bottomleft, bottomright) {
    return obj.setTint(topleft, topright, bottomleft, bottomright);
}

function addImage(scene, x, y, imgkey, shapekey) {
    var obj = scene.add.image(x, y, imgkey);
    return obj;
}

function addWorldDefaults(scene) {
    // setup world bounds
    scene.matter.world.setBounds(0, 0, game.config.width, game.config.height);

    // setup camera
    scene.cameras.main.setBounds(0, 0, game.config.width, game.config.height);
    scene.cameras.main.setZoom(1);
    //    this.cameras.main.centerOn(0, 0);
}

function addSky(scene, group) {
    //  Add Sky
    var sky = scene.matter.add.image(320, 10, 'sky');
    //    sky.setVelocity(2, 0);
    sky.body.ignoreGravity = true;
    sky.setBounce(1, 1);
    sky.body.collisionFilter += {
        group: group
    };
    sky.setScale(1.1);
    return sky;
}

function addGym(scene, group) {
    // Add Gym
    var gym = scene.add.image(game.config.width / 2, game.config.height / 2, 'gym');
    gym.group = group;
    tintcorner(gym, 0xffffff, 0xffffff, 0x2200ff, 0x2200ff);
    return gym;
}

function gravityWaves(scene) {
    framex += 0.02;
    framey += 0.02;
    scene.matter.world.engine.world.gravity.x = (Math.sin(framex) * 1);
    scene.matter.world.engine.world.gravity.y = (Math.cos(framey) * 1);
}

function noGravity(scene) {
    scene.matter.world.engine.world.gravity.x = 0;
    scene.matter.world.engine.world.gravity.y = 0;
}

function qSine(val) {
    return Math.sin(val);
}

const wavGen = {
    sinFrame: 0,
    cosFrame: 0,
    sadd: 0.0001,
    cadd: 0.001,
    qSin: function () {
        // range [-1,1]
        return Math.sin(wavGen.sinFrame += wavGen.sadd);
    },
    qCos: function () {
        // range [-1,1]
        return Math.cos(wavGen.sinFrame += wavGen.sadd);
    },
    nSin: function () {
        // range [0,1]
        return (wavGen.qSin() + 1) / 2
    },
    nCos: function () {
        // range [0,1]
        return (wavGen.qCos() + 1) / 2
    },
    s255: function () {
        // range [0,255]
        return Math.floor(wavGen.nSin() * 256);
    },
    c255: function () {
        // range [0,255]
        return Math.floor(wavGen.nCos() * 256);
    },
    sHex: function () {
        let hex = wavGen.s255()
        //        hex;
        return hex.toString(16);
    },
    isHex: function () {
        let hex = 255 - wavGen.s255()
        //        hex;
        return hex.toString(16);
    },
    cHex: function () {
        let hex = wavGen.c255()
        //        hex;
        return hex.toString(16);
    },
    waveHex: function () {
        let stra = `${wavGen.sHex()}${wavGen.cHex()}${wavGen.isHex()}`;
        //        let stra = `${wavGen.sHex()}${wavGen.cHex()}${wavGen.sHex()}`;
        //        let stra = `${wavGen.sHex()}0000}`;
        return parseInt(stra, 16);
        //        return stra;
    },
}

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

function create() {

    addWorldDefaults(this);
    // group for dealing with no-collides.
    const group = this.matter.world.nextGroup(true);

    //    var sky = addSky(this, group);
    var gym = addGym(this, group);

    shapes = this.cache.json.get('outlines');

    let x = 0;
    let y = -8;

    let head = addImage(this, x, y, 'head', 'head');
    let shirt = addImage(this, x, y, 'shirt', 'shirt');
    let leg = addImage(this, x, y, 'leg', 'legstand');
    let lhand = addImage(this, x, y, 'lhand', 'lhand');
    let rhand = addImage(this, x, y, 'rhand', 'rhand');
    //        let logo = addImage(this, x + 9, y + 10, 'logo', 'logo');

    shirt.tint = Math.random() * 0xffffff;
    leg.shirt = Math.random() * 0xffffff;

    x = 320;
    y = game.config.height / 2;

    head = this.matter.add.sprite(x, y - 32, 'head', 0, {
        shape: shapes.head,
        mass: 1,
        collisionFilter: {
            group: group
        },
        ignoreGravity: false,
    });
    //    head.isStatic = true;
    //    console.log(emitter);

    /*
        var particles = this.add.particles('link');

        var emitter = particles.createEmitter({
            x: 0,
            y: 0,
            lifespan: 2000,
            speed: {
                min: 200,
                max: 400
            },
            angle: 330,
            gravityY: 300
        });

        container.add(particles);*/

    //    console.log(container);
    particles = this.add.particles('ring');


    emitter = particles.createEmitter({
        frame: null,
        //        frequency: 0.1,
        tint: {
            onEmit: function (particle, key, t, value) {
                //                return Math.random() * 0xFFFFFF;
                //                return '0x444400';
                //                return `0x${wavGen.waveHex()}`;
                return `0x${wavGen.waveHex()}`;
            }
        },
        alpha: {
            start: 1,
            end: 0,
        },
        scale: {
            start: 0,
            end: 1,
        },
        speed: {
            min: 0,
            max: 64
        },
        followOffset: {
            x: 0,
            y: 0.5,
        },
        rotate: {
            onEmit: function (particle, key, t, value) {
                return Math.random() * 360;
            }
        },
        gravityY: -50,
        lifespan: 5000,
        blendMode: 'ADD',
        //        blendMode: 'MULTIPLY',
        //        blendMode: 'SCREEN',
    });

    /*    var skull = '9 14 21 14 22 4 18 0 11 0 9 2';

        var poly = this.add.polygon(400, 300, skull, 0x0000ff, 0.2);

        let polyobj = this.matter.add.gameObject(poly, {
            shape: {
                type: 'fromVerts',
                verts: skull,
                flagInternal: true
            }
        });

        poly.setScale(2);*/

    /*    container.body.matter.body.setVertices(container,
                [{
                "x": 9,
                "y": 14
                }, {
                "x": 21,
                "y": 14
                }, {
                "x": 22,
                "y": 4
                }, {
                "x": 18,
                "y": 0
                }, {
                "x": 11,
                "y": 0
                }, {
                "x": 9,
                "y": 2
        }]);*/


    //    container = this.add.container(x, y, [head, shirt, leg, lhand, rhand]);
    container = this.add.container(x, y, [shirt, leg, lhand, rhand]);
    container.group = group;
    container.setDepth(6);
    container.setSize(12, 14);

    physicsContainer = this.matter.add.gameObject(container);
    physicsContainer.setFrictionAir(0.001);
    physicsContainer.setBounce(0.8);
    physicsContainer.setScale(2);

    this.matter.add.constraint(physicsContainer, head, 32, 1);

    this.matter.add.mouseSpring();
    //    cursors = this.input.keyboard.createCursorKeys();
    emitter.startFollow(container);
    emitter.followOffset.set(0, 10);

    // -=-=- WIP
    //    var compoundBody = Phaser.Physics.Matter.Matter.Body.create({
    //        parts: [physicsContainer, head]
    //    });
    //    physicsContainer.setExistingBody(compoundBody);
    head.setScale(2);

}

function rotLock(obj, container) {
    return obj.rotation = container.body.angle;
}

function posLock(obj, container) {
    obj.allowGravity = false;
    obj.body.gameObject.body.position.x = container.body.position.x;
    obj.body.gameObject.body.position.y = container.body.position.y - 34;
}

function update() {

    //    console.log(wavGen.qCos());
    //    console.log(wavGen.nSin());
    //    console.log(wavGen.nCos());
    //    console.log(wavGen.s255());
    //    console.log(wavGen.sHex());
    //    container.body.angle = 0;

    //    head.rotation = container.body.angle;
    //    rotLock(head, physicsContainer);
    //    posLock(head, container);
    //    console.log(container.angle);
    //    container.body.angle = 90;

    //    gravityWaves(this);
    //    noGravity(this);

    //    if (cursors.up.isDown) {
    //
    //    }
    //
    //    if (cursors.down.isDown) {
    //        //        console.log(emitter);
    //    }

}
