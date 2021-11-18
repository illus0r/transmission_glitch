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

uniform float IMPACT;

#define PI 3.1415

#define rnd(x) fract(54321.987 * sin(987.12345 * x))
#define TRASH 1.

void main(void) {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float tt = mod(u_time, 99.);

    vec4 oI = o = texture(tex, uv);

    float split;
    vec2 edge1 = vec2(0), edge2 = vec2(1), span;
    split = ((floor(tt * 3.) + floor(tt * 5.) + floor(tt * 7.)) * PI) * .2 + .4;
    for(int i = 0; i < 14; i++) {
        int dir = i % 2;
        span[dir] = edge2[dir] - edge1[dir];
        if(span[dir] < 10. / u_resolution[dir])
            break;
        if((uv[dir] - edge1[dir]) / span[dir] < split) {
            edge2[dir] = edge1[dir] + split * span[dir];
            split = .5 + (rnd(split + 10.) - .5) * TRASH;
        } else {
            edge1[dir] = edge1[dir] + split * span[dir];
            split = .5 + (rnd(split + 20.) - .5) * TRASH;
        }
    }

    if((span.x < 400. / u_resolution.x * IMPACT && span.x > 5. / u_resolution.x * IMPACT && span.y < .09) ||
       (span.y < 400. / u_resolution.y * IMPACT && span.y > 5. / u_resolution.y * IMPACT && span.x < .09)) {
        o = #eb3536FF;
    }

    // o = mix(oI, o,);

    o.a = 1.;
}