'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';

/**
 * 2-opt local search
 * @param {number[]} order - ruta inicial (índices)
 * @param {number[][]} secondsMatrix
 * @param {number[][]} metersMatrix
 * @param {object} opt
 *   - cycle: boolean (true = TSP cerrado)
 *   - use: 'time' | 'distance' (objetivo a minimizar)
 *   - lockEnds: boolean (mantener extremos fijos en modo path)
 *   - maxIter: límite de iteraciones de mejora
 *   - firstImprovement: si true, acepta la primera mejora; si false, busca la mejor por iteración
 * @returns {{order:number[], time:number, distance:number}}
 */
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function twoOptBatchImprove(routes, secondsMatrix, metersMatrix, {
    k = 1000,
    use = 'time',      // 'time' o 'distance'
    cycle = false,
    lockEnds = true,
    maxIter = 200,
    firstImprovement = true,
    yieldEvery = 200
} = {}) {
    const sorted = [...routes].sort(use === 'distance' ? byDist : byTime);
    const target = Math.min(k, sorted.length);
    const improved = [];
    for (let i = 0; i < target; i++) {
        const r = sorted[i];
        // eslint-disable-next-line no-await-in-loop
        const imp = await twoOptImprove(r.order, secondsMatrix, metersMatrix, {
            cycle, use, lockEnds, maxIter, firstImprovement, yieldEvery
        });
        improved.push(imp);
        if (i % 50 === 0) await sleep(0);
    }
    // Mantén también el resto (sin mejorar) si k < total
    return improved.concat(sorted.slice(target));
}
async function twoOptImprove(order, secondsMatrix, metersMatrix, {
    cycle = false,
    use = 'time',
    lockEnds = true,
    maxIter = 200,
    firstImprovement = true,
    yieldEvery = 200
} = {}) {
    let bestOrder = order.slice();
    let bestCost = costOfOrder(bestOrder, secondsMatrix, metersMatrix, { cycle, use });
    if (!bestCost) return { order: bestOrder, time: Infinity, distance: Infinity };

    const n = bestOrder.length;
    let improved = true, iter = 0, inner = 0;

    while (improved && iter < maxIter) {
        improved = false;
        let iterationBest = { order: null, cost: bestCost };

        const iStart = lockEnds && !cycle ? 1 : 0;
        const iEnd = lockEnds && !cycle ? n - 3 : n - 2;

        for (let i = iStart; i <= iEnd; i++) {
            const kStart = i + 1;
            const kEnd = lockEnds && !cycle ? n - 2 : n - 1;
            for (let k = kStart; k <= kEnd; k++) {
                inner++;
                const candidate = twoOptSwap(bestOrder, i, k);
                const c = costOfOrder(candidate, secondsMatrix, metersMatrix, { cycle, use });
                if (!c) continue;

                if (c.score < bestCost.score) {
                    if (firstImprovement) {
                        bestOrder = candidate;
                        bestCost = c;
                        improved = true;
                        break;
                    } else {
                        if (c.score < iterationBest.cost.score) {
                            iterationBest = { order: candidate, cost: c };
                        }
                    }
                }
                if (inner % yieldEvery === 0) await sleep(0);
            }
            if (firstImprovement && improved) break;
        }

        if (!firstImprovement && iterationBest.order) {
            bestOrder = iterationBest.order;
            bestCost = iterationBest.cost;
            improved = true;
        }
        iter++;
    }
    return { order: bestOrder, time: bestCost.time, distance: bestCost.distance };
}
function costOfOrder(order, secondsMatrix, metersMatrix, { cycle = false, use = 'time' } = {}) {
    let t = 0, d = 0;
    for (let i = 0; i < order.length - 1; i++) {
        const a = order[i], b = order[i + 1];
        const sec = secondsMatrix[a]?.[b], met = metersMatrix[a]?.[b];
        if (sec == null || met == null) return null;
        t += sec; d += met;
    }
    if (cycle) {
        const a = order[order.length - 1], b = order[0];
        const sec = secondsMatrix[a]?.[b], met = metersMatrix[a]?.[b];
        if (sec == null || met == null) return null;
        t += sec; d += met;
    }
    return { time: t, distance: d, score: (use === 'distance' ? d : t) };
}

