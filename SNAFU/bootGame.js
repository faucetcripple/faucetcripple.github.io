// startup screen - click to play - gatekeeper for input required stuff like tts.

class Scene1 extends Phaser.Scene {
    constructor() {
        super("bootGame");
        this._G = undefined;
    }

    preload() {
        this.load.image('logo', '../sprites/logo_trim.png');
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

    create() {
        const _G = window.fx; // global access to pipeline modules
        this._G = _G;



        const _THIS = this;

        const opts = {
            logoAngle: 10,
        }


        let cam = this.cameras.main;

        //        this.add.text(15, 15, "Loading game...")
        this.add.text(_G.hw - 52, _G.hh + 90, "Product IonS");
        //        this.add.text(15, 15,"Connecting...")

        // logo section::
        var text = this.matter.add.image(_G.hw, _G.hh, 'logo').setAngle(opts.logoAngle * -1);

        text.setInteractive();

        text.body.ignoreGravity = true;

        text.setScale(2);

        text.setPostPipeline(this._G.LazersPostFX);


        // menu container
        this.tweens.add({
            targets: text,
            angle: opts.logoAngle,
            duration: 2000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        text.on('pointerout', function () {
            text.clearTint();
        });

        text.once('pointerup', function () {
            // 3 options *known
            _THIS.scene.start("playGame");
            //            _THIS.fade(_THIS.cameras.main);
            //            _THIS.scene.transition({
            //                target: 'playGame',
            //                duration: 3000
            //            });

            //            _THIS.scene.restart(); // works
        });


        this.styleCamera(cam, 2);
        this.styleCamera(cam, 0);

        _THIS.scene.start("playGame"); // AUtoloads game

        //        this.camera.setZoom(1)


    }
}
