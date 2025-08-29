
import Head from 'next/head';
import { Obra } from '@/utils/creadorRuta';
import { useEffect, useMemo, useState } from "react";
import InputCompAdress from '@/components/commons/inputAdress';
import VisorTipoObraLibre from '@/bioApp/componentes/visorTipoObraLibre';

import {
    centerFromBox,
    actualizarZonasObras,
    DEFAULT_BBOX,
    assignVehiclesToFences,
    stripUltimoNumero,
    buildFencesByMode,
    _placesSingleton,
    ensurePlacesServices,
    buildFleet,
    rnd,
    fenceForPoint,
    canFitCargoInVehicle,
    assignObrasToFleetByGeofence,
    assignVehiclesToFencesCenter,
    MapGeofences,
    MapVehicles,
    MapGeocercasConRutas,
    LS_IMPORTADAS_KEY,
    syncImportadasToLS,
    readExcelToRows,
    rowToObraInput,
    assignObrasToFences,
    hasCoords,
    simularCargaLaminas
} from './rutasUtiles.js';

const LS_FLEET_KEY = "bio_rutas_fleet_v1";

// Guarda solo lo necesario
const pickPersistFields = (v) => ({
    id: v.id,
    placa: v.placa,
    fenceId: v.fenceId ?? null,
    fenceName: v.fenceName ?? null,
    gps: v.gps ? { lat: v.gps.lat, lng: v.gps.lng } : null,
});

// Guardar en LS
const syncFleetToLS = (fleetArr) => {
    try {
        if (typeof window === "undefined") return;
        const minimal = (fleetArr || []).map(pickPersistFields);
        localStorage.setItem(LS_FLEET_KEY, JSON.stringify(minimal));
    } catch (e) {
        console.error("Error guardando flota en LS:", e);
    }
};

// Leer de LS y fusionar con la flota actual (match por id y fallback por placa)
const restoreFleetFromLS = (fleetArr) => {
    try {
        if (typeof window === "undefined") return fleetArr;
        const raw = localStorage.getItem(LS_FLEET_KEY);
        if (!raw) return fleetArr;
        const persisted = JSON.parse(raw);
        const byId = new Map(persisted.map((p) => [p.id, p]));
        return (fleetArr || []).map((v) => {
            const p = byId.get(v.id) || persisted.find((x) => x.placa === v.placa);
            if (!p) return v;
            return {
                ...v,
                fenceId: p.fenceId ?? v.fenceId,
                fenceName: p.fenceName ?? v.fenceName,
                gps: p.gps ?? v.gps,
            };
        });
    } catch (e) {
        console.error("Error rehidratando flota de LS:", e);
        return fleetArr;
    }
};

