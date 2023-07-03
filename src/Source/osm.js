import * as olSource from "ol/source";

function osm(obj) {
	return new olSource.OSM(obj);
}

export default osm;