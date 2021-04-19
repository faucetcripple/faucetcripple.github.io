// #module
import HueRotatePostFX from '../pipelines/HueRotatePostFX.js';
import LazersPostFX from '../pipelines/LazersPostFX.js';
import BendPostFX from '../pipelines/BendPostFX.js';
import BendRotationWavesPostFX from '../pipelines/BendRotationWavesPostFX.js';
import BendWavesPostFX from '../pipelines/BendWavesPostFX.js';
import BlurPostFX from '../pipelines/BlurPostFX.js';
import ColorPostFX from '../pipelines/ColorPostFX.js';
import PixelatedFX from '../pipelines/PixelatedFX.js';
import PlasmaPostFX from '../pipelines/PlasmaPostFX.js';
import PlasmaPost2FX from '../pipelines/PlasmaPost2FX.js';
import PlasmaPost3FX from '../pipelines/PlasmaPost3FX.js';
import BendWaves2 from '../pipelines/BendWaves2.js';
import ScalinePostFX from '../pipelines/ScalinePostFX.js';
import HueRotate from '../pipelines/HueRotate.js';

/*NOTES:

-first move is forward - no exceptions.

TADO:  evolve grid into class 

- finish single player version. (single scene)
- shaders - snake mat wiggly;  background
- audio tunes.

https://phaser.io/examples/v3/view/tweens/global-time-scale
- click on snake

*/


/*NOTES
Phaser.Math.RND. https://rexrainbow.github.io/phaser3-rex-notes/docs/site/random-data-generator/
*/
window.control_turn = 0;

var Gman = {
    grid: [],
}

// Options::
const debug = {
    camFollow: false,
    camZoom: 1,
    camPipe: true,
    isSnakePiped: false,
    isPlayerinContainer: false,
    autoDrive: true,
    autoTurn: 5,
    rotTiles: false,
    rotGrid: false,
    startSpeed: 30,
    readout: false,
}

class Snake {
    constructor(id, scene, x, y, facing, headtile, tailtile, tint = 0x770077, isPiped = debug.isSnakePiped, speedmod = debug.startSpeed) {

        this.readout = undefined;

        this.actioncount = 0;

        this.id = id;
        const _THIS = this;
        this.tint = tint;
        this.scene = scene;

        this.isPiped = isPiped; // PIPELINE

        // PIXEL POS:
        this.x = x + 8;
        this.y = y + 12;

        // tilesheet references::
        this.headtile = headtile;
        this.tailtile = tailtile;

        //grid space::
        this.gs = {
            x: 0,
            y: 0,
            s: 16,
            spawn: {
                x: x,
                y: y,
            },
        };

        this.d = {
            ar: ['up', 'right', 'down', 'left'],
            di: facing,
            turnFlag: false,
            isCC: false, // for tail tagging when spawning for end rotation accuracy
            change: 0,
            mutate: function () {


                // reset::
                _THIS.d.isCC = false;
                _THIS.d.turnFlag = false;
                //start process inputs::
                _THIS.d.change = window.control_turn; // grab from update loop;
                //                console.log(`got data = ${window.control_turn}`);
                if (_THIS.d.change > 0) {
                    _THIS.d.turnC(); // relative right turn.

                } else if (_THIS.d.change < 0) {
                    _THIS.d.turnCC(); // realive left turn.
                }
                // reset inputs:
                window.control_turn = 0;
                _THIS.d.change = 0;
            },
            turnC: function () {
                _THIS.d.di++;
                if (_THIS.d.di >= _THIS.d.ar.length) {
                    _THIS.d.di = 0;
                }
                _THIS.d.turnFlag = true;

            },
            turnCC: function () {
                _THIS.d.di--;
                if (_THIS.d.di < 0) {
                    _THIS.d.di = _THIS.d.ar.length - 1;
                }
                _THIS.d.isCC = true;
                _THIS.d.turnFlag = true;
            },
        }

        // speed related::
        this.movetick = 0;
        this.movemod = speedmod;

        this.speedmod = [60, 45, 40, 30, 20, 10];

        this.lastPos = {
            x: undefined,
            y: undefined,
        }

        this.gstate = {
            // game options:
            isTrimming: true,
        }


        this.tail = [];
        this.createEnds();

        this.maxLength = 4;

        this.fx = {
            headPulse: {
                increment: 0.01,
                maxAccumulation: 0.09, // scale or 'mock height' or zoom
                accumulation: 0,
                isOn: true,
                run: function () {
                    _THIS.head.scale += _THIS.fx.headPulse.increment;
                    _THIS.fx.headPulse.accumulation += _THIS.fx.headPulse.increment;
                    // bound range like sine wave::
                    if (_THIS.fx.headPulse.accumulation > _THIS.fx.headPulse.maxAccumulation || _THIS.fx.headPulse.accumulation <= 0) {
                        _THIS.fx.headPulse.increment *= -1;
                    }
                }
            },
            update: function () { // run all the effects that are toggled on::
                if (_THIS.fx.headPulse.isOn) {
                    _THIS.fx.headPulse.run();
                }
            }
        }
    }

