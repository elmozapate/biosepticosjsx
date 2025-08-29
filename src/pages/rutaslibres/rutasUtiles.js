
"use client"
import { useEffect, useMemo, useRef, useState ,useCallback } from "react";
import { useLoadScript, GoogleMap, MarkerF } from "@react-google-maps/api";
import { Loader } from "@googlemaps/js-api-loader";


const DEFAULT_BBOX = {
    latMin: 5.9692,
    latMax: 6.5398,
    lonMin: -75.8427,
    lonMax: -75.2868,
};

function randomPointInFenceBBox(fence) {
    const { south, north, west, east } = fence.bbox;
    const rand = (min, max) => Math.random() * (max - min) + min;
    const lat = Number(rand(south, north).toFixed(6));
    const lng = Number(rand(west, east).toFixed(6));
    return { lat, lng };
}

function assignVehiclesToFences(fleet, fences) {
    if (!Array.isArray(fences) || fences.length === 0) return fleet;
    const out = fleet.map((v, i) => {
        const fence = fences[i % fences.length];
        const pos = randomPointInFenceBBox(fence);
        return {
            ...v,
            gps: { ...v.gps, ...pos },
            fenceId: fence.id,
            fenceName: fence.name,
        };
    });
    return out;
}

const centerFromBox = (bbox = DEFAULT_BBOX) => ({
    lat: (bbox.latMin + bbox.latMax) / 2,
    lng: (bbox.lonMin + bbox.lonMax) / 2,
});

const rand = (min, max) => Math.random() * (max - min) + min;

const choice = (arr) => arr[Math.floor(Math.random() * arr.length)];

const pad = (n) => String(n).padStart(2, "0");

function buildLatBandFencesVertices(bbox, bands = 10) {
    const { latMin, latMax, lonMin, lonMax } = bbox;
    const dLat = (latMax - latMin) / bands;
    const fences = [];
    for (let i = 0; i < bands; i++) {
        const south = latMin + dLat * i;
        const north = latMin + dLat * (i + 1);
        const vertices = [
            { lat: Number(south.toFixed(6)), lon: Number(lonMin.toFixed(6)) }, // SW
            { lat: Number(south.toFixed(6)), lon: Number(lonMax.toFixed(6)) }, // SE
            { lat: Number(north.toFixed(6)), lon: Number(lonMax.toFixed(6)) }, // NE
            { lat: Number(north.toFixed(6)), lon: Number(lonMin.toFixed(6)) }, // NW
        ];
        fences.push({
            id: `lat_${String(i + 1).padStart(2, "0")}`,
            name: `LatBand ${i + 1} (lat ${south.toFixed(5)}–${north.toFixed(5)})`,
            vertices,
            bbox: { south, north, west: lonMin, east: lonMax },
        });
    }
    return fences;
}

function buildLonBandFencesVertices(bbox, bands = 10) {
    const { latMin, latMax, lonMin, lonMax } = bbox;
    const dLon = (lonMax - lonMin) / bands;
    const fences = [];
    for (let i = 0; i < bands; i++) {
        const west = lonMin + dLon * i;
        const east = lonMin + dLon * (i + 1);
        const vertices = [
            { lat: Number(latMin.toFixed(6)), lon: Number(west.toFixed(6)) }, // SW
            { lat: Number(latMin.toFixed(6)), lon: Number(east.toFixed(6)) }, // SE
            { lat: Number(latMax.toFixed(6)), lon: Number(east.toFixed(6)) }, // NE
            { lat: Number(latMax.toFixed(6)), lon: Number(west.toFixed(6)) }, // NW
        ];
        fences.push({
            id: `lon_${String(i + 1).padStart(2, "0")}`,
            name: `LonBand ${i + 1} (lon ${west.toFixed(5)}–${east.toFixed(5)})`,
            vertices,
            bbox: { south: latMin, north: latMax, west, east },
        });
    }
    return fences;
}

function buildGridFencesVertices(bbox, rows = 2, cols = 5) {
    const { latMin, latMax, lonMin, lonMax } = bbox;
    const dLat = (latMax - latMin) / rows;
    const dLon = (lonMax - lonMin) / cols;
    const fences = [];
    let k = 1;
    for (let r = 0; r < rows; r++) {
        const south = latMin + dLat * r;
        const north = latMin + dLat * (r + 1);
        for (let c = 0; c < cols; c++) {
            const west = lonMin + dLon * c;
            const east = lonMin + dLon * (c + 1);
            const vertices = [
                { lat: Number(south.toFixed(6)), lon: Number(west.toFixed(6)) }, // SW
                { lat: Number(south.toFixed(6)), lon: Number(east.toFixed(6)) }, // SE
                { lat: Number(north.toFixed(6)), lon: Number(east.toFixed(6)) }, // NE
                { lat: Number(north.toFixed(6)), lon: Number(west.toFixed(6)) }, // NW
            ];
            fences.push({
                id: `cell_${String(k).padStart(2, "0")}`,
                name: `Cell r${r + 1}c${c + 1}`,
                vertices,
                bbox: { south, north, west, east },
            });
            k++;
        }
    }
    return fences;
}

function stripUltimoNumero(addr = "") {
    const s = String(addr || "").trim();
    if (!s) return "";
    const s1 = s.replace(/\s*[-–]\s*\d+[a-zA-Záéíóúñ-]*\s*$/i, "").trim();
    if (s1 !== s) return s1;
    const parts = s.split(/\s+/);
    for (let i = parts.length - 1; i >= 0; i--) {
        if (/\d/.test(parts[i])) { parts.splice(i, 1); break; }
    }
    return parts.join(" ").trim();
}

