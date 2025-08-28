// pages/rutas-libre.jsx

import Head from 'next/head';
import Declaraciones from '@/engine/declaraciones';
import { Obra } from '@/utils/creadorRuta';
import { useMemo, useState } from 'react';
import InputCompAdress from '@/components/commons/inputAdress';
import VisorTipoObraLibre from '@/bioApp/componentes/visorTipoObraLibre';


const objCss = Declaraciones({ language: 'spanish', type: 'styles' }).styles;

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

export default function Home() {
    // obras ya listas para el visor
    const [listas, setListas] = useState([]);          // <- NUEVO
    const [showed, setShowed] = useState([]);          // espejo del visor; lo llenamos desde `listas`
    const [importadas, setImportadas] = useState([]);  // pendientes por confirmar coords
    const [busy, setBusy] = useState(false);

    // edición puntual (confirmar dirección de una obra)
    const [inRuta, setInRuta] = useState(null); // <- usar null; 0 es válido
    const [adressView, setAdressView] = useState({ state: false, centre: { ltn: 6.1576585, lgn: -75872710271 }, map: false });
    const [personalObj, setPersonalObj] = useState(null);

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

    // cuando el input de dirección retorna centro (lat/lng), movemos la obra: importadas -> listas
    const handleCreateAll = (value) => {
        const coords = value?.centre;
        if (!coords || typeof coords.lat !== 'number' || typeof coords.lng !== 'number') return;
        if (inRuta === null || personalObj == null) return;

        setImportadas((prev) => {
            const next = [...prev];
            const ob = next[inRuta];
            if (!ob) return prev;
            const actualizada = new Obra({
                id: ob.id, // mantiene el id de la obra
                nombre: ob.nombre,
                empresa: ob.empresa,
                contact: {
                    nombre: ob.contact?.nombre || "",
                    correoElectronico: ob.contact?.correoElectronico || "",
                    direccion: {
                        coordenadas: { lat: coords.lat, lng: coords.lng }
                    }
                },
                direccion: {
                    ciudad: ob.direccion?.ciudad || "Medellín",
                    otros: ob.direccion?.otros || "",
                    coordenadas: { lat: coords.lat, lng: coords.lng },
                },
                legal: ob.legal,
                idUser: ob.idUser || `USR-${ob.id}`,
            });


            // quitar de importadas
            next.splice(inRuta, 1);

            // agregar a listas
            setListas((prevListas) => {
                const nuevas = [...prevListas, actualizada];
                return nuevas;
            });

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
    const [willShows, setWillShow] = useState('')

    return (
        <>
            <Head>
                <title>Rutas Libre</title>
                <meta name="description" content="Rutas con carga desde Excel y confirmación de dirección" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <main className="div-main">
                <div className="flex-column-entregas transparent" style={{ gap: 16 }}>
                    {showed.length === 0 && <>
                        <section style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>
                            <h2>Agregar ruta</h2>
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

                                <button
                                    disabled={importadas.length === 0}
                                    onClick={() => setImportadas([])}
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
                                    <h3 style={{ marginTop: 16 }}>Obras importadas (pendientes por confirmar) — {importadas.length}</h3>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
                                        {importadas.map((obra, idx) => {
                                            const hasCoords = !!(obra?.direccion?.coordenadas?.lat && obra?.direccion?.coordenadas?.lng);
                                            return (
                                                <li
                                                    key={obra.id}
                                                    style={{
                                                        display: inRuta !== null ? (inRuta !== idx ? 'none' : 'block') : 'block',
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
                                                                    <span>✅ lat: {obra.direccion.coordenadas.lat}, lng: {obra.direccion.coordenadas.lng}</span>
                                                                ) : (
                                                                    <span
                                                                        className="pointer"
                                                                        onClick={() => {
                                                                            setPersonalObj(obra);
                                                                            setInRuta(idx);
                                                                        }}
                                                                    >
                                                                        ⚠️ Sin coordenadas (confirmar)
                                                                    </span>
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
                    <section style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>
                        <h2>Visor</h2>
                        {showed.length === 0 ? (
                            <p>Primero convierte y confirma direcciones. Luego usa “Usar obras listas”.</p>
                        ) : (
                            <VisorTipoObraLibre listos={[]} showed={showed} />
                        )}
                    </section>
                </div>
            </main>
        </>
    );
}

export async function getServerSideProps() {
    return { props: {} };
}
