import { useMemo, useState } from "react";

const BioRutaLibre = (props) => {
    const {
        irPlace = {
            ubicacionActual: false,
            mapSelectactiveState: false,
            funtionOk: false,
            biosepticosSelect: false,
            inSelect: false,
            mapSelect: false,
            obraSelect: false,
            obraSelected: "",
            obrasName: [],
            ubicacionMapSelected: {
                lat: 6.2019443,
                lng: -75.5892001,
                state: false,
                mapSelectactive: false,
            },
            using: false,
            state: false,
            go: false,
            coordenadas: {
                obra: "",
                position: -1,
                lat: 6.2476376,
                lng: -75.565815100000001,
            },
            coordenadasInicial: {
                obra: "",
                position: -1,
                lat: 6.2019443,
                lng: -75.5892001,
            },
            funtion: async () => {
                console.log();
            },
        },
        elTiempo = { hora: 0, min: 0, seg: 0, restante: "" },
        showed = [],
        inicio = "",
        back = console.log,
        doRuta = console.log,
        setResultsArray = console.log,
        resultsArray = { state: false, array: [] },
    } = props;

    // ===================== UI STATE =====================
    const [sortMode, setSortMode] = useState("tiempo"); // 'tiempo' | 'distancia' | 'equilibrado'
    const [expanded, setExpanded] = useState({ state: false, position: -1 });
    const [page, setPage] = useState(1);
    const pageSize = 10;

    // ===================== HELPERS =====================
    const fmtTime = (totalSec = 0) => {
        const s = Math.max(0, Math.round(totalSec));
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const r = s % 60;
        return h > 0 ? `${h}h ${String(m).padStart(2, "0")}m ${String(r).padStart(2, "0")}s`
            : `${m}m ${String(r).padStart(2, "0")}s`;
    };

    const fmtDist = (m = 0) => {
        if (m == null) return "–";
        return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${m} m`;
    };

    // Prepara rutas con índice original para que doRuta funcione aunque ordenemos
    const routesWithIdx = useMemo(() => {
        return (resultsArray?.array || []).map((r, i) => ({ ...r, _idx: i }));
    }, [resultsArray]);

    // Cálculo de “equilibrado”: normaliza tiempo y distancia y minimiza suma 50/50
    const sortedRoutes = useMemo(() => {
        const arr = [...routesWithIdx];
        if (!arr.length) return arr;

        if (sortMode === "tiempo") {
            return arr.sort((a, b) => a.time - b.time);
        }
        if (sortMode === "distancia") {
            return arr.sort((a, b) => a.distance - b.distance);
        }

        // equilibrado
        const minT = Math.min(...arr.map((r) => r.time));
        const maxT = Math.max(...arr.map((r) => r.time));
        const minD = Math.min(...arr.map((r) => r.distance));
        const maxD = Math.max(...arr.map((r) => r.distance));
        const tDen = Math.max(1, maxT - minT);
        const dDen = Math.max(1, maxD - minD);

        return arr
            .map((r) => {
                const tNorm = (r.time - minT) / tDen;
                const dNorm = (r.distance - minD) / dDen;
                const score = 0.5 * tNorm + 0.5 * dNorm; // peso 50/50
                return { ...r, _score: score };
            })
            .sort((a, b) => a._score - b._score);
    }, [routesWithIdx, sortMode]);

    // Paginación
    const total = sortedRoutes.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(page, totalPages);
    const startIdx = (safePage - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    const pageRoutes = sortedRoutes.slice(startIdx, endIdx);

    const headerInicio =
        irPlace.ubicacionMapSelected?.state
            ? "SELECCIÓN EN EL MAPA"
            : irPlace.biosepticosSelect
                ? "BIOSEPTICOS GUAYABAL"
                : irPlace.ubicacionActual
                    ? "UBICACIÓN ACTUAL"
                    : inicio || "—";

    const toggleExpand = (pos) => {
        setExpanded((p) => ({
            state: p.position === pos ? !p.state : true,
            position: pos,
        }));
    };

    // ===================== RENDER =====================
    return (
        <>
            {/* Styles inline: limpio, moderno */}


            <div className="bio-wrap">
                <div className="headers">
                    <div>
                        <div className="title">Rutas posibles: {total}</div>
                        <div className="subtitle">
                            Inicio en <span className="pill">{headerInicio}</span>
                        </div>
                    </div>
                    <div className="pill">Mostrando {Math.min(endIdx, total)} de {total}</div>
                </div>

                {/* Filtros */}
                <div className="filters">
                    <span
                        className={`chip ${sortMode === "tiempo" ? "active" : ""}`}
                        onClick={() => { setSortMode("tiempo"); setPage(1); }}
                        title="Ordenar por menor tiempo total"
                    >
                        ⏱️ Menor tiempo
                    </span>
                    <span
                        className={`chip ${sortMode === "distancia" ? "active" : ""}`}
                        onClick={() => { setSortMode("distancia"); setPage(1); }}
                        title="Ordenar por menor distancia total"
                    >
                        📏 Menor distancia
                    </span>
                    <span
                        className={`chip ${sortMode === "equilibrado" ? "active" : ""}`}
                        onClick={() => { setSortMode("equilibrado"); setPage(1); }}
                        title="Balancea tiempo y distancia"
                    >
                        ⚖️ Más equilibrado
                    </span>
                </div>

                {/* Grid de rutas */}
                <div className="gridsc">
                    {pageRoutes.map((r, localIdx) => {
                        const globalIdx = startIdx + localIdx; // índice dentro del orden actual
                        const startName = showed?.[r.order?.[0]]?.nombre ?? `Punto ${r.order?.[0] ?? "?"}`;
                        const endName =
                            showed?.[r.order?.[r.order.length - 1]]?.nombre ??
                            `Punto ${r.order?.[r.order.length - 1] ?? "?"}`;

                        const isOpen = expanded.state && expanded.position === globalIdx;

                        return (
                            <div key={`${r._idx}-${globalIdx}`} className="cards">
                                <div className="rowss">
                                    <div style={{ alignItems: 'center', display: "flex", gap: ' 54px' }}>
                                        <div style={{ fontSize: '1rem', fontWeight: 700, alignItems: 'center', display: "flex", gap: ' 14px' }}>
                                            <span className=" fzx">Inicio:</span><strong> {startName}</strong>
                                        </div>
                                        <div style={{ fontSize: '1rem', fontWeight: 700, alignItems: 'center', display: "flex", gap: ' 14px' }}>
                                            <span className=" fzx">Final:</span> <strong>{endName}</strong>
                                        </div>
                                    </div>
                                    <button
                                        className="btn secondary"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleExpand(globalIdx);
                                        }}
                                    >
                                        {isOpen ? "Minimizar" : "Ver ruta"}
                                    </button>
                                </div>

                                <div className="rowss">
                                    <div className="pill">⏱️ {fmtTime(r.time)}</div>
                                    <div className="pill">📏 {fmtDist(r.distance)}</div>
                                    <button
                                        className="btn"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            // Llévame ejecuta con índice ORIGINAL del arreglo
                                            doRuta(r._idx);
                                        }}
                                    >
                                        LLEVAME
                                    </button>
                                </div>

                                {isOpen && (
                                    <div className="steps">
                                        {r.order?.map((idx, i) => {
                                            const name = showed?.[idx]?.nombre ?? `Punto ${idx}`;
                                            return (
                                                <div key={`${r._idx}-step-${i}`} className="step">
                                                    <span className="pill" style={{ minWidth: 28, textAlign: "center" }}>
                                                        {i + 1}
                                                    </span>
                                                    <span>{name}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {pageRoutes.length === 0 && (
                        <div className="card">
                            <div className="muted">No hay rutas para mostrar.</div>
                        </div>
                    )}
                </div>

                {/* Footer / Paginador */}
                <div className="footer">
                    <div className="muted">
                        Página {safePage} de {totalPages}
                    </div>
                    <div className="pager">
                        <button
                            className="btn secondary"
                            disabled={safePage <= 1}
                            onClick={(e) => {
                                e.preventDefault();
                                setPage((p) => Math.max(1, p - 1));
                                setExpanded({ state: false, position: -1 });
                            }}
                            style={{ opacity: safePage <= 1 ? 0.6 : 1, cursor: safePage <= 1 ? "not-allowed" : "pointer" }}
                        >
                            ◀︎ Anterior
                        </button>
                        <button
                            className="btn secondary"
                            onClick={(e) => {
                                e.preventDefault();
                                back();
                            }}
                        >
                            ← Volver
                        </button>
                        <button
                            className="btn secondary"
                            disabled={safePage >= totalPages}
                            onClick={(e) => {
                                e.preventDefault();
                                setPage((p) => Math.min(totalPages, p + 1));
                                setExpanded({ state: false, position: -1 });
                            }}
                            style={{ opacity: safePage >= totalPages ? 0.6 : 1, cursor: safePage >= totalPages ? "not-allowed" : "pointer" }}
                        >
                            Siguiente ▶︎
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BioRutaLibre;
