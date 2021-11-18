'use strict';
let twgl = require('twgl.js')
let chroma = require('chroma-js')
import {Pane} from 'tweakpane'


let timePrev = +new Date()
let time = 0

const mousepos = [0, 0];
let pause = false
let tick = 0
const canvas = document.getElementById('canvasgl')
const gl = canvas.getContext("webgl2", { preserveDrawingBuffer: true })
let passes

function Pass({ frag, size = 8, texture }) {
  if (size.length)
    this.resolution = size
  else
    this.resolution = [size, size]

  console.log(this.resolution)
  this.vert = `#version 300 es
  precision mediump float;
  in vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }`
  this.frag = frag
  this.program = twgl.createProgramInfo(gl, [this.vert, this.frag])
  // this.attachments = [{ format: gl.RGBA, type: gl.UNSIGNED_BYTE, minMag: gl.GL_NEAREST, wrap: gl.GL_CLAMP_TO_EDGE }]
  this.attachments = [{ format: gl.RGBA, mag: gl.NEAREST }]
  this.buffer = twgl.createFramebufferInfo(gl, this.attachments, ...this.resolution)
  this.backbuffer = twgl.createFramebufferInfo(gl, this.attachments, ...this.resolution)
  this.b = this.backbuffer.attachments[0]
  this.positionObject = { position: { data: [1, 1, 1, -1, -1, -1, -1, 1], numComponents: 2 } }
  this.positionBuffer = twgl.createBufferInfoFromArrays(gl, this.positionObject)

  this.texture = texture

  this.draw = ({ uniforms, target }) => {
    // target: self, screen, self+screen
    gl.useProgram(this.program.program)
    twgl.setBuffersAndAttributes(gl, this.program, this.positionBuffer)

    if (!uniforms.u_resolution) uniforms.u_resolution = this.resolution
    if (target != 'screen') // self or both
      uniforms.backbuffer = this.backbuffer.attachments[0]
    if (this.texture)
      uniforms.tex = this.texture
    twgl.setUniforms(this.program, uniforms)

    if (target != 'self') { // screen or both
      twgl.bindFramebufferInfo(gl, null)
      twgl.drawBufferInfo(gl, this.positionBuffer, gl.TRIANGLE_FAN)
    }
    if (target != 'screen') { // self or both
      twgl.bindFramebufferInfo(gl, this.buffer)
      let tmp = this.buffer
      this.buffer = this.backbuffer
      this.backbuffer = tmp
      this.b = this.backbuffer.attachments[0]
      twgl.drawBufferInfo(gl, this.positionBuffer, gl.TRIANGLE_FAN)
    }
    // console.log(uniforms.u_resolution)
  }
}


import palettes from "z-palletes"
console.log(palettes)
let palette
let params

let isCanvasSquare = false
////////////////////
// CUSTOM CODE BELOW
////////////////////
let dartTheme = true


////////////////////
// CUSTOM CODE END
////////////////////

twgl.addExtensionsToContext(gl);
gl.getExtension("OES_texture_float")
gl.getExtension("WEBGL_color_buffer_float")







mouseClicked()
windowResized()




// let img = twgl.createTexture(gl, {
//   src = './transmission.jpg',
//   crossOrigin: '',
// }, function (err, tex, img) {
//   // wait for the image to load because we need to know it's size
//   // start();
// });

var img = twgl.createTexture(gl, {
  src:"face.jpg",
  crossOrigin: '',
});

passes = {
  init: new Pass({
    frag: require('./init.frag'),
    size: 1024,
    texture: img,
  }),
  stripes: new Pass({
    frag: require('./stripes.frag'),
    size: 1024,
  }),
  vh: new Pass({
    frag: require('./vh.frag'),
    size: 1024,
  }),  
  rsglitch: new Pass({
    frag: require('./RS_glitch.frag'),
    size: 1024,
  }),
}


const PARAMS = {
  stripes: 0.05,
  vh: 0.2,
  rsglitch: 0.3,
};

const pane = new Pane();
pane.addInput(PARAMS, 'stripes',{min: 0,max: 1,});
pane.addInput(PARAMS, 'vh',{min: 0,max: 1,});
pane.addInput(PARAMS, 'rsglitch',{min: 0,max: 1,});



function draw() {
  if(!passes || !passes.rsglitch || !passes.rsglitch.draw) return;

  let b
  passes.init.draw({
    uniforms: {
      u_time: time / 1000,
      // u_resolution: [canvas.width, canvas.height],
      u_resolution: [1024, 1024],
      // u_tex_res: [1024, 1024],
},
    // target: 'screen',
    target: 'self',
  })
  b = passes.init.b
  passes.stripes.draw({
    uniforms: {
      u_time: time / 1000,
      tex: b,
      u_resolution: [1024, 1024],
      // u_resolution: [canvas.width, canvas.height],
      IMPACT: PARAMS.stripes,
    },
    // target: 'screen',
    target: 'self',
  })
  b = passes.stripes.b
  passes.vh.draw({
    uniforms: {
      u_time: time / 1000,
      tex: b,
      u_resolution: [1024, 1024],
      // u_resolution: [canvas.width, canvas.height],
      IMPACT: PARAMS.vh,
    },
    target: 'self',
  })
  b = passes.vh.b
  passes.rsglitch.draw({
    uniforms: {
      u_time: time / 1000,
      tex: b,
      u_resolution: [canvas.width, canvas.height],
      IMPACT: PARAMS.rsglitch,
    },
    target: 'screen',
  })

  tick++
}

