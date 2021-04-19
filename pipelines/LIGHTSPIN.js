const fragShader = `

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D uMainSampler;

varying vec2 outTexCoord;

//float rand(vec2 uv) {
//	return fract(sin(dot(uv * 9.1234, vec2(4.1010,12.9191)) * 1123.9087)) * 2.0 - 1.0;
//}
mat2 rot(float angle)
{
    float c = cos(angle);
    float s = sin(angle);
    return mat2(c, -s, s, c);
}

void main( void ) {
	vec2 uv = ( 4.0 * gl_FragCoord.xy - resolution.xy ) / min(resolution.x, resolution.y);
	vec3 dir = normalize(vec3(uv, 1.0));
	vec3 pos = vec3(0, 0, -3.);
	vec3 col = vec3(1.0);
	float t = 0.0;
	
	
	float tt = 0.5+sin(time)*0.5;

	float sz = mix(0.15,0.9,tt);
	
	vec3 N = vec3(0.0, 1.0, 0.0);
	
	
	
	
	N.xy*=rot(time*0.4);
	
	N = normalize(N)*sz;
	
	t = -(5.0 - dot(dir, pos)) / dot(dir, N);
	if(t > 0.0)
		col = vec3(1,2,3) * t * 0.005;
	t = -(5.0 - dot(dir, pos)) / dot(dir, -N);
	if(t > 0.0)
		col = vec3(3,2,1) * t * 0.005;

   vec4 pixel = texture2D(uMainSampler, outTexCoord);
	
	gl_FragColor = pixel * vec4(clamp(col, vec3(0.0), vec3(1.0)), 1.0);
}
`;

export default class LIGHTSPIN extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
    constructor(game) {
        super({
            game,
            renderTarget: true,
            fragShader,
            uniforms: [
                'uProjectionMatrix',
                'uMainSampler',
                'time',
                'resolution',
                'mouse'
            ]
        });
    }

    onBoot() {
        this.set2f('resolution', this.renderer.width, this.renderer.height);
    }

    onPreRender() {

        this.set1f('time', this.game.loop.time / 1000);
        this.set2f('mouse', this.mouseX, this.mouseY)
    }
}
