const fragShader = `
#define SHADER_NAME PLASMA_2_FS

precision mediump float;

uniform float     uTime;
uniform vec2      uResolution;
uniform sampler2D uMainSampler;
varying vec2 outTexCoord;

#define MAX_ITER 3

void main( void )
{
    vec2 v_texCoord = gl_FragCoord.xy / uResolution;

    vec2 p =  v_texCoord * 8.0 - vec2(30.0);
    vec2 i = p;
    float c = 0.5;
    float inten = .15;

    for (int n = 0; n < MAX_ITER; n++)
    {
        float t = uTime * (1.0 - (3.0 / float(n+1)));

        i = p + vec2(cos(t - i.x) + sin(t + i.y),
        sin(t - i.y) + cos(t + i.x));

        c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),
        p.y / (cos(i.y+t)/inten)));
    }

    c /= float(MAX_ITER);
    c = 1.5 - sqrt(c);

    vec4 pixel = texture2D(uMainSampler, outTexCoord);
    vec4 texColor = vec4(0.01, 0.01, 0.015, 1.0)-pixel;

    texColor.rgb *= (1.0 / (1.0 - (c + 0.05)));
   

//    gl_FragColor = pixel + texColor;
    gl_FragColor = texColor+pixel;
}
`;

export default class PlasmaPost2FX extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
    constructor(game) {
        super({
            game,
            renderTarget: true,
            fragShader,
            uniforms: [
                'uProjectionMatrix',
                'uMainSampler',
                'uTime',
                'uResolution'
            ]
        });
    }

    onBoot() {
        this.set2f('uResolution', this.renderer.width, this.renderer.height);
    }

    onPreRender() {
        this.set1f('uTime', this.game.loop.time / 1000);
    }
}
