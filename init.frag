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

#define PI 3.1415

// // #pragma glslify: snoise2D = require(../modules/math/glsl-noise/simplex/2d.glsl)
// #pragma glslify: sn = require(../modules/math/glsl-noise/simplex/3d.glsl)

// void main (void) {
//     vec2 uv = gl_FragCoord.xy/u_resolution.xy;
//     o += sn(vec3(uv, fract(sn(vec3(u_time/16.)*8.))))*.5+.5;
//     o.a = 1.;
// }

void main (void) {
    vec2 uv = gl_FragCoord.xy/1024.;
    uv.y = 1. - uv.y;
    o = texture(tex, uv);
    o.a = 1.;
    // o=vec4(uv,0,1);
}