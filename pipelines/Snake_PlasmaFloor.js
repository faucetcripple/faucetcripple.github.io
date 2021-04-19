const fragShader = `
#define SHADER_NAME SNAKE_PLASMAFLOOR_FS

precision mediump float;

uniform sampler2D uMainSampler;
uniform float uTime;
uniform float uSpeed;
uniform float uBendFactor;

uniform vec2 uResolution;

varying vec2 outTexCoord;

void main()
{
// http://glslsandbox.com/e#72309.1
	vec2 p = (gl_FragCoord.xy * 2.0 - uResolution) / min(uResolution.x, uResolution.y);
	float yy = p.y;
	p+=sin(p+p)*0.5;
	p.x *= dot(p,p)*0.4;
	float dd = length(sin(uTime*0.4+p*p))*2.5;
	float z = 0.5+sin(uTime*.5+p.y*2.5)*0.5;
	p*=1.0+z*1.35;
	z=1.0-z;
	z = 0.6+(z*.85);
	
	float vv = sin(yy*100.0);
	vv*=vv;
	vec3 col1 = vec3(0.3+vv,0.51,0.55);
	vec3 col2 = vec3(0.3,.24,0.24);
	
	float v = sin(dd*5.0+uTime*0.5)*2.0;
	
	float d = step(sin(p.y*20.)+sin(p.y+p.x*12.0),v);
	

    vec4 pixel = texture2D(uMainSampler, outTexCoord);

    gl_FragColor =  pixel* vec4(mix(col1,col2,d)*z,1.0);
}
`;




export default class SNAKE_PLASMAFLOOR extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
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
        this.set1f('uTime', this.game.loop.time / 1000);
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