    setSpeed(val) {
        return this.movemod = Math.floor((val * 70) + 10);
    }

    setThrottle(val) {
        let valb = 1 - val;;
        return this.movemod = Math.floor((valb * 70) + 10);
    }

    showData() {
        this.readout = this.scene.add.text(this.head.x + 16, this.head.y - 16, `testicle ${this.id}`);
        //        this.readout.font = 'VT220-mod';
    } //wip

    dataReshow() {
        this.readout.text = `id:${this.id}`;
        this.readout.x = this.head.x + 16;
        this.readout.y = this.head.y + 16;
    } //wip

    createEnds() {
        if (this.isPiped) {
            //fancy::
            this.head = this.scene.add.image(this.x, this.y, this.headtile).setTint(this.tint).setDepth(5).setPostPipeline(BendPostFX);
            this.head.setPostPipeline(HueRotatePostFX)

            this.end = this.scene.add.image(this.x, this.y, this.tailtile).setTint(this.tint).setDepth(3).setPostPipeline(BendPostFX); //HueRotatePostFX
            this.end.setPostPipeline(HueRotatePostFX)
        } else {
            //plain::
            this.head = this.scene.add.image(this.x, this.y, this.headtile).setTint(this.tint).setDepth(5);
            this.end = this.scene.add.image(this.x, this.y, this.tailtile).setTint(this.tint).setDepth(3);
        }
        this.angleHead(this.d.di);
        this.angleTail(this.d.di);
    }

    headTween(tweendir) {
        // this actually moves the head.
        let tweenA = undefined;




        let timeslice = 500 / 60;
        let duration = timeslice * this.movemod;






        switch (tweendir) {
            case 0:
                tweenA = this.scene.tweens.add({
                    targets: this.head,
                    y: this.head.y - this.gs.s,
                    duration: duration,
                    ease: 'Sine.easeInOut',
                    yoyo: false,
                    repeat: 0
                });


                break;
            case 1:
                tweenA = this.scene.tweens.add({
                    targets: this.head,
                    x: this.head.x + this.gs.s,
                    //                    duration: 300,
                    duration: duration,
                    ease: 'Sine.easeInOut',
                    yoyo: false,
                    repeat: 0
                });


                break;
            case 2:


                tweenA = this.scene.tweens.add({
                    targets: this.head,
                    y: this.head.y + this.gs.s,
                    //                    duration: 400,
                    //                    duration: duration,
                    duration: duration,
                    ease: 'Sine.easeInOut',
                    yoyo: false,
                    repeat: 0
                });

                break;
            case 3:
                tweenA = this.scene.tweens.add({
                    targets: this.head,
                    x: this.head.x - this.gs.s,
                    //                    duration: 500,
                    duration: duration,
                    ease: 'Sine.easeInOut',
                    yoyo: false,
                    repeat: 0
                });


                break;
            default:
                console.log(`headTween default case hit`);
        }

    }

    addPart(part) {

        let offsety = 0;


        // case TURN OR NOT - TURNS NEED SOME SCALE FLIPS ETC.

        // this works for main body piece but not turns.
        let angles = [90, 180, -90, 0]
        if (this.isPiped) {
            this.tail[this.tail.length] = this.scene.add.image(this.lastPos.x, this.lastPos.y, part).setTint(this.tint).setAngle(angles[this.d.di]).setAlpha(1).setPostPipeline(BendPostFX);

            this.tail[this.tail.length - 1].setPostPipeline(HueRotatePostFX);
        } else {
            this.tail[this.tail.length] = this.scene.add.image(this.lastPos.x, this.lastPos.y, part).setTint(this.tint).setAngle(angles[this.d.di]).setAlpha(1)
        }

        if (this.d.isCC) {
            this.tail[this.tail.length - 1].setAngle(this.tail[this.tail.length - 1].angle -= 90);
        }

        if (part === 's_turn') { // hardcoded part
            this.tail[this.tail.length - 1].isC = true;
        } else {
            this.tail[this.tail.length - 1].isC = false;
        }


        if (debug.isPlayerinContainer) {
            window._C.add(this.tail[this.tail.length - 1]);
        }
        this.tail[this.tail.length - 1].setDepth(1);

        // imprint tag true or false for things looking for it.
        this.tail[this.tail.length - 1].isCC = this.d.isCC;

    }

