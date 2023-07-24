import React, {useEffect, useRef} from "react";
import {getScripts, initShaderProgram} from "./utils";


const fragmentCalculate = `
precision mediump float;
void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`
const vertexCalculate = `
attribute vec2 position;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
    gl_PointSize = 4.8;
}
`
const fragment = `
precision mediump float;
void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`
const vertex = `
attribute vec2 position;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
    gl_PointSize = 4.8;
}
`
const generateParticle = () => {
    return ({
        x: (Math.random() * 2) - 1,
        y: (Math.random() * 2) - 1,
        life: Math.ceil(Math.random() * 200),
    })
}

const createBuffers = (gl, data) => {
    const buffers = [gl.createBuffer(), gl.createBuffer()]
    for (let i = 0; i < 2; i++) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers[i]);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_COPY)
    }
    return buffers
}
export const Experiment = () => {
    const ref = useRef()

    useEffect(() => {
        if (!ref) {
            return
        }
        let arr = new Array(100).fill(-1).map(i => generateParticle())
        const {gl, vertexShaderSource, fragmentShaderSource} = getScripts(ref, fragment, vertex, 'webgl12')
        const {vertexShaderSource: calculateVShader, fragmentShaderSource : calculateFShader} = getScripts(ref, fragmentCalculate, vertexCalculate, 'webgl12')
        if (!gl) {
            return
        }
        const calculateProgram = initShaderProgram(gl, calculateVShader, calculateFShader)
        const drawProgram = initShaderProgram(gl, vertexShaderSource, fragmentShaderSource)

        const buffers = [...createBuffers(gl, arr)]

    }, [])
    return <canvas width={1080} height={540} ref={ref}/>
}