// #module
import HueRotatePostFX from '../pipelines/HueRotatePostFX.js';
import LazersPostFX from '../pipelines/LazersPostFX.js';
import BendPostFX from '../pipelines/BendPostFX.js';
import BendRotationWavesPostFX from '../pipelines/BendRotationWavesPostFX.js';
import BendWavesPostFX from '../pipelines/BendWavesPostFX.js';
import BlurPostFX from '../pipelines/BlurPostFX.js';
import PixelatedFX from '../pipelines/PixelatedFX.js';
import PlasmaPostFX from '../pipelines/PlasmaPostFX.js';
import PlasmaPost2FX from '../pipelines/PlasmaPost2FX.js';
import PlasmaPost3FX from '../pipelines/PlasmaPost3FX.js';
import BendWaves2 from '../pipelines/BendWaves2.js';
import ScalinePostFX from '../pipelines/ScalinePostFX.js';
import HueRotate from '../pipelines/HueRotate.js';

class Snake {
    constructor(id, scene, x, y, facing, headtile, tint = 0x770077) {

        this.facing = facing; // fix remove this from constructor di depreciated.
        const _THIS = this;
        this.tint = tint;
        this.scene = scene;
        this.tilescale = 16;

        // PIXEL POS:
        this.x = x;
        this.y = y;

        this.headtile = headtile; //str of tile name.

        this.p = {
            x: 0,
            r: 0,
            vx: 0,
            vy: 0,
            y: 0,
            s: 16,
            setV: function (vcase) {
                switch (_THIS.d.di) {
                    case 0:
                        _THIS.p.vx = 0;
                        _THIS.p.vy = -1;
                        break;
                    case 1:
                        _THIS.p.vx = 1;
                        _THIS.p.vy = 0;
                        break;
                    case 2:
                        _THIS.p.vx = 0;
                        _THIS.p.vy = 1;
                        break;
                    case 3:
                        _THIS.p.vx = -1;
                        _THIS.p.vy = 0;
                        break;
                    default:
                        console.log(`error default hit p.setV(${vcase})`);
                        break;

                }

                _THIS.p.mutate();

            },
            mutate: function () {



                //addjust body position by velocity and scale
                _THIS.x += (_THIS.p.vx * _THIS.p.s);
                _THIS.y += (_THIS.p.vy * _THIS.p.s);
                /*               _THIS.head.x += (_THIS.p.vx * _THIS.p.s);
                              _THIS.head.y += (_THIS.p.vy * _THIS.p.s);*/

                //grid change cordinates
                _THIS.p.x += _THIS.p.vx;
                _THIS.p.y += _THIS.p.vy;

                //                _THIS.head.y = _THIS.y;
                //                _THIS.head.x = _THIS.x;




            }
        }


        this.needsUpdate = false;
        //sketched out relative turning.
        this.d = {
            ar: ['up', 'right', 'down', 'left'],
            di: 0,
            change: 0,
            get: function () {
                return _THIS.d.ar[_THIS.d.ir];
            },
            inputC: function () {

                if (_THIS.d.change++ > 1) {
                    _THIS.d.change = 1;
                }

            },
            inputCC: function () {

                if ((_THIS.d.change--) < -1) {
                    _THIS.d.change = -1;
                }

            },
            mutate: function () {

                if (_THIS.d.change > 0) {
                    _THIS.d.turnC();
                    //                    _THIS.needsUpdate = true;
                }

                if (_THIS.d.change < 0) {
                    _THIS.d.turnCC();
                    //                    _THIS.needsUpdate = true;
                }
                _THIS.d.change = 0;
                _THIS.p.setV(_THIS.d.di);
                //final outcome... we have the index in the right place.

            },
            turnC: function () {
                _THIS.d.di++;
                if (_THIS.d.di >= _THIS.d.ar.length) {
                    _THIS.d.di = 0;
                }

            },
            turnCC: function () {
                _THIS.d.di--;
                if (_THIS.d.di < 0) {
                    _THIS.d.di = _THIS.d.ar.length - 1;
                }
            },
        }

        // speed related::
        this.movetick = 0;
        this.movemod = 60;

        this.lastPos = {
            x: undefined,
            y: undefined,
        }

        this.stat = { // hook in appropriately.
            skootches: 0, // add to cookie?
        }

        this.gstate = {
            isTrimming: true,
        }


        this.tail = [];
        this.createHead();

        this.maxLength = 5;

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

    addHue() { // screws up cause everything after aint got it.
        //        this.head.resetPostPipeline(HueRotatePostFX);
        this.head.setPostPipeline(HueRotatePostFX);
        this.tail.forEach(element => element.setPostPipeline(HueRotatePostFX));
    }

    createHead() {
        this.head = this.scene.add.image(this.x, this.y, this.headtile).setTint(this.tint).setDepth(5).setPostPipeline(BendPostFX); //HueRotatePostFX
        this.head.setPostPipeline(HueRotatePostFX)
        this.angleHead(this.d.di);
    }

    tween(tweendir) {

        //        tweendir = this.d.ar[this.d.ir];
        //        tweendir = this.d.get();

        if (tweendir == 'up') {
            /*            let tweenA = this.scene.tweens.add({
                            targets: this.head,
                            y: this.head.y - this.p.s,
                            duration: 200,
                            ease: 'Sine.easeInOut',
                            yoyo: false,
                            repeat: 0
                        });*/
            let tweenA = this.scene.tweens.add({
                targets: this.head,
                y: this.head.y - this.p.s,
                duration: 200,
                ease: 'Sine.easeInOut',
                yoyo: false,
                repeat: 0
            });

        }

        if (tweendir == 'down') {
            let tweenA = this.scene.tweens.add({
                targets: this.head,
                y: this.head.y + this.tilescale,
                duration: 1000 * (this.movemod / 60),
                ease: 'Sine.easeInOut',
                yoyo: false,
                repeat: 0
            });

        }
        if (tweendir == 'left') {

            let tweenA = this.scene.tweens.add({
                targets: this.head,
                x: this.head.x - this.tilescale,
                duration: 1000 * (this.movemod / 60),
                ease: 'Sine.easeInOut',
                yoyo: false,
                repeat: 0
            });

        }

        if (tweendir == 'right') {
            let tweenA = this.scene.tweens.add({
                targets: this.head,
                x: this.head.x + this.tilescale,
                duration: 1000 * (this.movemod / 60),
                ease: 'Sine.easeInOut',
                yoyo: false,
                repeat: 0
            });

        }


    }

    tailDrag() {

        let tailend = this.tail[1];
        tailend.setTint(0x11ff22);

        let tweenT = this.scene.tweens.add({
            targets: this.tail[0],
            //            y: this.tail[1].y - this.tail[2].y,
            duration: 200,
            ease: 'Sine.easeInOut',
            yoyo: false,
            repeat: 0
        });

    }

    addPart(part) {

        let offsety = 0;

        if (this.tail.length === 0) { // first part is tail
            part = 's_tail'; // over ride the called piece
            offsety = 0;
        }

        let anglelist = { // middle piece
            up: 90,
            down: -90,
            left: 0,
            right: 180,
        }

        this.tail[this.tail.length] = this.scene.add.image(this.lastPos.x, this.lastPos.y + offsety, part).setTint(this.tint).setAngle(anglelist[this.d.ar[this.d.di]]).setAlpha(1).setPostPipeline(BendPostFX);

        this.tail[this.tail.length - 1].setPostPipeline(HueRotatePostFX);


        if (this.tail.length === 1) {
            // style the first tail peice
            this.tail[0].angle = -90;
            //            this.tail[0].setDepth(6);
            //            this.tail[0].setBlendMode(1);

        }


        this.needsUpdate = false;
    }

    angleHead(doit) {
        //        console.log(this.direction)
        switch (doit) {
            case 0:
                this.head.angle = 0;
                break;
            case 3:
                this.head.angle = -90;
                break;
            case 1:
                this.head.angle = 90;
                break;
            case 2:
                this.head.angle = -180;
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

    checkTrimTail() {
        // wish this was a smooth tween of sorts::


        if (this.tail.length >= this.maxLength) {
            // if length limited deal with trailing tail piece.
            // set placement of tailend to first array obj then remove.
            this.tail[0].x = this.tail[1].x;
            this.tail[0].y = this.tail[1].y;
            this.tail[0].angle = this.tail[1].angle + 180;


            //            this.tailDrag();

            this.tail[1].destroy();
            this.tail.splice(1, 1);
        }
    }

    calcPlacement() {


        // place where head is at end of lerp::
        this.lastPos.x = this.x;
        this.lastPos.y = this.y;


        //        this.angleHead(this.d.di);


        this.head.y = this.lastPos.y;
        this.head.x = this.lastPos.x;

        //        this.head.y = this.y;
        //        this.head.x = this.x;
        //        this.tween(this.d.ar[this.d.di]);


        let part = 's_mid';

        if (!this.needsUpdate) {
            part = 's_mid';
        } else {
            // but what direction is the conundrum.
            part = 's_turn';
        }

        this.addPart(part);

    }

    update() {
        this.movetick++;
        if (this.gstate.isTrimming) {
            this.checkTrimTail();
        }
        // DONT DELETE
        // this.fx.update();
        // this.sinParts('y'); // gstate experimental

        //        this.movemod = 10;

        if (this.movetick % this.movemod == 0) {

            this.angleHead(this.d.di);
            // fire once a second
            this.d.mutate(); // get direction of movement


            this.calcPlacement(); // place body

            this.tween(this.d.ar[this.d.di]); // move head
        }



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
    }
}

window.gstate = gstate;
var cursors;
var game = new Phaser.Game(config);
window.game = game;

const opt = {
    rings: 24,
    x: game.config.width / 2,
    y: game.config.height / 2,
    frictionAir: 0.01,
    scaledown: 8,
    //    scaleinc: 0.3,
    scaleinc: 0.2,
    headmass: 500,
    movetick: 0,
}

function preload() {

    this.load.image('s_mid', '../sprites/s_body.png');
    this.load.image('s_tail', '../sprites/s_tail.png');
    this.load.image('s_head', '../sprites/s_head.png');
    this.load.image('s_npc', '../sprites/s_npc.png');
    this.load.image('s_turn', '../sprites/s_turn.png');
}

function create() {
    //
    let x = game.config.width / 2;
    let y = game.config.height / 2;

    gstate.spawnPlayer(new Snake('bob', this, x + 8, y - 24, 'up', 's_head', 0xff0033));
    gstate.spawnPlayer(new Snake('bill', this, x + 8 + 16, y - 24, 'up', 's_head', 0xff7733));

    this.add.text(game.config.width / 2.5, game.config.height / 4, "Loading game...")

    cursors = this.input.keyboard.createCursorKeys();


    this.cameras.main.centerOn(gstate.theLiving[gstate.pControlIndex].x, gstate.theLiving[gstate.pControlIndex].y);

    if (true) { //cam mode toggle
        this.cameras.main.setZoom(2);
        this.cameras.main.startFollow(gstate.theLiving[gstate.pControlIndex].head);
    }

    let zoom = 3;

    this.input.on('pointerdown', function (pointer) {
        zoom++;
        if (zoom > 5) {
            zoom = 1
        };
        this.cameras.main.setZoom(zoom);
    }, this);

}

function updateLivingSnakes() {
    gstate.theLiving.forEach(element => element.update());
}

function update() {

    // grab the client player:
    let _S = gstate.theLiving[gstate.pControlIndex];

    if (cursors.left.isDown) {
        _S.d.inputCC();
    }

    if (cursors.left.isUp) {
        //        _S.d.inputCC();
    }

    if (cursors.right.isDown) {
        _S.d.inputC();
    }


    // update all players.
    updateLivingSnakes();

}
