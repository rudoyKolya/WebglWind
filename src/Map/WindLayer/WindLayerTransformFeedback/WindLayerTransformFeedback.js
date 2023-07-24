import React, {useContext, useEffect, useRef} from "react";
import MapContext from "../../MapContext";
import ImageCanvasSource from "ol/source/ImageCanvas";
import ImageLayer from "ol/layer/Image";


const trailLength = 10
const particlesAmount = 10000
const BUFFER_SIZE = 6

const generateParticle = () => ([
    (Math.random() * 2) - 1,
    (Math.random() * 2) - 1,
    Math.ceil(Math.random() * 300),
    0,
    0,
    0,
])
const generateParticles = (count) => {
    const particles = new Float32Array(count * BUFFER_SIZE)
    for (let i = 0; i < count * BUFFER_SIZE; i += BUFFER_SIZE) {
        particles.set([...generateParticle()], i)
    }
    return particles
}
const createBufferWithVao = (gl, count, particles) => {
    const buffer = gl.createBuffer();
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, BUFFER_SIZE * count * 4, gl.DYNAMIC_COPY);
    particles && gl.bufferSubData(gl.ARRAY_BUFFER, 0, particles);
    gl.vertexAttribPointer(0, 1, gl.FLOAT, false, BUFFER_SIZE * 4, 0);
    gl.vertexAttribPointer(1, 1, gl.FLOAT, false, BUFFER_SIZE * 4, 4);
    gl.vertexAttribPointer(2, 1, gl.FLOAT, false, BUFFER_SIZE * 4, 8);
    gl.vertexAttribPointer(3, 3, gl.FLOAT, false, BUFFER_SIZE * 4, 12);
    gl.enableVertexAttribArray(0);
    gl.enableVertexAttribArray(1);
    gl.enableVertexAttribArray(2);
    gl.enableVertexAttribArray(3);

    return [buffer, vao]
}
const createProgram = (gl, vertexShaderSource, fragmentShaderSource, varyings) => {

    const program = gl.createProgram()
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vertexShader, vertexShaderSource)
    gl.compileShader(vertexShader)
    gl.attachShader(program, vertexShader)

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    gl.attachShader(program, fragmentShader);

    varyings && gl.transformFeedbackVaryings(program, varyings, gl.INTERLEAVED_ATTRIBS);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        return false
    }

    return program
}

const draw = (gl, program, buffers, count, state) => {
    gl.useProgram(program)
    const orderedBuffers = [...buffers.slice(0, state.buffer), ...buffers.slice(state.buffer)]

    const position = gl.getAttribLocation(program, 'position')
    const color = gl.getAttribLocation(program, 'color')
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE)
    gl.clear(gl.COLOR_BUFFER_BIT);
    for (let i = 0; i < orderedBuffers.length; i += 2) {
        gl.bindBuffer(gl.ARRAY_BUFFER, orderedBuffers[i])
        gl.enableVertexAttribArray(position)
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, BUFFER_SIZE * 4, 0)

        gl.enableVertexAttribArray(color)
        gl.vertexAttribPointer(color, 3, gl.FLOAT, false, BUFFER_SIZE * 4, 12)

        gl.drawArrays(gl.POINTS, 0, count)
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

}


function normalizeLongitude(lon) {
    while (lon < -180) lon += 360;
    while (lon > 180) lon -= 360;
    return lon;
}
function normalizeValue(value) {
    return (value + 1) / 2;
}

const dataUpdate = (program, gl, state, count, extent, buffers) => {
    gl.useProgram(program)
    gl.enable(gl.RASTERIZER_DISCARD);
    const u_extent = gl.getUniformLocation(program, "u_extent");
    gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null);
    const newExtent = [normalizeLongitude(extent[0])/180, extent[1]/90, normalizeLongitude(extent[2])/180, extent[3]/90].map(normalizeValue)
    gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null);
    gl.uniform4fv(u_extent, newExtent)
    gl.bindVertexArray(buffers[state.vao]);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffers[state.buffer]);

    gl.beginTransformFeedback(gl.POINTS);

    gl.drawArrays(gl.POINTS, 0, count);

    gl.endTransformFeedback();

    gl.bindVertexArray(null);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);

    state.vao = (state.vao + 2) >= buffers.length ? 1 : state.vao + 2;
    state.buffer = (state.buffer + 2) >= buffers.length ? 0 : state.buffer + 2;
    gl.disable(gl.RASTERIZER_DISCARD);
}

const createTexture = (gl, image, program) => {
    const texture = gl.createTexture()
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(gl.getUniformLocation(program, 'u_Texture'), 0);
}
const loadImageData = (gl, program, src, callback) => {
    const image = new Image();

    image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = image.width;
        canvas.height = image.height;

        ctx.drawImage(image, 0, 0);

        createTexture(gl, image, program)
        callback(true)
    };
    image.src = src
};


