// #version 300 es
// precision mediump float;
// uniform vec2 u_resolution;
// uniform sampler2D tex;
// uniform vec2 u_tex0Resolution;
// uniform vec2 u_tex_res;
// uniform sampler2D backbuffer;
// uniform float u_time;
// uniform vec4 palette[5];
// out vec4 o;

// uniform float IMPACT;

// #define PI 3.1415
// #define t u_time

// // #pragma glslify: snoise2D = require(../modules/math/glsl-noise/simplex/2d.glsl)
// #pragma glslify: snoise = require(./node_modules/glsl-noise/simplex/2d.glsl)
// #pragma glslify: rnd = require(glsl-random)

// float rnd(float x) {
//     return rnd(vec2(x));
// }
//     // #define rnd(x) fract(54321.987 * sin(987.12345 * x + .1))

// void main(void) {
//     vec2 uv = (gl_FragCoord.xy * 2. - u_resolution) / min(u_resolution.x, u_resolution.y);
//     vec2 uvI = uv;

//     vec2 uvG = uv * 4.;
//     float tid = rnd(floor(t * 9. / 5.) + floor(t * 9. / 3.) * .1);

//     if(length(uv) - .1 * snoise(vec2(length(uv) * 8., tid)) < .9) {
//         uv.y += 100. * tid;
//         float id = rnd(floor(uv.y * 8. + .5 * snoise(vec2(uv.y, tid))));
//         if(rnd(id * 10.6 + .3) < .9) {
//             uv += (id + tid) * 100.;
//             id = floor(uv.x * id * 2.);
//             o += sin(uv.x * 10000. * (rnd(id + .1) + .1) + t * (rnd(id + .2) - .5) * 80.) * .5 + .5;
//         } else {
//             uv += (id + tid) * 100.;
//             id = floor(uv.x * id * 10.) / id;
//             o.rgb = sin((id / 40. + vec3(0, .3, .5)) * 2. * PI) * .5 + .5;
//         }

//     } else {
//         float grid = step(.98, fract(uvG.x - .5)) + step(.98, fract(uvG.y - .5)) * .5 + .5;
//         o = vec4(grid);
//     }

//     o.a = 1.;
// }