function buildFencesByMode({ bbox, mode, bands, rows, cols }) {
    if (mode === "lon") return buildLonBandFencesVertices(bbox, bands);
    if (mode === "grid") return buildGridFencesVertices(bbox, rows, cols);
    return buildLatBandFencesVertices(bbox, bands); // default: lat
}

const _placesSingleton = { loading: null, autoSvc: null, placeSvc: null };

async function ensurePlacesServices(apiKey = GOOGLE_MAPS_KEY) {
    if (_placesSingleton.autoSvc && _placesSingleton.placeSvc) return _placesSingleton;

    // si Places no está, cárgalo
    if (!window?.google?.maps?.places) {
        if (!_placesSingleton.loading) {
            const loader = new Loader({
                apiKey,
                libraries: ["places"],
                version: "weekly",
            });
            _placesSingleton.loading = loader.load();
        }
        await _placesSingleton.loading;
    }

    _placesSingleton.autoSvc = _placesSingleton.autoSvc || new google.maps.places.AutocompleteService();
    _placesSingleton.placeSvc = _placesSingleton.placeSvc || new google.maps.places.PlacesService(document.createElement("div"));
    return _placesSingleton;
}

function toPolygonPathAndStyle(fences) {
    const colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];
    return fences.map((f, idx) => {
        const path = [
            { lat: f.vertices[0].lat, lng: f.vertices[0].lon },
            { lat: f.vertices[1].lat, lng: f.vertices[1].lon },
            { lat: f.vertices[2].lat, lng: f.vertices[2].lon },
            { lat: f.vertices[3].lat, lng: f.vertices[3].lon },
            { lat: f.vertices[0].lat, lng: f.vertices[0].lon },
        ];
        const color = colors[idx % colors.length];
        return {
            ...f,
            path,
            style: { strokeColor: color, strokeOpacity: 0.7, strokeWeight: 2, fillColor: color, fillOpacity: 0.1 },
        };
    });
}

const BRANDS = [
    { marca: "Chevrolet", modelos: ["NHR", "NKR", "NPR", "NQR"] },
    { marca: "Isuzu", modelos: ["NKR", "NPR", "NQR"] },
    { marca: "Foton", modelos: ["Aumark S", "BJ1049", "BJ1069"] },
    { marca: "JAC", modelos: ["N56", "N65", "N75"] },
    { marca: "Hino", modelos: ["300 616", "300 716", "300 816"] },
    { marca: "Fuso", modelos: ["Canter 4.9", "Canter 6.5"] },
    { marca: "Hyundai", modelos: ["HD65", "HD72"] },
    { marca: "Kia", modelos: ["K2700", "Frontier K3000"] },
];

const COLORS = ["blanco", "gris", "azul", "rojo", "verde", "negro", "plateado"];

const DIM_OPTS = [
    { largo: 3.5, ancho: 2.0, alto: 2.0 }, // ~14 m³
    { largo: 4.2, ancho: 2.1, alto: 2.2 }, // ~19 m³
    { largo: 4.6, ancho: 2.2, alto: 2.3 }, // ~23 m³
    { largo: 5.0, ancho: 2.3, alto: 2.3 }, // ~26 m³
    { largo: 5.4, ancho: 2.3, alto: 2.4 }, // ~30 m³
];

const PAYLOAD_KG_RANGE = [2000, 5000];

const letters = "BCDFGHJKLMNPRSTVWXYZ";

const randomPlate = () => {
    const L = () => letters[Math.floor(Math.random() * letters.length)];
    const N = () => Math.floor(Math.random() * 10);
    return `${L()}${L()}${L()}-${N()}${N()}${N()}`;
};

function buildFleet(n = 10, fences = buildLatBandFencesVertices(DEFAULT_BBOX, 10)) {
    const fleet = [];
    const letters = "BCDFGHJKLMNPRSTVWXYZ";




    // helper: punto aleatorio dentro del rectángulo de una cerca
    const randomPointInFence = (fence) => {
        const { south, north, west, east } = fence.bbox;
        const lat = Number(rand(south, north).toFixed(6));
        const lng = Number(rand(west, east).toFixed(6));
        return { lat, lng };
    };

    for (let i = 0; i < n; i++) {
        const fence = fences[i % fences.length]; // 1 vehículo por cerca; si hay más, cicla
        const brand = choice(BRANDS);
        const model = choice(brand.modelos);
        const color = choice(COLORS);
        const dims = choice(DIM_OPTS);
        const volumen_m3 = Number((dims.largo * dims.ancho * dims.alto).toFixed(1));
        const payloadKg = Math.round(rand(PAYLOAD_KG_RANGE[0], PAYLOAD_KG_RANGE[1]) / 50) * 50;
        const taraKg = Math.round(rand(2800, 5200) / 50) * 50;
        const { lat, lng } = randomPointInFence(fence);

        fleet.push({
            id: `veh_${pad(i + 1)}`,
            placa: randomPlate(),
            marca: brand.marca,
            modelo: model,
            color,
            online: true,
            enServicio: true,
            capacidad_carga_kg: payloadKg,
            capacidad_carga_t: Number((payloadKg / 1000).toFixed(2)),
            volumen_util_m3: volumen_m3,
            dimensiones_furgon_m: { ...dims },
            combustible: choice(["diésel", "diésel", "diésel", "GNV"]),
            ejes: 2,
            ano: Math.floor(rand(2016, 2025)),
            gps: { lat, lng, velocidad_kmh: 0, heading: Math.floor(rand(0, 360)) },
            taraKg,
            gvwKg: taraKg + payloadKg,
            fenceId: fence.id,          // 👈 referencia de cerca asignada
            fenceName: fence.name,
        });
    }
    return fleet;
}

