const fragShader = `
#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 resolution;

uniform sampler2D uMainSampler;
varying vec2 outTexCoord;

#define rotate2D(a) mat2(cos(a),-sin(a),sin(a),cos(a))

void main( void ) {
	vec2 p;
	float g,d=1.,i=0.;
	for(float j=0.;j<128.;j++) {
		i++;
		if (d<=.001) break;
		p=vec2((gl_FragCoord.xy-.5*resolution)/resolution.y)*g+vec2(.3)*rotate2D(g*2.);
		g+=d=-(length(p)-2.+g/9.)/2.;
	}
	p=vec2(atan(p.x,p.y),g)*8.28+time*2.;
	p=abs(fract(p+vec2(0,.5*ceil(p.x)))-.5);
	

   vec4 pixel = texture2D(uMainSampler, outTexCoord);
	
    
gl_FragColor+=pixel/(30./i-.8/step(.9,1.-abs(max(p.x*1.5+p.y,p.y*2.)-1.))-vec4(1.,0.7,0.,1.));


//gl_FragColor+=(30./i-.8/step(.9,1.-abs(max(p.x*1.5+p.y,p.y*2.)-1.))-vec4(1.,0.7,0.,1.));
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