// (opcional) limpiar asignaciones persistidas
const clearFleetLS = () => {
    try {
        if (typeof window === "undefined") return;
        localStorage.removeItem(LS_FLEET_KEY);
    } catch { }
};
export default function Home() {

    const [listas, setListas] = useState([]);
    const [showed, setShowed] = useState([]);
    const [vehiculoss, setVehiculoss] = useState(10);
    const [importadas, setImportadas] = useState([]);
    const [busy, setBusy] = useState(false);
    const [vista, setVista] = useState('rutas');
    const [autoFillProg, setAutoFillProg] = useState({ running: false, done: 0, ok: 0, skipped: 0, errors: 0, last: null });
    const [listasZonificadas, setListasZonificadas] = useState([]);
    const [resumenCercas, setResumenCercas] = useState([]);
    const [fueraDeCerca, setFueraDeCerca] = useState(0);
    const [bbox, setBbox] = useState(DEFAULT_BBOX);
    const [geoMode, setGeoMode] = useState("grid");
    const [bands, setBands] = useState(10);
    const [rows, setRows] = useState(18);
    const [cols, setCols] = useState(4);
    const [fleetAsignada, setFleetAsignada] = useState([]);
    const [obrasSinCap, setObrasSinCap] = useState([]);
    const [resumenAsignacion, setResumenAsignacion] = useState([]);
    const [manualFenceVehId, setManualFenceVehId] = useState("");
    const [manualPlaceMode, setManualPlaceMode] = useState("center");
    const [leftoversByFenceObj, setLeftoversByFenceObj] = useState({});
    const [leftNoFence, setLeftNoFence] = useState([]);
    const [manualVisible, setManualVisible] = useState(false);
    const [selectedFenceId, setSelectedFenceId] = useState("");
    const [selectedVehicleId, setSelectedVehicleId] = useState("");
    const [selectedObrasIds, setSelectedObrasIds] = useState([]);
    const GOOGLE_MAPS_KEY = "AIzaSyBE0Y1gpJ-P0Fu_hPUEP-mBrlu7fQFBWsQ";
    const [fleet, setFleet] = useState(() => buildFleet(vehiculoss));
    const [inRuta, setInRuta] = useState(null);
    const [adressView, setAdressView] = useState({ state: false, centre: { ltn: 6.1576585, lgn: -75872710271 }, map: false });
    const [personalObj, setPersonalObj] = useState(null);
    const [filtroObras, setFiltroObras] = useState("todas");
    const [loadedFromLS, setLoadedFromLS] = useState(false);

    const fences = useMemo(
        () => buildFencesByMode({ bbox, mode: geoMode, bands, rows, cols }),
        [bbox, geoMode, bands, rows, cols]
    );

    const [zonificacion, setZonificacion] = useState({ tagged: [], summary: [], outOfAny: 0 });

    const [zonasCambios, setZonasCambios] = useState({ added: [], moved: [], removed: [], coordChanged: [] });

    const [manualFenceId, setManualFenceId] = useState(fences?.[0]?.id || "");


    const obrasFuente = useMemo(() => listas, [listas]);


    const agregarTodasConSimulacion = () => {
        const conCoords = importadas.filter(hasCoords);

        setListas((prev) => {
            const ids = new Set(prev.map((p) => p.id));
            const nuevas = conCoords
                .filter((o) => !ids.has(o.id))
                .map((o) => simularCargaLaminas(o));

            return [...prev, ...nuevas];
        });
    };

    const reLocalizarDireccion = async (obra) => {
        // precalienta Google Places
        ensurePlacesServices(GOOGLE_MAPS_KEY).catch(() => { });
        const otros = draftDirecciones[obra.id] ?? (obra?.direccion?.otros ?? "");
        const obraConDireccion = { ...obra, direccion: { ...(obra.direccion || {}), otros } };
        setPersonalObj(obraConDireccion);
        setInRuta(obra.id); // usa ID, no índice
    };



    const norm = (t) => t.replace(/\s+/g, " ").trim();

    const getLeftoversArr = (fid) => leftoversByFenceObj[fid] || [];

    const setLeftoversArr = (fid, arr) =>
        setLeftoversByFenceObj(prev => ({ ...prev, [fid]: arr }));

    const asignarCargasAVehiculos = () => {
        const res1 = assignObrasToFleetByGeofence(zonificacion.tagged, fleet, fences);
        setFleetAsignada(res1.fleetAssigned);
        setObrasSinCap(res1.obrasSinCap);
        setResumenAsignacion(res1.resumen);
        const leftoversMap =
            res1 && res1.leftoversByFence
                ? (res1.leftoversByFence instanceof Map
                    ? res1.leftoversByFence
                    : new Map(Object.entries(res1.leftoversByFence || {})))
                : new Map();

        const obj = Object.fromEntries(leftoversMap);
        setLeftoversByFenceObj(obj);
        setLeftNoFence(Array.isArray(res1?.leftNoFence) ? res1.leftNoFence : []);
        setManualVisible(true);
        const fenceWithLeft = Object.keys(obj).find(fid => (obj[fid] || []).length > 0) || "";
        setSelectedFenceId(fenceWithLeft);
        const vehVacio = res1.fleetAssigned.find(v => (v.route?.length || 0) === 0);
        setSelectedVehicleId(vehVacio?.id || "");
        setSelectedObrasIds([]);
    };

    const reseedPositions = () => setFleet(prev => assignVehiclesToFences(prev, fences));

    const manualFillVehicleFromFence = (fid, vid) => {
        if (!fid || !vid) return;

        setFleetAsignada(prevFleet => {
            const fleetCopy = prevFleet.map(v => ({
                ...v,
                route: [...(v.route || [])],
                route_metrics: { ...(v.route_metrics || {}) }
            }));

            const vIdx = fleetCopy.findIndex(v => v.id === vid);
            if (vIdx === -1) return prevFleet;
            const v = fleetCopy[vIdx];
            if (typeof v.rem_kg !== "number")
                v.rem_kg = Math.max(0, (v.caps?.weight_kg ?? 0) - (v.route_metrics?.used_kg ?? 0));
            if (typeof v.rem_area_m2 !== "number")
                v.rem_area_m2 = Math.max(0, (v.caps?.deckArea_m2 ?? 0) - (v.route_metrics?.used_area_m2 ?? 0));

            let arr = getLeftoversArr(fid).slice();
            let moved = 0;

            for (let i = 0; i < arr.length;) {
                const o = arr[i];
                const sim = o?.cargaSim;
                if (!sim) { arr.splice(i, 1); continue; }

                const fit = canFitCargoInVehicle(sim, v);
                if (!fit.ok) { i++; continue; }
                v.rem_kg -= sim.peso_total_kg;
                v.rem_area_m2 -= fit.footprint_m2;
                v.route.push({
                    obraId: o.id,
                    nombre: o.nombre,
                    peso_kg: rnd(sim.peso_total_kg, 1),
                    area_m2: rnd(sim.area_total_m2, 2),
                    footprint_m2: rnd(fit.footprint_m2, 2),
                    altura_m: rnd(fit.neededHeight_m, 3),
                    coords: o.direccion?.coordenadas || null,
                    crossFence: fid !== v.fenceId,
                    sourceFenceId: o.fenceId,
                });
                v.route_metrics.used_kg = rnd((v.route_metrics.used_kg || 0) + sim.peso_total_kg, 1);
                v.route_metrics.used_area_m2 = rnd((v.route_metrics.used_area_m2 || 0) + fit.footprint_m2, 2);
                v.route_metrics.max_stack_m = Math.max(v.route_metrics.max_stack_m || 0, fit.neededHeight_m);
                arr.splice(i, 1);
                moved++;
            }
            setLeftoversArr(fid, arr);
            fleetCopy[vIdx] = {
                ...v,
                carga_utilizada_kg: rnd(v.route_metrics.used_kg || 0, 1),
                deck_usado_m2: rnd(v.route_metrics.used_area_m2 || 0, 2),
            };

            return fleetCopy;
        });
    };

    const manualAssignSelectedToVehicle = (fid, vid) => {
        if (!fid || !vid || selectedObrasIds.length === 0) return;

        setFleetAsignada(prevFleet => {
            const fleetCopy = prevFleet.map(v => ({
                ...v,
                route: [...(v.route || [])],
                route_metrics: { ...(v.route_metrics || {}) }
            }));

            const vIdx = fleetCopy.findIndex(v => v.id === vid);
            if (vIdx === -1) return prevFleet;
            const v = fleetCopy[vIdx];
            if (typeof v.rem_kg !== "number")
                v.rem_kg = Math.max(0, (v.caps?.weight_kg ?? 0) - (v.route_metrics?.used_kg ?? 0));
            if (typeof v.rem_area_m2 !== "number")
                v.rem_area_m2 = Math.max(0, (v.caps?.deckArea_m2 ?? 0) - (v.route_metrics?.used_area_m2 ?? 0));

            let arr = getLeftoversArr(fid).slice();
            const ids = new Set(selectedObrasIds);

            for (let i = 0; i < arr.length;) {
                const o = arr[i];
                if (!ids.has(o.id)) { i++; continue; }

                const sim = o?.cargaSim;
                if (!sim) { arr.splice(i, 1); ids.delete(o.id); continue; }

                const fit = canFitCargoInVehicle(sim, v);
                if (!fit.ok) { i++; continue; }
                v.rem_kg -= sim.peso_total_kg;
                v.rem_area_m2 -= fit.footprint_m2;
                v.route.push({
                    obraId: o.id,
                    nombre: o.nombre,
                    peso_kg: rnd(sim.peso_total_kg, 1),
                    area_m2: rnd(sim.area_total_m2, 2),
                    footprint_m2: rnd(fit.footprint_m2, 2),
                    altura_m: rnd(fit.neededHeight_m, 3),
                    coords: o.direccion?.coordenadas || null,
                    crossFence: fid !== v.fenceId,
                    sourceFenceId: o.fenceId,
                });
                v.route_metrics.used_kg = rnd((v.route_metrics.used_kg || 0) + sim.peso_total_kg, 1);
                v.route_metrics.used_area_m2 = rnd((v.route_metrics.used_area_m2 || 0) + fit.footprint_m2, 2);
                v.route_metrics.max_stack_m = Math.max(v.route_metrics.max_stack_m || 0, fit.neededHeight_m);
                arr.splice(i, 1);
                ids.delete(o.id);
            }

            setLeftoversArr(fid, arr);
            setSelectedObrasIds(Array.from(ids));

            fleetCopy[vIdx] = {
                ...v,
                carga_utilizada_kg: rnd(v.route_metrics.used_kg || 0, 1),
                deck_usado_m2: rnd(v.route_metrics.used_area_m2 || 0, 2),
            };

            return fleetCopy;
        });
    };
    const [showNewObra, setShowNewObra] = useState(false);
    const [newObra, setNewObra] = useState({
        nombre: "",
        empresa: "",
        ciudad: "Medellín",
        otros: "",
        contactNombre: "",
        contactEmail: "",
        lat: "",
        lng: "",
    });
    const [newObraError, setNewObraError] = useState("");

    const genObraId = () =>
        `OBR-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e4).toString(36)}`;

    const handleCrearObraNueva = (e) => {
        e?.preventDefault?.();
        setNewObraError("");

        const id = genObraId();

        // Validaciones mínimas
        if (!newObra.nombre.trim() && !newObra.otros.trim()) {
            setNewObraError("Ingresa al menos Nombre o Dirección (otros).");
            return;
        }

        // Coords opcionales
        const latVal = newObra.lat !== "" ? Number(newObra.lat) : null;
        const lngVal = newObra.lng !== "" ? Number(newObra.lng) : null;
        const coordsOk = typeof latVal === "number" && !Number.isNaN(latVal)
            && typeof lngVal === "number" && !Number.isNaN(lngVal);

        const creada = new Obra({
            id,
            nombre: newObra.nombre.trim() || `Obra ${id}`,
            empresa: newObra.empresa.trim(),
            contact: {
                nombre: newObra.contactNombre.trim(),
                correoElectronico: newObra.contactEmail.trim(),
                ...(coordsOk ? { direccion: { coordenadas: { lat: latVal, lng: lngVal } } } : {}),
            },
            direccion: {
                ciudad: (newObra.ciudad || "Medellín").trim(),
                otros: newObra.otros.trim(),
                coordenadas: coordsOk ? { lat: latVal, lng: lngVal } : { lat: null, lng: null },
            },
            legal: {},
        });

        setImportadas((prev) => {
            const next = [...prev, creada];
            // persistimos en LS
            try { syncImportadasToLS(next); } catch { }
            return next;
        });

        // opcional: precargar el draft de dirección para edición rápida
        setDraftDirecciones((prev) => ({ ...prev, [id]: newObra.otros.trim() }));

        // limpiar formulario
        setNewObra({
            nombre: "",
            empresa: "",
            ciudad: "Medellín",
            otros: "",
            contactNombre: "",
            contactEmail: "",
            lat: "",
            lng: "",
        });
        setShowNewObra(false);
    };
    const emptyVehicles = useMemo(
        () => fleetAsignada.filter(v => (v.route?.length || 0) === 0),
        [fleetAsignada]
    );

    const vehiclesConCapacidad = useMemo(
        () => fleetAsignada.filter(v => (v.rem_kg > 0 && v.rem_area_m2 > 0)),
        [fleetAsignada]
    );

    const fencesConSobrantes = useMemo(
        () => Object.entries(leftoversByFenceObj)
            .filter(([, arr]) => (arr || []).length > 0)
            .map(([fid]) => fid),
        [leftoversByFenceObj]
    );

    const sobrantesSeleccionados = useMemo(
        () => getLeftoversArr(selectedFenceId),
        [leftoversByFenceObj, selectedFenceId]
    );

    const obrasPendientes = useMemo(() => {
        const deCercas = Object.values(leftoversByFenceObj)
            .flatMap((arr) => Array.isArray(arr) ? arr : []);
        return [...deCercas, ...leftNoFence];
    }, [leftoversByFenceObj, leftNoFence]);

    const pendientesCount = obrasPendientes.length;   // === estado “Vehículos” — usa las cercas actuales

    const allObrasIndex = useMemo(() => {
        const idx = new Map();
        const push = (o) => { if (o?.id && !idx.has(o.id)) idx.set(o.id, o); };
        (zonificacion?.tagged || []).forEach(push);
        (listas || []).forEach(push);
        (importadas || []).forEach(push);
        (showed || []).forEach(push);
        return idx;
    }, [zonificacion?.tagged, listas, importadas, showed]);


    const generarRutaParaVehiculo = (veh) => {
        if (!veh?.route?.length) return;
        const obras = veh.route.map(r => {
            const base = allObrasIndex.get(r.obraId);
            if (base) return base;
            return new Obra({
                id: r.obraId,
                nombre: r.nombre,
                empresa: "",
                contact: {},
                direccion: {
                    ciudad: "Medellín",
                    otros: "",
                    coordenadas: r.coords || null,
                },
                legal: {},
            });
        });
        setShowed(obras);
        setVista("rutas")
    };
    useEffect(() => {
        setFleet(prev => assignVehiclesToFencesCenter(prev, fences));
    }, [fences]);
    useEffect(() => {
        setFleet((prev) => restoreFleetFromLS(prev));
    }, []);
    const agregarObraARutaHoy = (obra) => {
        setListas((prev) => {
            const exists = prev.some(o => o.id === obra.id);
            if (exists) return prev;
            return [...prev, obra];
        });
    };
    useEffect(() => {
        const arr = (fleetAsignada && fleetAsignada.length) ? fleetAsignada : fleet;
        syncFleetToLS(arr);
    }, [fleet, fleetAsignada]);

    const handleCreateAll = (value) => {
        const coords = value?.centre;
        if (!coords || typeof coords.lat !== 'number' || typeof coords.lng !== 'number') return;
        if (inRuta === null || personalObj == null) return; // inRuta es ID

        setImportadas((prev) => {
            const idx = prev.findIndex(o => o.id === inRuta); // 👈 localiza por ID
            if (idx === -1) return prev;

            const ob = prev[idx];
            const otros = draftDirecciones[ob.id] ?? (ob?.direccion?.otros ?? "");

            const actualizada = new Obra({
                id: ob.id,
                nombre: ob.nombre,
                empresa: ob.empresa,
                contact: {
                    nombre: ob.contact?.nombre || "",
                    correoElectronico: ob.contact?.correoElectronico || "",
                    direccion: { coordenadas: { lat: coords.lat, lng: coords.lng } },
                },
                direccion: {
                    ciudad: ob.direccion?.ciudad || "Medellín",
                    otros, // 👈 guardamos lo tecleado
                    coordenadas: { lat: coords.lat, lng: coords.lng },
                },
                legal: ob.legal,
                idUser: ob.idUser || `USR-${ob.id}`,
            });

            const next = [...prev];
            next[idx] = actualizada; // 👈 reemplaza in-place

            // limpiar edición
            setInRuta(null);
            setPersonalObj(null);
            setAdressView({ state: false, centre: { ltn: 6.1576585, lgn: -75872710271 }, map: false });

            return next;
        });
    };

    const todasConCoordsImportadas = useMemo(
        () => importadas.length > 0 && importadas.every((o) => o?.direccion?.coordenadas?.lat && o?.direccion?.coordenadas?.lng),
        [importadas]
    );

    const [draftDirecciones, setDraftDirecciones] = useState({});
    const limpiarImportacion = () => {
        setImportadas([]);
        try { localStorage.removeItem(LS_IMPORTADAS_KEY); } catch { }
    };

    useEffect(() => {
        if (typeof window === "undefined") return;
        try {
            const raw = localStorage.getItem(LS_IMPORTADAS_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                setImportadas(Array.isArray(parsed) ? parsed.map(p => new Obra(p)) : []);
            }
        } catch (e) {
            console.error("Error leyendo LS:", e);
        } finally {
            setLoadedFromLS(true);
        }
    }, []);


    useEffect(() => {
        if (!loadedFromLS) return;
        try {
            localStorage.setItem(LS_IMPORTADAS_KEY, JSON.stringify(importadas));
        } catch (e) {
            console.error("Error guardando en LS:", e);
        }
    }, [importadas, loadedFromLS]);


    const handleExcel = async (file) => {
        setBusy(true);
        try {
            const rows = await readExcelToRows(file);
            const obras = rows.map((r, i) => {
                const base = rowToObraInput(r, i);
                return new Obra({
                    id: base.id,
                    nombre: base.nombre,
                    empresa: base.empresa,
                    contact: base.contact,
                    direccion: {
                        ciudad: base.direccion.ciudad,
                        otros: base.direccion.otros,
                        coordenadas: { lat: null, lng: null },
                    },
                    legal: base.legal,
                });
            });
            setImportadas(obras);
        } catch (e) {
            console.error('Error leyendo Excel:', e);
            alert('No se pudo leer el Excel. Ver consola.');
        } finally {
            setBusy(false);
        }
    };
    const [placesReady, setPlacesReady] = useState(false);
    useEffect(() => {
        ensurePlacesServices(GOOGLE_MAPS_KEY).then(() => setPlacesReady(true)).catch(() => setPlacesReady(false));
    }, []);


    const autoFillObras = async () => {
        const completadas = [];
        try {
            setAutoFillProg({ running: true, done: 0, ok: 0, skipped: 0, errors: 0 });

            const { autoSvc, placeSvc } = await ensurePlacesServices(GOOGLE_MAPS_KEY);

            const bounds = new google.maps.LatLngBounds(
                new google.maps.LatLng(bbox.latMin, bbox.lonMin),
                new google.maps.LatLng(bbox.latMax, bbox.lonMax)
            );

            const getPredictions = (input) =>
                new Promise((resolve) => {
                    autoSvc.getPlacePredictions(
                        { input, bounds, componentRestrictions: { country: "co" } },
                        (preds, status) => {
                            if (status !== google.maps.places.PlacesServiceStatus.OK || !preds) return resolve([]);
                            resolve(preds);
                        }
                    );
                });

            const getDetails = (placeId) =>
                new Promise((resolve, reject) => {
                    placeSvc.getDetails(
                        { placeId, fields: ["geometry.location", "name", "formatted_address"] },
                        (place, status) => {
                            if (status !== google.maps.places.PlacesServiceStatus.OK || !place?.geometry?.location) {
                                return reject(status || "NO_GEOMETRY");
                            }
                            resolve(place);
                        }
                    );
                });

            function haversineMeters(lat1, lng1, lat2, lng2) {
                const toRad = (d) => (d * Math.PI) / 180;
                const R = 6371000; // m
                const dLat = toRad(lat2 - lat1);
                const dLng = toRad(lng2 - lng1);
                const s1 = Math.sin(dLat / 2), s2 = Math.sin(dLng / 2);
                const a = s1 * s1 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * s2 * s2;
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                return R * c;
            }
            const next = [...importadas];
            const DUP_TOLERANCE_M = 100;

            for (let i = 0; i < next.length; i++) {
                const ob = next[i];

                if (ob?.direccion?.coordenadas?.lat && ob?.direccion?.coordenadas?.lng) {
                    setAutoFillProg((s) => ({ ...s, done: s.done + 1, skipped: s.skipped + 1 }));
                    continue;
                }

                const nombre = ob?.nombre || "";
                const otros = ob?.direccion?.otros || "";
                const ciudad = ob?.direccion?.ciudad || "Medellín";
                const otrosSinNum = stripUltimoNumero(otros);
                const variantes = [
                    norm(`${otros}`),
                    norm(`${ciudad} ${otros}`),
                    norm(`${ciudad} ${otrosSinNum}`),
                    norm(`${nombre} ${otros} ${ciudad} Colombia`),
                ].filter(Boolean);
                let place = null;

                for (const q of variantes) {
                    const preds = await getPredictions(q);
                    if (preds.length === 1) {
                        try {
                            place = await getDetails(preds[0].place_id);
                            break;
                        } catch { /* intenta siguiente variante */ }
                    }

                    if (preds.length === 2) {
                        try {
                            const [p1, p2] = preds;
                            const [d1, d2] = await Promise.all([
                                getDetails(p1.place_id).catch(() => null),
                                getDetails(p2.place_id).catch(() => null),
                            ]);
                            if (d1?.geometry?.location && d2?.geometry?.location) {
                                const lat1 = d1.geometry.location.lat();
                                const lng1 = d1.geometry.location.lng();
                                const lat2 = d2.geometry.location.lat();
                                const lng2 = d2.geometry.location.lng();
                                const dist = haversineMeters(lat1, lng1, lat2, lng2);

                                if (dist <= DUP_TOLERANCE_M) {
                                    place = d1;
                                    break;
                                }
                            }
                        } catch { /* intenta siguiente variante */ }
                    }
                }

                if (!place) {
                    setAutoFillProg((s) => ({ ...s, done: s.done + 1, skipped: s.skipped + 1 }));
                    continue;
                }

                const loc = place.geometry.location;
                const lat = Number(loc.lat().toFixed(6));
                const lng = Number(loc.lng().toFixed(6));
                const fence = fenceForPoint(lat, lng, fences);
                if (!fence) {
                    setAutoFillProg((s) => ({ ...s, done: s.done + 1, skipped: s.skipped + 1 }));
                    continue;
                }

                const actualizada = new Obra({
                    ...ob,
                    contact: { ...(ob.contact || {}), direccion: { coordenadas: { lat, lng } } },
                    direccion: { ...(ob.direccion || {}), coordenadas: { lat, lng } },
                });
                next[i] = actualizada;

                completadas.push({ id: ob.id, nombre: ob.nombre, lat, lng, fenceId: fence.id, fenceName: fence.name });
                setAutoFillProg((s) => ({ ...s, done: s.done + 1, ok: s.ok + 1 }));
            }

            setImportadas(next);

            return completadas;
        } finally {
            setAutoFillProg((s) => ({ ...s, running: false }));
        }
    };

    const fenceById = (fid) => fences.find(f => f.id === fid);

    const fenceCenterBBox = (f) => ({
        lat: (f.bbox.south + f.bbox.north) / 2,
        lng: (f.bbox.west + f.bbox.east) / 2,
    });

    const fenceCenterVertices = (f) => {
        const vs = f?.vertices || [];
        if (!vs.length) return null;
        const lat = vs.reduce((s, p) => s + p.lat, 0) / vs.length;
        const lng = vs.reduce((s, p) => s + p.lng, 0) / vs.length;
        return { lat, lng };
    };

    const fenceCenterSafe = (f, fallback) => {
        if (!f) return fallback || null;
        if (f.bbox) return fenceCenterBBox(f);
        const vC = fenceCenterVertices(f);
        return vC || fallback || null;
    };

    // centro del bbox global (por si falta fence o no tiene bbox/vertices)
    const globalCenter = centerFromBox(bbox);

    // Centra cada vehículo en su cerca (y corrige fenceName). Si no tiene fence, lo deja igual.
    const centerVehiclesOnFences = (arr, fences) => {
        const byId = new Map(fences.map(f => [f.id, f]));
        return (arr || []).map(v => {
            const f = byId.get(v.fenceId);
            const c = fenceCenterSafe(f, globalCenter);
            if (!c) return v;
            return {
                ...v,
                fenceName: f?.name ?? v.fenceName ?? null,
                gps: { lat: Number(c.lat.toFixed(6)), lng: Number(c.lng.toFixed(6)) },
            };
        });
    };

    // Si ya usabas este nombre:
    const assignVehiclesToFencesCenter = (vehicles, fences) =>
        centerVehiclesOnFences(vehicles, fences);

    const fenceRandomPoint = (f) => ({
        lat: f.bbox.south + Math.random() * (f.bbox.north - f.bbox.south),
        lng: f.bbox.west + Math.random() * (f.bbox.east - f.bbox.west),
    });
    const recenterFleetNow = () => {
        setFleet(prev => {
            const centered = assignVehiclesToFencesCenter(prev, fences);
            syncFleetToLS(centered);
            return centered;
        });
    };
    const assignFenceToVehicle = (vehId, fenceId, mode = "center") => {
        const f = fences.find((ff) => ff.id === fenceId);
        if (!vehId || !f) return;

        const place =
            mode === "random"
                ? {
                    lat: f.bbox.south + Math.random() * (f.bbox.north - f.bbox.south),
                    lng: f.bbox.west + Math.random() * (f.bbox.east - f.bbox.west),
                }
                : {
                    lat: (f.bbox.south + f.bbox.north) / 2,
                    lng: (f.bbox.west + f.bbox.east) / 2,
                };

        const patch = (v) =>
            v.id !== vehId
                ? v
                : {
                    ...v,
                    fenceId: f.id,
                    fenceName: f.name,
                    gps: { lat: Number(place.lat.toFixed(6)), lng: Number(place.lng.toFixed(6)) },
                };

        if (fleetAsignada.length > 0) {
            setFleetAsignada((prev) => {
                const next = prev.map(patch);
                syncFleetToLS(next); // 👈 persistimos
                return next;
            });
        } else {
            setFleet((prev) => {
                const next = prev.map(patch);
                syncFleetToLS(next); // 👈 persistimos
                return next;
            });
        }
    };


    const aggPorCerca = useMemo(() => {
        const base = new Map(fences.map(f => [f.id, { peso: 0, cantidad: 0, area: 0, dim: null, dimMixed: false }]));
        (zonificacion?.tagged || []).forEach((o) => {
            if (!o?.fenceId || !o?.cargaSim) return;
            const a = base.get(o.fenceId) || { peso: 0, cantidad: 0, area: 0, dim: null, dimMixed: false };
            a.peso += o.cargaSim?.peso_total_kg || 0;
            a.cantidad += o.cargaSim?.cantidad || 0;
            a.area += o.cargaSim?.area_total_m2 || 0;

            const u = o.cargaSim?.item_unitario;
            const dimStr = u ? `${u.largo_m}×${u.ancho_m}×${u.espesor_m}` : null;
            if (dimStr) {
                if (a.dim == null) a.dim = dimStr;
                else if (a.dim !== dimStr) a.dimMixed = true; // hay mezcla de tamaños
            }
            base.set(o.fenceId, a);
        });
        return base;
    }, [zonificacion?.tagged, fences]);

    useEffect(() => {
        const { tagged, summary, outOfAny } = assignObrasToFences(listas, fences);
        setListasZonificadas(tagged);
        setResumenCercas(summary);
        setFueraDeCerca(outOfAny);
    }, [listas, fences]);


    useEffect(() => {
        const res = actualizarZonasObras({
            obras: obrasFuente,            // nuevas obras “fuente de verdad”
            prevTagged: zonificacion.tagged, // para comparar contra lo anterior
            fences,
        });
        setZonificacion({ tagged: res.tagged, summary: res.summary, outOfAny: res.outOfAny });
        setZonasCambios(res.changes); // { added, moved, removed, coordChanged }
    }, [obrasFuente, fences]);
    return (
        <>
            <Head>
                <title>Rutas Libre</title>
                <meta name="description" content="Rutas con carga desde Excel y confirmación de dirección" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <style>{`
            :root { --bg:#0b1020; --ink:#111827; --muted:#6b7280; --primary:#2563eb; --border:#e5e7eb; }
            body { background:#f8fafc; }
            .div-main { padding: 16px; overflow : hidden; max-width:95svw; margin: 0 auto; font-family: system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif; }
            .tabs { display:flex; gap:8px; margin-bottom: 16px; flex-wrap: wrap; }
            .tabbtn { padding:8px 12px; border:1px solid var(--border); border-radius:10px; background:#fff; cursor:pointer; }
            .tabbtn.active { background:#111827; color:#fff; border-color:#111827; }
            .card { background:#fff; border:1px solid var(--border); border-radius:12px; padding:12px; box-shadow:0 1px 2px rgba(0,0,0,.04); }
            .grid { display:grid; gap:12px; }
            .flex { display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
            .pointer { cursor:pointer; }
            .table { width:100%; border-collapse: collapse; }
            .table th, .table td { border:1px solid var(--border); padding:8px; text-align:left; vertical-align:top; font-size:13px; }
            .table th { background:#f9fafb; font-weight:600; }
            input[type="number"] { padding:8px; border:1px solid var(--border); border-radius:8px; }
            .muted { font-size:12px; color:#6b7280; }
          `}</style>

            <main className="div-main">
                <div className="tabs">
                    <button className={`tabbtn ${vista === "rutas" ? "active" : ""}`} onClick={() => setVista("rutas")}>Rutas</button>
                    <button className={`tabbtn ${vista === "geocercas" ? "active" : ""}`} onClick={() => setVista("geocercas")}>Geocercas</button>
                    <button className={`tabbtn ${vista === "vehiculos" ? "active" : ""}`} onClick={() => setVista("vehiculos")}>Vehículos</button>
                    <button className={`tabbtn ${vista === "geocercasconrutas" ? "active" : ""}`} onClick={() => setVista("geocercasconrutas")}>geocercasconrutas</button>
                </div>

                {vista === "rutas" && (<div className="flex-column-entregas transparent" style={{ gap: 16 }}>
                    {showed.length === 0 && <>
                        <section style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>
                            <h2>Agregar ruta</h2>
                            <div style={{ margin: "12px 0", display: "flex", gap: 8 }}>
                                <button
                                    className={filtroObras === "todas" ? "tabbtn active" : "tabbtn"}
                                    onClick={() => setFiltroObras("todas")}
                                >
                                    Todas
                                </button>
                                <button
                                    className={filtroObras === "con" ? "tabbtn active" : "tabbtn"}
                                    onClick={() => setFiltroObras("con")}
                                >
                                    Solo con coordenadas
                                </button>
                                <button
                                    className={filtroObras === "sin" ? "tabbtn active" : "tabbtn"}
                                    onClick={() => setFiltroObras("sin")}
                                >
                                    Solo sin coordenadas
                                </button>
                            </div>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                                <label style={{ display: 'inline-block' }}>
                                    <input
                                        type="file"
                                        accept=".xlsx,.xls"
                                        onChange={(e) => e.target.files?.[0] && handleExcel(e.target.files[0])}
                                        style={{ display: 'none' }}
                                    />
                                    <span className="pointer" style={{ padding: '8px 12px', border: '1px solid #aaa', borderRadius: 6, display: 'inline-block' }}>
                                        Desde Excel
                                    </span>
                                </label>
                                {importadas.some(o => o?.direccion?.coordenadas?.lat && o?.direccion?.coordenadas?.lng) && (
                                    <button className="tabbtn" onClick={agregarTodasConSimulacion}>
                                        Agregar todas (con coordenadas) a ruta de hoy
                                    </button>
                                )}
                                <div className="flex" style={{ gap: 8, alignItems: "center", marginTop: 8 }}>
                                    <button className="tabbtn" onClick={autoFillObras} disabled={!placesReady || busy || importadas.length === 0}>
                                        Autollenar direcciones
                                    </button>
                                    {autoFillProg.running
                                        ? <span className="muted">Autollenando… {autoFillProg.done}/{importadas.length}</span>
                                        : (autoFillProg.done > 0 && (
                                            <span className="muted">
                                                Listas: {autoFillProg.ok} · Omitidas: {autoFillProg.skipped} · Errores: {autoFillProg.errors}
                                            </span>
                                        ))
                                    }
                                </div>
                                <button
                                    disabled={importadas.length === 0}
                                    onClick={() => { setImportadas([]); syncImportadasToLS([]); }} // 👈 limpia LS
                                    style={{ padding: '8px 12px', borderRadius: 6 }}
                                >
                                    Limpiar importación
                                </button>

                                <button
                                    disabled={listas.length === 0}
                                    onClick={() => setShowed(listas)}
                                    style={{ padding: '8px 12px', borderRadius: 6, background: '#0b5', color: '#fff', border: 0 }}
                                    title="Pasa las obras listas al visor"
                                >
                                    Usar obras listas
                                </button>
                            </div>

                            {busy && <p>Procesando Excel…</p>}

                            {importadas.length > 0 && (
                                <>
                                    <h3 style={{ marginTop: 16 }}>Obras  — {importadas.filter((obra) => {
                                        const hasCoords = !!(obra?.direccion?.coordenadas?.lat && obra?.direccion?.coordenadas?.lng);
                                        if (filtroObras === "con") return hasCoords;
                                        if (filtroObras === "sin") return !hasCoords;
                                        return true; // "todas"
                                    }).length}</h3>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
                                        {importadas.filter((obra) => {
                                            const hasCoords = !!(obra?.direccion?.coordenadas?.lat && obra?.direccion?.coordenadas?.lng);
                                            if (filtroObras === "con") return hasCoords;
                                            if (filtroObras === "sin") return !hasCoords;
                                            return true; // "todas"
                                        }).map((obra, idx) => {
                                            const hasCoords = !!(obra?.direccion?.coordenadas?.lat && obra?.direccion?.coordenadas?.lng);
                                            return (
                                                <li
                                                    key={obra.id}
                                                    style={{
                                                        display: inRuta ? (inRuta !== obra.id ? 'none' : 'block') : 'block',
                                                        border: '1px solid #eee',
                                                        borderRadius: 8,
                                                        padding: 12,
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                                                        <div>
                                                            <strong>{obra.nombre}</strong>
                                                            <div style={{ fontSize: 12, opacity: 0.8 }}>
                                                                {obra?.direccion?.ciudad || '—'} • {obra?.direccion?.otros || 'Sin dirección'}
                                                            </div>
                                                            <div style={{ fontSize: 12, marginTop: 4 }}>
                                                                {hasCoords ? (
                                                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6, flexWrap: 'wrap' }}>
                                                                        <span>✅ lat: {obra.direccion.coordenadas.lat}, lng: {obra.direccion.coordenadas.lng}</span>
                                                                        <button
                                                                            className="tabbtn"
                                                                            onClick={() => agregarObraARutaHoy(obra)}
                                                                            title="Agregar esta obra a la ruta de hoy"
                                                                        >
                                                                            Agregar a ruta de hoy
                                                                        </button>
                                                                        <button
                                                                            className="tabbtn"
                                                                            onClick={() => reLocalizarDireccion(obra)}
                                                                            title="Volver a elegir la ubicación en el mapa / Places"
                                                                            style={{ background: '#eef', borderColor: '#99f' }}
                                                                        >
                                                                            Re-localizar dirección
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6, flexWrap: 'wrap' }}>
                                                                        <input
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === 'Enter') {
                                                                                    const otros = draftDirecciones[obra.id] ?? (obra?.direccion?.otros ?? "");
                                                                                    const obraConDireccion = {
                                                                                        ...obra,
                                                                                        direccion: { ...(obra.direccion || {}), otros },
                                                                                    };
                                                                                    setPersonalObj(obraConDireccion);
                                                                                    setInRuta(obra.id);
                                                                                }
                                                                            }}
                                                                            type="text"
                                                                            placeholder="Barrio / dirección"
                                                                            value={draftDirecciones[obra.id] ?? (obra?.direccion?.otros ?? "")}
                                                                            onChange={(e) =>
                                                                                setDraftDirecciones(prev => ({ ...prev, [obra.id]: e.target.value }))
                                                                            }
                                                                            style={{ padding: '6px 10px', border: '1px solid #ddd', borderRadius: 6, minWidth: 260 }}
                                                                        />

                                                                        <button
                                                                            className="tabbtn"
                                                                            onClick={async () => {
                                                                                // precalienta Places (evita la espera luego)
                                                                                ensurePlacesServices(GOOGLE_MAPS_KEY).catch(() => { });
                                                                                const otros = draftDirecciones[obra.id] ?? (obra?.direccion?.otros ?? "");
                                                                                const obraConDireccion = { ...obra, direccion: { ...(obra.direccion || {}), otros } };
                                                                                setPersonalObj(obraConDireccion);
                                                                                setInRuta(obra.id);
                                                                            }}
                                                                        >
                                                                            Modificar dirección
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>

                                    {!todasConCoordsImportadas && (
                                        <p style={{ marginTop: 8, fontSize: 12 }}>
                                            Tip: Usa “confirmar dirección” para asignar coordenadas y mover cada obra a la lista lista.
                                        </p>
                                    )}
                                </>
                            )}
                        </section>

                        {inRuta !== null && personalObj && (
                            <>
                                <span
                                    className="pointer"
                                    onClick={() => {
                                        setPersonalObj(null);
                                        setInRuta(null);
                                    }}
                                >
                                    ← Volver
                                </span>

                                {/* Tu input que termina llamando a handleCreateAll con `centre: {lat,lng}` */}
                                <InputCompAdress
                                    setAdressView={handleCreateAll}
                                    adressView={adressView}
                                    personalObj={personalObj}
                                    value={personalObj.direccion}
                                    placeholder={'barrio'}
                                    funtions={handleCreateAll}
                                    required
                                />
                            </>
                        )}

                    </>}
                    {inRuta === null && <div className="card" style={{ margin: "12px 0" }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
                            <h3 style={{ margin: 0 }}>Crear nueva obra</h3>
                            <button className="tabbtn" onClick={() => setShowNewObra(s => !s)}>
                                {showNewObra ? "Cerrar" : "Añadir manualmente"}
                            </button>
                        </div>

                        {showNewObra && (
                            <form
                                onSubmit={handleCrearObraNueva}
                                style={{ marginTop: 10, display: "grid", gap: 8 }}
                            >
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 8 }}>
                                    <label>
                                        Nombre<br />
                                        <input
                                            type="text"
                                            value={newObra.nombre}
                                            onChange={(e) => setNewObra(o => ({ ...o, nombre: e.target.value }))}
                                            placeholder="Nombre de la obra"
                                            style={{ width: "100%", padding: 8 }}
                                        />
                                    </label>
                                    <label>
                                        Empresa<br />
                                        <input
                                            type="text"
                                            value={newObra.empresa}
                                            onChange={(e) => setNewObra(o => ({ ...o, empresa: e.target.value }))}
                                            placeholder="Empresa / Cliente"
                                            style={{ width: "100%", padding: 8 }}
                                        />
                                    </label>
                                    <label>
                                        Ciudad<br />
                                        <input
                                            type="text"
                                            value={newObra.ciudad}
                                            onChange={(e) => setNewObra(o => ({ ...o, ciudad: e.target.value }))}
                                            placeholder="Medellín"
                                            style={{ width: "100%", padding: 8 }}
                                        />
                                    </label>
                                    <label style={{ gridColumn: "1 / -1" }}>
                                        Dirección (otros)<br />
                                        <input
                                            type="text"
                                            value={newObra.otros}
                                            onChange={(e) => setNewObra(o => ({ ...o, otros: e.target.value }))}
                                            placeholder="Barrio / Calle / #"
                                            style={{ width: "100%", padding: 8 }}
                                        />
                                    </label>
                                    <label>
                                        Contacto (nombre)<br />
                                        <input
                                            type="text"
                                            value={newObra.contactNombre}
                                            onChange={(e) => setNewObra(o => ({ ...o, contactNombre: e.target.value }))}
                                            placeholder="Nombre de contacto"
                                            style={{ width: "100%", padding: 8 }}
                                        />
                                    </label>
                                    <label>
                                        Contacto (email)<br />
                                        <input
                                            type="email"
                                            value={newObra.contactEmail}
                                            onChange={(e) => setNewObra(o => ({ ...o, contactEmail: e.target.value }))}
                                            placeholder="correo@dominio.com"
                                            style={{ width: "100%", padding: 8 }}
                                        />
                                    </label>

                                    {/* Coords opcionales; si las dejas vacías luego puedes usar “Modificar dirección” */}
                                    <label>
                                        Latitud (opcional)<br />
                                        <input
                                            type="number"
                                            step="0.000001"
                                            value={newObra.lat}
                                            onChange={(e) => setNewObra(o => ({ ...o, lat: e.target.value }))}
                                            placeholder="6.24…"
                                            style={{ width: "100%", padding: 8 }}
                                        />
                                    </label>
                                    <label>
                                        Longitud (opcional)<br />
                                        <input
                                            type="number"
                                            step="0.000001"
                                            value={newObra.lng}
                                            onChange={(e) => setNewObra(o => ({ ...o, lng: e.target.value }))}
                                            placeholder="-75.56…"
                                            style={{ width: "100%", padding: 8 }}
                                        />
                                    </label>
                                </div>

                                {newObraError && (
                                    <div style={{ color: "#b00", fontSize: 12 }}>{newObraError}</div>
                                )}

                                <div className="flex" style={{ gap: 8, marginTop: 6 }}>
                                    <button className="tabbtn" type="submit">
                                        Crear obra
                                    </button>
                                    <button
                                        type="button"
                                        className="tabbtn"
                                        onClick={() => {
                                            setShowNewObra(false);
                                            setNewObraError("");
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                                <p className="muted" style={{ marginTop: 6, fontSize: 12 }}>
                                    * Si no ingresas lat/lng, podrás usar “Modificar dirección” para geocodificar con Google Places.
                                </p>
                            </form>
                        )}
                    </div>}
                    <section style={{ padding: 12, width: '100%', overflowY: 'auto', border: '1px solid #ddd', borderRadius: 8 }}>
                        <h2>Visor</h2>
                        {showed.length === 0 ? (
                            <p>Primero convierte y confirma direcciones. Luego usa “Usar obras listas”.</p>
                        ) : (
                            <VisorTipoObraLibre listos={[]} showed={showed} />
                        )}
                    </section>

                </div>)}

                {vista === "geocercas" && (
                    <div className="grid">
                        <section className="card">
                            <h2>Geocercas (bandas o grid)</h2>

                            <div className="flex" style={{ marginBottom: 8 }}>
                                <label>latMin&nbsp;
                                    <input type="number" step="0.0001" value={bbox.latMin}
                                        onChange={(e) => setBbox(v => ({ ...v, latMin: Number(e.target.value) }))} />
                                </label>
                                <label>latMax&nbsp;
                                    <input type="number" step="0.0001" value={bbox.latMax}
                                        onChange={(e) => setBbox(v => ({ ...v, latMax: Number(e.target.value) }))} />
                                </label>
                                <label>lonMin&nbsp;
                                    <input type="number" step="0.0001" value={bbox.lonMin}
                                        onChange={(e) => setBbox(v => ({ ...v, lonMin: Number(e.target.value) }))} />
                                </label>
                                <label>lonMax&nbsp;
                                    <input type="number" step="0.0001" value={bbox.lonMax}
                                        onChange={(e) => setBbox(v => ({ ...v, lonMax: Number(e.target.value) }))} />
                                </label>
                            </div>

                            {/* Controles de modo */}
                            <div className="flex" style={{ marginBottom: 8 }}>
                                <label>
                                    modo&nbsp;
                                    <select value={geoMode} onChange={(e) => setGeoMode(e.target.value)}>
                                        <option value="lat">Bandas por LAT (horizontal)</option>
                                        <option value="lon">Bandas por LON (vertical)</option>
                                        <option value="grid">Grid (R × C)</option>
                                    </select>
                                </label>

                                {/* Para lat/lon usamos "bands" */}
                                {geoMode !== "grid" && (
                                    <label>bandas&nbsp;
                                        <input type="number" min={1} max={50} value={bands}
                                            onChange={(e) => setBands(Math.max(1, Math.min(50, Number(e.target.value) || 1)))} />
                                    </label>
                                )}

                                {/* Para grid usamos rows/cols */}
                                {geoMode === "grid" && (
                                    <>
                                        <label>filas (R)&nbsp;
                                            <input type="number" min={1} max={50} value={rows}
                                                onChange={(e) => setRows(Math.max(1, Math.min(50, Number(e.target.value) || 1)))} />
                                        </label>
                                        <label>columnas (C)&nbsp;
                                            <input type="number" min={1} max={50} value={cols}
                                                onChange={(e) => setCols(Math.max(1, Math.min(50, Number(e.target.value) || 1)))} />
                                        </label>
                                    </>
                                )}
                            </div>

                            <MapGeofences
                                apiKey={GOOGLE_MAPS_KEY}
                                bbox={bbox}
                                mode={geoMode}
                                bands={bands}
                                rows={rows}
                                cols={cols}
                            />


                        </section>
                    </div>
                )}

                {vista === "vehiculos" && (
                    <div className="grid">
                        <section className="card">
                            <h2>Vehículos 2–5 t (10)</h2>

                            {(() => {
                                const asignacionActiva = fleetAsignada.length > 0;
                                const vehiclesView = asignacionActiva ? fleetAsignada : fleet;

                                // helpers de fallback para tabla
                                const deckTotal = (v) => {
                                    if (typeof v?.deck_total_m2 === "number") return v.deck_total_m2;
                                    const L = v?.dimensiones_furgon_m?.largo ?? 0;
                                    const W = v?.dimensiones_furgon_m?.ancho ?? 0;
                                    const area = Number((L * W).toFixed(2));
                                    return isFinite(area) ? area : 0;
                                };
                                const capTotalKg = (v) => {
                                    if (typeof v?.carga_total_kg === "number") return v.carga_total_kg;
                                    return v?.capacidad_carga_kg ?? 0;
                                };

                                return (
                                    <>
                                        <div className="card" style={{ marginBottom: 8 }}>
                                            <h3>Asignar geocerca a vehículo</h3>
                                            {(() => {
                                                const asignacionActiva = fleetAsignada.length > 0;
                                                const vehiclesView = asignacionActiva ? fleetAsignada : fleet;

                                                return (
                                                    <div className="flex" style={{ gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                                                        <label>
                                                            Vehículo:&nbsp;
                                                            <select
                                                                value={manualFenceVehId}
                                                                onChange={(e) => setManualFenceVehId(e.target.value)}
                                                            >
                                                                <option value="">—</option>
                                                                {vehiclesView.map(v => (
                                                                    <option key={v.id} value={v.id}>
                                                                        {v.placa} • {v.marca} {v.modelo} ({v.fenceName || v.fenceId || "sin cerca"})
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </label>

                                                        <label>
                                                            Geocerca:&nbsp;
                                                            <select
                                                                value={manualFenceId}
                                                                onChange={(e) => setManualFenceId(e.target.value)}
                                                            >
                                                                {fences.map(f => (
                                                                    <option key={f.id} value={f.id}>
                                                                        {f.id} • {f.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </label>

                                                        <label>
                                                            Posición:&nbsp;
                                                            <select
                                                                value={manualPlaceMode}
                                                                onChange={(e) => setManualPlaceMode(e.target.value)}
                                                            >
                                                                <option value="center">Centro</option>
                                                                <option value="random">Aleatoria en la cerca</option>
                                                            </select>
                                                        </label>

                                                        <button
                                                            className="tabbtn"
                                                            onClick={() => assignFenceToVehicle(manualFenceVehId, manualFenceId, manualPlaceMode)}
                                                            disabled={!manualFenceVehId || !manualFenceId}
                                                        >
                                                            Asignar cerca
                                                        </button>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                        <div className="flex" style={{ marginBottom: 8, gap: 8, flexWrap: "wrap" }}>
                                            <button
                                                className="tabbtn"
                                                disabled={asignacionActiva}
                                                title={asignacionActiva ? "Desactiva la asignación para reubicar" : ""}
                                                onClick={(e) => { e.preventDefault(); reseedPositions(); }}
                                            >
                                                Reubicar aleatorio en su cerca
                                            </button>

                                            <button
                                                className="tabbtn"
                                                disabled={asignacionActiva}
                                                title={asignacionActiva ? "Desactiva la asignación para regenerar" : ""}
                                                onClick={(e) => { e.preventDefault(); regenerateFleet(vehiculoss); }}
                                            >
                                                Generar vehiculoss vehículos
                                            </button>

                                            <button
                                                className="tabbtn"
                                                disabled={asignacionActiva}
                                                title={asignacionActiva ? "Desactiva la asignación para re-centrar" : ""}
                                                onClick={(e) => { e.preventDefault(); setFleet(prev => assignVehiclesToFencesCenter(prev, fences)); }}
                                            >
                                                Re-centrar vehículos en su cerca
                                            </button>

                                            <button
                                                className="tabbtn"
                                                disabled={asignacionActiva}
                                                title={asignacionActiva ? "Desactiva la asignación para resembrar" : ""}
                                                onClick={(e) => { e.preventDefault(); recenterFleetNow(); }}
                                            >
                                                Re-centrar vehículos
                                            </button>

                                            {asignacionActiva && (
                                                <button
                                                    className="tabbtn"
                                                    style={{ background: "#f55", color: "#fff", border: 0 }}
                                                    onClick={(e) => { e.preventDefault(); setFleetAsignada([]); }}
                                                    title="Quita rutas y vuelve a ver la flota base"
                                                >
                                                    Limpiar asignación
                                                </button>
                                            )}
                                        </div>

                                        <MapVehicles apiKey={GOOGLE_MAPS_KEY} vehicles={vehiclesView} fences={fences} />

                                        <div className="card" style={{ marginTop: 12 }}>
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Placa</th>
                                                        <th>Marca/Modelo</th>
                                                        <th>Color</th>
                                                        <th>Cap. (kg / t)</th>
                                                        <th>Volumen (m³)</th>
                                                        <th>Dim (L×A×H m)</th>
                                                        <th>Ubicación</th>
                                                        <th>Cerca</th>
                                                        <th># Obras</th>
                                                        <th>Kg usados / cap</th>
                                                        <th>Área usada / deck (m²)</th>
                                                        <th>Max pila (m)</th>
                                                        <th>Generar ruta</th> {/* 👈 nueva */}
                                                        <th>Pick</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {vehiclesView.map((v, i) => (
                                                        <tr key={v.id}>
                                                            <td>{i + 1}</td>
                                                            <td>{v.placa}</td>
                                                            <td>{v.marca} {v.modelo}</td>
                                                            <td>{v.color}</td>
                                                            <td>{v.capacidad_carga_kg} / {v.capacidad_carga_t}</td>
                                                            <td>{v.volumen_util_m3}</td>
                                                            <td>{v.dimensiones_furgon_m.largo}×{v.dimensiones_furgon_m.ancho}×{v.dimensiones_furgon_m.alto}</td>
                                                            <td>{v.gps.lat}, {v.gps.lng}</td>
                                                            <td>{v.fenceId || "—"}<br /><span className="muted">{v.fenceName || ""}</span></td>
                                                            <td>{v.route?.length ?? 0}</td>
                                                            <td>{(v.carga_utilizada_kg ?? 0)} / {capTotalKg(v)}</td>
                                                            <td>{(v.deck_usado_m2 ?? 0)} / {deckTotal(v)}</td>
                                                            <td>{v.max_stack_m ?? 0}</td>
                                                            <td>
                                                                <button
                                                                    className="tabbtn"
                                                                    style={{ padding: '6px 10px' }}
                                                                    disabled={!(v.route?.length)}
                                                                    onClick={() => generarRutaParaVehiculo(v)}
                                                                    title={v.route?.length ? "Pasa las obras de este vehículo al visor" : "Este vehículo no tiene obras asignadas"}
                                                                >
                                                                    Generar ruta
                                                                </button>
                                                            </td>
                                                            <td>
                                                                <button
                                                                    className="tabbtn"
                                                                    onClick={() => setManualFenceVehId(v.id)}
                                                                    title="Preseleccionar este vehículo en el panel de asignación"
                                                                >
                                                                    Pick
                                                                </button>
                                                            </td>  </tr>
                                                    ))}
                                                </tbody>

                                            </table>
                                        </div>
                                    </>
                                );
                            })()}
                        </section>
                    </div>
                )}



                {vista === "geocercasconrutas" && (
                    <div className="grid">
                        <section className="card">
                            <h2>Geocercas con Rutas</h2>

                            <div className="flex" style={{ gap: 8, marginBottom: 8 }}>
                                <button className="tabbtn" onClick={asignarCargasAVehiculos}>
                                    Asignar cargas a vehículos (por cerca)
                                </button>
                                {obrasSinCap.length > 0 && (
                                    <span className="muted">Sin capacidad: {obrasSinCap.length}</span>
                                )}
                            </div>

                            <MapGeocercasConRutas
                                apiKey={GOOGLE_MAPS_KEY}
                                fences={fences}
                                obras={zonificacion.tagged}
                                bbox={bbox}
                            />
                            <div className="card" style={{ marginTop: 12 }}>
                                <h3>Asignación por vehículo</h3>
                                {fleetAsignada.length === 0 ? (
                                    <p>Presiona “Asignar cargas a vehículos (por cerca)”.</p>
                                ) : (
                                    <table className="table" style={{ width: "100%" }}>
                                        <thead>
                                            <tr>
                                                <th>Placa</th>
                                                <th>Cerca</th>
                                                <th>Kg usados / cap</th>
                                                <th>Área usada / deck (m²)</th>
                                                <th># Obras</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {fleetAsignada.map(v => (
                                                <tr key={v.id}>
                                                    <td>{v.placa}</td>
                                                    <td>{v.fenceName || v.fenceId || "—"}</td>
                                                    <td>{v.carga_utilizada_kg} / {v.carga_total_kg}</td>
                                                    <td>{v.deck_usado_m2} / {v.deck_total_m2}</td>
                                                    <td>{v.route?.length || 0}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            {fleetAsignada.length > 0 && (
                                <div className="card" style={{ marginTop: 12 }}>
                                    <h3>Detalle de rutas</h3>
                                    {fleetAsignada.map(v => (
                                        <details key={v.id} style={{ marginBottom: 8 }}>
                                            <summary>
                                                {v.placa} • {v.marca} {v.modelo} — {v.fenceName || v.fenceId || "—"} —
                                                Obras: {v.route.length} — Kg: {v.carga_utilizada_kg}/{v.carga_total_kg} — Área: {v.deck_usado_m2}/{v.deck_total_m2} m²
                                            </summary>
                                            {v.route.length === 0 ? (
                                                <div className="muted">Sin asignaciones</div>
                                            ) : (
                                                <table className="table" style={{ width: "100%", marginTop: 6 }}>
                                                    <thead>
                                                        <tr>
                                                            <th>Obra</th>
                                                            <th>Peso (kg)</th>
                                                            <th>Footprint (m²)</th>
                                                            <th>Altura pila (m)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {v.route.map(r => (
                                                            <tr key={r.obraId}>
                                                                <td>{r.nombre}</td>
                                                                <td>{r.peso_kg}</td>
                                                                <td>{r.footprint_m2}</td>
                                                                <td>{r.altura_m}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            )}
                                        </details>
                                    ))}
                                </div>
                            )}

                            {pendientesCount > 0 && (
                                <div className="card" style={{ marginTop: 12 }}>
                                    <h3>Obras sin capacidad en su cerca</h3>
                                    <div className="card" style={{ marginTop: 12 }}>
                                        <h3>Asignación manual (sobrantes por cerca)</h3>

                                        {!manualVisible ? (
                                            <p>Primero ejecuta “Asignar cargas a vehículos (por cerca)”.</p>
                                        ) : (
                                            <>
                                                <div className="flex" style={{ gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 8 }}>
                                                    <label>
                                                        Cerca:&nbsp;
                                                        <select value={selectedFenceId} onChange={(e) => { setSelectedFenceId(e.target.value); setSelectedObrasIds([]); }}>
                                                            <option value="">—</option>
                                                            {fencesConSobrantes.map(fid => {
                                                                const f = fences.find(ff => ff.id === fid);
                                                                const leftCnt = getLeftoversArr(fid).length;
                                                                return (
                                                                    <option key={fid} value={fid}>
                                                                        {fid} • {f?.name || ""} ({leftCnt})
                                                                    </option>
                                                                );
                                                            })}
                                                        </select>
                                                    </label>

                                                    <label>
                                                        Vehículo:&nbsp;
                                                        <select value={selectedVehicleId} onChange={(e) => setSelectedVehicleId(e.target.value)}>
                                                            <option value="">—</option>
                                                            {emptyVehicles.map(v => (
                                                                <option key={v.id} value={v.id}>
                                                                    {v.placa} (vacío) — {v.fenceName || v.fenceId || "—"}
                                                                </option>
                                                            ))}
                                                            {vehiclesConCapacidad
                                                                .filter(v => !emptyVehicles.some(ev => ev.id === v.id))
                                                                .map(v => (
                                                                    <option key={v.id} value={v.id}>
                                                                        {v.placa} — cap rem: {v.rem_kg} kg / {v.rem_area_m2.toFixed(2)} m²
                                                                    </option>
                                                                ))}
                                                        </select>
                                                    </label>

                                                    <button
                                                        className="tabbtn"
                                                        onClick={() => manualFillVehicleFromFence(selectedFenceId, selectedVehicleId)}
                                                        disabled={!selectedFenceId || !selectedVehicleId || getLeftoversArr(selectedFenceId).length === 0}
                                                    >
                                                        Llenar vehículo con todo lo que quepa (cerca seleccionada)
                                                    </button>
                                                </div>

                                                {selectedFenceId ? (
                                                    <div className="grid" style={{ gap: 12 }}>
                                                        <section className="card">
                                                            <h4>Sobrantes — {selectedFenceId}</h4>
                                                            {sobrantesSeleccionados.length === 0 ? (
                                                                <p>Sin sobrantes en esta cerca.</p>
                                                            ) : (
                                                                <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "grid", gap: 6 }}>
                                                                    {sobrantesSeleccionados.map(o => (
                                                                        <li key={o.id} style={{ display: "flex", gap: 8, alignItems: "center", border: "1px solid #eee", borderRadius: 6, padding: 6 }}>
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={selectedObrasIds.includes(o.id)}
                                                                                onChange={(e) => {
                                                                                    setSelectedObrasIds(prev => {
                                                                                        const set = new Set(prev);
                                                                                        if (e.target.checked) set.add(o.id); else set.delete(o.id);
                                                                                        return Array.from(set);
                                                                                    });
                                                                                }}
                                                                            />
                                                                            <span style={{ flex: 1 }}>
                                                                                <b>{o.nombre}</b> • {o.fenceName || o.fenceId}
                                                                                <div className="muted" style={{ fontSize: 12 }}>
                                                                                    {o.cargaSim?.peso_total_kg} kg · {o.cargaSim?.area_total_m2} m² · {o.cargaSim?.item_unitario?.largo_m}×{o.cargaSim?.item_unitario?.ancho_m}×{o.cargaSim?.item_unitario?.espesor_m} m
                                                                                </div>
                                                                            </span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}

                                                            <div className="flex" style={{ gap: 8, marginTop: 8 }}>
                                                                <button
                                                                    className="tabbtn"
                                                                    onClick={() => manualAssignSelectedToVehicle(selectedFenceId, selectedVehicleId)}
                                                                    disabled={!selectedFenceId || !selectedVehicleId || selectedObrasIds.length === 0}
                                                                >
                                                                    Asignar seleccionadas al vehículo
                                                                </button>
                                                                <button
                                                                    className="tabbtn"
                                                                    onClick={() => setSelectedObrasIds([])}
                                                                    disabled={selectedObrasIds.length === 0}
                                                                >
                                                                    Limpiar selección
                                                                </button>
                                                            </div>
                                                        </section>

                                                        <section className="card">
                                                            <h4>Vehículos (capacidad remanente)</h4>
                                                            <table className="table" style={{ width: "100%" }}>
                                                                <thead>
                                                                    <tr>
                                                                        <th>Placa</th>
                                                                        <th>Cerca</th>
                                                                        <th>Kg usados / cap</th>
                                                                        <th>Área usada / deck (m²)</th>
                                                                        <th># Obras</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {fleetAsignada.map(v => (
                                                                        <tr key={v.id} style={{ background: v.id === selectedVehicleId ? "#f5fff7" : undefined }}>
                                                                            <td>{v.placa}</td>
                                                                            <td>{v.fenceName || v.fenceId || "—"}</td>
                                                                            <td>{v.carga_utilizada_kg} / {v.carga_total_kg}</td>
                                                                            <td>{v.deck_usado_m2} / {v.deck_total_m2}</td>
                                                                            <td>{v.route?.length || 0}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </section>
                                                    </div>
                                                ) : (
                                                    <p className="muted">Selecciona una cerca con sobrantes para continuar.</p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                                        {obrasPendientes.map(o => (
                                            <li key={o.id}>
                                                {o.nombre} — {o.fenceName || o.fenceId || "sin cerca"} <span className="muted">({o.reason || "pendiente"})</span>
                                            </li>
                                        ))}
                                    </ul>

                                </div>
                            )}
                            <div className="card" style={{ marginTop: 12 }}>
                                <h3>Obras por geocerca</h3>
                                {zonificacion.summary.length === 0 ? (
                                    <p>No hay geocercas.</p>
                                ) : (
                                    <table className="table" style={{ width: "100%" }}>
                                        <thead>
                                            <tr>
                                                <th>Cerca</th>
                                                <th>Nombre</th>
                                                <th>Cantidad</th>
                                                <th>Peso total (kg)</th>
                                                <th>Cant. láminas</th>
                                                <th>Área total (m²)</th>
                                                <th>L×A×E (m)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {zonificacion.summary.map(row => {
                                                const a = aggPorCerca.get(row.fenceId) || { peso: 0, cantidad: 0, area: 0, dim: null, dimMixed: false };
                                                return (
                                                    <tr key={row.fenceId}>
                                                        <td>{row.fenceId}</td>
                                                        <td>{row.fenceName}</td>
                                                        <td><strong>{row.count}</strong></td>
                                                        <td>{a.peso ? a.peso.toFixed(1) : "—"}</td>
                                                        <td>{a.cantidad || "—"}</td>
                                                        <td>{a.area ? a.area.toFixed(2) : "—"}</td>
                                                        <td>{a.dimMixed ? "variado" : (a.dim || "—")}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colSpan={2} style={{ textAlign: "right" }}>
                                                    Fuera de cualquier cerca (con coordenadas):
                                                </td>
                                                <td><strong>{zonificacion.outOfAny}</strong></td>
                                                <td colSpan={4}></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                )}
                            </div>


                        </section>
                    </div>
                )}


            </main>
        </>
    );
}

export async function getServerSideProps() {
    return { props: {} };
}
