import { useEffect, useState } from "react"
import { Niveles, ObjNivelesDisponibles } from "."

const ComponentePistasTorneo = (props) => {
    const { stateExtra = {}, setStateExtra = console.log, setCarrerasDispobles = console.log, carrerasDispo = [] } = props
    const [inCharge, setIncharge] = useState(false)
    const [inPista, setInPista] = useState({ pista: {}, niveles: ObjNivelesDisponibles, nivelesDisponibles: ObjNivelesDisponibles })
    const charging = () => {
    }
    const darNiveles = (key) => {
        setInPista({
            ...inPista,
            pista: key,
            niveles: key.nivelesDisponibles,
            nivelesDisponibles: key.nivelesDisponibles

        });
        setIncharge(true)
    }
    const loadIn = (key) => {
        setIncharge(true)

        setCarrerasDispobles(key, false, ObjNivelesDisponibles)
        setTimeout(() => {
            setIncharge(false)
        }, 1);
    }
    /*  useEffect(() => {
     }, []) */
    return (
        <>{!inCharge ?
            <>
                <h1>SELECCIONA LAS PISTAS</h1>
                {
                    carrerasDispo.map((key, i) => {
                        return (
                            <div className='flex-row'>
                                <p className='flex-row ' id={i}>
                                    <span className='
                            xxl'> {key.pista}</span>
                                    <span
                                        onClick={(e) => {
                                            e.preventDefault(); key.active ? loadIn(key) : darNiveles(key); setIncharge(true);
                                        }}
                                        className='
                            xxl'> {key.active ? 'QUITAR' : 'AGREGAR'}</span>
                                </p>
                            </div>
                        )
                    })
                }
            </> : <>
                <div>
                    NIVELES ACTUALES
                    {Niveles.map((key, i) => {
                        let isIn = true;
                        if (inPista.niveles[key]) {
                            isIn = false
                        }
                        return (
                            <>{
                                !isIn ? <><p>{key} <span onClick={(e) => {
                                    e.preventDefault(); setInPista({
                                        ...inPista, nivelesDisponibles: {
                                            ...inPista.nivelesDisponibles,
                                            [key]: !inPista.nivelesDisponibles[key]
                                        }
                                    });
                                }}>{inPista.nivelesDisponibles[key] ? 'quitar' : 'dar'}</span></p>
                                </> : <></>
                            }</>
                        )
                    })}
                    <p onClick={(e) => {
                        e.preventDefault(); setCarrerasDispobles(inPista.pista, !inPista.pista.active, inPista.nivelesDisponibles);
                        setIncharge(false)
                    }}>CREAR</p>
                </div></>}
        </>

    )
}
export default ComponentePistasTorneo