const rnd = (x, n = 2) => Number((x ?? 0).toFixed(n));

const libraries = ["places"];

const mapOptions = {
    disableDefaultUI: true,
    clickableIcons: true,
    scrollwheel: false,
    zoomControl: true,
};

function isInFence(lat, lng, fence) {
    const { south, north, west, east } = fence.bbox;
    return lat >= south && lat <= north && lng >= west && lng <= east;
}

function fenceForPoint(lat, lng, fences) {
    return fences.find((f) => isInFence(lat, lng, f)) || null;
}

function fenceCenterFromBBox(fence) {
    const { south, north, west, east } = fence.bbox;
    const lat = Number(((south + north) / 2).toFixed(6));
    const lng = Number(((west + east) / 2).toFixed(6));
    return { lat, lng };
}

function vehicleCaps(v) {
    const L = Number(v?.dimensiones_furgon_m?.largo ?? 0);
    const W = Number(v?.dimensiones_furgon_m?.ancho ?? 0);
    const H = Number(v?.dimensiones_furgon_m?.alto ?? 0);
    const deckArea = L * W; // m²
    const vol = deckArea * H; // m³ (opcional)
    const kg = Number(v?.capacidad_carga_kg ?? 0);

    return {
        L, W, H,
        deckArea_m2: deckArea,
        volume_m3: vol,
        weight_kg: kg,
    };
}

function canFitCargoInVehicle(cargoSim, vState) {
    if (!cargoSim) return { ok: false, reason: "sin_carga" };

    const L = vState.caps.L, W = vState.caps.W, H = vState.caps.H;
    const aL = cargoSim.item_unitario.largo_m;
    const aW = cargoSim.item_unitario.ancho_m;
    const aE = cargoSim.item_unitario.espesor_m;
    const qty = cargoSim.cantidad;

    // 1) plano (permitimos rotar)
    const fitsPlanar = (aL <= L && aW <= W) || (aW <= L && aL <= W);
    if (!fitsPlanar) return { ok: false, reason: "no_cabe_plano" };

    // 2) altura (laminados apilados)
    const neededHeight = qty * aE; // m
    if (neededHeight > H) return { ok: false, reason: "sin_altura" };

    // 3) peso
    if (cargoSim.peso_total_kg > vState.rem_kg) return { ok: false, reason: "sin_peso" };

    // 4) "huella" de área en la plataforma (tomamos footprint de UNA lámina)
    const footprint = aL * aW;
    if (footprint > vState.rem_area_m2) return { ok: false, reason: "sin_area" };

    return { ok: true, footprint_m2: footprint, neededHeight_m: neededHeight };
}

function FenceLabels({ fences = [], PolygonFAvailable = true, mapInstance = null }) {
    const labelsRef = useRef([]);

    const centerFromFence = (f) => ({
        lat: (f.bbox.south + f.bbox.north) / 2,
        lng: (f.bbox.west + f.bbox.east) / 2,
    });

    useEffect(() => {
        if (PolygonFAvailable || !mapInstance || !window.google) return;
        labelsRef.current.forEach(m => m.setMap(null));
        labelsRef.current = [];

        fences.forEach(f => {
            const pos = centerFromFence(f);
            const marker = new google.maps.Marker({
                position: pos,
                map: mapInstance,
                label: `#${f.cell ?? f.id}`,
                icon: { path: google.maps.SymbolPath.CIRCLE, scale: 0 },
                clickable: false,
            });
            labelsRef.current.push(marker);
        });

        return () => {
            labelsRef.current.forEach(m => m.setMap(null));
            labelsRef.current = [];
        };
    }, [PolygonFAvailable, mapInstance, fences]);

    if (!PolygonFAvailable) return null;

    return fences.map(f => (
        <MarkerF
            key={`fence-label-${f.id}`}
            position={centerFromFence(f)}
            label={`#${f.cell ?? f.id}`}
            clickable={false}
            icon={{ path: window.google?.maps?.SymbolPath?.CIRCLE ?? 0, scale: 0 }}
        />
    ));
}

