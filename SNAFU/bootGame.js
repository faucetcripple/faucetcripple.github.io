/*
START UP SCENE.  can* Double as Background to other scenes.
*/

//var music;

class Scene1 extends Phaser.Scene {
    constructor() {
        super("bootGame");
        this._G = undefined;
        this.props = {};
        this.clickcount = 0;
    }

    exitScene(scene) {
        // 3 options *known
        window.fx.game.scene.start("playGame");
        //            _THIS.fade(_THIS.cameras.main);
        //            _THIS.scene.transition({
        //                target: 'playGame',
        //                duration: 3000
        //            });
        //            _THIS.scene.restart(); // works
    }

    preload() {
        this.load.image('logo', '../sprites/logo_trim.png');
        this.load.image('backdrop', '../sprites/backdrop_space.png');

        this.load.audio('intro_tune', ['audio/INTRO_TUNE_DCA.ogg', 'audio/INTRO_TUNE_DCA.mp3']);

    }

    styleCamera(cam, style) {
        switch (style) {
            case 0:
                cam.setPostPipeline(this._G.PlasmaPost2FX);
                break;
            case 1:
                cam.setPostPipeline(this._G.LazersPostFX);
                break;
            case 2:
                cam.setPostPipeline(this._G.BendWavesPostFX);
                break;
            case 3:
                cam.setPostPipeline(this._G.BendRotationWavesPostFX);
                break;
            case 4:
                cam.setPostPipeline(this._G.BlurPostFX);
                break;
            case 5:
                cam.setPostPipeline(this._G.ColorPostFX);
                break;
            case 6:
                cam.setPostPipeline(this._G.PlasmaPostFX);
                break;
            case 7:
                cam.setPostPipeline(this._G.PixelatedFX);
                break;
            case 8:
                cam.setPostPipeline(this._G.ScalinePostFX);
                break;
            case 9:
                cam.setPostPipeline(this._G.BendWaves2);
                break;
        }
    }

    fade(cam) {
        //  You can set your own fade color and duration
        cam.fade(0x000000, 1000);

    }

