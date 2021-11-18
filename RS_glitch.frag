#version 300 es
precision mediump float;
uniform vec2 u_resolution;
uniform sampler2D tex;
uniform vec2 u_tex0Resolution;
uniform vec2 u_tex_res;
uniform sampler2D backbuffer;
// uniform float midi[64];
uniform float u_time;
uniform vec4 palette[5];
out vec4 o;

#define PI 3.1415


#define rnd(x) (sin(20.*x + \
			(SPEED * (.5*sin(u_time*7.)+sin(u_time*5.)+u_time*8.)))*.5+.5)
// #define rnd(x) (sin(20.*x + \
// 			floor(SPEED * (.5*sin(u_time*7.)+sin(u_time*5.)+u_time*8.)))*.5+.5)
#define ABBERATION_MAX .1
#define DISTORTION_MAX .01
#define SPEED 1.


void main (void) {
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    float split, edgeX1=0., edgeX2=1., edgeY1=0., edgeY2=1., spanX, spanY;
    split = rnd(.1);
    for(float i = 0.; i < 10.; i++) {
    
        spanX = edgeX2 - edgeX1;
        if (spanX < 0.04) break;
        if((uv.x-edgeX1)/spanX < split) {
            edgeX2 = edgeX1 + split*spanX;
            split = rnd(split+10.);
        }
        else {
            edgeX1 = edgeX1 + split*spanX;
            split = rnd(split+20.);
        }
        
        
        spanY = edgeY2 - edgeY1;
        if (spanY < 0.04) break;
        if((uv.y-edgeY1)/spanY < split) {
            edgeY2 = edgeY1 + split*spanY;
            split = rnd(split+10.);
        }
        else {
            edgeY1 = edgeY1 + split*spanY;
            split = rnd(split+20.);
        }
        
    }
    uv.x += DISTORTION_MAX * (rnd(split)-1.);
    uv.y += DISTORTION_MAX * (rnd(split+1.)-1.);
    float aberration = ABBERATION_MAX * rnd(split+2.) * min(spanX, spanY);
    float blackness = rnd(split+3.);
    
    o.r = texture(tex,uv).r;
    o.g = texture(tex,uv+aberration).g;
    o.b = texture(tex,uv+aberration*2.).b;
    o *= 1. - smoothstep(.99, 1.05, blackness);
    o.a = 1.;
}