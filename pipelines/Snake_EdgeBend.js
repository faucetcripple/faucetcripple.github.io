const fragShader = `
#define SHADER_NAME SNAKE_EDGEBEND_FS
// d74g0ns first custom made shader::
precision mediump float;

uniform sampler2D uMainSampler;
uniform float uTime;
uniform float uSpeed;
uniform float uBendFactor;

uniform vec2 uResolution;

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
    

    vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / uResolution.xy;

    float x = p.x;
    float y = p.y;
    float mov0 = x+y+cos(sin(uTime*0.001)*2.0)*100.+sin(x/100.)*1000.;
    float mov1 = y / 0.9 + (uTime * 0.001);
    float mov2 = x / 0.2;
    float c1 = abs(sin(mov1+uTime*0.001)/2.+mov2/2.-mov1-mov2+uTime*0.001);
    float c2 = abs(sin(c1+sin(mov0/1000.+uTime*0.001)+sin(y/40.+uTime*0.001)+sin((x+y)/100.)*3.));
    float c3 = abs(cos(c1+sin(mov0/1000.+uTime*0.001)+sin(y/40.+uTime*0.001)+sin((x+y)/100.)*3.));
    

//    float c3 = abs(sin(c2+cos(mov1+mov2+c2)+cos(mov2)+sin(x/1000.)));

    vec4 pixel = texture2D(uMainSampler, outTexCoord);

// valid
//    pixel *= vec4(c1, c2, c3, 1);
//fn great::
//    pixel += vec4(c1, c2, c3, 1);

    pixel += vec4(c1, c2, c3, 1);






//    gl_FragColor = texture + texture2 + pixel;
    gl_FragColor = texture + texture2 - pixel;
    // * plasma ;
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
                'uBendFactor',
                'uResolution'
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

    onDraw(renderTarget) {
        this.set2f('uResolution', renderTarget.width, renderTarget.height);

        this.bindAndDraw(renderTarget);
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
