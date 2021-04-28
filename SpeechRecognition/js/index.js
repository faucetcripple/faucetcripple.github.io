// make a listening clock.

var game = window.game;
var config = window.config;
var scene;

//var style = {}
var s = {
    isLazerText: false,
    isHueText: true,
    isScanlineCam: true,
};

var readout = {
    isVerbose: false,
    text: undefined,
    container: undefined,
    center: function (text) {
        text.x = (-(config.width / 2) - text.width / 2) + (config.width / 2);
        text.y = (-(config.height / 2) - text.height / 2) + (config.height / 2);
    },
    update: function (transcript, confidence) {
        r.container.alpha = 0; // for animaion;
        r.text.setText(transcript);
        r.center(r.text);

        scene.tweens.add({
            targets: r.container,
            scale: {
                from: 0,
                to: 1
            },
            alpha: {
                from: 0,
                to: 0.9,
            },
            angle: {
                from: 0,
                to: 360,
            },
            ease: 'Sine.easeOut', // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 500,
            delay: 500,
            repeat: 0, // -1: infinity
            yoyo: false
        });
    },
}
const r = readout;

var general_design = {
    mainCamera: undefined,
}
const gd = general_design;

function wordWrap(msg, confidence) {

    if (r.isVerbose) {
        msg += ` [${(confidence * 100).toFixed(2)}%]`;
    }
    let wordwrapped = (msg + ' ').replace(/(\S(.{0,24}\S)?)\s+/g, '$1\n').trim();

    // zoom last message out::
    scene.tweens.add({
        targets: r.container,
        scale: {
            from: 1,
            to: 0
        },
        alpha: {
            from: 0.9,
            to: 0,
        },
        angle: {
            from: 360,
            to: 0,
        },
        ease: 'Sine.easeOut', // 'Cubic', 'Elastic', 'Bounce', 'Back'
        duration: 500,
        delay: 0,
        repeat: 0, // -1: infinity
        yoyo: false,
        onComplete: function () {
            //            console.log('done');
            r.update(wordwrapped);
        },
    });
}

function callback_SR(msg, con) {
    wordWrap(msg, con);
}

function preload() {
    scene = this;
    this.load.image('backdropB', '../sprites/backdrop_a.png');
    this.load.image('backdrop', '../sprites/backdrop_space.png');
    //    this.load.image('backdrop', '../sprites/backdrop_matte_a.png');
    //    this.load.image('backdrop', '../sprites/backdrop_basic_vig.png');
}

function create() {
    gd.backdrop = this.add.image(0, 0, 'backdrop');
    gd.backdrop.setScale(1)

    scene.tweens.add({
        targets: gd.backdrop,
        scale: {
            from: 1,
            to: 3
        },
        alpha: {
            from: 0.5,
            to: 1,
        },
        angle: {
            from: 3600,
            to: 0,
        },
        ease: 'Sine.easeInOut', // 'Cubic', 'Elastic', 'Bounce', 'Back'
        duration: 50000,
        delay: 0,
        repeat: -1, // -1: infinity
        yoyo: true,
    });



    gd.backdropB = this.add.image(0, 0, 'backdropB');
    gd.backdropB.setScale(3);
    gd.backdropB.alpha = 0.1;

    gd.mainCamera = this.cameras.main; //.centerOn(0, 0);
    gd.mainCamera.centerOn(0, 0);

    var style = {
        font: "bold 42px VT220",
        //        fill: "#080",
        fill: "#f80",
        boundsAlignH: "center",
        boundsAlignV: "middle"
    };

    //  The Text is positioned at 0, 100
    r.text = this.add.text(-304, -150, "d74g0n", style);
    r.text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
    r.center(r.text);

    gd.backdrop.tint = 0x882344;
    //    gd.backdrop.alpha = 0;
    //    this.cameras.main.setPostPipeline(window.fx.LazersPostFX);

    if (s.isLazerText) {
        r.text.setPostPipeline(window.fx.LazersPostFX);
        //                r.text.setPostPipeline(window.fx.Snake_EdgeBend);
    }

    if (s.isScanlineCam) {
        gd.mainCamera.setPostPipeline(window.fx.OldestMonitorPostFX);
        gd.mainCamera.setPostPipeline(window.fx.Snake_EdgeBend);
    }

    if (s.isHueText) {
        r.text.setPostPipeline(window.fx.HueRotatePostFX);
    }

    this.input.activePointer;
    //    gd.mainCamera.setPostPipeline(window.fx.HueRotatePostFX);
    //    gd.backdrop.setPostPipeline(window.fx.Snake_EdgeBend);
    //    gd.backdrop.setPostPipeline(window.fx.LazersPostFX);
    //    gd.backdrop.setPipeline(window.fx.HueRotatePostFX);

    //    r.text.setPipeline(window.fx.LazersPostFX);
    //    r.backdrop.setPostPipeline(window.fx.BendRotationWavesPostFX);


    // mock anchor::
    r.container = this.add.container(0, 0);
    r.container.add(r.text);
}

function update() {

}

function say(msg) {
    wordWrap(msg);
}
