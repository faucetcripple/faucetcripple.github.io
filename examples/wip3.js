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
import ScalinePostFX from '../pipelines/ScalinePostFX.js';

// try setting the container as a sensor.

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
    //    scene: [Scene1, Scene2],
    pipeline: {
        HueRotatePostFX,
        LazersPostFX,
        BendPostFX,
        BendRotationWavesPostFX,
        BendWavesPostFX,
        BlurPostFX,
        PlasmaPostFX,
        PlasmaPost2FX,
        ScalinePostFX,
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

function preload() {
    this.load.image('buttonBG', '/sprites/button_purple.png');
    //    this.load.image('buttonText', '/sprites/text_play.png');

    this.load.image('head', '../sprites/head.png');
    this.load.image('shirt', '../sprites/shirt.png');
    this.load.image('leg', '../sprites/legstand.png');
    this.load.image('legthin', '../sprites/legthin.png');
    this.load.image('lhand', '../sprites/lhand.png');
    this.load.image('rhand', '../sprites/rhand.png');
    this.load.image('logo', '../sprites/logo.png');
    this.load.image('buttonText', '../sprites/logo_trim.png');
    this.load.image('gym', '../sprites/gym_bright.png');
    this.load.image('sky', '../sprites/sky_bright.png');

    this.load.image('block', '../sprites/ball_white.png');

    this.load.image('ring', '../sprites/ring.png');
    //    this.load.image('ring', 'particles/blue-flare.png');
    //    this.load.image('ring', 'particles/blue.png');
    //    this.load.image('ring', 'particles/bubble.png');
    //    this.load.image('ring', 'particles/cloud.png');
    //    this.load.image('ring', 'particles/glass.png');
    //    this.load.image('ring', 'particles/sparkle1.png');
    //    this.load.image('ring', 'particles/smoke0.png');
    //    this.load.image('ring', 'particles/fire3.png');
    //    this.load.image('ring', 'particles/rising-smoke.png');


    this.load.image('link', '../sprites/link.png');

    this.load.json('outlines', '../sprites/mult5.json');
}




function create() {
    var particles = this.add.particles('head');

    var emitter = particles.createEmitter({
        //        frame: ['head', 'shirt', 'lhand', 'leg'],
        x: game.config.width / 2,
        y: game.config.height / 2,
        speed: 200,
        lifespan: 3000,
        blendMode: 'ADD',
        //        accellerationX: 200,
        scale: {
            start: 0,
            end: 10
        },
        frequency: 100,
    });


    //        var bg = this.add.image(0, 0, 'buttonBG');
    var text = this.matter.add.image(game.config.width / 2, game.config.height / 2, 'buttonText').setAngle(-45);

    text.setInteractive();

    text.body.ignoreGravity = true;

    text.setScale(2);

    // menu container
    let tweenA = this.tweens.add({
        targets: text,
        angle: 45,
        duration: 3000,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1
    });

    let tweenB = this.tweens.add({
        targets: text,
        alpha: 0.5,
        duration: 1000,
        ease: 'Sine.easeOut',
        yoyo: true,
        repeat: -1
    });

    text.on('pointerover', function () {

        text.setTint(0xff0000);

    });

    text.on('pointerout', function () {

        text.clearTint();

    });

    text.once('pointerup', function () {
        tweenB.remove();
        //        text.destroy();

    });






    let cam = this.cameras.main;

    //    cam.setPostPipeline(LazersPostFX);

    //    cam.setPostPipeline(LazersPostFX);
    cam.setPostPipeline(HueRotatePostFX);
    //    cam.setPostPipeline(BendPostFX);
    //    cam.setPostPipeline(BendRotationWavesPostFX); // huh
    cam.setPostPipeline(BendWavesPostFX);
    //    cam.setPostPipeline(BlurPostFX);



    //    cam.setPostPipeline(ColorPostFX); //huh
    //    cam.setPostPipeline(PlasmaPostFX);
    cam.setPostPipeline(PlasmaPost2FX);
    //    cam.setPostPipeline(PixelatedFX);
    //    cam.setPostPipeline(ScalinePostFX);

    cam.setZoom(1)


    //  Just to display the hit area, not actually needed to work



}

function update() {

}
