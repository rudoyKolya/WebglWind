import React, {useContext, useEffect, useRef, useState, memo} from "react";
import MapContext from "../../MapContext";
import ImageCanvasSource from "ol/source/ImageCanvas";
import ImageLayer from "ol/layer/Image";
import {fShaderDraw, fShaderCalculate, vShaderCalculate, vShaderDraw} from "./shaders";
import {generateParticles, arrayEquals} from "./utils";
import {draw, dataUpdate, createProgram, createBufferWithVao, loadImageData} from "./webglUtils";
import {BUFFER_SIZE} from "./consts";

export const WindLayerTransformFeedback = memo(({src, trailLength, particlesNumber, speed, onlyWhite}) => {
    const canvas = useRef(document.createElement("canvas")).current
    const [particles, setParticles] = useState(generateParticles(particlesNumber))
    const [ext, setExt] = useState([0, 0, 0, 0])
    const gl = useRef(canvas.getContext('webgl2')).current
    const programFeedback = useRef(createProgram(gl, vShaderCalculate, fShaderCalculate, ['ox', 'oy', 'oLife', 'oColor'])).current
    const drawProgram = useRef(createProgram(gl, vShaderDraw, fShaderDraw)).current
    const {map} = useContext(MapContext);
    const layerRef = useRef(null)
    useEffect(() => {
        gl.useProgram(drawProgram)
        gl.uniform1f(gl.getUniformLocation(drawProgram, 'u_onlyWhite'), onlyWhite ? 1: 0);
    }, [onlyWhite])

    useEffect(() => {
        gl.useProgram(programFeedback)
        gl.uniform1f(gl.getUniformLocation(programFeedback, 'u_speed'), speed / 10000);
    }, [speed])

    useEffect(() => {
        setParticles(generateParticles(particlesNumber))
    }, [particlesNumber])

    useEffect(() => {
        if (!map || particles.length !== BUFFER_SIZE * particlesNumber ) return
        const initialBuffer = createBufferWithVao(gl, particlesNumber, particles)
        const buffers = new Array(trailLength).fill(-1).map(() => createBufferWithVao(gl, particlesNumber)).flatMap(i => i)
        gl.bindVertexArray(null);
        gl.useProgram(drawProgram)
        gl.uniform1f(gl.getUniformLocation(drawProgram, 'u_onlyWhite'), onlyWhite ? 1: 0);
        gl.useProgram(programFeedback)
        gl.uniform1f(gl.getUniformLocation(programFeedback, 'u_speed'), speed / 10000);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        const state = {
            vao: -1,
            buffer: 0
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
                if (!arrayEquals(extent, ext)) {
                    setExt(extent)
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
                    dataUpdate(programFeedback, gl, state, particlesNumber, extent, buffers, initialBuffer)
                    draw(gl, drawProgram, buffers, particlesNumber, state)
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
        return () => {
            map.removeLayer(layerRef.current);
        }
    }, [map, src, particles, trailLength, particlesNumber, ext])


    return null
})