    setupLogo(scene) {
        const _THIS = scene;
        const opts = {
            logoAngle: 10,
        }

        var LOGO = scene.add.image(0, 0, 'logo').setAngle(opts.logoAngle * -1);

        LOGO.setInteractive();
        LOGO.setScale(2);
        //        LOGO.setPostPipeline(this._G.LazersPostFX);
        LOGO.setPostPipeline(this._G.LIGHTSPIN);

        scene.tweens.add({
            targets: LOGO,
            angle: opts.logoAngle,
            duration: 2000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        //        LOGO.once('pointerup', function () {
        LOGO.on('pointerup', function () {

            console.log(_THIS.clickcount);

            switch (_THIS.clickcount++) {
                case 0:
                    _THIS.tweenWorkIntro(_THIS);
                    break;
                case 4:
                    //                    _THIS.exitScene(LOGO);
                    break;
                default:


            }

        });

        LOGO.alpha = 0.1;
        this.props.logo = LOGO;


    }

    setupBackdrop(scene) {
        let backdrop = scene.add.image(0, 0, 'backdrop');
        backdrop.setScale(2);
        backdrop.setDepth(-100);
        //        backdrop.setPostPipeline(window.fx.BendPostFX2);
        backdrop.setPostPipeline(window.fx.SHADE_ELEVATOR);
        backdrop.setPostPipeline(window.fx.LIGHTSPIN);
        this.props.backdrop = backdrop;
    }

    setupMainCamera(scene) {
        let cam = scene.cameras.main;

        //        cam.setZoom(5);
        cam.setZoom(0.0001);
        cam.centerOn(0, 0);
        cam.alpha = 0.2;
        this.props.cam = cam;
    }

    tweenWorkIntro(scene) {
        scene.tweens.add({
            targets: this.props.intro_tune,
            volume: {
                from: 0,
                to: 0.5
            },
            ease: 'Sine.easeOut', // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 5000,
            delay: 0,
            repeat: 0, // -1: infinity
            yoyo: false
        });




        scene.tweens.add({
            targets: this.props.cam,
            zoom: {
                from: 0.250,
                to: 1
            },
            alpha: {
                from: 0,
                to: 1,
            },
            ease: 'Sine.easeOut', // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 1000,
            delay: 500,
            repeat: 0, // -1: infinity
            yoyo: false
        });





        scene.tweens.add({
            targets: this.props.backdrop,
            scale: {
                from: 1,
                to: 2
            },
            alpha: {
                from: 0.5,
                to: 1,
            },
            ease: 'Sine.easeOut', // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 1000,
            delay: 500,
            repeat: 0, // -1: infinity
            yoyo: false
        });



        scene.tweens.add({
            targets: this.props.backdrop,
            scale: {
                from: 2,
                to: 4
            },
            ease: 'Sine.easeInOut', // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 30000,
            delay: 1500,
            repeat: -1, // -1: infinity
            yoyo: true
        });




        scene.tweens.add({
            targets: this.props.camSpace,
            zoom: {
                from: 1,
                to: 4
            },
            alpha: {
                from: 0,
                to: 0.5,
            },
            ease: 'Sine.easeInOut', // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 10000,
            delay: 15000,
            repeat: -1, // -1: infinity
            yoyo: true
        });






        /*        scene.tweens.add({
                    targets: this.props.cam,
                    zoom: {
                        from: 0.5,
                        to: 1
                    },
                    ease: 'Sine.easeInOut', // 'Cubic', 'Elastic', 'Bounce', 'Back'
                    duration: 4000,
                    delay: 2000,
                    repeat: -1, // -1: infinity
                    yoyo: true
                });*/
        /*
        scene.tweens.add({
            targets: this.props.backdrop,
            scale: {
                from: 4,
                to: 1
            },
            ease: 'Sine.easeInOut', // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 4000,
            delay: 2000,
            repeat: -1, // -1: infinity
            yoyo: true
        });

        scene.tweens.add({
            targets: this.props.LOGO,
            scale: {
                from: 4,
                to: 1
            },
            ease: 'Sine.easeInOut', // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 4000,
            delay: 2000,
            repeat: -1, // -1: infinity
            yoyo: true
        });*/




    }

    create() {
        this.props.intro_tune = this.sound.add('intro_tune', {
            volume: 0
        });
        this.props.intro_tune.play({
            loop: true,
            volume: 0,
        });

        const _G = window.fx; // global access to pipeline modules
        this._G = _G;
        const _THIS = this;

        this.setupLogo(this);
        this.setupBackdrop(this);

        this.setupMainCamera(this);


        let camBend = this.cameras.add();

        camBend.setPostPipeline(window.fx.BendWaves2).alpha = 0.5;
        camBend.setPostPipeline(window.fx.LIGHTSPIN);
        camBend.setPostPipeline(window.fx.HueRotatePostFX);
        camBend.ignore(this.props.backdrop);
        camBend.centerOn(0, 0);

        let cam2 = this.cameras.add();
        cam2.setPostPipeline(window.fx.BendWaves2).alpha = 0;
        cam2.ignore(this.props.logo);
        cam2.centerOn(0, 0);
        this.props.camSpace = cam2;

        //        this.props.cam.setPostPipeline(window.fx.BendWaves2);

        //
        //        let camElevator = this.cameras.add();
        //        camElevator.centerOn(0, 0);
        //
        //        camElevator.setPostPipeline(window.fx.SHADE_ELEVATOR).alpha = 0;
        //
        //        camBend.alpha = 0.25;
        //        camElevator.alpha = 0.25;

        //        this.styleCamera(cam, 2);
        //        this.styleCamera(cam, 0);



    }

}
