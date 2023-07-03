import React, {useEffect, useRef} from "react";
import {initShaderProgram, loadShader, createProgram, getScripts} from './utils'
import img from './Map/WindLayer/2016112000.png'


const fragment = `
precision mediump float;
uniform sampler2D u_Texture;
varying vec2 v_TexCoord;
void main() {
    float r = 0.5;
    if (distance(gl_PointCoord, vec2(0.5)) > r) {
        discard;
    }
    gl_FragColor = texture2D(u_Texture, v_TexCoord);
}
`
const vertex = `
attribute vec2 position;
attribute float a_Size;
varying vec2 v_TexCoord;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
    gl_PointSize = 1.8;
    v_TexCoord = position * 0.5 + 0.5;
}
`

function mapToIndex(number, n) {
    return Math.round((number + 1) * (n - 1) / 2);
}

function createTexture(gl, image) {
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
    gl.uniform1i(gl.getUniformLocation(gl.program, 'u_Texture'), 0);
}

const convert = (x, y, width, height) => {
    return {
        x: mapToIndex(x, width),
        y: mapToIndex(y, height),
    }
}
const createBuffer = (gl) => {
    const positionLocation = gl.getAttribLocation(gl.program, 'position');
    const positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
}

const generateParticle = () => {
    return ({
        x: (Math.random() * 2) - 1,
        y: (Math.random() * 2) - 1,
        life: Math.ceil(Math.random() * 200),
    })
}

const generateParticles = (particles, canvas) => {
    const totalArea = canvas.width * canvas.height;
    const requiredArea = totalArea * Number(0.3)
    let currentArea = 0
    const r = 1
    while (currentArea < requiredArea) {
        particles.push(generateParticle())
        currentArea += Math.PI * r * r
    }
}

const updateParticles = (particles, speedFactor, windDirectionData) => {
    particles.forEach(particle => {
        particle.life = particle.life + (Math.random() > 0.5 ? 1 : 0);
        const {x, y} = convert(particle.x, particle.y, windDirectionData[0].length, windDirectionData.length)
        const vx = windDirectionData[y][x].r / 255 * 2 - 1;
        const vy = windDirectionData[y][x].g / 255 * 2 - 1;
        const speed = windDirectionData[y][x].g / 255 + windDirectionData[y][x].r / 255;
        if (particle.life >= 200 || (particle.x + (vx * speedFactor * speed)) > 1 || (particle.x + (vx * speedFactor * speed)) < -1 || (particle.y + (vy * speedFactor * speed)) > 1 || (particle.y + (vy * speedFactor * speed)) < -1) {
            Object.assign(particle, generateParticle());
        } else {

            particle.x += (vx * speedFactor * speed);
            particle.y += (vy * speedFactor * speed);
        }
    });
}
const render = (gl, particles, speedFactor, windDirectionData) => {
    updateParticles(particles, speedFactor, windDirectionData);
    const data = [];
    particles.forEach(particle => {
        data.push(particle.x, particle.y);
    });

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.DYNAMIC_DRAW);

    gl.clearColor(1.0, 1.0, 1.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, particles.length);
    requestAnimationFrame(render.bind(null, gl, particles, speedFactor, windDirectionData));
}


export const WebGLLayer = () => {
    const ref = useRef()
    const particles = []

    useEffect(() => {
        if (!ref) {
            return;
        }
        const {gl, vertexShaderSource, fragmentShaderSource} = getScripts(ref, fragment, vertex)
        if (!gl) {
            return
        }

        if (!initShaderProgram(gl, vertexShaderSource, fragmentShaderSource)) {
            return;
        }

        const loadImageData = () => {
            const image = new Image();
            const data = [];

            image.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                canvas.width = image.width;
                canvas.height = image.height;

                ctx.drawImage(image, 0, 0);

                const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const imageData = img.data
                for (let i = 0; i < imageData.length; i += 4) {
                    data.push({
                        r: imageData[i],
                        g: imageData[i + 1],
                        b: imageData[i + 2],
                    });
                }
                const groupedData = data.reduce((res, _, id, arr) => {
                    if (id % img.width === 0) {
                        res.push(arr.slice(id, id + img.width))
                    }
                    return res
                }, []).reverse()
                createTexture(gl, image)
                render(gl, particles, 0.002, groupedData);
            };
            image.src = img
        };
        createBuffer(gl)
        generateParticles(particles, ref.current, 0.9);


        loadImageData()
    }, [])
    return (
        <canvas id="canvas" width="1080" height="540" ref={ref}></canvas>
    )
}