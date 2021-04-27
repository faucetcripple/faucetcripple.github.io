// #module
import HueRotatePostFX from '../pipelines/HueRotatePostFX.js';
import LazersPostFX from '../pipelines/LazersPostFX.js';
import BendPostFX from '../pipelines/BendPostFX.js';
import BendRotationWavesPostFX from '../pipelines/BendRotationWavesPostFX.js';
import BendWavesPostFX from '../pipelines/BendWavesPostFX.js';
import BlurPostFX from '../pipelines/BlurPostFX.js';
import PixelatedFX from '../pipelines/PixelatedFX.js';
import PlasmaPostFX from '../pipelines/PlasmaPostFX.js';
import PlasmaPost2FX from '../pipelines/PPlasmaPost2FX.js';

import PlasmaPost3FX from '../pipelines/PlasmaPost3FX.js';
import BendWaves2 from '../pipelines/BendWaves2.js';

import ScalinePostFX from '../pipelines/ScalinePostFX.js';

import HueRotate from '../pipelines/HueRotate.js';


import SHADE_ELEVATOR from '../pipelines/Shade_Elevator.js';
import LIGHTSPIN from '../pipelines/LIGHTSPIN.js';
// doing this  until i figure out a better way to get to external scene scopes::
window.fx = {}
window.fx.HueRotatePostFX = HueRotatePostFX;
window.fx.LazersPostFX = LazersPostFX;
window.fx.BendPostFX = BendPostFX;
window.fx.BendRotationWavesPostFX = BendRotationWavesPostFX;
window.fx.BendWavesPostFX = BendWavesPostFX;
window.fx.BlurPostFX = BlurPostFX;
window.fx.PixelatedFX = PixelatedFX;
window.fx.PlasmaPostFX = PlasmaPostFX;
window.fx.PlasmaPost2FX = PlasmaPost2FX;
window.fx.PlasmaPost3FX = PlasmaPost3FX;



window.fx.ScalinePostFX = ScalinePostFX;
window.fx.BendWaves2 = BendWaves2;
window.fx.SHADE_ELEVATOR = SHADE_ELEVATOR;
window.fx.LIGHTSPIN = LIGHTSPIN;








var config = {
    type: Phaser.AUTO,
    width: 640,
    //    height: 360,
    height: 352,
    scale: {
        mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
        //        mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
        //        autoCenter: Phaser.Scale.CENTER_BOTH
        autoCenter: Phaser.Scale.NO_CENTER
    },
    parent: 'game', // if this gets removed everything breaks lol
    //    pixelArt: true,
    pixelArt: true,
    //    backgroundColor: "#156525",
    scene: [Scene1, Scene2],
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
        SHADE_ELEVATOR,
        LIGHTSPIN,
    },
    physics: {
        default: "matter",
        matter: {
            enableSleeping: true,
            debug: false,
        }
    }
};


var game = new Phaser.Game(config);



window.fx.w = game.config.width;
window.fx.hw = game.config.width / 2;
window.fx.h = game.config.height;
window.fx.hh = game.config.height / 2;

window.fx.game = game;
