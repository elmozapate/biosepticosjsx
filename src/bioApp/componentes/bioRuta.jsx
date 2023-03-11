import { useState } from "react"

const BioRuta = (props) => {
    const { irPlace = {
        ubicacionActual: false, mapSelectactiveState: false, funtionOk: false, biosepticosSelect: false, inSelect: false, mapSelect: false, obraSelect: false, obraSelected: '', obrasName: [], ubicacionMapSelected: { lat: 6.2019443, lng: -75.5892001, state: false, mapSelectactive: false },
        using: false, state: false, go: false, coordenadas: { obra: '', position: -1, lat: 6.2476376, lng: -75.565815100000001 }, coordenadasInicial: { obra: '', position: -1, lat: 6.2019443, lng: -75.5892001 }, funtion: async () => { console.log }
    }, elTiempo = {
        hora: 0,
        min: 0,
        seg: 0,
        restante: ''
    }, showed = [], inicio = '', back = console.log, doRuta = console.log, setResultsArray = console.log, resultsArray = { state: false, array: [] } } = props
    const [rutaCompleta, setRutaCompleta] = useState({
        state: false, position: -1
    })
    const [maxV, setMaxV] = useState({
        max: 10,
        min: 0,
        page: 1
    })
    console.log(resultsArray);
    return (
        <>
            <div className="container-bio-rutas">
                <h2>rutas posibles : {resultsArray.array.length}</h2>
                <h3>INICIO EN {irPlace.ubicacionMapSelected ? 'SELECCION EN EL MAPA' : irPlace.biosepticosSelect ? 'BIOSEPTICOS GUAYABAL' : irPlace.ubicacionActual ? 'UBICACION ACTUAL' : inicio}</h3>
                {
                    resultsArray.array.map((key, i) => {
                        return (
                            <>
                                {i < maxV.max && i >= maxV.min &&
                                    <div className="ruta-search">
                                        <p onClick={(e) => { e.preventDefault; setRutaCompleta({ ...rutaCompleta, position: rutaCompleta.position === i ? -1 : i, state: rutaCompleta.position === i ? !rutaCompleta.state : true }) }}><span><span>INICIO </span><span> {showed[key.order[0]].nombre}</span></span><span><span>FINAL </span><span> {showed[key.order[key.order.length - 1]].nombre}</span></span></p>
                                        <p onClick={(e) => { e.preventDefault; setRutaCompleta({ ...rutaCompleta, position: rutaCompleta.position === i ? -1 : i, state: rutaCompleta.position === i ? !rutaCompleta.state : true }) }}> <span><span> Tiempo :</span><span>{parseInt(key.time / 60) > 60 && `${parseInt(parseInt(key.time / 60) / 60)}h :`}{parseInt(key.time / 60) > 60 ? (parseInt(key.time / 60) - (parseInt(parseInt(key.time / 60) / 60)) * 60) : parseInt(key.time / 60)} :{key.time - (parseInt(key.time / 60) * 60) > 9 ? '' : 0}{key.time - (parseInt(key.time / 60) * 60)} </span></span><span>Distancia:{key.distance}</span> <span className="pointer" onClick={(e) => { e.preventDefault; setRutaCompleta({ ...rutaCompleta, position: rutaCompleta.position === i ? -1 : i, state: rutaCompleta.position === i ? !rutaCompleta.state : true }) }}>{rutaCompleta.position === i && rutaCompleta.state ? 'minimizar' : 'ver ruta completa'}</span></p>
                                        <p onClick={(e) => { e.preventDefault; doRuta(i) }} className="pointer text-center">LLEVAME</p>
                                        {
                                            rutaCompleta.state && rutaCompleta.position === i &&
                                            <>
                                                {key.order.map((keyS, iS) => {
                                                    return (
                                                        <>
                                                            <p><span>{iS + 1}</span><span>{showed[keyS].nombre}</span></p>
                                                        </>
                                                    )

                                                })}
                                            </>
                                        }
                                    </div>
                                }

                            </>
                        )
                    })
                }
                <div className="ruta-search">
                    <><span> MOSTRANDO PAGINA {maxV.page} de {(parseInt(resultsArray.array.length / 10) + 1)}</span></>
                    <p >                {maxV.page > 1 ? <span className="pointer" onClick={(e) => {
                        e.preventDefault; const lastV = maxV.page; setMaxV({
                            ...maxV,
                            max: ((lastV) * 10),
                            min: ((lastV - 1) * 10),
                            page: (lastV - 1)
                        });
                    }}>{`<`}</span> : <span className="pointer"></span>}
                        <span className="pointer" onClick={(e) => { e.preventDefault; back(); }}>volver</span>
                        {(parseInt(maxV.max) < parseInt(resultsArray.array.length)) ? <span className="pointer" onClick={(e) => {
                            e.preventDefault; const lastV = maxV.page; setMaxV({
                                ...maxV,
                                max: ((lastV + 1) * 10),
                                min: ((lastV) * 10),
                                page: (lastV + 1)
                            });
                        }}>{`>`}</span> : <span className="pointer"></span>}
                    </p>
                </div>
            </div>
        </>
    )
}
export default BioRuta