import EDGEBEND_HUE from '../common/pipelines/EDGEBEND_HUE.js';
import OLDMONITOR_RAW from '../common/pipelines/OLDMONITOR_RAW.js';
import OLDMONITOR_FIXED from '../common/pipelines/OLDMONITOR_FIXED.js';

var config = {
    type: Phaser.AUTO,
    //    width: innerWidth,
    //    height: innerHeight,
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
        //        update: update
    },
};



var game = new Phaser.Game(config);

var loadingtext;


function preload() {
    this.load.script('webcam', 'plugins/Webcam.js');
}

var webcam;
var bmd;
var sprite;
var cam;

function create() {

    webcam = game.plugins.add(Phaser.Plugin.Webcam);

    bmd = game.make.bitmapData(800, 600);
    sprite = bmd.addToWorld();

    webcam.start(800, 600, bmd.context);

    game.input.onDown.addOnce(takePicture, this);



}

function takePicture() {

    webcam.stop();

    //  bmd.context now contains your webcam image

    sprite.tint = Math.random() * 0xff0000;

}
