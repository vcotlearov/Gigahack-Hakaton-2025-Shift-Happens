/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

import * as turf from "@turf/turf";

// Округление
const round = (n: number, d = 2) => Math.round(n * Math.pow(10, d)) / Math.pow(10, d);

function DrawControls({ handleCreatePolygon }: { handleCreatePolygon: (geoJson: any) => void }) {
    const map = useMap();
    const layersRef = useRef<Set<any>>(new Set()); // храним все слои-полигоны, чтобы считать общую площадь

    useEffect(() => {
        // Включаем тулбар Geoman
        // @ts-ignore
        map.pm.addControls({
            position: "topleft",
            drawMarker: false,
            drawPolyline: false,
            drawCircle: false,
            drawRectangle: false,
            drawCircleMarker: false,
            drawText: false,
            drawPolygon: true,
            editMode: true,
            dragMode: true,
            cutPolygon: true,
            removalMode: true,
        });

        // Подсчёт суммарной площади всех текущих полигонов (ha)
        const totalHa = () => {
            let sum = 0;
            layersRef.current.forEach((layer) => {
                try {
                    const gj = layer.toGeoJSON?.();
                    if (gj?.geometry) {
                        const m2 = turf.area(gj.geometry as any);
                        sum += m2 / 10_000;
                    }
                } catch { console.warn('Failed to calc area of layer', layer); }
            });
            return round(sum, 4);
        };

        // Обогащаем feature полезными полями в properties
        const enrichFeature = (layer: any) => {
            const gj = layer.toGeoJSON() as GeoJSON.Feature;
            const geom = gj.geometry;
            const areaM2 = turf.area(geom as any);
            const areaHa = areaM2 / 10_000;
            const centroid = turf.centroid(gj as any).geometry.coordinates as [number, number]; // [lng,lat]
            const bbox = turf.bbox(gj as any) as [number, number, number, number];

            const enriched: GeoJSON.Feature = {
                ...gj,
                properties: {
                    ...(gj.properties || {}),
                    area_m2: round(areaM2, 2),
                    area_ha: round(areaHa, 4),
                    centroid,                 // [lng, lat]
                    bbox,                     // [minLng, minLat, maxLng, maxLng]
                    total_drawn_ha: totalHa() // суммарная площадь всех фигур
                },
            };
            return enriched;
        };

        // Создание полигона
        const onCreate = (e: any) => {
            const layer = e.layer as L.Layer & { toGeoJSON: () => GeoJSON.Feature } & any;
            layersRef.current.add(layer);
            const enriched = enrichFeature(layer);
            handleCreatePolygon(enriched);
        };

        // Редактирование полигона
        const onEdit = (e: any) => {
            const layer = e.layer as any;
            // слой уже есть в наборе, просто перекидывать не нужно
            const enriched = enrichFeature(layer);
            handleCreatePolygon(enriched);
        };

        // Удаление полигона
        const onRemove = (e: any) => {
            const layer = e.layer as any;
            layersRef.current.delete(layer);
            // Можно уведомить форму о новой сумме площадей, если нужно:
            // передадим "последний" feature как null-объект с общей площадью
            const fake: any = {
                type: "Feature",
                properties: { total_drawn_ha: totalHa() },
                geometry: null,
            };
            handleCreatePolygon(fake);
        };

        // @ts-ignore
        map.on("pm:create", onCreate);
        // @ts-ignore
        map.on("pm:edit", onEdit);
        // @ts-ignore
        map.on("pm:remove", onRemove);

        return () => {
            // @ts-ignore
            map.off("pm:create", onCreate);
            // @ts-ignore
            map.off("pm:edit", onEdit);
            // @ts-ignore
            map.off("pm:remove", onRemove);
            layersRef.current.clear();
        };
    }, [handleCreatePolygon, map]);

    return null;
}

export default function MapWithDraw({ onCreatePolygon }: { onCreatePolygon: (geoJson: any) => void }) {
    return (
        <div style={{ height: "80vh", width: "100%" }}>
            <MapContainer center={[47.0, 28.8]} zoom={8} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <DrawControls handleCreatePolygon={onCreatePolygon} />
            </MapContainer>
        </div>
    );
}