    angleHead(doit) {
        switch (doit) {
            case 0:
                this.head.angle = 0;
                break;
            case 1:
                this.head.angle = 90;
                break;
            case 2:
                this.head.angle = 180;
                break;
            case 3:
                this.head.angle = -90;
                break;

        }
    }

    angleTail(mydir) {

        switch (mydir) {
            case 0:
                this.end.angle = -90;
                break;
            case 1:
                this.end.angle = 0;
                break;
            case 2:
                this.end.angle = 90;
                break;
            case 3:
                this.end.angle = -180;
                break;
        }
    }

    mySine() {
        let rate = 5;
        let mySine = Math.sin(this.movetick) / 10;
        return mySine;
    }

    sinParts(key = 'scale') {

        let scalefactor = 100;

        this.tail.forEach(element => element[key] += (this.mySine()) * scalefactor);


    }

    calcPlacement() {

        // the head has just mutated and needs retargeting.
        this.head.y = this.lastPos.y;
        this.head.x = this.lastPos.x;

        let part = 's_mid';


        if (this.d.turnFlag) {
            part = 's_turn';
        }

        this.addPart(part);

    }

    checkTrimTail() {
        if (this.tail.length >= this.maxLength) {
            this.tailGo(this.tail[1].x, this.tail[1].y, this.tail[1].angle, this.tail[1].isCC, this.tail[1].isC);
            this.tail[0].destroy();
            this.tail.splice(0, 1);
        }
    }

    tailGo(x, y, a, isCC = false, isC = false) {
        // sets up movement tweens and rotations of tail

        if (isCC) {
            a += -90;
        } else if (isC) {

            if (a == 90) {
                a = -90;
            } else {
                a += 180;
            }
        }

        let timeslice = 500 / 60;
        let duration = timeslice * this.movemod;

        let tweenT = this.scene.tweens.add({
            targets: this.end,
            y: y,
            x: x,
            //            duration: 500,
            duration: duration,
            ease: 'Quart.easeIn', //Bounce was fun
            yoyo: false,
            repeat: 0
        });

        if (isCC || isC) {
            let tweenR = this.scene.tweens.add({
                targets: this.end,
                angle: a,
                //            duration: 500,
                duration: duration,
                ease: 'Quart.easeIn',
                yoyo: false,
                repeat: 0
            });
        }
    }

    updateGridState() {
        switch (this.d.di) {
            case 0:
                this.gs.y--;
                break;
            case 1:
                this.gs.x++;
                break;
            case 2:
                this.gs.y++;
                break;
            case 3:
                this.gs.x--;
                break;
        }
    }

    update() {

        this.movetick++;
        if (this.movemod <= 0) { // old limiter for debugging.
            this.movemod = 1;
        }


        // DONT DELETE
        this.fx.update();
        //        this.sinParts('y'); // gstate experimental

        if (this.movetick % this.movemod == 0) {
            this.actioncount++;
            this.lastPos.x = this.head.x;
            this.lastPos.y = this.head.y;
            this.d.mutate(); // get direction of movement
            this.updateGridState(); // update movement from origin.
            this.headTween(this.d.di); // move head
            this.angleHead(this.d.di);
            this.calcPlacement(); // place body
            if (this.gstate.isTrimming) {
                this.checkTrimTail();
            }




        }

        // everyframe calculations::
        //        if (this.readout) { // WIP DEBUGGING 
        //            this.dataReshow();
        //        }


    }




}

var config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
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
        update: update,

    },
    pipeline: {
        HueRotatePostFX,
        LazersPostFX,
        BendPostFX,
        BendRotationWavesPostFX,
        BendWavesPostFX,
        BlurPostFX,
        PlasmaPostFX,
        PlasmaPost2FX,
        PlasmaPost3FX,
        ScalinePostFX,
        BendWaves2,
        ColorPostFX,
    },
    physics: {
        default: "matter",
        matter: {
            debug: true,
        }
    }
};

