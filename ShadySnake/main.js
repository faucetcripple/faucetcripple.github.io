/*STYLE TADO

snake leaves trail.
emitters.
camera tweens.


RULES/MODES:
go under self 4 square

fixed distance; 90degree container pivot.

eat the floor (destroy tiles reveal pic? like nudy ditty.)


*/
/*NOTES:

- edges:: add different images
- collisions:: figure out grid tagging. snake -> grid --> snake. read/write.
- writeKey(x,y,key,value)


- finish single player version. (single scene)
- shaders - snake mat wiggly;  background
- audio tunes.

https://phaser.io/examples/v3/view/tweens/global-time-scale
- click on snake

hex tint yellow - 16696168.446638271
pale blue - 9551312.232573077
orange - 14697994.066424608
red - 13047078.69092266
skinny - 15044961.084430406
pinkerpurp - 14628325.377192367
lime - 12581921.61570923
*/
/*NOTES
Phaser.Math.RND. https://rexrainbow.github.io/phaser3-rex-notes/docs/site/random-data-generator/
*/
const keeperPallette_notcode = [0x007737]


// #module
import SNAKE_PLASMAFLOOR from '../pipelines/Snake_PlasmaFloor.js';
import SNAKE_SPIRAL from '../pipelines/Snake_Spiral.js';

// dimwit - add it to config::

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
import HueRotatePostFX from '../pipelines/HueRotatePostFX.js';
import HueRotate from '../pipelines/HueRotate.js';
import GREYSCALE from '../pipelines/GrayScale.js';
import SNAKEORGY from '../pipelines/Snake_Orgy.js';
import ELEVATOR from '../pipelines/Elevator.js';
import SHADE_ELEVATOR from '../pipelines/Shade_Elevator.js';
import RBMAT from '../pipelines/RBMAT.js';


// good for space backdrop
import LIGHTSPIN from '../pipelines/LIGHTSPIN.js';

//raw::
import HEXSPIRAL_TIGHT from '../pipelines/HEXSPIRAL_TIGHT.js';

import SNAKE_EDGEBEND from '../pipelines/Snake_EdgeBend.js';
window.SNAKE_EDGEBEND = SNAKE_EDGEBEND;
window.RBMAT = RBMAT;
const myPipe = SNAKE_EDGEBEND;