const vShaderCalculate = `#version 300 es
layout(location=0) in float ix;
layout(location=1) in float iy;
layout(location=2) in float iLife;
layout(location=3) in float iColor;
uniform sampler2D u_texture;

out float ox;
out float oy;
out float oLife;
out vec3 oColor;

uniform vec4 u_extent;
uniform float u_trailLength;

vec2 getTextureCoord(float normalizedX, float normalizedY) {
  float newX;

  if (u_extent.x < u_extent.z) {
    newX = normalizedX;
  } else {
    if(normalizedX > u_extent.x) {
      newX = mix(u_extent.x, 1.0, (normalizedX - u_extent.x) / (1.0 - u_extent.x));
    } else {
      newX = mix(0.0, u_extent.z, normalizedX / u_extent.z);
    }
  }

  return vec2(newX, normalizedY);
}

const vec3 rand_constants = vec3(12.9898, 78.233, 4375.85453);
float random(const vec2 co) {
  float t = dot(rand_constants.xy, co);
  return fract(sin(t) * (rand_constants.z + t));
}

void main()
{
  float speed = 0.002;
  float normalizedX;
  if(u_extent.z <= u_extent.x) {
    normalizedX = ((ix + 1.0) / 2.0) * (1.0 + u_extent.z - u_extent.x) + u_extent.x;
    if(normalizedX > 1.0) normalizedX -= 1.0;
  } else {
    normalizedX = ((ix + 1.0) / 2.0) * (u_extent.z - u_extent.x) + u_extent.x;
  }
  float normalizedY = ((iy + 1.0) / 2.0) * (u_extent.a - u_extent.y) + u_extent.y;
  vec2 texCoords = getTextureCoord(normalizedX, normalizedY);
  vec4 texel = texture(u_texture, texCoords);
  ox = ix + ((texel.r) * 2.0 - 1.0) * speed;
  oy = iy + ((texel.g) * 2.0 - 1.0) * speed;
  oColor = vec3(texel.r, texel.g, texel.b);
  if (iLife > 400.0 || ox < -1.0 || ox > 1.0 || oy < -1.0 || oy > 1.0) {
    float randValX = random(vec2(ix, iy)) * 2.0 - 1.0;
    float randValY = random(vec2(iy, ix)) * 2.0 - 1.0;
    float randLife = random(vec2(randValX, randValY)) * 300.0;

    ox = randValX;
    oy = randValY;
    oLife = randLife;
  }
  else {
    oLife = iLife + 1.0;
  }
}`

const fShaderCalculate = `#version 300 es
void main() {
}`

const fShaderDraw = `#version 300 es
precision mediump float;
out vec4 color;
in vec3 vColor;
void main() {
  color = vec4(vColor, 1.0);
}`

const vShaderDraw = `#version 300 es
layout(location = 0) in vec2 position;
layout(location = 1) in vec3 color;

out vec3 vColor;

void main()
{
  gl_Position = vec4(position, 0.0, 1.0);
  gl_PointSize = 2.0;
  vColor = color;
}`
export const WindLayerTransformFeedback = ({src}) => {

    const {map} = useContext(MapContext);
    const layerRef = useRef(null)

    useEffect(() => {
        if (!map) return;

        return () => {
            if (layerRef.current) {
                map.removeLayer(layerRef.current);
            }
        };
    }, [src, map]);

    useEffect(() => {
        if (!map) return
        const canvas = document.createElement("canvas")
        const gl = canvas.getContext('webgl2')
        const programFeedback = createProgram(gl, vShaderCalculate, fShaderCalculate, ['ox', 'oy', 'oLife', 'oColor'])
        const drawProgram = createProgram(gl, vShaderDraw, fShaderDraw)
        const count = particlesAmount
        const particles = generateParticles(count)
        const buffers = new Array(trailLength).fill(-1).map((_, id) => id === 0 ? createBufferWithVao(gl, count, particles) : createBufferWithVao(gl, count)).flatMap(i => i)
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        const u_trailLength = gl.getUniformLocation(programFeedback, 'u_trailLength')
        gl.useProgram(programFeedback)
        gl.uniform1f(u_trailLength, trailLength)
        const state = {
            vao: 1,
            buffer: 2
        }
        let dataLoaded = false

        loadImageData(gl, programFeedback, src, (value) => {
            dataLoaded = value
        })
        let animationId = null
        const canvasSource = new ImageCanvasSource({
            ratio: 1,
            projection: 'EPSG:4326',
            canvasFunction: (extent, resolution, pixelRatio, size) => {
                if (animationId) {
                    cancelAnimationFrame(animationId)
                }
                if (!dataLoaded) {
                    animationId = requestAnimationFrame(() => {
                        canvasSource.changed()
                    })
                    return
                }

                canvas.width = size[0];
                canvas.height = size[1];
                gl.viewport(0, 0, canvas.width, canvas.height);


                const animate = () => {
                    draw(gl, drawProgram, buffers, count, state)
                    dataUpdate(programFeedback, gl, state, count, extent, buffers)
                }
                animate()
                animationId = requestAnimationFrame(() => {
                    canvasSource.changed()
                })


                return canvas;
            },
        });
        const layer = new ImageLayer({
            source: canvasSource,
        });
        layerRef.current = layer;
        map.addLayer(layer)
    }, [map, src])


    return null
}