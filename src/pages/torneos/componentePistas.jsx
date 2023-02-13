import { useEffect, useState } from "react"

const ComponentePistas = (props) => {
    const { setCarrerasDispobles = console.log, carrerasDispo = [] } = props
    const [inCharge, setIncharge] = useState(false)
    const charging = () => {
        setIncharge(true)
        setTimeout(() => {
            setIncharge(false)

        }, 1);
    }
    useEffect(() => {
        charging()
    }, [carrerasDispo])
    return (
        <>{!inCharge ?
            <>
                <h1>SELECCIONA LAS PISTAS</h1>
                {
                    carrerasDispo.map((key, i) => {
                        return (
                            <div className='flex-row'>
                                <p className='flex-row listaPlayer' id={i}>
                                    <span className='
                            xxl'> {key.pista}</span>
                                    <span className='
                            xxl'> {key.nivel}</span>
                                    <span
                                        onClick={(e) => {
                                            e.preventDefault(), setCarrerasDispobles(key, !key.active); charging()
                                        }}
                                        className='
                            xxl'> {key.active ? 'QUITAR' : 'SELECCIONAR'}</span>
                                </p>
                            </div>
                        )
                    })
                }
            </> : <>
            </>}
        </>

    )
}
export default ComponentePistas
