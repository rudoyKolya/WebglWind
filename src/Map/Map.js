import React, {useRef, useState, useEffect} from "react"
import "./Map.css";
import MapContext from "./MapContext";
import * as ol from "ol";
import {get as getProjection} from 'ol/proj';
import OLTileLayer from "ol/layer/Tile";
import {osm} from "../Source";


const Map = ({children, zoom, center}) => {
    const mapRef = useRef();
    const [map, setMap] = useState(null);

    useEffect(() => {
        const layer = new OLTileLayer({
            source: osm(),
        })
        layer.on('postrender', function (event) {
            event.context.globalCompositeOperation = 'destination-over';
            event.context.fillStyle = 'rgba(170, 211, 223, 1)';
            event.context.fillRect(
                0,
                0,
                event.context.canvas.width,
                event.context.canvas.height / 2
            );
            event.context.fillStyle = 'rgba(242, 239, 233, 1)';
            event.context.fillRect(
                0,
                event.context.canvas.height / 2,
                event.context.canvas.width,
                event.context.canvas.height / 2
            );
            event.context.globalCompositeOperation = 'source-over';
        });
        let options = {
            view: new ol.View({
                projection: getProjection('EPSG:4326'),
                center: [0, 0],
                zoom: 2,
                maxZoom: 10,
                minZoom: 1
            }),
            layers: [
                layer
            ],


            controls: [],
            overlays: []
        };

        let mapObject = new ol.Map(options);
        mapObject.setTarget(mapRef.current);
        setMap(mapObject);
        return () => mapObject.setTarget(undefined);
    }, []);

    // zoom change handler
    useEffect(() => {
        if (!map) return;
        map.getView().setZoom(zoom);
    }, [zoom]);

    // center change handler
    useEffect(() => {
        if (!map) return;

        map.getView().setCenter(center)
    }, [center])

    return (
        <MapContext.Provider value={{map}}>
            <div ref={mapRef} className="ol-map">
                {children}
            </div>
        </MapContext.Provider>
    )
}

export default Map;