function assignObrasToFleetByGeofence(obrasZonificadas, fleet, fences) {
    const fleetState = fleet.map(v => {
        const caps = vehicleCaps(v);
        return {
            ...v,
            caps,
            rem_kg: caps.weight_kg,
            rem_area_m2: caps.deckArea_m2,
            route: [],
            route_metrics: { used_kg: 0, used_area_m2: 0, max_stack_m: 0 },
        };
    });

    const obrasSinCap = [];
    const index = new Map(); // fenceId -> { fence, obras:[], vehs:[], left:[] }
    fences.forEach(f => index.set(f.id, { fence: f, obras: [], vehs: [], left: [] }));

    fleetState.forEach(v => {
        if (v.fenceId && index.has(v.fenceId)) index.get(v.fenceId).vehs.push(v);
    });

    const leftNoFence = [];
    obrasZonificadas.forEach(o => {
        if (!obraHasCoords(o) || !o?.cargaSim) return;
        const bucket = o.fenceId ? index.get(o.fenceId) : null;
        if (bucket) bucket.obras.push(o);
        else leftNoFence.push({ ...o, reason: "fuera_de_cerca" });
    });

    // Greedy dentro de cada cerca
    for (const [, bucket] of index.entries()) {
        const vehs = bucket.vehs.sort((a, b) => b.rem_kg - a.rem_kg);
        for (const o of bucket.obras) {
            let ok = false;
            for (const v of vehs) {
                const fit = canFitCargoInVehicle(o.cargaSim, v);
                if (!fit.ok) continue;

                v.rem_kg -= o.cargaSim.peso_total_kg;
                v.rem_area_m2 -= fit.footprint_m2;
                v.route.push({
                    obraId: o.id,
                    nombre: o.nombre,
                    peso_kg: rnd(o.cargaSim.peso_total_kg, 1),
                    area_m2: rnd(o.cargaSim.area_total_m2, 2),
                    footprint_m2: rnd(fit.footprint_m2, 2),
                    altura_m: rnd(fit.neededHeight_m, 3),
                    coords: o.direccion?.coordenadas || null,
                    crossFence: false,
                    sourceFenceId: o.fenceId,
                });
                v.route_metrics.used_kg = rnd((v.route_metrics.used_kg || 0) + o.cargaSim.peso_total_kg, 1);
                v.route_metrics.used_area_m2 = rnd((v.route_metrics.used_area_m2 || 0) + fit.footprint_m2, 2);
                v.route_metrics.max_stack_m = Math.max(v.route_metrics.max_stack_m || 0, fit.neededHeight_m);
                ok = true;
                break;
            }
            if (!ok) {
                bucket.left.push({ ...o, reason: "sin_capacidad_en_cerca" });
                obrasSinCap.push({ ...o, reason: "sin_capacidad_en_cerca" });
            }
        }
    }

    const fleetAssigned = fleetState.map(v => ({
        ...v,

        // 👇 NECESARIOS para el paso manual
        rem_kg: Number(v.rem_kg),
        rem_area_m2: Number(v.rem_area_m2),
        caps: { ...v.caps },
        route: [...v.route],
        route_metrics: { ...v.route_metrics },

        // 👇 Derivados para la tabla
        carga_utilizada_kg: rnd(v.route_metrics.used_kg, 1),
        carga_total_kg: rnd(v.caps.weight_kg, 0),
        deck_usado_m2: rnd(v.route_metrics.used_area_m2, 2),
        deck_total_m2: rnd(v.caps.deckArea_m2, 2),
        max_stack_m: rnd(v.route_metrics.max_stack_m, 3),
    }));

    const resumen = Array.from(index.values()).map(({ fence, vehs }) => ({
        fenceId: fence.id,
        fenceName: fence.name,
        vehiculos: vehs.length,
        obras_asignadas: vehs.reduce((s, v) => s + v.route.length, 0),
        kg_asignados: rnd(vehs.reduce((s, v) => s + v.route_metrics.used_kg, 0), 1),
    }));

    // 👇 estos dos eran los que faltaban (Map + array)
    const leftoversByFence = new Map(
        Array.from(index.entries()).map(([fid, b]) => [fid, b.left])
    );

    return { fleetAssigned, obrasSinCap, resumen, leftoversByFence, leftNoFence };
}

function assignVehiclesToFencesCenter(fleet, fences) {
    if (!Array.isArray(fences) || fences.length === 0) return fleet;
    return fleet.map((v, i) => {
        const fence = fences[i % fences.length];
        const pos = fenceCenterFromBBox(fence);
        return {
            ...v,
            gps: { ...v.gps, ...pos },
            fenceId: fence.id,
            fenceName: fence.name,
        };
    });
}

