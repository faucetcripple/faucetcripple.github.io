const fragShader = `
#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

uniform sampler2D uMainSampler;
varying vec2 outTexCoord;


#define FC gl_FragCoord
#define o gl_FragColor
#define r resolution
#define t time

#define rotate2D(a) mat2(cos(a),-sin(a),sin(a),cos(a))


void main( void ) {
vec4 pixel = texture2D(uMainSampler, outTexCoord);

    vec2 p; 
	float i,g,d=2.;
	for(float j=0.;j<128.;j++) {
		++i;
		if (d<=.001) break;
		p=vec2((FC.xy-.5*r)/r.y)*g+vec2(.3)*rotate2D(g*2.);
		g+=d=-(length(p)-2.+g/9.)/2.;
	}
	p=vec2(atan(p.x,p.y),g)*8.28+t*2.;
	p=abs(fract(p+vec2(0,.5*ceil(p.x)))-.5);
//	o+=pixel+(30./i-.5/step(.9,1.-abs(max(p.x*1.5+p.y,p.y*2.)-1.)));
	o+=(30./i-.5/step(.9,1.-abs(max(p.x*1.5+p.y,p.y*2.)-1.)));
}
`;

export default class HEXSPIRAL_TIGHT extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
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
        this.set2f('mouse', this.game.width / 2, this.game.height / 2)
    }
}
