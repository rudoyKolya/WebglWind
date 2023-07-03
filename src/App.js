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


const images = [img, img2, img3]
const App = () => {
    const [center, setCenter] = useState(mapConfig.center);
    const [zoom, setZoom] = useState(1);
    const [windLayerData, setWindLayerData] = useState(null)
    const [activeImage, setActiveImage] = useState(img)

    useEffect(() => {
        loadImageData(activeImage, (data) => {
            debugger
            setWindLayerData(data)
        })
    }, [activeImage])
    return (
        <div>
            <Map center={fromLonLat(center)} zoom={zoom}>
                <Layers>
                    {windLayerData ? <WindLayer vectorsData={windLayerData}/> : null}
                </Layers>
            </Map>
            <div>
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