function MapGeofences({
    bbox = DEFAULT_BBOX,
    mode = "lat",
    bands = 10,
    rows = 2,
    cols = 5,
    apiKey
}) {
    // 1) Hooks SIEMPRE arriba y en el mismo orden
    const libraries = useMemo(() => ["places"], []);
    const { isLoaded } = useLoadScript({ googleMapsApiKey: apiKey, libraries });

    const fences = useMemo(
        () => buildFencesByMode({ bbox, mode, bands, rows, cols }),
        [bbox, mode, bands, rows, cols]
    );
    const fencesPolys = useMemo(() => toPolygonPathAndStyle(fences), [fences]);
    const center = useMemo(() => centerFromBox(bbox), [bbox]);

    const polygonsRef = useRef([]);
    const mapRef = useRef(null);

    // 2) Resolver disponibilidad de PolygonF de forma estable
    let PolygonFComp = null;
    try {
        const pkg = require("@react-google-maps/api");
        PolygonFComp = pkg.PolygonF || null;
    } catch (_) { }
    const polyAvailable = !!PolygonFComp;

    // 3) Fallback nativo para dibujar polígonos (memoizado)
    const drawNativePolys = useCallback((map) => {
        if (!window.google?.maps || !map) return;
        // limpia previos
        polygonsRef.current.forEach((p) => p.setMap?.(null));
        polygonsRef.current = [];
        // pinta
        fencesPolys.forEach((fp) => {
            const poly = new google.maps.Polygon({
                paths: fp.path,
                strokeColor: fp.style.strokeColor,
                strokeOpacity: fp.style.strokeOpacity,
                strokeWeight: fp.style.strokeWeight,
                fillColor: fp.style.fillColor,
                fillOpacity: fp.style.fillOpacity,
                clickable: true,
                map,
            });
            poly.addListener("click", () => console.log(fp.id, fp.name, fp.vertices));
            polygonsRef.current.push(poly);
        });
    }, [fencesPolys]);

    // 4) Redibujar fallback cuando haga falta (sin depender de PolygonFComp directamente)
    useEffect(() => {
        if (!isLoaded) return;
        if (polyAvailable) return;
        if (mapRef.current) drawNativePolys(mapRef.current);
        // cleanup al desmontar
        return () => {
            polygonsRef.current.forEach((p) => p.setMap?.(null));
            polygonsRef.current = [];
        };
    }, [isLoaded, polyAvailable, drawNativePolys]);

    if (!isLoaded) return <div className="card">Cargando mapa…</div>;

    return (
        <GoogleMap
            options={mapOptions}
            zoom={12}
            center={center}
            mapTypeId={google.maps.MapTypeId.ROADMAP}
            mapContainerStyle={{ width: "100%", height: 420 }}
            onLoad={(map) => {
                mapRef.current = map;
                if (!polyAvailable) drawNativePolys(map);
            }}
        >
            {/* Polígonos con PolygonF si está disponible */}
            {polyAvailable &&
                fencesPolys.map((fp) => (
                    <PolygonFComp
                        key={fp.id}
                        path={fp.path}
                        options={fp.style}
                        onClick={() => console.log(fp.id, fp.name, fp.vertices)}
                    />
                ))}

            {/* Etiquetas #cell (si ya tienes este componente) */}
            <FenceLabels
                fences={fences}
                PolygonFAvailable={polyAvailable}
                mapInstance={mapRef.current}
            />
        </GoogleMap>
    );
}


function MapVehicles({ apiKey, vehicles = [], fences = [], bbox = DEFAULT_BBOX }) {
    // HOOKS SIEMPRE ARRIBA
    const libraries = useMemo(() => ['places'], []);
    const { isLoaded } = useLoadScript({ googleMapsApiKey: apiKey, libraries });

    const center = useMemo(() => centerFromBox(bbox), [bbox]);
    const fencesPolys = useMemo(() => toPolygonPathAndStyle(fences), [fences]);

    // estado para InfoWindow
    const [selectedId, setSelectedId] = useState(null);
    const selectedVeh = useMemo(
        () => vehicles.find(v => v.id === selectedId) || null,
        [vehicles, selectedId]
    );

    // refs y fallbacks
    const polygonsRef = useRef([]);
    const mapRef = useRef(null);

    // Mapa: fenceId -> #cell (si no viene, usamos índice+1)
    const cellById = useMemo(() => {
        const m = new Map();
        fences.forEach((f, i) => m.set(f.id, f.cell ?? (i + 1)));
        return m;
    }, [fences]);

    // Intentar usar componentes funcionales (F) de la lib:
    let PolygonFComp = null;
    let InfoWindowComp = null;
    try {
        const pkg = require("@react-google-maps/api");
        PolygonFComp = pkg.PolygonF || null;
        InfoWindowComp = pkg.InfoWindowF || pkg.InfoWindow || null;
    } catch (_) { /* noop */ }

    const drawNativePolys = (map) => {
        polygonsRef.current.forEach((p) => p.setMap(null));
        polygonsRef.current = [];
        fencesPolys.forEach((fp) => {
            const poly = new google.maps.Polygon({
                paths: fp.path,
                strokeColor: fp.style.strokeColor,
                strokeOpacity: fp.style.strokeOpacity,
                strokeWeight: fp.style.strokeWeight,
                fillColor: fp.style.fillColor,
                fillOpacity: fp.style.fillOpacity,
                clickable: false,
                map,
            });
            polygonsRef.current.push(poly);
        });
    };

    // Redibuja fallback cuando cambien cercas
    useEffect(() => {
        if (!isLoaded) return;
        if (PolygonFComp) return;
        if (mapRef.current) drawNativePolys(mapRef.current);
    }, [isLoaded, PolygonFComp, fencesPolys, fences]);

    if (!isLoaded) return <div className="card">Cargando mapa…</div>;

    return (
        <GoogleMap
            options={mapOptions}
            zoom={12}
            center={center}
            mapTypeId={google.maps.MapTypeId.ROADMAP}
            mapContainerStyle={{ width: "100%", height: 420 }}
            onLoad={(map) => {
                mapRef.current = map;
                if (!PolygonFComp) drawNativePolys(map);
            }}
            onClick={() => setSelectedId(null)} // cerrar ficha al hacer click en el mapa
        >
            {/* Cercas como fondo */}
            {PolygonFComp && fencesPolys.map((fp) => (
                <PolygonFComp key={fp.id} path={fp.path} options={fp.style} />
            ))}

            {/* Etiquetas #cell (ya tienes este componente) */}
            <FenceLabels
                fences={fences}
                PolygonFAvailable={!!PolygonFComp}
                mapInstance={mapRef.current}
            />

            {/* Marcadores de vehículos */}
            {vehicles.map((v) => (
                <MarkerF
                    key={v.id}
                    position={{ lat: v.gps.lat, lng: v.gps.lng }}
                    title={`${v.placa} • ${v.fenceName || v.fenceId || "—"} • Obras: ${v.route?.length || 0}`}
                    label={{ text: String(v.route?.length || ""), fontSize: "12px" }}
                    onClick={() => setSelectedId(v.id)}
                />
            ))}

            {/* Ficha (InfoWindow) */}
            {InfoWindowComp && selectedVeh && (
                <InfoWindowComp
                    position={{ lat: selectedVeh.gps.lat, lng: selectedVeh.gps.lng }}
                    onCloseClick={() => setSelectedId(null)}
                >
                    <div style={{ fontFamily: "system-ui, Arial", maxWidth: 260 }}>
                        <div style={{ fontWeight: 700, marginBottom: 4 }}>{selectedVeh.placa}</div>
                        <div style={{ fontSize: 13, marginBottom: 6 }}>
                            {selectedVeh.marca} {selectedVeh.modelo} • {selectedVeh.color}
                        </div>
                        <div style={{ fontSize: 12, lineHeight: 1.5 }}>
                            <div><b>Capacidad:</b> {selectedVeh.capacidad_carga_kg} kg ({selectedVeh.capacidad_carga_t} t)</div>
                            <div><b>Volumen:</b> {selectedVeh.volumen_util_m3} m³</div>
                            {selectedVeh.dimensiones_furgon_m && (
                                <div>
                                    <b>Dim:</b> {selectedVeh.dimensiones_furgon_m.largo}×{selectedVeh.dimensiones_furgon_m.ancho}×{selectedVeh.dimensiones_furgon_m.alto} m
                                </div>
                            )}
                            <div style={{ marginTop: 4 }}>
                                <b>Cerca:</b> {selectedVeh.fenceName || selectedVeh.fenceId || "—"}
                                {selectedVeh.fenceId ? ` ( #${cellById.get(selectedVeh.fenceId) ?? "?"} )` : ""}
                            </div>
                            <div style={{ marginTop: 4 }}>
                                <b>Obras:</b> {selectedVeh.route?.length || 0}
                            </div>
                        </div>
                    </div>
                </InfoWindowComp>
            )}
        </GoogleMap>
    );
}