function animate() {
  if (pause) return;
  let timeCurrent = +new Date()
  time += timeCurrent - timePrev
  timePrev = timeCurrent
  draw()
  requestAnimationFrame(animate)
}
animate()

function setMousePos(e) {
  mousepos[0] = e.clientX / gl.canvas.clientWidth;
  mousepos[1] = 1 - e.clientY / gl.canvas.clientHeight;
}

canvas.addEventListener('mousemove', setMousePos);

// canvas.addEventListener('mouseleave', () => {
//   mousepos[0] = .501;
//   mousepos[1] = .501;
// });

function handleTouch(e) {
  e.preventDefault();
  setMousePos(e.touches[0]);
}



document.querySelector('canvas').addEventListener('click', mouseClicked)
window.addEventListener('touchstart', mouseClicked)
function mouseClicked() {
  let paletteId = Math.floor(palettes.length * Math.random())
  console.log(paletteId)
  console.log(palettes[paletteId])
  palette = palettes[paletteId].map(c => chroma(c).gl())
  // palette = palette.sort((a, b) => chroma(a).get('lch.l') - chroma(b).get('lch.l'))
  params = [Math.random(), Math.random(), Math.random(), Math.random(),]

  ////////////////////
  // CUSTOM CODE BELOW
  ////////////////////
  dartTheme = !dartTheme



  ////////////////////
  // CUSTOM CODE END
  ////////////////////
  draw()
}

window.addEventListener('resize', windowResized)
function windowResized() {
  if (isCanvasSquare) {
    let winMinSize = Math.min(window.innerWidth, window.innerHeight)
    canvas.width = canvas.height = winMinSize * window.devicePixelRatio
    document.querySelector('canvas').style.width = document.querySelector('canvas').style.heigth = winMinSize + 'px'
  }
  else {
    canvas.width = window.innerWidth * window.devicePixelRatio
    canvas.height = window.innerHeight * window.devicePixelRatio
    document.querySelector('canvas').style.width = window.innerWidth + 'px'
    document.querySelector('canvas').style.heigth = window.innerHeight + 'px'
  }
}

let blink = () => {
  document.querySelector('canvas').style.opacity = 0
  setTimeout(() => document.querySelector('canvas').style.opacity = 1, 100)
}

let timer
window.addEventListener('keypress', keyPressed)
function keyPressed(key) {
  if (key.code.slice(0, 5) == 'Digit') {
    let digit = Number(key.key)
    if (digit == 0) {
      blink()
      clearInterval(timer)
    }
    else {
      if (!digit) return // NaN check, just in case
      clearInterval(timer)
      blink()
      mouseClicked()
      timer = setInterval(() => { mouseClicked() }, 1.5 ** digit * 400)
    }
  }
  if (key.code == 'Space') {
    pause = !pause
    if (pause) {
    }
    else {
      timePrev = +new Date()
      animate()
    }
  }
  // if (key.code == 'KeyS') {
  //   saveImage()
  // }
}

// function saveImage() {
//   let size = 10000
//   let splits = Math.ceil(size / 512)
//   let step = 1 / splits
//   let splitSize = size / splits
//   canvas.width = splitSize
//   canvas.height = splitSize

//   var dynamicCanvas = document.createElement("canvas");
//   var dynamicContext = dynamicCanvas.getContext("2d")
//   dynamicCanvas.height = size;
//   dynamicCanvas.width = size;

//   let date = new Date()
//   for (let i = 0; i < 1; i += step) {
//     for (let j = 0; j < 1; j += step) {
//       gl.useProgram(program.program);
//       twgl.setBuffersAndAttributes(gl, program, positionBuffer);
//       twgl.setUniforms(program, {
//         // prevStateCells: shader.attachments[0],
//         tick: tick,
//         palette: palette.flat(),
//         u_time: time / 1000,
//         u_resolution: [gl.canvas.width, gl.canvas.height],
//         u_mouse: mousepos,
//         params: params,
//         viewbox: [i, j, step, step],
//         dartTheme: dartTheme,
//       });
//       twgl.bindFramebufferInfo(gl, null);
//       twgl.drawBufferInfo(gl, positionBuffer, gl.TRIANGLE_FAN);

//       dynamicContext.drawImage(canvas, i * size, size - (j + step) * size);
//     }
//   }


//   let link = document.getElementById('link');
//   link.setAttribute('download', `image.png`);
//   link.setAttribute('href', dynamicCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
//   link.click();

//   // resume
//   windowResized()
//   draw()
// }

canvas.addEventListener('click', event => {
  let gui = document.querySelector('.tp-dfwv')
  let guiOpacity = gui.style.opacity
  // console.log(guiOpacity)
  if(guiOpacity === '') guiOpacity = 1
  gui.style.opacity = 1 - guiOpacity;
});