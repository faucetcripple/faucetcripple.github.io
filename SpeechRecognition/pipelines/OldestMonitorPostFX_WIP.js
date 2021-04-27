// This is a good start
const fragShader = `
#define SHADER_NAME OLDESTMONITOR_FS

precision mediump float;

uniform float     uTime;
uniform vec2      uResolution;
uniform sampler2D uMainSampler;
uniform vec2      uMouse;

uniform float     uCValue;


uniform float     uSpeed;
uniform float     uFrame;

varying vec2 outTexCoord;

float noise(vec2 pos) {
    return fract(sin(dot(pos, vec2(12.9898 - uTime,78.233 + uTime))) * 43758.5453);
}

void main( void ) {

    vec2 normalPos = gl_FragCoord.xy / uResolution.xy;

    vec2 pointer = uMouse / uResolution;

    pointer.y = (1.0-pointer.y);
    
    float pos = (gl_FragCoord.y / uResolution.y);

    float mouse_dist = length(vec2((pointer.x - normalPos.x) * (uResolution.x / uResolution.y), pointer.y - normalPos.y));

    float distortion = clamp(1.0 - (mouse_dist + 0.4) * 3.0, 0.0, 1.0);

    pos -= (distortion * distortion) * 0.1;

    float c = sin(pos * 400.0) * 0.4 + 0.4;
    c = pow(c, 0.2);
//    c *= 0.01;
    
//    c *= uCValue;





//    c *= 0.2;

//    c *= sin(uFrame*0.0005);
    c *= sin(uTime*uSpeed);
//    c *= sin(uTime/1000.)*uSpeed;

    float band_pos = fract(uTime * 0.1) * 3.0 - 1.0;
    c += clamp( (1.0 - abs(band_pos - pos) * 10.0), 0.0, 1.0) * 0.1;
    c += distortion * 0.08;
//    c += distortion * uSpeed;


    c += (noise(gl_FragCoord.xy) - 0.5) * (0.09);
    vec4 pixel = texture2D(uMainSampler, outTexCoord);


    vec4 blendA = pixel - vec4( 0.0, c, 0.0, 1.0 );
    vec4 blendB = pixel + vec4( 0.0, c, 0.0, 1.0 );
    vec4 blendC = pixel / vec4( 0.0, c, 0.0, 1.0 );

    vec4 blendG = blendC.rgra;
    blendG *= 0.09;

//    gl_FragColor = blendA;
//    gl_FragColor = blendB;
//    gl_FragColor = blendC; // pink fuzz
    
//gl_FragColor = blendG; 


    
    gl_FragColor = pixel - blendG; // amazing static monochrome



}
`;

export default class OldestMonitorPostFX extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
    constructor(game) {
        super({
            game,
            renderTarget: true,
            fragShader,
            uniforms: [
                'uProjectionMatrix',
                'uMainSampler',
                'uTime',
                'uResolution',
                'uMouse',
                'uSpeed',
                'uFrame',
                'uCValue',
            ]
        });

        this.scanrate = 50;
        this._speed = 0.0001;
        this.frame = 0;


        this.cValue = 0.01;
    }

    onBoot() {
        this.set2f('uResolution', this.renderer.width, this.renderer.height);

    }

    onPreRender() {

        this.frame++;
        this.scanrate += this._speed;

        if (this.scanrate > 1000 || this.scanrate <= 10) {
            this._speed *= -1;
        }

        this.set1f('uCValue', this.cValue);

        this.set1f('uSpeed', this._speed);
        this.set1f('uFrame', this.frame);
        this.set1f('uTime', this.game.loop.time / this.scanrate);
        this.set2f('uMouse', this.mouseX, this.mouseY)
    }

    get speed() {
        return this._speed;
    }

    set speed(value) {
        this._speed = value;
    }

}