function MapGeocercasConRutas({ apiKey, fences = [], obras = [], bbox = DEFAULT_BBOX }) {
    const { isLoaded } = useLoadScript({ googleMapsApiKey: apiKey, libraries });
    const center = useMemo(() => centerFromBox(bbox), [bbox]);
    const fencesPolys = useMemo(() => toPolygonPathAndStyle(fences), [fences]);

    const [selId, setSelId] = useState(null);
    const selObra = useMemo(() => obras.find(o => o.id === selId) || null, [obras, selId]);

    const polygonsRef = useRef([]);
    const mapRef = useRef(null);

    let PolygonFComp = null;
    let InfoWindowComp = null;
    try {
        const pkg = require("@react-google-maps/api");
        PolygonFComp = pkg.PolygonF || null;
        InfoWindowComp = pkg.InfoWindowF || pkg.InfoWindow || null;
    } catch (_) { }

    const drawNativePolys = (map) => {
        polygonsRef.current.forEach((p) => p.setMap(null));
        polygonsRef.current = [];
        fencesPolys.forEach((fp) => {
            const poly = new google.maps.Polygon({
                paths: fp.path,
                strokeColor: fp.style.strokeColor,
                strokeOpacity: fp.style.strokeOpacity,
                strokeWeight: fp.style.strokeWeight,
                fillColor: fp.style.fillColor,
                fillOpacity: fp.style.fillOpacity,
                clickable: false,
                map,
            });
            polygonsRef.current.push(poly);
        });
    };

    useEffect(() => {
        if (!isLoaded) return;
        if (PolygonFComp) return;
        if (mapRef.current) drawNativePolys(mapRef.current);
    }, [isLoaded, PolygonFComp, fencesPolys]);

    if (!isLoaded) return <div className="card">Cargando mapa…</div>;

    return (
        <GoogleMap
            options={mapOptions}
            zoom={12}
            center={center}
            mapTypeId={google.maps.MapTypeId.ROADMAP}
            mapContainerStyle={{ width: "100%", height: 460 }}
            onLoad={(map) => { mapRef.current = map; if (!PolygonFComp) drawNativePolys(map); }}
            onClick={() => setSelId(null)}
        >
            {/* Cercas de fondo */}
            {PolygonFComp && fencesPolys.map((fp) => (
                <PolygonFComp key={fp.id} path={fp.path} options={fp.style} />
            ))}

            {/* Marcadores de obras con coords */}
            {obras.map((o) => {
                const lat = o?.direccion?.coordenadas?.lat;
                const lng = o?.direccion?.coordenadas?.lng;
                if (typeof lat !== "number" || typeof lng !== "number") return null;

                return (
                    <MarkerF
                        key={o.id}
                        position={{ lat, lng }}
                        title={`${o.nombre} • ${o.fenceName || "Sin cerca"}`}
                        label={{
                            text: o.fenceId ? (o.fenceId.split("_").pop() || "") : "",
                            fontSize: "12px",
                        }}
                        onClick={() => setSelId(o.id)}
                    />
                );
            })}

            {/* Info de obra */}
            {InfoWindowComp && selObra && (
                <InfoWindowComp
                    position={{
                        lat: selObra.direccion.coordenadas.lat,
                        lng: selObra.direccion.coordenadas.lng
                    }}
                    onCloseClick={() => setSelId(null)}
                >
                    <div style={{ fontFamily: "system-ui, Arial", maxWidth: 260 }}>
                        <div style={{ fontWeight: 700, marginBottom: 4 }}>{selObra.nombre}</div>
                        <div style={{ fontSize: 12, lineHeight: 1.5 }}>
                            <div><b>Cerca:</b> {selObra.fenceName || "—"}</div>
                            <div><b>Coords:</b> {selObra.direccion.coordenadas.lat}, {selObra.direccion.coordenadas.lng}</div>
                        </div>
                    </div>
                </InfoWindowComp>
            )}
        </GoogleMap>
    );
}

