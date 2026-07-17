/// <reference types="geojson" />

declare module 'geojson' {
    // Re-export the GeoJSON namespace types as named exports
    export type GeoJSON = GeoJSON;
    export type GeoJsonObject = GeoJSON.GeoJsonObject;
    export type Feature = GeoJSON.Feature;
    export type FeatureCollection = GeoJSON.FeatureCollection;
    export type GeometryCollection = GeoJSON.GeometryCollection;
    export type Geometry = GeoJSON.Geometry;
    export type Position = GeoJSON.Position;
}
