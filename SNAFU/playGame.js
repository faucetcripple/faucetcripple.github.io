var CustomPipeline = new Phaser.Class({

    Extends: Phaser.Renderer.WebGL.Pipelines.MultiPipeline,

    initialize:

        function CustomPipeline(game) {
            Phaser.Renderer.WebGL.Pipelines.MultiPipeline.call(this, {
                game: game,
                fragShader: `
            precision mediump float;

            uniform sampler2D uMainSampler[%count%];
            uniform vec2 uResolution;
            uniform float uTime;

            varying vec2 outTexCoord;
            varying float outTexId;
            varying vec4 outTint;

            vec4 plasma()
            {
                vec2 pixelPos = gl_FragCoord.xy / uResolution * 20.0;
                float freq = 0.8;
                float value =
                    sin(uTime + pixelPos.x * freq) +
                    sin(uTime + pixelPos.y * freq) +
                    sin(uTime + (pixelPos.x + pixelPos.y) * freq) +
                    cos(uTime + sqrt(length(pixelPos - 0.5)) * freq * 2.0);

                return vec4(
                    cos(value),
                    sin(value),
                    sin(value * 3.14 * 2.0),
                    cos(value)
                );
            }

            void main()
            {
                vec4 texture;

                %forloop%

                texture *= vec4(outTint.rgb * outTint.a, outTint.a);

                gl_FragColor = texture * plasma();
            }
            `,
                uniforms: [
                'uProjectionMatrix',
                'uViewMatrix',
                'uModelMatrix',
                'uMainSampler',
                'uResolution',
                'uTime'
            ]
            });
        }
});





var customPipeline;
// this scene is the game.
class Scene2 extends Phaser.Scene {
    constructor() {
        super("playGame");
        this.myframe = 0;
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
                cam.setPostPipeline(this._G.PlasmaPost3FX);
                break;
        }
    }

    preload() {
        //        this.load.image('tile_basic', '../sprites/tile_grey.png');
        this.load.image('tile_basic', '../sprites/tile_outline_bright.png');
        //        this.load.image('tile_basic', '../sprites/tile_round.png');
        //        this.load.image('tile_basic', '../sprites/tile_round_bright.png');
        //        this.load.image('tile_basic', '../sprites/tile_round_spin.png');


    }

    create() {

        //        customPipeline = this.renderer.pipelines.add('Custom', new CustomPipeline(game));
        //        customPipeline.set2f('uResolution', game.config.width, game.config.height);
        /*
        const colorPipeline = this.renderer.pipelines.get('HueRotate');
        const bendPipeline = this.renderer.pipelines.get('BendPostFX');*/


        const _G = window.fx; // global access to pipeline modules
        this._G = _G;
        const _THIS = this;

        this.rows = [];
        var container = this.add.container(320, 176);

        let offset = {
            x: -320,
            y: -176,
        }



        for (let y = 0; y < 360; y += 16) {
            for (let x = 0; x < 640; x += 16) {
                let tmp = this.add.image(8 + x + offset.x, 8 + y + offset.y, 'tile_basic')

                //                .setPipeline(colorPipeline).setPostPipeline(bendPipeline);
                //  tmp.tint = Math.random() * 0xff0000;
                tmp.tint = halp.color.rndSkin();
                // tmp.tint = halp.rnd.pattern('soft_purple');

                //                tmp.rotation = Math.random() * 360 / 2;

                //                tmp.setPipeline(this._G.BendPostFX);
                this.rows.push(tmp);
                //  tmp.blendMode = 3;
                //                tmp.setPostPipeline(window.fx.LazersPostFX);

            }
        }


        container.add(this.rows);
        this._C = container;

        let cam = this.cameras.main;

        cam.setPipeline('Custom');
        //        this.styleCamera(cam, 0);
        this.styleCamera(cam, 2);
        //        this.styleCamera(cam, 9);
        //        cam.setZoom(0.50);
        cam.setZoom(1);

        //        cam.setPostPipeline(this._G.PlasmaPost3FX);
        //        cam.setPostPipeline('custom');
    }


    rotTiles() {
        return this.rows.forEach(element => element.rotation += 0.05)
    }

    rotGrid(val) {
        return this._C.angle += (val * val) * 2.5;
    }

    update() {
        this.myframe++;
        let val = Math.sin(this.myframe);
        //        this.rotTiles();
        //        this.rotGrid(val);

        //        }
        if (this.myframe % 60 === 0) {
            //            halp.tint.arrPattern(this.rows, 'chess');
            //            halp.tint.arrPattern(this.rows, 'vampire_sky');
            //            halp.tint.arrPattern(this.rows, 'flame_ship');
            //            halp.tint.arrPattern(this.rows, 'soft_purple');
            //            this._C.scale += val;
        }

        //        this._C.rotation += 0.01;
        //        this._C.angle += Math.sin(this.myframe / 360) / 2;



        //        this._C.scale += val / 100;
    }


}
