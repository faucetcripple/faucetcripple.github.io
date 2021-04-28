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
    pipeline: {
        EDGEBEND_HUE,
        OLDMONITOR_RAW,
        OLDMONITOR_FIXED,
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: "matter",
        matter: {
            debug: false
        }
    }
};



var game = new Phaser.Game(config);

var loadingtext;


function preload() {

    //    loadingtext = this.add.text(100, 100, "Loading videos ...", {
    //        font: "65px Arial",
    //        fill: "#ff0044"
    //    });

    //    this.load.video('space', '../common/video/love.mp4', 'loadeddata', true, true);
    this.load.video('space', '../common/video/happyd.webm', 'loadeddata', true, true);



}

var video;
var cam;

function create() {

    video = this.add.video(config.width / 2, config.height / 2, 'space');

    video.setVolume(0.5);
    video.setScale(0.3);

    video.setMute(false);
    video.play(true);

    cam = this.cameras.main;

    //    this.tweens.add({
    //        targets: cam,
    //        zoom: {
    //            from: 1,
    //            to: 0.25
    //        },
    //        ease: 'Sine.easeOut', // 'Cubic', 'Elastic', 'Bounce', 'Back'
    //        duration: 5000,
    //        delay: 0,
    //        repeat: -1, // -1: infinity
    //        yoyo: true
    //    });

    cam.setPostPipeline(EDGEBEND_HUE);
    cam.setPostPipeline(OLDMONITOR_FIXED);

}

function update() {



}