var gstate = {
    //    playerList: [],
    pControlIndex: 0,
    theLiving: [],
    addPlayer: function (pdata) {
        this.theLiving.push(pdata);
    },
    spawnPlayer: function (pdata) {
        this.addPlayer(pdata);
        return pdata;
    }
}

window.gstate = gstate;
var cursors;
var game = new Phaser.Game(config);
window.game = game;

function preload() {

    window.scene = this;
    //    this.load.image('tile_basic', '../sprites/tile_outline_bright.png');
    //    this.load.image('tile_basic', '../sprites/tile_grad.png');
    this.load.image('tile_basic', '../sprites/tile_grey.png');
    //    this.load.image('tile_basic', '../sprites/tile_round.png');
    //    this.load.image('tile_basic', '../sprites/tile_round_bright.png');
    //    this.load.image('tile_basic', '../sprites/tile_round_spin.png');


    this.load.image('s_mid', '../sprites/s_body.png');
    this.load.image('s_tail', '../sprites/s_tail.png');
    this.load.image('s_head', '../sprites/s_head.png');
    this.load.image('s_npc', '../sprites/s_npc.png');
    this.load.image('s_turn', '../sprites/s_turn.png');
}

function create() {
    Gman.grid = [];

    let w = (game.config.width / 2);
    let h = (game.config.height / 2);

    let nx = (game.config.width / 2) * -1;
    let ny = (game.config.height / 2) * -1;

    window._C = this.add.container(w, h);
    //    window._C = this.add.container(-16, 0);

    let offset = {
        //        x: -320,
        x: 0,
        y: 4,
    }

    for (let y = ny; y < w; y += 16) {
        for (let x = nx; x < h; x += 16) {
            let tmp = this.add.image(8 + x + offset.x, 8 + y + offset.y, 'tile_basic')

            //            tmp.setPostPipeline(BendWavesPostFX);
            //  tmp.tint = Math.random() * 0xff0000;
            //            tmp.tint = halp.color.rndSkin();
            tmp.tint = halp.rnd.pattern('soft_purple');
            //            tmp.tint = halp.rnd.pattern('vampire_sky');
            //            tmp.tint = halp.rnd.pattern('flame_ship');

            //            tmp.rotation = Math.random() * 360 / 2;

            //            tmp.setPipeline(this._G.BendPostFX);
            Gman.grid.push(tmp);
            //            tmp.blendMode = 3;
            //            tmp.setPostPipeline(BendPostFX);

        }
    }



    // container::
    window._C.add(Gman.grid);

    setupSpawns(this);

    if (debug.isPlayerinContainer) {

        window._C.add(window.PLAYER.head);
        window._C.add(window.PLAYER.end);

    }

    //    this.add.text(game.config.width / 2.5, game.config.height / 4, "Loading game...")

    // ALL THE CAMERA GOOP::
    //    this.cameras.main.centerOn(gstate.theLiving[gstate.pControlIndex].x, gstate.theLiving[gstate.pControlIndex].y);
    this.cameras.main.centerOn(256, 186);



    //    window._C.add(this.cameras.main);

    if (debug.camFollow) { //cam mode toggle
        this.cameras.main.startFollow(gstate.theLiving[gstate.pControlIndex].head);

        if (debug.isPlayerinContainer) {
            this.cameras.main.followOffset.set(nx, ny);
        }
    }

    if (debug.camPipe) {
        //        this.cameras.main.setPostPipeline(ScalinePostFX);
        this.cameras.main.setPostPipeline(BendWavesPostFX);
    }

    this.cameras.main.x += 1


    this.cameras.main.setZoom(debug.camZoom);

    //    let zoom = 3;
    debug.text = this.add.text(10, 10, '', {
        fill: '#ffffff',
    }).setDepth(1);
    this.input.mouse.disableContextMenu();

    this.input.on('pointerdown', function (pointer) {
        //        console.log(pointer);

        switch (pointer.button) {
            case 0:
                window.control_turn = -1;
                break;
            case 1:
                debug.camZoom++;
                if (debug.camZoom > 5) {
                    debug.camZoom = 1
                };
                this.cameras.main.setZoom(debug.camZoom);
                break;
            case 2:
                window.control_turn = 1;
                break;
        }


    }, this);

    // KEYBOARD INPUTS:
    cursors = this.input.keyboard.createCursorKeys();
}

