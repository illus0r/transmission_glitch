#version 300 es
precision mediump float;
uniform vec2 u_resolution;
uniform sampler2D tex;
uniform vec2 u_tex0Resolution;
uniform vec2 u_tex_res;
uniform sampler2D backbuffer;
uniform float u_time;
uniform vec4 palette[5];
out vec4 o;

uniform float IMPACT;


#define PI 3.1415

// #pragma glslify: snoise2D = require(../modules/math/glsl-noise/simplex/2d.glsl)
#pragma glslify: sn = require(./node_modules/glsl-noise/simplex/3d.glsl)
#pragma glslify: rnd = require(glsl-random)

#define col(c) -cos((pow(vec3(c), pw) + off) * 2. * PI) * mul + add
vec3 pw  = vec3(.9, 1., 1.);
vec3 off = vec3(.0, .33, .66);
vec3 mul = vec3(.5, .5, .5);
vec3 add = vec3(.5, .5, .5);

void main (void) {
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    vec2 uvI = uv;


    uv.y *= IMPACT;
    uv.y+=floor(u_time/3.) + floor(u_time/5.) + floor(u_time/7.) + .1*sn(vec3(u_time));
    float id = rnd(vec2(floor(uv.y*7.)+floor(uv.y*11.)+floor(uv.y*13.)));

    uv.x += .1*sin(u_time*id+id*2.*PI); // stripes
    uv.x += id * .001 * sin(uv.y * 1000.); // waves
    uv = fract(uv);

    uv=mix(uvI,uv,IMPACT);

    o = texture(tex, uv);

    // o.rgb = fract(o.rgb*10.);
    o.rgb= mix(o.rgb, step(.5, col(uv.x*100.*id))*2., IMPACT);
    o.a = 1.;
}