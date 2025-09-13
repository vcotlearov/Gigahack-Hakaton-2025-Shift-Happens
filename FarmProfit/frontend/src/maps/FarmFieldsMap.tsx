/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
// Плагин для рисования
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
// Площадь/геометрия
import * as turf from "@turf/turf";

// ---- Типы GeoJSON для полей
export type FieldProps = {
    id: string;
    name: string;
    area_m2: number;
    area_ha: number;
};
export type FieldGeom = GeoJSON.Polygon | GeoJSON.MultiPolygon;
export type FieldFeature = GeoJSON.Feature<FieldGeom, FieldProps>;
export type FieldCollection = GeoJSON.FeatureCollection<FieldGeom, FieldProps>;

const round = (n: number, d = 2) => Math.round(n * Math.pow(10, d)) / Math.pow(10, d);
const uid = () => (globalThis.crypto?.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`);

function computeAreas(g: GeoJSON.Geometry) {
    const m2 = turf.area(g as any);
    const ha = m2 / 10_000;
    return { m2: round(m2, 2), ha: round(ha, 4) };
}

type DrawApi = {
    importGeoJSON: (file: File) => void;
    fitToFeatures: () => void;
};

function DrawLogic({
    onUpdate,
    onApi,
}: {
    onUpdate: (fc: FieldCollection) => void;
    onApi?: (api: DrawApi) => void;
}) {
    const map = useMap();
    const layers = useRef<Map<string, L.Layer>>(new Map()); // id -> layer
    const features = useRef<FieldCollection>({ type: "FeatureCollection", features: [] });

    useEffect(() => {
        // Включаем тулбар рисования
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
            dragMode: false,
            cutPolygon: true,
            removalMode: true,
        });

        const ensureFeature = (layer: any, defaultName?: string): FieldFeature | null => {
            const gj = layer.toGeoJSON?.();
            if (!gj || !gj.geometry) return null;
            const id: string = layer.__fieldId ?? uid();
            layer.__fieldId = id; // запомним id прямо на слой

            const name = (layer.__fieldName as string) || defaultName || `Field ${features.current.features.length + 1}`;
            layer.__fieldName = name;

            const { m2, ha } = computeAreas(gj.geometry);
            const feat: FieldFeature = {
                type: "Feature",
                geometry: gj.geometry as FieldGeom,
                properties: { id, name, area_m2: m2, area_ha: ha },
            };
            return feat;
        };

        const upsert = (feat: FieldFeature) => {
            const idx = features.current.features.findIndex((f) => f.properties.id === feat.properties.id);
            if (idx === -1) features.current.features.push(feat);
            else features.current.features[idx] = feat;
            onUpdate({ ...features.current, features: [...features.current.features] });
        };

        const removeById = (id: string) => {
            features.current.features = features.current.features.filter((f) => f.properties.id !== id);
            layers.current.delete(id);
            onUpdate({ ...features.current, features: [...features.current.features] });
        };

        // Создание
        const onCreate = (e: any) => {
            const layer = e.layer as L.Layer & { toGeoJSON: () => GeoJSON.Feature } & any;
            const feat = ensureFeature(layer);
            if (!feat) return;
            layers.current.set(feat.properties.id, layer);
            if ((layer as any).bindTooltip) {
                (layer as any).bindTooltip(() => `${feat.properties.name}: ${feat.properties.area_ha} ha`, { permanent: false });
            }
            upsert(feat);
        };

        // Редактирование (перерисовка геометрии)
        const onEdit = (e: any) => {
            const layer = e.layer as any;
            const feat = ensureFeature(layer, layer.__fieldName);
            if (!feat) return;
            upsert(feat);
        };

        // Удаление
        const onRemove = (e: any) => {
            const layer = e.layer as any;
            const id: string | undefined = layer.__fieldId;
            if (id) removeById(id);
        };

        // @ts-ignore
        map.on("pm:create", onCreate);
        // @ts-ignore
        map.on("pm:edit", onEdit);
        // @ts-ignore
        map.on("pm:remove", onRemove);

        // ---------- Импорт и fit: отдаём наружу через onApi ----------
        const fitToFeatures = () => {
            const group = L.featureGroup(Array.from(layers.current.values()) as any);
            if (group.getLayers().length) map.fitBounds(group.getBounds().pad(0.2));
        };

        const importFromObject = (data: any) => {
            // Нормализуем к массиву Feature
            const featuresArray: GeoJSON.Feature[] = [];
            if (data?.type === "FeatureCollection") featuresArray.push(...data.features);
            else if (data?.type === "Feature") featuresArray.push(data);
            else if (data?.type && ["Polygon", "MultiPolygon"].includes(data.type)) {
                featuresArray.push({ type: "Feature", geometry: data, properties: {} } as any);
            } else {
                throw new Error("Not a valid (Multi)Polygon GeoJSON");
            }

            featuresArray.forEach((f,
                // i
            ) => {
                if (!f.geometry || !["Polygon", "MultiPolygon"].includes(f.geometry.type)) return;

                // const layer = L.geoJSON(f as any, {
                //     style: { weight: 2 },
                //     onEachFeature: (_feature, lyr) => {
                //         const l: any = lyr;
                //         // Связываем служебные поля
                //         l.__fieldId = f.properties?.id ?? uid();
                //         l.__fieldName =
                //             (f.properties && (f.properties as any).name) || `Field ${features.current.features.length + 1 + i}`;

                //         // Включаем поддержку geoman (чтобы редактировать/удалять)
                //         if (l.pm && l.pm.enable) {
                //             l.pm.enable({ allowSelfIntersection: false });
                //         }

                //         // Добавим тултип с площадью (после upsert будут актуальные цифры)
                //         if (l.bindTooltip) {
                //             l.bindTooltip(() => `${l.__fieldName}`, { permanent: false });
                //         }

                //         // На карту и в индексы
                //         l.addTo(map);
                //         layers.current.set(l.__fieldId, l);

                //         const feat = ensureFeature(l, l.__fieldName);
                //         if (feat) upsert(feat);
                //     },
                // });
            });

            fitToFeatures();
        };

        const importGeoJSON = (file: File) => {
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const obj = JSON.parse(String(reader.result));
                    importFromObject(obj);
                } catch (e) {
                    alert("Invalid GeoJSON file");
                }
            };
            reader.readAsText(file);
        };

        onApi?.({ importGeoJSON, fitToFeatures });

        return () => {
            // @ts-ignore
            map.off("pm:create", onCreate);
            // @ts-ignore
            map.off("pm:edit", onEdit);
            // @ts-ignore
            map.off("pm:remove", onRemove);
        };
    }, [map, onUpdate, onApi]);

    return null;
}

export default function MapFieldsArea() {
    const [fc, setFc] = useState<FieldCollection>({ type: "FeatureCollection", features: [] });
    const totalHa = useMemo(
        () => round(fc.features.reduce((s, f) => s + (f.properties.area_ha || 0), 0), 4),
        [fc]
    );

    // API от DrawLogic (импорт/fit)
    const apiRef = useRef<DrawApi | null>(null);

    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16, height: "80vh" }}>
            <div style={{ position: "relative" }}>
                <MapContainer center={[47.0, 28.8]} zoom={8} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <DrawLogic onUpdate={setFc} onApi={(api) => (apiRef.current = api)} />
                </MapContainer>
                <div
                    style={{
                        position: "absolute",
                        left: 12,
                        bottom: 12,
                        background: "white",
                        padding: "6px 10px",
                        borderRadius: 12,
                        boxShadow: "0 2px 8px rgba(0,0,0,.1)",
                        fontSize: 14,
                    }}
                >
                    Total surface: <b>{totalHa}</b> ha
                </div>
            </div>

            <aside style={{ background: "#fff", border: "1px solid #eee", borderRadius: 16, padding: 12, overflow: "auto" }}>
                <h3 style={{ margin: 0 }}>Fields</h3>

                {/* Импорт + Fit */}
                <div style={{ display: "flex", gap: 8, marginTop: 8, marginBottom: 8 }}>
                    <label
                        style={{
                            cursor: "pointer",
                            padding: "8px 10px",
                            borderRadius: 10,
                            border: "1px solid #ddd",
                            background: "#fff",
                            fontSize: 14,
                        }}
                    >
                        Import GeoJSON
                        <input
                            type="file"
                            accept=".geojson,application/geo+json,application/json"
                            style={{ display: "none" }}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file && apiRef.current) apiRef.current.importGeoJSON(file);
                                // сброс input, чтобы повторно выбирать тот же файл
                                e.currentTarget.value = "";
                            }}
                        />
                    </label>
                    <button
                        onClick={() => apiRef.current?.fitToFeatures()}
                        style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #ddd", background: "#fff", fontSize: 14 }}
                    >
                        Fit to fields
                    </button>
                </div>

                {fc.features.length === 0 ? (
                    <p style={{ color: "#666", fontSize: 14 }}>
                        Dear farmer, draw a polygon (Polygon button on the top left). The area will be calculated automatically.
                    </p>
                ) : (
                    <ul style={{ listStyle: "none", padding: 0, margin: "8px 0", display: "grid", gap: 8 }}>
                        {fc.features.map((f) => (
                            <li key={f.properties.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 8 }}>
                                <div style={{ fontSize: 12, color: "#6b7280" }}>ID: {f.properties.id}</div>
                                <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 4 }}>
                                    <input
                                        defaultValue={f.properties.name}
                                        onChange={(e) => {
                                            const name = e.target.value;
                                            setFc((prev) => ({
                                                ...prev,
                                                features: prev.features.map((x) =>
                                                    x.properties.id === f.properties.id ? { ...x, properties: { ...x.properties, name } } : x
                                                ),
                                            }));
                                        }}
                                        style={{ flex: 1, padding: "6px 8px", borderRadius: 8, border: "1px solid " + "#ddd" }}
                                    />
                                </div>
                                <div style={{ marginTop: 6, fontSize: 14 }}>
                                    Land area: <b>{f.properties.area_ha}</b> ha (<span>{f.properties.area_m2}</span> m²)
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                <button
                    onClick={() => {
                        const blob = new Blob([JSON.stringify(fc, null, 2)], { type: "application/geo+json" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "fields.geojson";
                        a.click();
                        URL.revokeObjectURL(url);
                    }}
                    style={{ marginTop: 8, padding: "8px 10px", borderRadius: 10, border: "1px solid #ddd", background: "#fff" }}
                >
                    Export GeoJSON
                </button>
            </aside>
        </div>
    );
}
