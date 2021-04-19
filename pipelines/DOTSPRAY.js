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
#define rotate3D(a) mat2(cos(a),-sin(a),sin(a),cos(a))

#define rotate2D(a) mat2(cos(a),-sin(a),sin(a),cos(a))
void main( void ) {

 	vec2 p;
	float i,g,d=4.;
	for(float j=0.;j<128.;j++) {
		++i;
		if (d<=.2) break;
		p=vec2((FC.xy-.5*r)-r.y)*g+vec2(.3)*rotate3D(g*14.);
		g+=d=-(length(p)-2.+g*1.)*8.;
	}
	p=vec2(atan(p.x,p.y),g)*8.28+t*1.5;
	p=abs(fract(p+vec2(0,.5*ceil(p.x)))-.5);

 vec4 pixel = texture2D(uMainSampler, outTexCoord);

	o+=pixel*(30./i-.5/step(.99,1.-abs(max(p.x*1.5+p.y,p.y*2.)-1.)));

}
`;

export default class DOTSPRAY extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
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
