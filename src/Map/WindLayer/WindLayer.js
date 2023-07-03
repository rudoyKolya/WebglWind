import MapContext from "../MapContext";
import {useContext, useEffect, useRef} from "react";
import {getScripts, initShaderProgram} from "../../utils";
import {fragment, vertex} from "./shaders";
import {createBuffer} from "./bufferUtils";
import {convert, generateParticles, speedFactor, trailLength, updateParticles} from "./particleUtils";
import ImageCanvasSource from "ol/source/ImageCanvas";
import {getSubArray} from "./getSubArray";
import ImageLayer from "ol/layer/Image";

export const WindLayer = ({vectorsData}) => {
    const {map} = useContext(MapContext);
    const layerRef = useRef(null)
    useEffect(() => {
        if(!map) return;

        return () => {
            if (layerRef.current) {
                map.removeLayer(layerRef.current);
            }
        };
    }, [vectorsData, map]);
    useEffect(() => {
        if(!map) return
        const canvas = document.createElement("canvas")
        const {gl, vertexShaderSource, fragmentShaderSource} = getScripts({current: canvas}, fragment, vertex)
        initShaderProgram(gl, vertexShaderSource, fragmentShaderSource)

        const particles = []
        createBuffer(gl)
        generateParticles(particles)
        let animationId = null
        const canvasSource = new ImageCanvasSource({
            ratio: 1,
            projection: 'EPSG:4326',
            canvasFunction: (extent, resolution, pixelRatio, size) => {

                if (animationId) {
                    cancelAnimationFrame(animationId)
                }

                canvas.width = size[0];
                canvas.height = size[1];

                gl.viewport(0, 0, canvas.width, canvas.height);
                const render = () => {
                    const worldProjection = getSubArray(vectorsData, extent, [-180, -90, 180, 90])
                    updateParticles(particles, speedFactor / 1000, worldProjection)
                    const data = [];
                    particles.forEach(particle => {
                        const {x, y} = convert(particle.x, particle.y, worldProjection[0].length, worldProjection.length)
                        const color = worldProjection[y][x]
                        data.push(particle.x, particle.y, color.r / 255, color.g / 255, 0.0, 1.0);
                        particle.oldPositions.forEach((oldPosition, index) => {
                            const oldX = convert(oldPosition.x, oldPosition.y, worldProjection[0].length, worldProjection.length)
                            const oldColor = worldProjection[oldX.y][oldX.x]
                            data.push(oldPosition.x, oldPosition.y, oldColor.r / 255, oldColor.g / 255, 0.0, 1.0 - (index + 1) / trailLength);
                        });
                    });

                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.DYNAMIC_DRAW);
                    gl.clearColor(0.0, 0.0, 0.0, 0.0);
                    gl.enable(gl.BLEND);
                    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE);
                    gl.clear(gl.COLOR_BUFFER_BIT);

                    gl.drawArrays(gl.POINTS, 0, data.length / 6);
                    animationId = requestAnimationFrame(() => {
                        canvasSource.changed()
                    })
                }

                render()
                return canvas;
            },
        });
        const layer = new ImageLayer({
            source: canvasSource,
        });
        layerRef.current = layer;
        map.addLayer(layer)
    }, [map, vectorsData])
    return null
}