var config = { // phaser config.
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    scale: {
        mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    parent: 'game',
    pixelArt: true,
    //    backgroundColor: "#FF15FF",
    //    backgroundColor: "#00ae44",
    //    backgroundColor: "#151525",
    backgroundColor: "#000000",
    scene: {
        preload: preload,
        create: create,
        update: update,

    },
    pipeline: {
        RBMAT,
        SNAKE_EDGEBEND,
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
        SNAKE_PLASMAFLOOR,
        SNAKE_SPIRAL,
        SNAKEORGY,
        ELEVATOR,
        LIGHTSPIN,
        HEXSPIRAL_TIGHT,
        SHADE_ELEVATOR,
    },
    physics: {
        default: "matter",
        matter: {
            debug: true,
        }
    }
};


window.control_turn = 0;

function getnoiseVal(x = 1, y = 1, z = 1, o = 1, p = 1) {
    return Perl.OctavePerlin(x / 10, y / 10, z / 10, o, p);
}

window.getnoiseVal = getnoiseVal;

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
GD.game = game;
//window.game = game;

var pipcam;
var pipcam2;

// done gud::
function preload() {

    GD.scene = this;
    window.scene = this;

    this.load.image('msg_GO', '../sprites/msg_GO.png');

    //    this.load.image('backdrop_basic', '../sprites/backdrop_a.png');
    //    this.load.image('backdrop_trump', '../sprites/backdrop_t.png');
    //    this.load.image('backdrop', '../sprites/backdrop_testpattern.png');
    this.load.image('backdrop', '../sprites/backdrop_space.png');
    //    this.load.image('backdrop', '../sprites/backdrop_t.png');
    //    this.load.image('backdrop', '../sprites/backdrop_basic_vig.png');
    //    this.load.image('backdrop', '../sprites/backdrop_glitter.png');
    //    this.load.image('tile_basic', '../sprites/tile_outline_bright.png');
    //    this.load.image('tile_basic', '../sprites/tile_grad.png');
    //    this.load.image('tile_basic', '../sprites/tile_grey.png');
    //    this.load.image('tile_basic', '../sprites/tile_round.png');
    //    this.load.image('tile_basic', '../sprites/tile_round_bright.png');
    this.load.image('tile_basic', '../sprites/tile_white.png');
    //    this.load.image('tile_basic', '../sprites/tile_skylike.png');
    //    this.load.image('tile_basic', '../sprites/tile_round_spin.png');
    this.load.image('s_mid', '../sprites/s_body.png');
    this.load.image('s_tail', '../sprites/s_tail.png');
    this.load.image('s_head', '../sprites/s_head.png');
    this.load.image('s_npc', '../sprites/s_npc.png');
    this.load.image('s_turn', '../sprites/s_turn.png');
}

function create() {

    // background stuff (unrefined)
    let backdrop = this.add.image(0, 0, 'backdrop');
    backdrop.setScale(2);
    backdrop.setDepth(-20);
    backdrop.setPostPipeline(myPipe);
    //    backdrop.setPipeline(myPipe);

    GD.prop.BG = backdrop;



    // floor
    GD.prop.floor = new Floor('basicfloor', GD.w, GD.h, 16, this);
    markSpawns(); // style floor (SS conditional):

    // spawn Players::
    setupSpawns(this);

    // ALL THE CAMERA GOOP::

    GD.prop.cam = this.cameras.main;
    GD.prop.cam.centerOn(0, 0);
    //    GD.prop.cam.setZoom(SS.zoom);
    GD.prop.cam.setZoom(0.5);

    /*  // PIP CAMERA::
    GD.prop.pipcam = this.cameras.add(480 - 16, 16, 640 / 4, 360 / 4);
    GD.prop.pipcam.setZoom(3);
    GD.prop.pipcam.startFollow(gstate.theLiving[gstate.pControlIndex].head);
    //    GD.prop.pipcam.fade(2000);

    GD.prop.pipcam2 = this.cameras.add(480 - 16, 90 + 16, 640 / 4, 360 / 4);
    GD.prop.pipcam2.setZoom(3);
    GD.prop.pipcam2.startFollow(gstate.theLiving[gstate.pControlIndex].head);
    GD.prop.pipcam2.rotation = -3.14159;
    GD.prop.pipcam2.setPostPipeline(myPipe);
    //    GD.prop.pipcam2.scaleY = ;
    //    GD.prop.pipcam.fade(2000);*/

    if (debug.camFollow) { //cam mode toggle
        GD.prop.cam.startFollow(gstate.theLiving[gstate.pControlIndex].head);

        //            GD.prop.cam.followOffset.set(nx, ny);
    }

    if (debug.camPipe) {
        //        this.cameras.main.setPostPipeline(SNAKE_EDGEBEND);
        this.cameras.main.setPostPipeline(myPipe);
        //        this.cameras.main.setPostPipeline(PlasmaPostFX);
        //        this.cameras.main.setPostPipeline(ScalinePostFX);
        //        this.cameras.main.setPostPipeline(BendWavesPostFX);
        //        this.cameras.main.setPostPipeline(PlasmaPost2FX);
    }



    debug.text = this.add.text(10, 10, '', {
        fill: '#ffffff',
    }).setDepth(1);


    // Ready, 3 ,2, 1::
    var style = {
        font: "80px VT220",
        fill: "#24f",
        boundsAlignH: "center",
        boundsAlignV: "middle"
    };

    var countdown = 4;

    var stext = this.add.text(4, 0, "ready!", style);
    stext.setShadow(3, 3, 'rgba(0,100,55,0.5)', 2);
    stext.setOrigin(0.5, 0.5);

    var countTween = scene.tweens.add({
        targets: stext,
        alpha: 0,
        scale: {
            from: 0.25,
            to: 3
        },
        ease: 'Linear', // 'Cubic', 'Elastic', 'Bounce', 'Back'
        duration: 1000,
        delay: 10,
        repeat: 3, // -1: infinity
        yoyo: false,
        onRepeat: function () {

            countdown -= 0.5;

            arguments[1].text = countdown;

        },
        onComplete: function () {

        }
    });


    // GO message at round START::
    let GO = this.add.image(0, 0, 'msg_GO');
    GO.setDepth(10);
    GO.tint = 0x00ff92;
    GO.blendMode = 3;
    GO.alpha = 0;
    //    GO.setPostPipeline(myPipe);
    // GO Msg animation::
    // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/tween/
    var GOtween = scene.tweens.add({
        targets: GO,
        alpha: 1,
        scale: {
            from: 0.25,
            to: 4
        },
        ease: 'Linear', // 'Cubic', 'Elastic', 'Bounce', 'Back'
        duration: 400,
        delay: 4000,
        repeat: 0, // -1: infinity
        yoyo: true
    });

    setTimeout(function () {
        SS.roundStart = true;
    }, 4000);


    // camera::

    var camzoom = scene.tweens.add({
        targets: GD.prop.cam,
        zoom: {
            from: 0.50,
            to: 1
        },
        ease: 'Sine.easeOut', // 'Cubic', 'Elastic', 'Bounce', 'Back'
        duration: 4000,
        delay: 500,
        repeat: 0, // -1: infinity
        yoyo: false
    });









    this.input.mouse.disableContextMenu();

    this.input.on('pointerdown', function (pointer) {
        //        console.log(pointer);

        switch (pointer.button) {
            case 0:
                window.control_turn = -1;
                break;
            case 1:
                SS.zoom -= 0.25;
                if (SS.zoom < 0.5) {
                    SS.zoom = 1;
                };
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

    let si = 3;

    const spawnData = [{
        x: 2,
        y: 12,
        d: 1
}, {
        x: 38,
        y: 11,
        d: 3
}, {
        x: 20,
        y: 2,
        d: 2
}, {
        x: 20,
        y: 21,
        d: 0
}];

    // player one
    GD.prop.player = gstate.spawnPlayer(new Snake(initData.id, scene, spawnData[si].x, spawnData[si].y, spawnData[si].d, 's_head', 's_tail', spawnColours[si]));
    si--;
    //    GD.prop.ai1 = gstate.spawnPlayer(new Snake('ai1', scene, spawnData[si].x, spawnData[si].y, spawnData[si].d, 's_head', 's_tail', spawnColours[si]));
    //    si--;
    //    GD.prop.ai2 = gstate.spawnPlayer(new Snake('ai2', scene, spawnData[si].x, spawnData[si].y, spawnData[si].d, 's_head', 's_tail', spawnColours[si]));
    //    si--;
    //    GD.prop.ai3 = gstate.spawnPlayer(new Snake('ai3', scene, spawnData[si].x, spawnData[si].y, spawnData[si].d, 's_head', 's_tail', spawnColours[si]));
}

function updateLivingSnakes() {
    gstate.theLiving.forEach(element => element.update());
}

//move all these to floor class::
function rotTiles(rotCase = 0) {

    switch (rotCase) {

        case 0:
            // no rotation mode:
            return;
            break;
        case 1:
            // uniform rotation::
            return GD.prop.floor.grid.forEach(element => element.rotation += 0.05)
            break;
        case 2:
            // random rotation::
            return GD.prop.floor.grid.forEach(element => element.angle += ((Math.random() * 1) * 2) - 1)
            break;
        case 3:
            break;
        default:
    }


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

function rndTileTween(frame) {
    function setTween(tmp) {
        // good effect with some depth tweaks.
        // when tweens overlap the leaves big blocks = glitchy = cool.
        window.scene.tweens.add({
            targets: tmp,
            scale: 4,
            duration: 1000,
            ease: 'Quart.easeInOut', //Bounce was fun
            yoyo: true,
            repeat: 0
        });

    }
    setTween(Phaser.Math.RND.pick(GD.prop.floor.grid));
}

function rotGrid(val) {
    return window._C.angle += (val * val) * 2.5;
}

function markSpawns() {
    if (SS.isSpawnMarked) {
        // the true formula of 4x spawn.
        // SPAWN MARKING
        // spawn 1:
        GD.prop.floor.markTile(2, Math.ceil(GD.h / 2), spawnColours[0]);
        // spawn 2:
        GD.prop.floor.markTile(GD.w - 2, Math.floor(GD.h / 2), spawnColours[1]);
        // spawn 3:
        GD.prop.floor.markTile(Math.floor(GD.w / 2), 2, spawnColours[2]);
        // spawn 4:
        GD.prop.floor.markTile(Math.ceil(GD.w / 2), GD.h - 2, spawnColours[3]);
    }
}

// debug level
function syncDebugText(_S) {

    debug.text.setText([
            'id:' + _S.id,
            'x: ' + _S.gs.x,
            'y: ' + _S.gs.y,
//            'sx:' + _S.gs.spx,
//            'sy:' + _S.gs.spy,
        ]);
    debug.text.x = _S.head.x - 100;
    debug.text.y = _S.head.y - 45;
    debug.text.setDepth(8);
}

let sintick = 1;
let turnCount = 0;
let isLeftTurn = false;

function update() {

    //    GD.prop.BG.rotation += 0.0005;

    // update zoom by SS SUPERSTATE::
    //    GD.prop.cam.setZoom(SS.zoom);
    GD.prop.floor.updateFloor();

    // grab the client player: // refactor
    let _S = gstate.theLiving[gstate.pControlIndex];

    /*    //autodriving stuff::
        if (_S.actioncount % debug.autoTurn == 0 && _S.actioncount != 0) { // forget what i was doing but wanted to limit it lol
            if (_S.movetick % _S.movemod == 0) {
                turnCount++;
                if (debug.autoDrive) {
                    if (turnCount > 3) {
                        turnCount = 0;
                        isLeftTurn = !isLeftTurn;
                    }
                    if (isLeftTurn) {
                        window.control_turn = -1;
                    } else {
                        window.control_turn = 1;
                    }
                }
            }
        }*/

    /*
    // INPUTS::
    // DEV-CAMERA
    if (cursors.up.isDown) {

        sintick += 0.05;
        if (sintick > 2) {
            sintick = 2;
        }

    }
    if (cursors.down.isDown) {
        //        sintick -= 0.05;
        //        if (sintick < 0) {
        //            sintick = 1;
        //        }


        if (debug.noiseAlphaGrid) {
            GD.prop.floor.activeNoise();
        }
    }*/

    /*
    // SNAKE KEYBOARD CONTROLS:
    if (cursors.left.isDown) {
        window.control_turn = -1;
    }
    if (cursors.right.isDown) {
        window.control_turn = 1;
    }*/

    if (SS.roundStart) {

        // update all players.
        updateLivingSnakes();

    }





    // style floor::

    if (SS.tweenTileBool) {
        rndTileTween();
    }

    rotTiles(SS.rotTileCaseIndex);

    if (debug.rotGrid) {
        rotGrid(0.5);
    }



    //    var pointer = this.input.activePointer;
    if (debug.readout) {
        syncDebugText(GD.prop.player);
    }
}
