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
#define t u_time

// #pragma glslify: snoise2D = require(../modules/math/glsl-noise/simplex/2d.glsl)
#pragma glslify: snoise = require(./node_modules/glsl-noise/simplex/2d.glsl)
#pragma glslify: rnd = require(glsl-random)

float rnd(float x) {
    return rnd(vec2(x));
}
    // #define rnd(x) fract(54321.987 * sin(987.12345 * x + .1))

#define col(c) -cos((pow(vec3(c), pw) + off) * 2. * PI) * mul + add
vec3 pw = vec3(.9, 1., 1.);
vec3 off = vec3(.0, .33, .66);
vec3 mul = vec3(.5, .5, .5);
vec3 add = vec3(.5, .5, .5);

#define cicada(x) ((floor(x/5.)*5.+floor(x/7.)*7.+floor(x/11.)*11.) / 3.)

void main(void) {
    vec2 uv = (gl_FragCoord.xy * 2. - u_resolution) / min(u_resolution.x, u_resolution.y);

    // ripples
    float n = snoise(vec2(uv.y*4., cicada(t*(20. + 200.*IMPACT))));
    uv.x += (.1+.1*IMPACT)*n*n*n*n*n*n*n;

    vec2 uvI = uv;

    vec2 uvG = uv * 4.;
    float tid = rnd(floor(t * 9. / 5.) + floor(t * 9. / 3.) * .1);
    float id;

    // background grid
    float grid = step(.98, fract(uvG.x - .5)) + step(.98, fract(uvG.y - .5)) * .5 + .5;
    o = vec4(grid);

    if(length(uv) - .1 * snoise(vec2(length(uv) * 8., tid)) < .9) {
        uv.y += 100. * tid;
        id = rnd(floor(uv.y * 8. + .5 * snoise(vec2(uv.y, tid))));
        if(rnd(id * 10.6 + .3) < .9) {
            uv += (id + tid) * 100.;
            id = floor(uv.x * id * 2.);
            o += sin(uv.x * 10000. * (rnd(id + .1) + .1) + t * (rnd(id + .2) - .5) * 80.) * .5 + .5;
        } else {
            uv += (id + tid) * 100.;
            id = floor(uv.x * id * 10.) / id;
            o.rgb = sin((id / 40. + vec3(0, .3, .5)) * 2. * PI) * .5 + .5;
        }

    }

    uv = uvI;

    // stripes offset
    vec2 offset = .5 * IMPACT * (vec2(rnd(id+.1+cicada(t)), rnd(id+.2+cicada(t))) - .5);
    uv += offset;


    // portrait
    vec4 tx = texture(tex, uv*.5+.5);

    // overlapping by test pattern
    float overlap = step(IMPACT, rnd(id));

    // radial circles
    float l = length(uv);
    float radialCircles = 1.-step(.9,l + .2 * snoise(vec2(l * 8., cicada(t*(1.+20.*IMPACT)))));

    o = mix(o, tx, radialCircles * overlap);

    o.a = 1.;
}