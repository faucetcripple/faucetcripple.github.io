import LazersPostFX from '../../pipelines/LazersPostFX.js';
import BendPostFX from '../../pipelines/BendPostFX.js';
//import ScalinePostFX from '../../pipelines/ScalinePostFX.js';
import OldestMonitorPostFX from '../pipelines/OldestMonitorPostFX.js';
import HueRotatePostFX from '../../pipelines/HueRotatePostFX.js';
import Snake_EdgeBend from '../../pipelines/Snake_EdgeBend.js';

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
    backgroundColor: "#000000",
    //    backgroundColor: "#ffff00",
    scene: {
        preload: preload,
        create: create,
        update: update,

    },
    pipeline: {
        LazersPostFX,
        BendPostFX,
        OldestMonitorPostFX,
        HueRotatePostFX,
        Snake_EdgeBend,
    },
    physics: {
        default: "matter",
        matter: {
            debug: false,
        },
    }
};

var game = new Phaser.Game(config);

window.game = game;
window.config = config;
window.fx = {};
window.fx.LazersPostFX = LazersPostFX;
window.fx.BendPostFX = BendPostFX;
window.fx.OldestMonitorPostFX = OldestMonitorPostFX;
window.fx.HueRotatePostFX = HueRotatePostFX;
window.fx.Snake_EdgeBend = Snake_EdgeBend;
