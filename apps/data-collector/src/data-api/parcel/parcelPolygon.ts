import {
  queryFeatures,
  IQueryFeaturesOptions,
  IGeometry,
} from "@esri/arcgis-rest-feature-service";

let GeoJSON = require("geojson");
import type { Feature, Polygon } from "geojson";

export interface ParcelPolygonDataSource {
  fetchParcelPolygon(parcelId: string): Promise<Feature | undefined>;
}

export class ParcelPolygonAPIDataSource implements ParcelPolygonDataSource {
  async fetchParcelPolygon(parcelId: string): Promise<Feature | undefined> {
    const options: IQueryFeaturesOptions = {
      url: "https://gis.worcesterma.gov/worcags/rest/services/OpenData/Property/MapServer/1",
      where: `MAP_PAR_ID='${parcelId}'`,
      outFields: "*",
      geometryType: "esriGeometryEnvelope",
      spatialRel: "esriSpatialRelIntersects",
      returnGeometry: true,
      returnTrueCurves: false,
      returnIdsOnly: false,
      returnCountOnly: false,
      returnDistinctValues: false,
      returnZ: false,
      returnM: false,
      returnExtentOnly: false,
      outSR: "4326",
      f: "geojson",
    };

    return await queryFeatures(options).then((response) => {
      if ("features" in response) {
        let feature = response.features.at(0);
        if (feature === undefined) return undefined;

        // get geometry
        if (
          feature.geometry !== undefined &&
          "type" in feature.geometry &&
          feature.geometry.type === "Polygon"
        ) {
          return GeoJSON.parse(feature.geometry, {
            Polygon: "coordinates",
          });
        }
      } else {
        // IQueryResponse
        return undefined;
      }
    });
  }
}
