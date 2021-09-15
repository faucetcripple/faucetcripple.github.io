import OLDMONITOR_FIXED from '../common/pipelines/OLDMONITOR_FIXED.js';
import OLDMONITOR_RED from '../common/pipelines/OLDMONITOR_RED.js';

var config = {
    type: Phaser.AUTO,
    width: innerWidth,
    height: innerHeight,
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
        update: update
    },
    pipeline: {
        OLDMONITOR_FIXED,
        OLDMONITOR_RED,
    },
    physics: {
        default: "matter",
        matter: {
            debug: false
        }
    }
};

var game = new Phaser.Game(config);

function preload() {
    this.load.image('skull', '../common/img/pmw.png');
    this.load.image('backdrop', '../sprites/backdrop_a.png');
}

var skull;
var backdrop;
var cam;

function create() {

    backdrop = this.add.image(config.width / 2, config.height / 2, 'backdrop');
    backdrop.setScale(8);

    skull = this.add.image(config.width / 2, config.height / 2, 'skull');

    skull.alpha = 0.5;
    skull.tint = 0x007700;
    //    skull.setPostPipeline(OLDMONITOR_FIXED);
    //    backdrop.setPostPipeline(OLDMONITOR_FIXED);
    backdrop.setPostPipeline(OLDMONITOR_RED);

    cam = this.cameras.main;

    //    cam.setPostPipeline(OLDMONITOR_FIXED);


}


function update() {

}

window.addEventListener('resize', () => {
    game.resize(window.innerWidth, window.innerHeight);
});