function setupSpawns(scene) {

    /*    let spA = {
            x: 1,
            y: 1,
            scale: 16,
        };*/
    let spA = {
        x: 5,
        y: 5,
        scale: 16,
    };
    window.PLAYER = gstate.spawnPlayer(new Snake('bob', scene, spA.x * spA.scale, spA.y * spA.scale, 1, 's_head', 's_tail', 0xff00ff));

    window.PLAYER.gs.spx = spA.x;
    window.PLAYER.gs.spy = spA.y;
}

function updateLivingSnakes() {
    gstate.theLiving.forEach(element => element.update());
}

function rotTiles(frame) {
    return Gman.grid.forEach(element => element.rotation += 0.05)
    //    return Gman.grid.forEach(element => element.angle += ((Math.random() * 1) * 2) - 1)

    /*    let singo = Math.sin(frame / 20);

        if (singo < 0) {
            singo *= 1;
        }

        function performOps(element) {
            element.scale = singo;
            element.rotation += 0.05;
        }
        //    console.log(singo);
        Gman.grid.forEach(element => performOps(element));*/
}

var s;

function rndTileTween(frame) {
    /*ease: 'Power2',
        yoyo: true,
        delay: 1000
                onStart: function () { console.log('onStart'); console.log(arguments); },
            onComplete: function () { console.log('onComplete'); console.log(arguments); },
            onYoyo: function () { console.log('onYoyo'); console.log(arguments); },
            onRepeat: function () { console.log('onRepeat'); console.log(arguments); },
            
            function onYoyoHandler (tween, target)
{
    console.log(arguments);

    target.toggleFlipX().setAlpha(0.2 + Math.random());
}


//// this is DOPE:::
https://phaser.io/examples/v3/view/tweens/checkerboard-rotate


this.tweens.add({
            targets: child,
            ease: 'Power1',
            duration: 250,
            delay: (Math.random() * 6000),
            repeatDelay: 3000 + (Math.random() * 6000),
            repeat: -1,
            angle: {

                getEnd: function (target, key, value)
                {
                    var a = 90;

                    if (Math.random() > 0.5)
                    {
                        a = 180;
                    }

                    if (Math.random() > 0.5)
                    {
                        return target.angle + a;
                    }
                    else
                    {
                        return target.angle - a;
                    }
                },

                getStart: function (target, key, value)
                {
                    return target.angle;
                }

            }
        });
            
        */


    function setTween(tmp) {
        // good effect with some depth tweaks.
        // when tweens overlap the leaves big blocks = glitchy = cool.
        window.scene.tweens.add({
            targets: tmp,
            scale: 4,
            duration: 100,
            ease: 'Quart.easeInOut', //Bounce was fun
            yoyo: true,
            repeat: 0
        });

        //        tmp.tint = 0x00ff00;
        //        heEnd, this);
        //        s.start();
    }



    let tmp = Phaser.Math.RND.pick(Gman.grid);
    //    console.log(tmp);
    //    tmp.tint = 0x0000ff;

    setTween(tmp);


    //    function 

    //get rnd element::
    //     Gman.grid.forEach(element => performOps(element));



}


function rotGrid(val) {
    return window._C.angle += (val * val) * 2.5;
}

function syncDebugText(_S) {

    debug.text.setText([
            'id:' + _S.id,
            'x: ' + _S.gs.x,
            'y: ' + _S.gs.y,
            'sx:' + _S.gs.spx,
            'sy:' + _S.gs.spy,
        ]);

    debug.text.x = _S.head.x - 100;
    debug.text.y = _S.head.y - 45;
    debug.text.setDepth(8);
}

function update() {

    // grab the client player:
    let _S = gstate.theLiving[gstate.pControlIndex];

    if (_S.actioncount % debug.autoTurn == 0 && _S.actioncount != 0) { // forget what i was doing but wanted to limit it lol

        if (debug.autoDrive) {
            window.control_turn = 1;
        }

    }


    if (cursors.up.isDown) {
        _S.movemod--;
    }

    if (cursors.down.isDown) {
        _S.movemod++;
    }

    if (cursors.left.isDown) {
        window.control_turn = -1;
    }


    if (cursors.right.isDown) {
        window.control_turn = 1;
    }

    if (_S.movemod < 10) {
        _S.movemod = 10;
    }

    // update all players.
    updateLivingSnakes();

    rndTileTween();


    if (debug.rotTiles) {
        rotTiles(_S.movetick);
    }
    if (debug.rotGrid) {
        rotGrid(0.5);
    }


    var pointer = this.input.activePointer;
    if (debug.readout) {
        syncDebugText(window.PLAYER);
    }
}