function twoOptSwap(order, i, k) {
    // nuevo = [0..i-1] + reverse[i..k] + [k+1..]
    return order.slice(0, i).concat(order.slice(i, k + 1).reverse(), order.slice(k + 1));
}

function isLatLng(x) { return x && typeof x === 'object' && typeof x.lat === 'number' && typeof x.lng === 'number'; }
function getPlaceId(x) { if (typeof x === 'string') return x; if (x && typeof x === 'object') return x.placeId || x.place_id || null; return null; }

async function resolvePlaceToLatLng(placeRef, apiKey) {
    if (isLatLng(placeRef)) return placeRef;
    const placeId = getPlaceId(placeRef);
    if (!placeId) throw new Error('Elemento inválido: se esperaba {lat,lng} o placeId.');
    await ensureMaps(apiKey, true);
    return new Promise((resolve, reject) => {
        const svc = new google.maps.places.PlacesService(document.createElement('div'));
        svc.getDetails({ placeId, fields: ['geometry'] }, (place, st) => {
            if (st !== google.maps.places.PlacesServiceStatus.OK || !place?.geometry?.location) return reject(new Error('No se pudo resolver placeId'));
            resolve({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
        });
    });
}

const chunkIdx = (n, size) => {
    const out = []; for (let i = 0; i < n; i += size) out.push(Array.from({ length: Math.min(size, n - i) }, (_, k) => i + k)); return out;
};

// ====== Distance Matrix batched (20x20 = 4 requests de 10x10) ======
async function getDistanceTimeMatrixBatched({ sitios, apiKey, mode = 'DRIVING', units = 'METRIC', blockSize = 10 }) {
    await ensureMaps(apiKey, false);

    // 1) resolver coords + labels
    const coords = [], labels = [];
    for (let i = 0; i < sitios.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        const xy = await resolvePlaceToLatLng(sitios[i], apiKey);
        coords.push(xy);
        labels.push(typeof sitios[i] === 'object' ? (sitios[i].label || '') : '');
    }

    const N = coords.length;
    const secondsMatrix = Array.from({ length: N }, () => Array(N).fill(null));
    const metersMatrix = Array.from({ length: N }, () => Array(N).fill(null));

    const svc = new google.maps.DistanceMatrixService();
    const modeVal = google.maps.TravelMode[mode] || google.maps.TravelMode.DRIVING;
    const unitVal = google.maps.UnitSystem[units] || google.maps.UnitSystem.METRIC;

    const oChunks = chunkIdx(N, blockSize);
    const dChunks = chunkIdx(N, blockSize);

    for (const oIdxs of oChunks) {
        for (const dIdxs of dChunks) {
            if (oIdxs.length * dIdxs.length > 100) throw new Error(`Bloque ${oIdxs.length}x${dIdxs.length} excede 100 elementos (ajusta blockSize).`);

            const req = {
                origins: oIdxs.map(i => new google.maps.LatLng(coords[i].lat, coords[i].lng)),
                destinations: dIdxs.map(j => new google.maps.LatLng(coords[j].lat, coords[j].lng)),
                travelMode: modeVal,
                unitSystem: unitVal,
            };

            // eslint-disable-next-line no-await-in-loop
            const res = await new Promise((resolve, reject) => {
                svc.getDistanceMatrix(req, (r, st) => st === 'OK' && r?.rows ? resolve(r) : reject(new Error('DistanceMatrix: ' + st)));
            });

            // vuelca submatriz
            res.rows.forEach((row, oi) => {
                row.elements.forEach((el, dj) => {
                    const I = oIdxs[oi], J = dIdxs[dj];
                    if (el && el.status === 'OK') {
                        secondsMatrix[I][J] = el.duration?.value ?? null;
                        metersMatrix[I][J] = el.distance?.value ?? null;
                    }
                });
            });

            // rate-limit suave
            // eslint-disable-next-line no-await-in-loop
            await new Promise(r => setTimeout(r, 120));
        }
    }

    return { secondsMatrix, metersMatrix, labels };
}

async function ensureMaps(apiKey, withPlaces = true) {
    if (typeof window !== 'undefined' && window.google?.maps && (!withPlaces || window.google.maps.places)) return;
    const { Loader } = await import('@googlemaps/js-api-loader');
    const loader = new Loader({ apiKey, libraries: withPlaces ? ['places'] : [], version: 'weekly' });
    await loader.load();
}

// ====== Generación de rutas “sin límite” (muestreo aleatorio) ======

function shuffleInPlace(a) { // Fisher–Yates
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; }
    return a;
}

function buildRandomOrder(N, { startIndex = null, endIndex = null } = {}) {
    const all = Array.from({ length: N }, (_, i) => i);
    const mid = all.filter(i => i !== startIndex && i !== endIndex);
    shuffleInPlace(mid);
    let order = [];
    if (startIndex != null) order.push(startIndex);
    order.push(...mid);
    if (endIndex != null) order.push(endIndex);
    // si no fijaste nada y quedó fuera alguien, mézclalo (N pequeño)
    if (order.length < N) {
        const rest = all.filter(i => !order.includes(i));
        order.push(...rest);
    }
    return order;
}


/**
 * Genera 'count' rutas aleatorias únicas (hasta donde sea posible) y calcula costo con la matriz.
 * Hace 'yields' cada 'yieldEvery' iteraciones para no congelar la UI.
 */
async function sampleRoutesFromMatrix(secondsMatrix, metersMatrix, {
    count = 1000,
    startIndex = null,
    endIndex = null,
    cycle = false,
    labels = null,
    yieldEvery = 250,     // cede el hilo cada 250 iteraciones
    maxAttemptsFactor = 50, // para evitar bucles si 'count' es muy alto
} = {}) {
    const N = secondsMatrix.length;
    const out = [];
    const seen = new Set(); // para dedup por orden
    const maxAttempts = count * maxAttemptsFactor;
    let attempts = 0, made = 0;

    while (made < count && attempts < maxAttempts) {
        attempts++;
        const order = buildRandomOrder(N, { startIndex, endIndex });
        const key = order.join("-");
        if (seen.has(key)) {
            if (attempts % yieldEvery === 0) await sleep(0);
            continue;
        }
        const cost = costOfOrder(order, secondsMatrix, metersMatrix, { cycle });
        if (!cost) {
            if (attempts % yieldEvery === 0) await sleep(0);
            continue;
        }
        seen.add(key);
        out.push({
            order,
            time: cost.time,
            distance: cost.distance,
            ...(labels ? { labelOrder: order.map(i => labels[i] ?? String(i)) } : {})
        });
        made++;
        if (made % yieldEvery === 0) await sleep(0);
    }
    return out;
}

const byTime = (a, b) => a.time - b.time;
const byDist = (a, b) => a.distance - b.distance;
const apiKey = "AIzaSyBE0Y1gpJ-P0Fu_hPUEP-mBrlu7fQFBWsQ";


// Heap's permutations con límite opcional
function permute(arr, cap = null) {
    const res = [arr.slice()];
    const c = new Array(arr.length).fill(0);
    let i = 0;
    while (i < arr.length) {
        if (cap && res.length >= cap) break;
        if (c[i] < i) {
            if (i % 2 === 0) [arr[0], arr[i]] = [arr[i], arr[0]];
            else[arr[c[i]], arr[i]] = [arr[i], arr[c[i]]];
            res.push(arr.slice());
            c[i]++; i = 0;
        } else { c[i] = 0; i++; }
    }
    return res;
}

/**
 * Construye rutas sumando aristas de la matriz (no llama a Google).
 * - Puedes fijar startIndex y/o endIndex (o ninguno).
 * - Si cycle=true, cierra el ciclo volviendo al inicio.
 */
function rutasDesdeMatriz(secondsMatrix, metersMatrix, {
    startIndex = null,
    endIndex = null,
    limit = null,
    labels = null,
    cycle = false,
} = {}) {
    const N = secondsMatrix.length;
    const all = Array.from({ length: N }, (_, i) => i);

    // arma el conjunto a permutar
    const middle = all.filter(i => i !== startIndex && i !== endIndex);
    const midsPerms = permute(middle, limit || undefined);

    const rutas = [];
    for (const mids of midsPerms) {
        const order =
            startIndex != null && endIndex != null ? [startIndex, ...mids, endIndex] :
                startIndex != null ? [startIndex, ...mids] :
                    endIndex != null ? [...mids, endIndex] :
                        [...mids]; // sin restricciones (poco común)
        // si no fijaste ninguno, esta orden NO incluye el que quedó fuera ⇒ mézclalo:
        if (order.length < N) {
            const restantes = all.filter(i => !order.includes(i));
            order.push(...restantes);
        }

        // suma costos
        let t = 0, d = 0, ok = true;
        for (let i = 0; i < order.length - 1; i++) {
            const a = order[i], b = order[i + 1];
            const sec = secondsMatrix[a]?.[b];
            const met = metersMatrix[a]?.[b];
            if (sec == null || met == null) { ok = false; break; }
            t += sec; d += met;
        }
        // cerrar ciclo si se pidió
        if (ok && cycle && order.length > 1) {
            const a = order[order.length - 1], b = order[0];
            const sec = secondsMatrix[a]?.[b];
            const met = metersMatrix[a]?.[b];
            if (sec == null || met == null) ok = false;
            else { t += sec; d += met; }
        }

        if (ok) {
            rutas.push({
                order,
                time: t,
                distance: d,
                ...(labels ? { labelOrder: order.map(i => labels[i] ?? String(i)) } : {})
            });
        }
    }
    return rutas;
}

/**
 * Mejor ruta (por tiempo o distancia) para CADA posible inicio.
 * - Puedes fijar un destino común (endIndex) o dejarlo libre.
 * - Puedes pedir ciclo=true (TSP cerrado).
 */
function mejoresPorCadaInicio(secondsMatrix, metersMatrix, {
    endIndex = null,     // o num, si quieres destino fijo
    limitPerStart = 1000,     // seguridad
    labels = null,
    criterio = "time",   // "time" | "distance"
    cycle = false,
} = {}) {
    const N = secondsMatrix.length;
    const mejores = [];
    for (let start = 0; start < N; start++) {
        const rutas = rutasDesdeMatriz(secondsMatrix, metersMatrix, {
            startIndex: start,
            endIndex,
            limit: limitPerStart,
            labels,
            cycle,
        });
        if (!rutas.length) continue;
        const mejor = rutas.sort(criterio === "distance" ? byDist : byTime)[0];
        mejores.push({
            startIndex: start,
            startLabel: labels ? labels[start] : String(start),
            ...mejor,
        });
    }
    // ordenar el resumen por el criterio
    return mejores.sort(criterio === "distance" ? byDist : byTime);
}


/* ---------- Ejemplo de uso con tu objeto ---------- */



// 4) Si quieres exactamente el “formato de rutas” como el que mostraste:



// === FUNCIÓN PRINCIPAL: devuelve matrices de tiempo/distancia ===
async function getDistanceTimeMatrix({ sitios, apiKey, mode = 'DRIVING', units = 'METRIC' }) {
    // 1) Asegura Maps core
    await ensureMaps(apiKey, false);

    // 2) Resuelve todos los sitios a coordenadas
    const coords = [];
    const labels = [];
    for (let i = 0; i < sitios.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        const xy = await resolvePlaceToLatLng(sitios[i], apiKey);
        coords.push(xy);
        const lbl = typeof sitios[i] === 'object' ? (sitios[i].label || '') : '';
        labels.push(lbl);
    }

    // 3) Llama Distance Matrix: orígenes = coords, destinos = coords
    const svc = new google.maps.DistanceMatrixService();
    const req = {
        origins: coords.map(({ lat, lng }) => new google.maps.LatLng(lat, lng)),
        destinations: coords.map(({ lat, lng }) => new google.maps.LatLng(lat, lng)),
        travelMode: google.maps.TravelMode[mode] || google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem[units] || google.maps.UnitSystem.METRIC,
    };

    const resp = await new Promise((resolve, reject) => {
        svc.getDistanceMatrix(req, (res, status) => {
            if (status !== 'OK' || !res?.rows) return reject(new Error('DistanceMatrix falló: ' + status));
            resolve(res);
        });
    });

    // 4) Construye matrices (segundos y metros), mismo orden de sitios
    const n = coords.length;
    const secondsMatrix = Array.from({ length: n }, () => Array(n).fill(null));
    const metersMatrix = Array.from({ length: n }, () => Array(n).fill(null));

    for (let i = 0; i < n; i++) {
        const row = resp.rows[i]?.elements || [];
        for (let j = 0; j < n; j++) {
            const el = row[j];
            if (el && el.status === 'OK') {
                secondsMatrix[i][j] = el.duration?.value ?? null; // segundos
                metersMatrix[i][j] = el.distance?.value ?? null; // metros
            } else {
                secondsMatrix[i][j] = null;
                metersMatrix[i][j] = null;
            }
        }
    }

    return {
        secondsMatrix, // n x n (segundos)
        metersMatrix,  // n x n (metros)
        labels,        // opcional: nombres/etiquetas alineadas a índices
        raw: resp,     // respuesta cruda por si quieres inspeccionar
    };
}

// === COMPONENTE DEMO (muestra matrices) ===
export default function RutasMatrizGoogle({
    mode = 'DRIVING',
    units = 'METRIC',
    limitPermutations = 1200, // por defecto permite hasta 1200 permutaciones aprox.
    onDone = null, obras = []
}) {
    function mapObrasToSitios(obras = []) {
        return obras
            .filter((key) => key?.direccion?.coordenadas) // solo si tiene coords
            .map((key) => ({
                ...key.direccion.coordenadas,
                label: key.nombre || ""
            }));
    }
    const sitios = mapObrasToSitios(obras);
    const [data, setData] = useState(null);
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            if (!sitios?.length) { setData(null); setStatus('idle'); return; }
            try {
                setStatus('loading');
                const MAX_SITES = 50;
                const sitiosCap = (sitios || []).slice(0, MAX_SITES);
                // 1) MATRIZ por batching (20x20 => 4 requests de 10x10)
                const res = await getDistanceTimeMatrixBatched({
                    sitios: sitiosCap,
                    apiKey,
                    mode,
                    units,
                    blockSize: 10,  // ← hacemos de a 10 (<=100 elementos por request)
                });
                if (cancelled) return;

                setData(res);
                setStatus('done');

                // Labels seguros
                const labels =
                    res.labels?.length ? res.labels
                        : sitiosCap.map((s, i) => (typeof s === 'object' && s.label) ? s.label : `Punto ${i}`);

                const N = res.secondsMatrix.length;

                // 2) Parámetros de muestreo y 2-opt
                const routesTarget = 10000;    // tamaño que quieras: 1000, 10000, 50000…
                const startIndex = null;     // fija a 0 si quieres origen fijo
                const endIndex = null;     // fija a N-1 si quieres destino fijo
                const wantCycle = false;    // true para TSP cerrado (volver al inicio)

                const applyTwoOpt = false;     // ← activa/desactiva mejora 2-opt
                const twoOptCfg = {
                    k: 1000,                     // cuántas mejorar (top-k por criterio)
                    use: 'time',                 // 'time' o 'distance'
                    cycle: wantCycle,
                    lockEnds: startIndex != null || endIndex != null, // si fijas extremos, no los toca
                    maxIter: 200,
                    firstImprovement: true,
                    yieldEvery: 200,
                };

                // 3) Muestrea rutas SIN llamar a Google (usa la matriz)
                const rutasMuestreadas = await sampleRoutesFromMatrix(
                    res.secondsMatrix,
                    res.metersMatrix,
                    {
                        count: routesTarget,
                        startIndex,
                        endIndex,
                        cycle: wantCycle,
                        labels,
                        yieldEvery: 250,
                        maxAttemptsFactor: 50,
                    }
                );

                // 4) (opcional) Mejora 2-opt de las k mejores por 'use'
                const rutasEnFormato = applyTwoOpt
                    ? await twoOptBatchImprove(
                        rutasMuestreadas,
                        res.secondsMatrix,
                        res.metersMatrix,
                        twoOptCfg
                    )
                    : rutasMuestreadas;

                // 5) Mejores globales DESPUÉS de 2-opt
                const mejorGlobalPorTiempo = rutasEnFormato.length ? [...rutasEnFormato].sort(byTime)[0] : null;
                const mejorGlobalPorDistancia = rutasEnFormato.length ? [...rutasEnFormato].sort(byDist)[0] : null;

                // 6) Mejor por CADA inicio (fin libre) con muestreo + 2-opt
                const kPorInicio = Math.max(200, Math.ceil(routesTarget / Math.max(1, N)));
                const mejoresPorCadaInicio = [];
                for (let s = 0; s < N; s++) {
                    // eslint-disable-next-line no-await-in-loop
                    const sample = await sampleRoutesFromMatrix(res.secondsMatrix, res.metersMatrix, {
                        count: kPorInicio,
                        startIndex: s,
                        endIndex,
                        cycle: wantCycle,
                        labels,
                        yieldEvery: 250,
                        maxAttemptsFactor: 50,
                    });
                    const sampleImp = applyTwoOpt
                        ? await twoOptBatchImprove(sample, res.secondsMatrix, res.metersMatrix, {
                            ...twoOptCfg,
                            // para cada inicio, probablemente mantienes extremos si endIndex fijo
                            lockEnds: endIndex != null,
                        })
                        : sample;

                    const best = sampleImp.length ? [...sampleImp].sort(byTime)[0] : null;
                    if (best) {
                        mejoresPorCadaInicio.push({
                            startIndex: s,
                            startLabel: labels[s] ?? String(s),
                            ...best,
                        });
                    }
                }

                // 7) (opcional) Mejor CICLO por cada inicio (TSP cerrado)
                const wantCyclePerStart = false;  // pon true si además quieres ciclo por inicio
                const mejorCicloPorCadaInicio = [];
                if (wantCyclePerStart) {
                    for (let s = 0; s < N; s++) {
                        // eslint-disable-next-line no-await-in-loop
                        const sampleCycle = await sampleRoutesFromMatrix(res.secondsMatrix, res.metersMatrix, {
                            count: kPorInicio,
                            startIndex: s,
                            endIndex: null,
                            cycle: true,
                            labels,
                            yieldEvery: 250,
                            maxAttemptsFactor: 50,
                        });
                        const sampleCycleImp = applyTwoOpt
                            ? await twoOptBatchImprove(sampleCycle, res.secondsMatrix, res.metersMatrix, {
                                ...twoOptCfg,
                                cycle: true,
                                lockEnds: false, // en ciclo no hay extremos fijos
                            })
                            : sampleCycle;

                        const bestC = sampleCycleImp.length ? [...sampleCycleImp].sort(byTime)[0] : null;
                        if (bestC) {
                            mejorCicloPorCadaInicio.push({
                                startIndex: s,
                                startLabel: labels[s] ?? String(s),
                                ...bestC,
                            });
                        }
                    }
                }
                console.log(rutasEnFormato);

                // 8) Callback con TODO (rutasEnFormato queda del largo que pediste)
                onDone && onDone({
                    labels,
                    secondsMatrix: res.secondsMatrix,
                    metersMatrix: res.metersMatrix,

                    mejorGlobalPorTiempo,
                    mejorGlobalPorDistancia,

                    mejoresPorCadaInicio,
                    mejorCicloPorCadaInicio,

                    rutasEnFormato, // incluye 2-opt si applyTwoOpt=true
                });

            } catch (e) {
                if (!cancelled) {
                    setError(e?.message || String(e));
                    setStatus('error');
                }
            }



        })();
        return () => { cancelled = true; };
    }, [apiKey, mode, units, JSON.stringify(sitios)]);

    return (
        <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold">Matriz tiempos/distancias (Distance Matrix)</h3>
                <small className="opacity-70">{status}</small>
            </div>

            {status === 'error' && (
                <div className="text-sm p-2 rounded bg-red-50 text-red-700">{String(error)}</div>
            )}

            {data ? (
                <>
                    <details open>
                        <summary className="cursor-pointer font-medium">secondsMatrix (s)</summary>
                        <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto" style={{ maxHeight: 300 }}>
                            {JSON.stringify(data.secondsMatrix, null, 2)}
                        </pre>
                    </details>
                    <details>
                        <summary className="cursor-pointer font-medium">metersMatrix (m)</summary>
                        <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto" style={{ maxHeight: 300 }}>
                            {JSON.stringify(data.metersMatrix, null, 2)}
                        </pre>
                    </details>
                </>
            ) : (
                <em className="text-sm">Sin datos aún…</em>
            )}
        </div>
    );
}