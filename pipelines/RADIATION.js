const fragShader = `
#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;


uniform sampler2D uMainSampler;
varying vec2 outTexCoord;

#define rotate2D(a) mat2(cos(a),-sin(a),sin(a),cos(a))

void main( void ) {

	vec2 position = 1000. * (1. + sin(time/10.)) * ( gl_FragCoord.xy / resolution.xy );
	
	position += vec2(0,position.x*position.y+position.y);

	float color = tan(3.1*position.x / position.y + cos(position.y));

//	gl_FragColor = vec4( vec3( color, color, color ), 1.0 );


//	vec2 p = gl_FragCoord.xy / min(resolution.x, resolution.y) - 0.5;
//	vec2 p = gl_FragCoord.xy / min(resolution.x, resolution.y)- .88;
//	vec2 p = gl_FragCoord.xy / min(resolution.x, resolution.y)- .88;
//	float th = atan(p.y, p.x);
//	float ra = length(p);
//	float sr = pow(ra, .2) * 10.0;
//
//	float c = step(.5, fract(th / (sr / time)));
//	gl_FragColor = vec4(c);






//	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
//	float yy = sin(p.y*0.2+time*0.01+p.x*43.05);
//	p+=sin(p+p)*0.5;
//	p.x *= dot(p,p)*0.4;
//	float dd = length(sin(time*0.4+p*p))*2.5;
//	float z = 0.5+sin(time*.5+p.y*2.5)*0.5;
//	p*=1.0+z*1.35;
//	z=1.0-z;
//	z = 0.6+(z*.85);
//	
//	float vv = sin(yy*80.0);
//	vv*=vv;
//	vec3 col1 = vec3(.3,0.2+(0.6*vv),0.5*vv);
//	vec3 col2 = vec3(0.6,.64*vv,0.53);
//	
//	float v = sin(dd*5.0+time*0.5)*2.0;
//	
//	float d = step(sin(p.y*2.)+sin(p.y+p.x*2.0),v);
//	

   vec4 pixel = texture2D(uMainSampler, outTexCoord);
	
//gl_FragColor = pixel-vec4(c);

gl_FragColor = pixel* vec4( vec3( color, color, color ), 1.0 );
    
//    gl_FragColor = pixel*vec4(mix(col1,col2,d)*z,1.0);
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

        this.set1f('time', this.game.loop.time / 100000);
        this.set2f('mouse', this.mouseX, this.mouseY)
    }
}
