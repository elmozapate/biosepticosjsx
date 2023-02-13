import { useState } from "react"
import { objCarreras } from "."
const optionsArray = []
const EnTorneo = (props) => {
    const { Players = { array: [] }, ingresarEnSala = console.log, carrerasObj = objCarreras() } = props
    const [torneoPlayers, setTorneoPlayers] = useState({ array: carrerasObj.enTorneo.jugadores })
    const [stage, setstage] = useState({ value: 0, inValue: 0, inCategory: '', inConfiguration: '' })
    const agregarQuitaJugadores = (keyIn, quit) => {
/*         setstage({ ...stage, value: -1 })
 */        if (!quit) {
            const oldArray = carrerasObj.enTorneo.jugadores
            oldArray.push(keyIn)
            setTorneoPlayers({
                ...torneoPlayers,
                array: oldArray
            })
            ingresarEnSala(carrerasObj.enTorneo, 'addPlayer', oldArray)
        } else {
            const oldArray = Players.array
            let newArray = []
            oldArray.map((key, i) => {
                if (key.nombre == keyIn.nombre) {
                } else {
                    newArray.push(key)
                }
            })
            setTorneoPlayers({
                ...torneoPlayers,
                array: newArray
            })
            ingresarEnSala(carrerasObj.enTorneo, 'addPlayer', newArray)

        }
        /*  setTimeout(() => {
             setstage({ ...stage, value: 0 })
 
         }, 11); */
    }
    const check = (key) => {
        let res = true
        carrerasObj.enTorneo.jugadores.map((keyM, iM) => {
            if (key.nombre && keyM.nombre && key.nombre === keyM.nombre) {
                res = false
            }
        })
        return res
    }
    return (
        <>
            {
                stage.value === 0 &&
                <>
                    <h1>INGRESA LOS JUGADORES</h1>
                    {
                        Players.array.map((key, i) => {
                            if (key.activo.estado && key.activo.juego === 'carreras' && check(key)) {
                                return (
                                    <div className="flex-row">
                                        <span className='xl' id={`iuss-${i}`}> {key.nombre}</span>
                                        <span
                                            onClick={(e) => { e.preventDefault(); agregarQuitaJugadores(key) }}
                                            className='xl' id={`iuss-${i}`}> UNIRME AL TORNEO</span>
                                    </div>
                                )
                            }
                        })
                    }
                    <div>
                        <h1>JUGADORES</h1>
                        {
                            carrerasObj.enTorneo.jugadores.map((key, i) => {

                                return (
                                    <div className="flex-row">
                                        <span className='xl' id={`iuss-${i}`}> {key.nombre}</span>
                                        <span
                                            onClick={(e) => { e.preventDefault(); agregarQuitaJugadores(key, true) }}
                                            className='xl' id={`iuss-${i}`}> SALIR DEL TORNEO</span>
                                    </div>
                                )
                            })
                        }
                        {carrerasObj.enTorneo.jugadores.length > 1 && <span
                            onClick={(e) => { e.preventDefault(); setstage({ ...stage, value: 1 }); }}
                            className='xl' id={`iussd}`}> CONTINUAR</span>}
                    </div>
                </>
            }
            {
                stage.value === 1 &&
                <>
                    {(console.log(carrerasObj.enTorneo))}
                    {stage.inValue === 0 ? <>
                        <h1>CONFIGURAR TORNEO</h1>
                        <span
                            onClick={(e) => { e.preventDefault(); setstage({ ...stage, inValue: 1 }); }}
                            className='xl' id={`iussd}`}> categoria</span>
                        <span
                            onClick={(e) => { e.preventDefault(); setstage({ ...stage, inValue: 2 }); }}
                            className='xl' id={`iussd}`}> configuracion</span>
                    </> :
                        <>
                            {stage.inValue === 1 ?
                                <>
                                    <h1>categorias</h1>
                                    {carrerasObj.enTorneo.jugadores.length > 1 && <span onClick={(e) => { e.preventDefault(); setstage({ ...stage, inCategory: '' }); }} className='xl'>DEADMATCH</span>}
                                    {carrerasObj.enTorneo.jugadores.length > 3 && <span onClick={(e) => { e.preventDefault(); setstage({ ...stage, inCategory: '' }); }} span className='xl'>GRUPOS</span>}
                                    {carrerasObj.enTorneo.jugadores.length > 3 && <span onClick={(e) => { e.preventDefault(); setstage({ ...stage, inCategory: '' }); }} className='xl'>ELIMINACION</span>}
                                    {carrerasObj.enTorneo.jugadores.length > 2 && <span onClick={(e) => { e.preventDefault(); setstage({ ...stage, inCategory: '' }); }} className='xl'>PAREJAS</span>}
                                    {carrerasObj.enTorneo.jugadores.length > 1 && <span onClick={(e) => { e.preventDefault(); setstage({ ...stage, inCategory: '' }); }} className='xl'>CAMPEONATO</span>}
                                    <span onClick={(e) => { e.preventDefault(); setstage({ ...stage, inValue: 0 }); }}>VOLVER</span>

                                </> : <>
                                    <h1>configuracion</h1>
                                    <span className='xl'>jugadoresporpartida</span>
                                    <span className='xl'>vueltas</span>
                                    <span className='xl'>bonus</span>
                                    <span onClick={(e) => { e.preventDefault(); setstage({ ...stage, inValue: 0 }); }}>VOLVER</span>
                                </>

                            }
                        </>
                        /* 
                                                {
                                                
                                                    
                                            
                                            
                                            }
                                            {
                                                
                                            
                                            } */

                    }
                </>

            }
            {
                stage === 2 &&
                <></>
            }
        </>)
}
export default EnTorneo