const LS_IMPORTADAS_KEY = "obras_importadas_v1";

function syncImportadasToLS(obras) {
    try { localStorage.setItem(LS_IMPORTADAS_KEY, JSON.stringify(obras)); } catch { }
}

async function readExcelToRows(fileOrBlob) {
    const XLSX = (await import('xlsx')).default || (await import('xlsx'));
    const data = await fileOrBlob.arrayBuffer();
    const wb = XLSX.read(data, { type: 'array' });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
    return rows;
}

function pick(row, aliases, def = '') {
    const lower = {};
    Object.keys(row).forEach((k) => (lower[k.toLowerCase().trim()] = row[k]));
    for (const a of aliases) {
        const key = a.toLowerCase();
        if (lower[key] !== undefined && String(lower[key]).trim() !== '') {
            return String(lower[key]).trim();
        }
    }
    return def;
}

function rowToObraInput(row, index) {
    const nombreObra = pick(row, ['Referencia', 'nombre obra', 'nombre'], `Obra ${index + 1}`);
    const empresa = pick(row, ['Referencia', 'Dirección', 'compania', 'company'], '');
    const contactoNombre = pick(row, ['Dirección', 'contacto', 'nombre contacto'], '');
    const contactoCargo = pick(row, ['cargo'], '');
    const correo = pick(row, ['correo', 'correo electronico', 'email'], '');
    const tel = pick(row, ['telefono', 'teléfono', 'telefono principal'], '');
    const direccionTexto = pick(row, ['Dirección', 'dirección', 'address'], '');
    const ciudad = pick(row, ['Pais*'], 'Medellín');
    const nit = pick(row, ['documento', 'nit'], '');
    const id = pick(row, ['id', 'id obra'], `OBRA-${String(index + 1).padStart(4, '0')}`);

    return {
        id,
        nombre: nombreObra,
        empresa,
        contact: {
            obra: nombreObra,
            nombre: contactoNombre,
            cargo: contactoCargo,
            correoElectronico: correo,
            telefonoPrincipal: String(tel || ''),
        },
        direccion: {
            ciudad,
            otros: direccionTexto,
            coordenadas: { lat: null, lng: null },
        },
        legal: { documento: nit },
    };
}

function obraHasCoords(o) {
    const lat = o?.direccion?.coordenadas?.lat;
    const lng = o?.direccion?.coordenadas?.lng;
    return typeof lat === "number" && typeof lng === "number";
}

function assignObrasToFences(obras, fences) {
    const counts = new Map(fences.map(f => [f.id, 0]));
    const tagged = obras.map(o => {
        if (!obraHasCoords(o)) return { ...o, fenceId: null, fenceName: null };
        const { lat, lng } = o.direccion.coordenadas;
        const fence = fenceForPoint(lat, lng, fences);
        if (fence) {
            counts.set(fence.id, (counts.get(fence.id) || 0) + 1);
            return { ...o, fenceId: fence.id, fenceName: fence.name };
        }
        return { ...o, fenceId: null, fenceName: null };
    });

    const summary = fences.map(f => ({
        fenceId: f.id,
        fenceName: f.name,
        count: counts.get(f.id) || 0,
    }));

    const outOfAny = tagged.filter(o => !o.fenceId && obraHasCoords(o)).length;

    return { tagged, summary, outOfAny };
}

const hasCoords = (o) => typeof o?.direccion?.coordenadas?.lat === "number" && typeof o?.direccion?.coordenadas?.lng === "number";

const roundN = (x, n = 2) => Number(x.toFixed(n));

function simularCargaLaminas(obra) {
    // 1) objetivo de peso (20–300 kg)
    const pesoObjetivoKg = Math.round(rand(5, 100));

    // 2) dimensiones de la lámina (máx 4 x 2 m), granulares a 0.1 m
    const largo_m = roundN(rand(0.5, 1.0), 1);
    const ancho_m = roundN(rand(0.3, 0.5), 1);

    // 3) espesor típico (m)
    const espesores = [0.012, 0.015, 0.018, 0.021, 0.025];
    const espesor_m = espesores[Math.floor(Math.random() * espesores.length)];

    // 4) densidad madera (kg/m³)
    const densidad_kg_m3 = 600;

    // 5) métricas unitarias
    const area_m2 = roundN(largo_m * ancho_m, 2);
    const volumen_m3 = largo_m * ancho_m * espesor_m;
    const peso_unitario_kg = roundN(volumen_m3 * densidad_kg_m3, 1);

    // 6) cantidad según peso objetivo (mín 1)
    let cantidad = Math.max(1, Math.floor(pesoObjetivoKg / Math.max(0.1, peso_unitario_kg)));
    // si nos quedamos por debajo del 60% del objetivo, intenta sumar 1
    if (cantidad * peso_unitario_kg < 0.6 * pesoObjetivoKg) cantidad += 1;

    const peso_total_kg = roundN(cantidad * peso_unitario_kg, 1);
    const area_total_m2 = roundN(cantidad * area_m2, 2);

    // 7) adjunta en la obra sin romper su forma
    return {
        ...obra,
        cargaSim: {
            tipo: "laminas",
            peso_objetivo_kg: pesoObjetivoKg,
            item_unitario: {
                largo_m,
                ancho_m,
                espesor_m,
                densidad_kg_m3,
                area_m2,
                peso_unitario_kg,
            },
            cantidad,
            area_total_m2,
            peso_total_kg,
        },
    };
}

