const fragShader = `
#define SHADER_NAME SNAKE_EDGEBEND_FS
// d74g0ns first custom made shader::
precision mediump float;

uniform sampler2D uMainSampler;
uniform float uTime;
uniform float uSpeed;
uniform float uBendFactor;

varying vec2 outTexCoord;

void main()
{
    float hb = 1.0- outTexCoord.y;
    float wb = 1.0 - outTexCoord.x;

    float ht = outTexCoord.y;
    float wt = outTexCoord.x;

    float toy = pow(ht, 2.5);
    float tox = pow(wt, 2.5);

    float boy = pow(hb, 2.5);
    float box = pow(wb, 2.5);

    toy *= (sin(uTime * uSpeed) * uBendFactor);
    tox *= (cos(uTime * uSpeed) * uBendFactor);

    boy *= (sin(uTime * uSpeed) * uBendFactor);
    box *= (cos(uTime * uSpeed) * uBendFactor);

    vec4 texture = texture2D(uMainSampler, fract(fract(vec2(outTexCoord.x + tox, outTexCoord.y+toy))));
    vec4 texture2 = texture2D(uMainSampler, fract(fract(vec2(outTexCoord.x + box, outTexCoord.y+boy))));
    

    gl_FragColor = texture+texture2;
}
`;

export default class SNAKE_EDGEBEND extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
    constructor(game) {
        super({
            game,
            renderTarget: true,
            fragShader,
            uniforms: [
                'uProjectionMatrix',
                'uMainSampler',
                'uTime',
                'uSpeed',
                'uBendFactor'
            ]
        });

        this._bend = 0.02;
        this._speed = 0.01;
    }

    onBoot() {
        this.set1i('uMainSampler', 1);
    }

    onPreRender() {
        this.set1f('uTime', this.game.loop.time);
        this.set1f('uSpeed', this._speed);
        this.set1f('uBendFactor', this._bend);
    }

    get bend() {
        return this._bend;
    }

    set bend(value) {
        this._bend = value;
    }

    get speed() {
        return this._speed;
    }

    set speed(value) {
        this._speed = value;
    }
}
