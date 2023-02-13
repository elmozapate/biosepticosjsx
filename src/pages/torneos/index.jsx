import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Carreras from './carreras'
import Jugadores from './jugadores'
export const ObjPlayer = (nombre = 'Moet') => {
    return {
        nombre: nombre,
        ultimoJuego: 'carreras',
        historial: [],
        activo: {
            juego: 'carreras',
            estado: true,
            historial: []
        }
    }
}

export const ObjNivelesDisponibles = {
    novato: false,
    amateur: false,
    profesional: false,
    experto: false
}
export const ObjNivelesDisponiblesFunt = () => {
    return {
        novato: false,
        amateur: false,
        profesional: false,
        experto: false
    }
}
export const objCarreras = () => {
    return {
        pistas: [{
            pista: 'moet',
            nivelesDisponibles: {
                novato: true,
                amateur: true,
                profesional: true,
                experto: true
            },
            nivel: 'amateur',
            maxPlayers: 4,
            recordGeneral: { vuelta: { tiempo: Number(), poseedor: 'sinRecord' }, carrera: [{ tiempo: Number(), poseedor: '', vueltas: Number(), data: {} }] },
            historial: []
        }],
        torneos: [],
        enTorneo: {
            nombre: '', jugadores: [], id: Number(), pistas: [{
                pista: '',
                nivelesDisponibles: ObjNivelesDisponibles,
                nivel: '',
                recordGeneral: { vuelta: { tiempo: Number(), poseedor: '' }, carrera: { tiempo: Number(), poseedor: '' } },
                recordActual: { vuelta: { tiempo: Number(), poseedor: '' }, carrera: { tiempo: Number(), poseedor: '' } }
            }], vueltas: Number(), modalidad: '', jugadoresporpartida: Number(), bonus: {
                recordVuelta: Number(), recordPista: Number(), recordVueltaGeneral: Number(), ganarPista: Number(), ganarCarrera: Number()

            }
        }
    }
}
export const Niveles = ['novato', 'amateur', 'profesional', 'experto',]
let disponible = []
export default function Home(props) {
    const { usersArray = [], mensajes = {} } = props
    const [torneo, setTorneo] = useState('')
    const [carrerasObj, setCarrerasObj] = useState(objCarreras())
    const creadorDePistas = (newPista) => {
        let resPistas = {
            pista: newPista.nombre,
            nivelesDisponibles: newPista.niveles,
            nivel: '',
            maxPlayers: 1,
            recordGeneral: { vuelta: { tiempo: Number(), poseedor: 'sinRecord' }, carrera: [{ tiempo: Number(), poseedor: '', vueltas: Number(), data: {} }] },
            historial: []
        }
        let existe = false
        /*  if (carrerasObj.pistas.length > 0) {
             carrerasObj.pistas.map((key, i) => {
                 if (key.pista === newPista.nombre) {
                     existe = true
                 }
             })
         } */
        if (!existe) {
            let oldPistas = carrerasObj.pistas
            Niveles.map((key, i) => {
                if (newPista.niveles[key]) {
                    resPistas = {
                        pista: newPista.nombre,
                        nivel: key,
                        maxPlayers: newPista.maxPlayers,
                        nivelesDisponibles: newPista.niveles,
                        recordGeneral: { vuelta: { tiempo: Number(), poseedor: 'sinRecord' }, carrera: [{ tiempo: Number(), poseedor: '', vueltas: Number(), data: {} }] },
                        historial: []
                    }
                    oldPistas.push(resPistas)
                }
            })

            setCarrerasObj({
                ...carrerasObj,
                pistas: oldPistas
            })
            return 'ok'
        } else {
            return 'existe'
        }

    }
    const ingresarEnSala = (sala, typo, valor) => {
        if (typo === 'torneo') {
            carrerasObj.torneos.map((key, i) => {
                if (key.id === sala.id) {
                    setCarrerasObj({
                        ...carrerasObj,
                        enTorneo: {
                            ...carrerasObj.enTorneo,
                            ...key
                        }
                    })
                }
            })
        }
        if (typo === 'addPlayer') {
            carrerasObj.torneos.map((key, i) => {
                if (key.id === sala.id) {
                    setCarrerasObj({
                        ...carrerasObj,
                        enTorneo: {
                            ...carrerasObj.enTorneo,
                            jugadores: valor
                        },
                    })
                }
            })
        }

    }
    const creadorDePistasTorneo = (cantidad, seleccionadas, niveles) => {
        let resPistas = {
            pista: '',
            maxPlayers: 1,
            nivelesDisponibles: ObjNivelesDisponibles,
            recordGeneral: { vuelta: { tiempo: Number(), poseedor: '' }, carrera: { tiempo: Number(), poseedor: '' } },
            recordActual: { vuelta: { tiempo: Number(), poseedor: '' }, carrera: { tiempo: Number(), poseedor: '' } }
        }
        if (cantidad > 0 && carrerasObj.pistas.length > 0) {
            carrerasObj.pistas.map((key, i) => {
                if (key.pista === seleccionadas.pista && key.nivel === seleccionadas.nivel) {
                    resPistas = {
                        maxPlayers: key.maxPlayers,
                        pista: key.pista,
                        recordGeneral: carrerasObj.pistas[i].recordGeneral,
                        recordActual: { vuelta: { tiempo: Number(), poseedor: '' }, carrera: { tiempo: Number(), poseedor: '' } }
                    }

                }

            })
        }
        return resPistas
    }
    const [Players, setPlayers] = useState({ array: [ObjPlayer()], nombres: [], activos: [], off: [] })
    const [PlayersNames, setPlayersNames] = useState({ array: [ObjPlayer()], nombres: [], activos: [], off: [] })

    const setPlayer = (nombre, typo, set, setValue) => {
        let oldPlayers = Players
        if (typo === 'actualize') {
            Players.array.map((key, i) => {
                if (key.nombre === nombre) {
                    if (set === 'activarJuego') {
                        oldPlayers.array[i].ultimoJuego = setValue,
                            oldPlayers.array[i].activo = {
                                ...oldPlayers.array[i].activo,
                                juego: setValue,
                                estado: true,
                                historial: []
                            }
                    }
                }
            })
        } else {
            const newPlayer = ObjPlayer(nombre)
            oldPlayers.array.push(newPlayer)
        }
        setPlayersNames({ ...Players, array: oldPlayers.array })

    }
    const [carrerasDispo, setCarrerasDispo] = useState([])
    const setCarrerasDispobles = (carrera, value) => {
        disponible = carrerasDispo;
        carrerasDispo.map((key, i) => {
            if (carrera.pista === key.pista && key.nivel === carrera.nivel) {
                disponible[i].active = value
            }
        })
        setCarrerasDispo(disponible)
    }
    const creartorneo = (nombre, torneo, id) => {
        let disponible = carrerasObj.torneos;
        disponible.push({ nombre: nombre, pistas: torneo.pistas, id: id })
        setCarrerasObj({ ...carrerasObj, torneos: disponible })
    }

    const crearDispo = () => {
        let disponible = [];
        carrerasObj.pistas.map((key) => {
            disponible.push({
                ...key,
                active: false
            })
        })
        setCarrerasDispo(disponible)
    }
    useEffect(() => {
        let ply = [];
        let aply = []
        let oPlay = []
        PlayersNames.array.map((key, i) => {
            ply.push(key.nombre)
            if (key.activo.estado === true) {
                aply.push(key.nombre)
            }
            if (!key.activo.estado === true) {
                oPlay.push(key.nombre)
            }
        })
        setPlayers({ ...PlayersNames, nombres: ply, activos: aply, off: oPlay })
    }, [PlayersNames])


    return (
        <>
            <Head>
                <title>TORNEOS</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={'div-main'}>
                <div className='flex-column-100 torneos'>
                    {
                        torneo === '' ?
                            <>
                                <div className='s1'>
                                    <h1>VICIOSOS POR EL JUEGO</h1>
                                    <h1>Seleccione categoria</h1>
                                </div>
                                <div className='s2'>
                                    <h1 onClick={(e) => { e.preventDefault(), setTorneo('jugadores') }}>JUGADORES</h1>
                                    <h1 onClick={(e) => { e.preventDefault(), setTorneo('carreras') }}>CARRERAS</h1>
                                </div>

                            </> : <>

                                {
                                    torneo === 'carreras' &&

                                    <><Carreras ingresarEnSala={ingresarEnSala} creartorneo={creartorneo} creadorDePistasTorneo={creadorDePistasTorneo} crearDispo={crearDispo} carrerasDispo={carrerasDispo} setCarrerasDispobles={setCarrerasDispobles} carrerasObj={carrerasObj} creadorDePistas={creadorDePistas} Players={Players} setPlayer={setPlayer} back={() => { setTorneo('') }} /></>
                                }
                                {
                                    torneo === 'jugadores' &&

                                    <><Jugadores Players={Players} setPlayer={setPlayer} back={() => { setTorneo('') }} /></>
                                }
                            </>
                    }
                </div>
            </main>
        </>
    )
}