function fenceForPointSimple(lat, lng, fences = []) {
    for (const f of fences) {
        if (f?.bbox) {
            const { south, north, west, east } = f.bbox;
            if (lat >= south && lat <= north && lng >= west && lng <= east) return f;
        } else if (Array.isArray(f.vertices) && f.vertices.length) {
            const minLat = Math.min(...f.vertices.map(p => p.lat));
            const maxLat = Math.max(...f.vertices.map(p => p.lat));
            const minLng = Math.min(...f.vertices.map(p => p.lng));
            const maxLng = Math.max(...f.vertices.map(p => p.lng));
            if (lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng) return f;
        }
    }
    return null;
}

// Si ya tienes un fenceForPoint más preciso, usa ese en su lugar:
const fenceForPointSafe = (lat, lng, fences) => {
    try { return fenceForPoint(lat, lng, fences) || fenceForPointSimple(lat, lng, fences); }
    catch { return fenceForPointSimple(lat, lng, fences); }
};

function tagObrasToFences(obras = [], fences = []) {
    return obras.map((o) => {
        if (!hasCoords(o)) return { ...o, fenceId: null, fenceName: null };
        const { lat, lng } = o.direccion.coordenadas;
        const f = fenceForPointSafe(lat, lng, fences);
        return { ...o, fenceId: f?.id ?? null, fenceName: f?.name ?? null };
    });
}

function haversineMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
}

const getCoords = (o) => o?.direccion?.coordenadas || null;


function diffZonas(prevTagged = [], nextTagged = []) {
    const prevById = new Map(prevTagged.map(o => [o.id, { fenceId: o.fenceId ?? null, coords: getCoords(o) }]));
    const nextById = new Map(nextTagged.map(o => [o.id, { fenceId: o.fenceId ?? null, coords: getCoords(o), full: o }]));

    const added = [];
    const moved = [];
    const coordChanged = [];
    const removed = [];

    // added / moved / coordChanged
    nextById.forEach((cur, id) => {
        const prev = prevById.get(id);
        if (!prev) { added.push(cur.full); return; }
        if ((prev.fenceId || null) !== (cur.fenceId || null)) {
            moved.push({ obra: cur.full, before: prev.fenceId, after: cur.fenceId });
        }
        if (prev.coords && cur.coords) {
            const d = haversineMeters(prev.coords.lat, prev.coords.lng, cur.coords.lat, cur.coords.lng);
            if (d > 10) coordChanged.push({ obra: cur.full, delta_m: d });
        }
    });

    // removed
    prevById.forEach((_, id) => {
        if (!nextById.has(id)) {
            const fullPrev = prevTagged.find(o => o.id === id) || { id };
            removed.push(fullPrev);
        }
    });

    return { added, moved, removed, coordChanged };
}

function summarizeByFence(tagged = [], fences = []) {
    const base = new Map(fences.map(f => [f.id, { fenceId: f.id, fenceName: f.name, count: 0 }]));
    let outOfAny = 0;
    tagged.forEach(o => {
        if (!hasCoords(o)) return;
        if (o.fenceId && base.has(o.fenceId)) base.get(o.fenceId).count++;
        else outOfAny++;
    });
    return { summary: Array.from(base.values()), outOfAny };
}


function actualizarZonasObras({ obras = [], prevTagged = [], fences = [] }) {
    const nextTagged = tagObrasToFences(obras, fences);
    const changes = diffZonas(prevTagged, nextTagged);
    const { summary, outOfAny } = summarizeByFence(nextTagged, fences);
    return { tagged: nextTagged, changes, summary, outOfAny };
}

export {
    DEFAULT_BBOX,
    randomPointInFenceBBox,
    assignVehiclesToFences,
    centerFromBox,
    rand,
    choice,
    pad,
    buildLatBandFencesVertices,
    buildLonBandFencesVertices,
    buildGridFencesVertices,
    stripUltimoNumero,
    buildFencesByMode,
    _placesSingleton,
    ensurePlacesServices,
    toPolygonPathAndStyle,
    BRANDS,
    COLORS,
    DIM_OPTS,
    PAYLOAD_KG_RANGE,
    letters,
    randomPlate,
    buildFleet,
    rnd,
    libraries,
    mapOptions,
    isInFence,
    fenceForPoint,
    fenceCenterFromBBox,
    vehicleCaps,
    canFitCargoInVehicle,
    FenceLabels,
    assignObrasToFleetByGeofence,
    assignVehiclesToFencesCenter,
    MapGeofences,
    MapVehicles,
    MapGeocercasConRutas,
    LS_IMPORTADAS_KEY,
    syncImportadasToLS,
    readExcelToRows,
    pick,
    rowToObraInput,
    obraHasCoords,
    assignObrasToFences,
    hasCoords,
    roundN,
    simularCargaLaminas,
    actualizarZonasObras
}