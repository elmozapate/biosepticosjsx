
import SelectComp from '@/components/commons/selector'
import { useEffect, useState } from 'react'
import { ObjPlayer } from '.'

const testing = false
const arrayJuegos = [{
    pista: 1,
    recordPista: { tiempo: '1,58.40', nombre: 'j' },
}]
const opcionesJugadores = ['menu', 'players', 'Crear Jugador', 'actualizaJugador']
const Jugadores = (props) => {
    const { back = console.log, Players = { array: [ObjPlayer()], nombres: [], activos: [], off: [] }, setPlayer = console.log } = props
    const [newPlayer, setNewPlayer] = useState({ nombre: '' })
    const [state, setState] = useState({ menu: true, ['Crear Jugador']: false, actualizaJugador: false, players: false, historial: false })
    const setTheState = (stateIn) => {
        let newState = state
        opcionesJugadores.map((key, i) => {
            if (key !== 'kk') {
                if (key === stateIn) {
                    newState[key] = true
                } else {
                    newState[key] = false
                }
            }

        })
        setState({ ...state, ...newState })
    }
    const setPlayerName = (e) => {
        e.preventDefault()
        const value = e.target.value
        setNewPlayer({
            ...newPlayer,
            nombre: value
        })
    }

    return (
        <>
            <div className='torneos'>
                {
                    state.menu ?
                        <>
                            <h1>MENU JUGADORES</h1>
                            {opcionesJugadores.map((key, i) => {
                                return (<>
                                    {key !== 'menu' && <p className='flex-row listaBoton' id={i}>
                                        {key}  <span>
                                            <button onClick={(e) => { e.preventDefault(); setTheState(key) }}>
                                                IR
                                            </button>
                                        </span>
                                    </p>}
                                </>)
                            })}
                        </> : <></>
                }
                {
                    state.actualizaJugador ?
                        <>
                            <h1>ACTUALIZAR JUGADOR</h1>
                            <div className='tablaplayers'>
                                <div class="absolutedialog">
                                    <div class="absolutedialog_popout">
                                        <form onSubmit={(e) => { e.preventDefault() }} className="form-registro">
                                            <p>DATOS</p>
                                            <SelectComp item={'JUGADORES'} items={Players.nombres
                                            } funtions={console.log} />

                                            {newPlayer.nombre.length > 3 && <button onClick={(e) => { e.preventDefault(); setPlayer(newPlayer.nombre); setTheState('menu') }} >CREAR</button>}
                                            <button onClick={(e) => { e.preventDefault(); setTheState('menu') }} >VOLVER</button>
                                        </form>
                                    </div>
                                </div>
                            </div>

                        </> : <></>
                }

                {
                    state.players ?
                        <>
                            <h1>JUGADORES</h1>
                            <div className='tablaplayers'>
                                <p className='flex-row listaPlayer' id={'0'}>
                                    <span className='xl'> JUGADOR </span>
                                    <span className='xl'> ULTIMO JUEGO </span>
                                    <span className='xxl'> JUGANDO </span>
                                    <span>MAS</span>
                                </p>
                                {(testing ? [ObjPlayer()] : Players.array).map((key, i) => {

                                    return (<>
                                        <p className='flex-row listaPlayer' id={i}>
                                            <span className='xl'> {key.nombre}</span>
                                            <span className='xl'> {key.ultimoJuego}</span>
                                            <span className='xxl'> {key.activo.estado ? key.activo.juego : ''}</span>
                                            <span> <button onClick={(e) => { e.preventDefault(); }}>VER MAS</button></span>

                                        </p>
                                    </>)
                                })}
                            </div>

                        </> : <></>
                }
                {
                    state['Crear Jugador'] ?
                        <>
                            <h1>CREAR JUGADOR</h1>
                            <div className='tablaplayers'>
                                <div class="absolutedialog">
                                    <div class="absolutedialog_popout">
                                        <form onSubmit={(e) => { e.preventDefault() }} className="form-registro">
                                            <p>INGRESA TUS DATOS</p>
                                            <input min="0" id="nombre" type="text" placeholder="nombre" required="" value={newPlayer.nombre} onChange={setPlayerName} />
                                            {newPlayer.nombre.length > 3 && <button onClick={(e) => { e.preventDefault(); setPlayer(newPlayer.nombre, 'newPlayer'); setTheState('menu') }} >CREAR</button>}
                                            <button onClick={(e) => { e.preventDefault(); setTheState('menu') }} >VOLVER</button>
                                        </form>
                                    </div>
                                </div>
                            </div>

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
                {state.menu && <button className='back' onClick={(e) => { e.preventDefault(); back() }}>
                    SALIR AL MENU PRINCIPAL
                </button>}
            </div>

        </>
    )
}
export default Jugadores