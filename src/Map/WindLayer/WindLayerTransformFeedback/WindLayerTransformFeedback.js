import React, {useContext, useEffect, useRef, useState} from "react";
import MapContext from "../../MapContext";
import ImageCanvasSource from "ol/source/ImageCanvas";
import ImageLayer from "ol/layer/Image";
import {fShaderDraw, fShaderCalculate, vShaderCalculate, vShaderDraw} from "./shaders";
import {generateParticles} from "./utils";
import {draw, dataUpdate, createProgram, createBufferWithVao, loadImageData} from "./webglUtils";

function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}
export const WindLayerTransformFeedback = ({src, trailLength, particlesNumber, speed}) => {
    const canvas = useRef(document.createElement("canvas")).current
    const [particles, setParticles] = useState(generateParticles(particlesNumber))
    const [ext, setExt] = useState([0, 0, 0 , 0])
    const gl = useRef(canvas.getContext('webgl2')).current
    const programFeedback = useRef(createProgram(gl, vShaderCalculate, fShaderCalculate, ['ox', 'oy', 'oLife', 'oColor'])).current
    const drawProgram = useRef(createProgram(gl, vShaderDraw, fShaderDraw)).current
    const {map} = useContext(MapContext);
    const layerRef = useRef(null)


    useEffect(() => {
        gl.useProgram(programFeedback)
        gl.uniform1f(gl.getUniformLocation(programFeedback, 'u_speed'), speed / 10000);
    }, [speed])

    useEffect(() => {
        setParticles(generateParticles(particlesNumber))
    }, [particlesNumber])
    useEffect(() => {
        if (!map) return;

        return () => {
            if (layerRef.current) {
                map.removeLayer(layerRef.current);
            }
        };
    }, [src, map, trailLength, particlesNumber, particles, ext]);

    useEffect(() => {
        if (!map) return
        const buffers = new Array(trailLength).fill(-1).map((_, id) => id === 0 ? createBufferWithVao(gl, particlesNumber, particles) : createBufferWithVao(gl, particlesNumber)).flatMap(i => i)
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
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
                if(!arrayEquals(extent, ext)) {
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
                    draw(gl, drawProgram, buffers, particlesNumber, state)
                    dataUpdate(programFeedback, gl, state, particlesNumber, extent, buffers)
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
    }, [map, src, particles, trailLength, particlesNumber, ext])


    return null
}