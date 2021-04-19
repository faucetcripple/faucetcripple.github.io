const fragShader = `
#define SHADER_NAME SNAKE_SPIRAL_FS
// http://glslsandbox.com/e#72499.1
precision mediump float;

uniform sampler2D uMainSampler;
uniform float uTime;
uniform float uSpeed;
uniform float uBendFactor;

uniform vec2 uResolution;

varying vec2 outTexCoord;

float rand(vec2 uv) {
	return fract(sin(dot(uv * 22.1234, vec2(2.1010,.9191)) * 3.9087)) * 2.0 - 1.0;
}
mat2 rot(float angle)
{
    float c = cos(angle);
    float s = sin(angle);
    return mat2(c, -s, s, c);
}



void main()
{
    vec2 uv = ( 2.0 * gl_FragCoord.xy - uResolution.xy ) / min(uResolution.x, uResolution.y);
	
	
	float r = 0.5+abs(rand(uv*10.0));
	float d = length(uv)*5.0;
	uv.xy*= dot(uv,uv)*(0.5+sin(uTime*0.9)*0.5);
	
	
	uv += sin(uv*r)*0.2;

	
	vec3 dir = normalize(vec3(uv, 1.0));
	vec3 pos = vec3(0.0, 0.0, 1.0);
	vec3 col = vec3(1.0);
	
	vec3 N = vec3(0.0, 1.0, 0.0);
	N.xy*=rot(40.0/d+uTime*0.4);
	
	float t = -(5.0 - dot(dir, pos)) / dot(dir, N);
	if(t > 0.0)
		col = vec3(3,2,3) * t * 0.018;
	t = -(5.0 - dot(dir, pos)) / dot(dir, -N);
	if(t > 0.0)
		col = vec3(3,2,1) * t * 0.018;

	r = abs(r)+0.8;
	r = clamp(r,0.0,1.0);
	
//	gl_FragColor = vec4(clamp(0.25/col, vec3(0.0), vec3(1.0))*r, 1.0);
	

    vec4 pixel = texture2D(uMainSampler, outTexCoord);

    gl_FragColor =  pixel* vec4(clamp(0.25/col, vec3(0.0), vec3(1.0))*r, 1.0);
}
`;




export default class SNAKE_SPIRAL extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
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
        this.set1f('uTime', this.game.loop.time / 100);
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
