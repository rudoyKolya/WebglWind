import React, {useEffect, useRef, useState} from "react";
import Map from "./Map";
import {Layers, TileLayer, VectorLayer} from "./Layers";
import {fromLonLat, get} from "ol/proj";
import {WindLayer} from "./Map/WindLayer/WindLayer";
import img from '../src/Map/WindLayer/2016112000.png'
import img2 from '../src/Map/WindLayer/2016112118.png'
import img3 from '../src/Map/WindLayer/2016112106.png'
import {loadImageData} from "./Map/WindLayer/loadImageData";

import mapConfig from "./config.json";
import "./App.css";
import {Experiment} from "./Experiment";
import {WindLayerTransformFeedback} from "./Map/WindLayer/WindLayerTransformFeedback/WindLayerTransformFeedback";


const images = [img, img2, img3]
const App = () => {
    const [center, setCenter] = useState(mapConfig.center);
    const [zoom, setZoom] = useState(1);
    const [version, setVersion] = useState(2)
    const [windLayerData, setWindLayerData] = useState(null)
    const [activeImage, setActiveImage] = useState(img)

    useEffect(() => {
        loadImageData(activeImage, (data) => {
            setWindLayerData(data)
        })
    }, [activeImage])
    return (
        <div>
            <Map center={fromLonLat(center)} zoom={zoom}>
                <Layers>
                    {windLayerData && version === 1 ? <WindLayer vectorsData={windLayerData}/> : null}
                    {version === 2 && <WindLayerTransformFeedback src={activeImage}/>}
                </Layers>
            </Map>
            <div>
                <fieldset>
                    <legend>Version:</legend>

                    <div>
                        <input onChange={() => setVersion(1)} type="radio" id="huey" name="drone" value={1} checked={version === 1}/>
                            <label htmlFor="huey">PlainJS</label>
                    </div>

                    <div>
                        <input onChange={() => setVersion(2)} type="radio" id="dewey" name="drone" value="dewey" checked={version === 2}/>
                            <label htmlFor="dewey">TransformFeedback</label>
                    </div>
                </fieldset>
                <div>Choose image</div>
                {images.map(i => {
                    return (
                        <div
                            onClick={() => {
                                setActiveImage(i)
                            }}
                            style={{background: i === activeImage ? 'red' : "blue"}}
                            key={i}>
                            {i}
                        </div>
                    )
                })}
            </div>
        </div>
);
};

export default App;
