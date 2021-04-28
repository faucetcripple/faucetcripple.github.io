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
            debug: true,
            //            lineColor: 0xff0000,
        }
    }
};


var container;
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

var emitter;
var particles;

function preload() {
    this.load.image('head', '../sprites/head.png');
    this.load.image('shirt', '../sprites/shirt.png');
    this.load.image('leg', '../sprites/legstand.png');
    this.load.image('lhand', '../sprites/lhand.png');
    this.load.image('rhand', '../sprites/rhand.png');
    this.load.image('logo', '../sprites/logo.png');


    //    this.load.image('blue', 'particles/white-smoke.png');
    //    this.load.image('blue', 'particles/smoke-puff.png');
    //    this.load.image('leg', 'sprites/legstand.png');

    this.load.image('block', '../sprites/ball_white.png');
    this.load.image('ring', '../sprites/ring.png');
    this.load.image('link', '../sprites/link.png');

    this.load.json('outlines', '../sprites/mult5.json');
}

function create() {

    this.cameras.main.setBounds(0, 0, 640, 360);
    this.cameras.main.setZoom(2);
    //    this.cameras.main.centerOn(0, 0);



    // grouping chain together for no collision jitter.
    const group = this.matter.world.nextGroup(true);

    this.matter.world.setBounds(0, 0, game.config.width, game.config.height);

    shapes = this.cache.json.get('outlines');

    function addObj(dis, x, y, imgkey, shapekey) {
        var obj = dis.add.image(x, y, imgkey, null, {
            //            var obj = dis.matter.add.sprite(x, y, imgkey, null, {
            shape: shapes[shapekey], // the fucking filename
            collisionFilter: {
                group: group
            }
        });

        //        obj.allowGravity(false);
        //        obj.setScale(1);
        //
        //
        //        obj.body.isStatic = false;

        return obj;

    }


    //    var Bodies = Phaser.Physics.Matter.Matter.Bodies;

    let x = 0;
    let y = -8;


    let head = addObj(this, x, y, 'head', 'head');
    let shirt = addObj(this, x, y, 'shirt', 'shirt');

    let leg = addObj(this, x, y, 'leg', 'legstand');
    let lhand = addObj(this, x, y, 'lhand', 'lhand');
    let rhand = addObj(this, x, y, 'rhand', 'rhand');
    //        let logo = addObj(this, x + 9, y + 10, 'logo', 'logo');

    shirt.tint = Math.random() * 0xffffff;
    leg.shirt = Math.random() * 0xffffff;




    x = 320;
    y = game.config.height / 2;








    //
    //    var compoundBody = Phaser.Physics.Matter.Matter.Body.create({
    //        parts: [head, leg, lhand, rhand]
    //    });
    //    //
    //    shirt.setExistingBody(compoundBody);

    //        this.matter.add.joint(shirt, head, 10, 1);
    //        this.matter.add.joint(shirt, lhand, 8, 1);
    //        this.matter.add.joint(shirt, rhand, 10, 1);
    //        this.matter.add.joint(shirt, leg, 9, 1);
    /* particles = this.add.particles('blue');


     emitter = particles.createEmitter({
         frame: null,
         //        frequency: 4,
         speed: {
             onEmit: function (particle, key, t, value) {
                 return head.body.speed;
             }
         },
         lifespan: {
             onEmit: function (particle, key, t, value) {
                 return Phaser.Math.Percent(head.body.speed, 0, 300) * 600000;
             }
         },
         alpha: {
             onEmit: function (particle, key, t, value) {
                 return Phaser.Math.Percent(head.body.speed, 0, 300) * 100000;
             }
         },
         //        tint: {
         //            onEmit: function (particle, key, t, value) {
         //                return Math.random() * 0xffffff;
         //            }
         //        },
         scale: {
             start: 0.35,
             end: 1
         },
         followOffset: {
             x: 0,
             y: 15,
         },
         gravityX: 0,
         gravityY: -9,
         blendMode: 'ADD'
     });

     head.setDepth(5);*/
    //    emitter.startFollow(head);
    //    shirt.body.startFollow(head);
    //    emitter.followOffset.set(0, 10);


    //    console.log(emitter);
    this.matter.add.mouseSpring();
    cursors = this.input.keyboard.createCursorKeys();



    container = this.add.container(x, y, [head, shirt, leg, lhand, rhand]);


    container.group = group;


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

    container.add(particles);


    //  A Container has a default size of 0x0, so we need to give it a size before enabling a physics body
    container.setSize(12, 16);

    var physicsContainer = this.matter.add.gameObject(container);

    physicsContainer.setFrictionAir(0.001);
    physicsContainer.setBounce(0.9)
    physicsContainer.setScale(1)



}




function update() {

    this.matter.world.engine.world.gravity.x = 0;
    this.matter.world.engine.world.gravity.y = 0;

    /*    framex += 0.01;
        framey += 0.03;
        this.matter.world.engine.world.gravity.x = (Math.sin(framex) * 2);
        this.matter.world.engine.world.gravity.y = (Math.cos(framey) * 2);*/
    if (cursors.up.isDown) {
        //        emitter.emit(particles);
    }

    if (cursors.down.isDown) {
        //        console.log(emitter);
    }


}
