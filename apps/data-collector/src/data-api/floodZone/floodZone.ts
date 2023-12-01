import type { FloodZone } from "database/generated/prisma-client";
import { arcgisToGeoJSON, geojsonToArcGIS } from "@terraformer/arcgis";
import { Feature } from "geojson";
import {
  IQueryFeaturesOptions,
  queryFeatures,
} from "@esri/arcgis-rest-feature-service";

export interface FloodZoneDataSource {
  getFloodZone(parcelPolygon: Feature): Promise<FloodZone | undefined>;
}

export class FloodZoneAPIDataSource implements FloodZoneDataSource {
  async getFloodZone(parcelPolygon: Feature): Promise<FloodZone | undefined> {
    const convertedGeometry = geojsonToArcGIS(parcelPolygon.geometry);
    if (!("rings" in convertedGeometry)) return;
    const options: IQueryFeaturesOptions = {
      url: "https://services1.arcgis.com/j8dqo2DJE7mVUBU1/arcgis/rest/services/FEMA_Flood_Zones_2011/FeatureServer/2",
      httpMethod: "POST",
      outFields: "*",
      geometry: convertedGeometry,
      inSR: "4326",
      spatialRel: "esriSpatialRelIntersects",
      geometryType: "esriGeometryPolygon",
      outSR: "4326",
      f: "json",
    };

    return await queryFeatures(options).then((result) => {
      if (!("features" in result)) return;
      const feature = result.features[0];
      if (feature === undefined || feature.geometry === undefined) return;

      return {
        id: parseInt(feature.attributes.FLD_AR_ID as string),
        zoneName: feature.attributes.FLD_ZONE as string,
        floodway: feature.attributes.FLOODWAY as string,
        specialFloodHazardArea: (feature.attributes.SFHA_TF as string) === "T",
        polygonJSON: JSON.stringify(arcgisToGeoJSON(feature.geometry)),
      };
    });
  }
}
