
import SelectComp from '@/components/commons/selector'
import { useEffect, useState } from 'react'
import { Niveles, objCarreras, ObjNivelesDisponiblesFunt, ObjPlayer } from '.'
import ComponentePistas from './componentePistas'
import ComponentePistasTorneo from './componentePsitasTorneo'
import EnTorneo from './enTorneo'
import Jugadores from './jugadores'
const arrayJuegos = [{
    pista: 1,
    recordPista: { tiempo: '1,58.40', nombre: 'j' },
}]
const opcionesCarreras = ['record', 'menu', 'pistas', 'historial', 'players', 'carreraSimple', 'torneo', 'multijugador']
const newPlayrObj = () => {
    return {
        nombre: '',
        niveles: ObjNivelesDisponiblesFunt(),
        maxPlayers: -1,
        vueltas: -1
    }
}
const Carreras = (props) => {
    const { creartorneo = console.log, creadorDePistasTorneo = console.log, crearDispo = console.log, carrerasDispo = console.log, setCarrerasDispobles = console.log, ingresarEnSala = console.log, carrerasObj = objCarreras(), creadorDePistas = console.log, back = console.log, setPlayer = console.log, Players = { array: [ObjPlayer()], nombres: [], activos: [], off: [] } } = props
    const [newPlayer, setNewPlayer] = useState()
    const [niveles, setNiveles] = useState(newPlayrObj())
    const [carrerasArray, setCarrerasArray] = useState(arrayJuegos)
    const [state, setState] = useState({ record: false, menu: true, pistas: false, historial: false, players: false, carreraSimple: false, torneo: false, multijugador: false, })
    const [stateExtra, setStateExtra] = useState({ newPlayer: false, newPista: false, newTorneo: false, startTorneo: false, historial: false, players: Players, enNiveles: false, torneo: false, inTorneo: false, })
    const resetState = () => {
        setNewPlayer(newPlayrObj());
        setNiveles({
            niveles: ObjNivelesDisponiblesFunt(),
            selected: false,
            selector: Niveles

        })
    }
    const setNewPlayerFunt = (e) => {
        e.preventDefault()
        const value = e.target.value
        setNewPlayer({
            ...newPlayer,
            nombre: value
        })
    }

    const setNewPlayerNiveles = (e) => {
        e.preventDefault()
        const oldValues = newPlayer
        const value = e.target.value
        let newSelector = []
        niveles.selector.map((key, i) => {
            if (value !== key) {
                newSelector.push(key)
            }
        })
        setNiveles({
            ...niveles,
            selected: true,
/*             selector: newSelector,
 */            niveles: {
                ...newPlayer.niveles,
                [value]: !oldValues.niveles[value]
            }
        })
        /*         entryNewPlayerNiveles()
         */
    }
    const quitPlayerNiveles = (value) => {
        let newSelector = niveles.selector
        newSelector.push(value)
        setNiveles({
            ...niveles,
            selector: newSelector,
            niveles: {
                ...newPlayer.niveles,
                [value]: false
            }
        })
        setNewPlayer({
            ...newPlayer,
            niveles: {
                ...newPlayer.niveles,
                [value]: false
            }
        })
    }
    const entryNewPlayerNiveles = () => {
        let newSelector = []
        Niveles.map((key, i) => {
            if (!niveles.niveles[key]) {
                newSelector.push(key)
            }
        })
        setNewPlayer({
            ...newPlayer,
            niveles: {
                ...newPlayer.niveles,
                ...niveles.niveles
            }
        })
        setNiveles({
            ...niveles,
            selected: false,
            selector: newSelector,
            /*          niveles: {
                         ...newPlayer.niveles,
                     } */
        })
    }

    const crearTorneo = () => {
        let newTorneo = {
            nombre: newPlayer.nombre,
            pistas: [],
            estado: false,
            participantes: [],
            data: {},
            id: parseInt(Math.random() * 88765)
        }
        carrerasDispo.map((key, i) => {
            const pistaNueva = creadorDePistasTorneo(1, key)
            newTorneo.pistas.push(pistaNueva);
        })
        creartorneo(newPlayer.nombre, newTorneo, newTorneo.id)
    }
    const setTheState = (stateIn) => {
        let newState = state
        opcionesCarreras.map((key, i) => {
            if (key !== 'assaas') {
                if (key === stateIn) {
                    newState[key] = true
                } else {
                    newState[key] = false
                }
            }
        })
        setState({ ...state, ...newState })
    }

    return (
        <>
            <div className='torneos'>
                {
                    state.menu ?
                        <>
                            <h1>MENU CARRERAS</h1>
                            {opcionesCarreras.map((key, i) => {
                                return (<>
                                    {key !== 'menu' && key !== 'record' && <p className='flex-row listaBoton' id={i}>
                                        {key}  <span>
                                            <button onClick={(e) => { e.preventDefault(); resetState(); setTheState(key) }}>
                                                IR
                                            </button>
                                        </span>
                                    </p>}
                                </>)
                            })}
                        </> : <></>
                }
                {
                    state.torneo ?
                        !stateExtra.newTorneo && !stateExtra.startTorneo ?
                            <>
                                <h1>TORNEOS</h1>
                                <button onClick={(e) => {
                                    e.preventDefault(); resetState(); crearDispo(); setStateExtra({ ...stateExtra, newTorneo: true });
                                }}>
                                    CREAR NUEVO TORNEO
                                </button>
                                <button onClick={(e) => {
                                    e.preventDefault(); resetState(); setStateExtra({ ...stateExtra, startTorneo: true });
                                }}>
                                    INICIAR UN TORNEO
                                </button>
                                {/*  <button onClick={(e) => { e.preventDefault(); setTheState('menu') }}>
                            VOLVER AL MENU
                        </button>
                            {carrerasArray.map((key, i) => {

                                return (<>
                                    <p className='flex-row listarecord' id={i}>
                                        <span className='s'> {key.pista}</span>
                                        <span> {key.recordPista.tiempo}</span>
                                        <span>{key.recordPista.nombre}</span>
                                    </p>
                                </>)
                            })} */}
                            </> :
                            <>
                                {stateExtra.newTorneo &&

                                    <>
                                        NOMBRE DEL TORNEO
                                        <input min="0" id="nombre" type="text" placeholder="NOMBRE DEL TORNEO" required="" value={newPlayer.nombre} onChange={setNewPlayerFunt} />
                                        <ComponentePistas setStateExtra={setStateExtra} crearDispo={crearDispo} stateExtra={stateExtra} setCarrerasDispobles={setCarrerasDispobles} carrerasDispo={carrerasDispo} />
                                        {newPlayer.nombre.length > 0 &&
                                            <>
                                                <button onClick={(e) => { e.preventDefault(); crearTorneo(); setStateExtra({ ...stateExtra, newTorneo: false }); }}>
                                                    CREAR TORNEO
                                                </button>
                                            </>
                                        }
                                    </>
                                }
                                {stateExtra.startTorneo ?
                                    <>  {!stateExtra.inTorneo ? <>
                                        <h1>TORNEOS  </h1>
                                        <button onClick={(e) => { e.preventDefault(); setStateExtra({ ...stateExtra, startTorneo: false }); }}>
                                            VOLVER
                                        </button>
                                        {carrerasObj.torneos.map((key, i) => {
                                            return (
                                                <div className='flex-row'>
                                                    <p className='flex-row listaPlayer' id={i}>
                                                        <span className='
                                                            xxl'> {key.nombre}</span>
                                                        <span onClick={(e) => { e.preventDefault(); ingresarEnSala(key, 'torneo'); setStateExtra({ ...stateExtra, inTorneo: true }); }} className='
                                                            xxl'> INICIAR</span>
                                                    </p>
                                                </div>

                                            )
                                        })}
                                    </> :
                                        <>
                                            <EnTorneo ingresarEnSala={ingresarEnSala} carrerasObj={carrerasObj} Players={Players} />
                                            <span onClick={(e) => { e.preventDefault(); setStateExtra({ ...stateExtra, inTorneo: false }); }} className='
                                                            xxl'> VOLVER</span>
                                        </>
                                    }</>
                                    : <></>}
                            </> : <></>
                }
                {
                    state.record ?
                        <>
                            <h1>RECORDS</h1>
                            <p className='flex-row listarecord' id={'0'}>
                                <span className='s'> Pista </span>
                                <span> Tiempo Vuelta </span>
                                <span>Dueño Record</span>
                            </p>
                            {carrerasArray.map((key, i) => {

                                return (<>
                                    <p className='flex-row listarecord' id={i}>
                                        <span className='s'> {key.pista}</span>
                                        <span> {key.recordPista.tiempo}</span>
                                        <span>{key.recordPista.nombre}</span>
                                    </p>
                                </>)
                            })}
                        </> : <></>
                }
                {
                    !state.menu &&
                    <>
                        <button onClick={(e) => { e.preventDefault(); setTheState('menu') }}>
                            VOLVER AL MENU
                        </button>
                    </>
                }
                {
                    state.pistas &&
                    <>
                        {!stateExtra.newPista ?
                            <>

                                {
                                    carrerasObj.pistas.length > 0 ?
                                        <>
                                            <h1>PISTAS ACTUALES</h1>
                                            {carrerasObj.pistas.map((key, i) => {
                                                return (
                                                    <div className='flex-row'>
                                                        <p className='flex-row listaPlayer' id={i}>
                                                            <span className='
                                                            xxl'> {key.pista}</span>
                                                            <span className='
                                                            xxl'> {key.nivel}</span>
                                                            <span className='
                                                            xxl'> ver mas</span>
                                                        </p>
                                                    </div>
                                                )
                                            })}

                                        </>
                                        :
                                        <>SIN PISTAS ACTUALMENTE</>
                                }
                                <button onClick={(e) => { e.preventDefault(); setStateExtra({ ...stateExtra, newPista: true }); resetState(); }}>
                                    {carrerasObj.pistas.length > 0 ? 'CREAR NUEVA PISTA' : 'CREA PRIMERA PISTA'}
                                </button>
                            </> :
                            <>
                                <div class="absolutedialog">
                                    <div class="absolutedialog_popout">
                                        <form onSubmit={(e) => { e.preventDefault() }} className="form-registro">
                                            {stateExtra.enNiveles ?
                                                <>
                                                    NIVELES DISPONNIBLES
                                                    <SelectComp item={'niveles'} items={niveles.selector
                                                    } funtions={setNewPlayerNiveles} />
                                                    {niveles.selected && <button onClick={(e) => { e.preventDefault(); entryNewPlayerNiveles(); }} >Agregar</button>}
                                                    {stateExtra.enNiveles && niveles.selector.length > 0 && <>
                                                        NIVELES ACTUALES
                                                        {Niveles.map((key, i) => {
                                                            let isIn = false;
                                                            niveles.selector.map((keySel, iSel) => {
                                                                if (key === keySel) {
                                                                    isIn = true
                                                                }
                                                            })
                                                            return (
                                                                <>{
                                                                    !isIn ? <><p>{key} <span onClick={(e) => { e.preventDefault(); quitPlayerNiveles(key); }}>QUITAR</span></p></> : <></>
                                                                }</>
                                                            )
                                                        })}</>}
                                                    {niveles.selector.length !== Niveles.length ? <button onClick={(e) => { e.preventDefault(); setStateExtra({ ...stateExtra, enNiveles: false }) }} >ACEPTAR Y GUARDAR</button> : <button onClick={(e) => { e.preventDefault(); setStateExtra({ ...stateExtra, enNiveles: false }) }} >VOLVER</button>}

                                                </>
                                                :
                                                < >
                                                    <p>NOMBRE DE LA PISTA</p>
                                                    <input min="0" id="nombre" type="text" placeholder="NOMBRE DE LA PISTA" required="" value={newPlayer.nombre} onChange={setNewPlayerFunt} />
                                                    <p onClick={(e) => { e.preventDefault(); setStateExtra({ ...stateExtra, enNiveles: true }) }} >AGREGAR NIVELES</p>
                                                    <SelectComp item={'maxPlayers'} items={[1, 2, 3, 4]}
                                                        funtions={(e) => { e.preventDefault(); const value = e.target.value; setNewPlayer({ ...newPlayer, maxPlayers: value }) }} />

                                                    <div>

                                                    </div>


                                                </>}
                                            {newPlayer.nombre.length > 3 && niveles.selector.length !== Niveles.length && <p onClick={(e) => { e.preventDefault(); creadorDePistas(newPlayer); setStateExtra({ ...stateExtra, newPista: false }) }} >CREAR</p>}
                                            {!stateExtra.enNiveles && <button onClick={(e) => { e.preventDefault(); setStateExtra({ ...stateExtra, newPista: false, enNiveles: false }) }} >VOLVER</button>}
                                        </form>
                                    </div>
                                </div>
                            </>
                        }
                    </>
                }
                {
                    state.players &&
                    <>
                        <div>
                            <h1>JUGADORES ACTIVOS</h1>
                            {
                                Players.array.map((key, i) => {
                                    if (key.activo.estado && key.activo.juego === 'carreras') {
                                        return (<span className='xl' id={`iuss-${i}`}> {key.nombre}</span>)
                                    }
                                })
                            }
                        </div>
                        <div>
                            {stateExtra.newPlayer ?
                                <div class="absolutedialog">
                                    <div class="absolutedialog_popout">
                                        <form onSubmit={(e) => { e.preventDefault() }} className="form-registro">
                                            <p>JUGADOR</p>
                                            <SelectComp item={'jugadores'} items={Players.off
                                            } funtions={(e) => { e.preventDefault(); const value = e.target.value; setNewPlayer({ ...newPlayer, nombre: value }) }} />
                                            {newPlayer.nombre.length > 3 && <button onClick={(e) => { e.preventDefault(); setPlayer(newPlayer.nombre, 'actualize', 'activarJuego', 'carreras'); setTheState('menu'); setStateExtra({ ...stateExtra, newPlayer: false }) }} >UNIRME </button>}
                                            <button onClick={(e) => { e.preventDefault(); setTheState('menu') }} >VOLVER</button>
                                        </form>
                                    </div>
                                </div>
                                :
                                <>
                                    <button onClick={(e) => { e.preventDefault(); setStateExtra({ ...stateExtra, newPlayer: true }) }} >UNIR UN NUEVO JUGADOR</button>
                                </>}
                        </div>
                        {stateExtra.newPlayer && <button onClick={(e) => { e.preventDefault(); setTheState('menu') }}>
                            VOLVER AL MENU
                        </button>}
                    </>
                }
                {state.menu && <button className='back' onClick={(e) => { e.preventDefault(); back() }}>
                    MENU PRINCIPAL
                </button>}
            </div>

        </>
    )
}
export default Carreras