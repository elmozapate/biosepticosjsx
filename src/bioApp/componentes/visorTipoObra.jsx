import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import { useEffect, useState } from "react"
import PersComp from "@/bioDashBoard/componentes/dependencias/persComp"
import ModeloUsuario from "../models/modelosUsuario"
import ContenedorMaps from "./contenedorMaps"
import PercentComp from "./percentComp"
import { rewrites } from "next.config"
import SelectComp from "@/components/commons/selector"
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
let userCoord = {
    lat: 0, lng: 0, obra: '',
    position: -1
}
const VisorTipoObra = (props) => {
    const { userModel = ModeloUsuario, willShow = console.log,listos = [], showed = [], objStrings = objStringsInit, objCss = objCssInit } = props
    const [inObra, setInObra] = useState({
        selected: '',
        action: '',
        data: {}
    })
    const [readyRuta, setReadyRuta] = useState(false)
    const [times, setTimes] = useState([[]])
    const [timesReady, setTimesReady] = useState([[]])
    const [inTimes, setInTimes] = useState(0)
    const [elPercent, setElPercent] = useState(0)
    const [inAdress, setInAdress] = useState({
        state: true
    })
    const [irPlace, setIrPlace] = useState({
        funtionOk: false, biosepticosSelect: false, inSelect: false, mapSelect: false, obraSelect: false, obraSelected: '', obrasName: [], ubicacionMapSelected: { lat: 6.2019443, lng: -75.5892001, state: false, mapSelectactive: false },
        using: false, state: false, go: false, coordenadas: { obra: '', position: -1, lat: 6.2476376, lng: -75.56581530000001 }, coordenadasInicial: { obra: '', position: -1, lat: 6.2019443, lng: -75.5892001 }, funtion: async () => { console.log }
    })
    const [confirmMyDirection, setconfirmMyDirection] = useState(false)
    const [activeUser, setActiveUser] = useState({
        selectOp: '',
        userInfo: ModeloUsuario()
    })
    let elTimeReady = [[]]
    let rutastime = []


    let inValue = 0
    let maxValue = showed.length
    const sheduleCreator = (array, father, valuesIn, tiempoIn, inStage) => {
        /*         console.log(array, valuesIn, tiempo, father, inStage, 'aca');
         */
        let resArray = []
        array.map((key, i) => {
            let tiempo = tiempoIn + key.item.time
            let newArreglo = []
            let newValues = key.values
            elTimeReady[key.position].map((keyMap, iMap) => {
                const keyMapVar = { ...keyMap, time: tiempo + keyMap.time }
                newValues = key.values
                let isShedule = false
                newValues.map((keyComp, iComp) => {
                    if (keyComp === iMap) {
                        isShedule = true
                    }
                })
                if (!isShedule && newValues.length < elTimeReady[key.position].length) {
                    newValues.push(iMap)
                    newArreglo.push({ tiempo: parseInt(parseInt(tiempo + keyMap.time)), item: keyMapVar, position: iMap, values: newValues })
                    let resArrayReq = sheduleCreator(newArreglo, father, [], parseInt(parseInt(tiempo)))
                    newValues.length + 1 < elTimeReady[key.position].length ? resArray.push(resArrayReq) : resArray.push({ tiempo: tiempo + keyMap.time, item: keyMapVar, position: iMap, values: newValues })

                }
            })

        })
        return resArray
    }


    const sheduleCreators = async (array, values = [], tiempo, father, inStage = 0) => {


        let arrgelado = () => {
            let newArreglo = []
            array.map((key, i) => {
                key.map((keyM, iM) => {
                    console.log(keyM,'keyM');
                    let isInRuta = false
                    values.map((keyComp, iComp) => {
                        if (keyComp === i) {
                            isInRuta = true
                        }
                    })
                    if (iM === father && !isInRuta) {
                        let valuesUsed = []
                        valuesUsed.push(father)
                        valuesUsed.push(i)
                        newArreglo.push({ item: keyM, position: i, values: valuesUsed })
                    }
                })
            })
            return newArreglo
        }
        const elArreglo = arrgelado()

        const res = sheduleCreator(elArreglo, father, [], 0)
        return res

    }

    let newToSearchE = []

    const crearOptRuta = async () => {
        newToSearchE = []
        let resSearhE = []
        setElPercent(0)
        let newTimes = []
        let theFastest = { item: {}, tiempo: 0 }
        if (irPlace.obraSelect && !irPlace.ubicacionMapSelected.mapSelectactive && !irPlace.biosepticosSelect && !irPlace.mapSelect && !irPlace.ubicacionMapSelected.state) {
            newTimes = times
        } if (!irPlace.obraSelect) {
            for (let index = 1; index < showed.length + 1; index++) {
                const element = times[index];
                newTimes.push(element)

            }
        }
        elTimeReady = newTimes
        setTimesReady(newTimes)
        if (showed.length > 2) {
            for (let index = 0; index < showed.length; index++) {
                newToSearchE = []
                newToSearchE.push(index)
                resSearhE.push(await sheduleCreators(newTimes, newToSearchE, parseInt(times[0][index].time), index))
            }
            if (resSearhE[0] && resSearhE[0][0] && resSearhE[0][0].item && resSearhE[0][0].item.time) {
                theFastest = { item: resSearhE[0][0], tiempo: 999999999999 }

            }
            resSearhE.map((key, i) => {
                key.map((keyComp, iComp) => {
                    if (irPlace.obraSelect && !irPlace.mapSelect && !irPlace.ubicacionMapSelected.state && !irPlace.biosepticosSelect) {
                        if ((keyComp.values[0] === userCoord.position) && keyComp.item.time < theFastest.tiempo) {
                            theFastest = { item: keyComp, tiempo: (keyComp.item.time) }
                        }
                    }
                    if (!irPlace.obraSelect && parseInt(parseInt(times[0][keyComp.values[0]].time) + parseInt(keyComp.item.time)) < theFastest.tiempo) {
                        theFastest = { item: keyComp, tiempo: parseInt(parseInt(times[0][keyComp.values[0]].time) + parseInt(keyComp.item.time)) }
                    }

                })
            })
        }
        let rutaPlaneadaArray = []
        for (let index = 0; index < showed.length; index++) {
            const element = showed[showed.length > 2 ? theFastest.item.values[index] : index];
            rutaPlaneadaArray.push(element.direccion.coordenadas)

        }
        let url = `https://www.google.com/maps/dir/${irPlace.obraSelect ? '' : `${userCoord.lat},${userCoord.lng}/`}`
        console.log(rutaPlaneadaArray);
        for (let index = 0; index < showed.length; index++) {
            const element = rutaPlaneadaArray[index];
            url = url + `${element.lat},${element.lng}/`
        }
        window.open(url)

    }
    const myPosition = (biosepticos, selected, coordenadas) => {
        irPlace.mapSelect && setIrPlace({ ...irPlace, ubicacionMapSelected: { ...irPlace.ubicacionMapSelected, mapSelectactive: true } })

        if (!biosepticos && !selected && !coordenadas) {
            navigator.geolocation.getCurrentPosition(
                function (position) { // success cb
                    userCoord = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        obra: 'userPosition',
                        position: 0
                    }
                    setIrPlace({
                        ...irPlace,
                        state: true,
                        using: true,
                        coordenadasInicial: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            obra: 'userPosition',
                            position: 0
                        },
                    })
                    setTimeout(() => {
                        setconfirmMyDirection(true)
                        makeRuta(0, true)
                    }, 1000)
                }

            );
        } else {

            if (biosepticos && biosepticos === 'true' && !coordenadas && !selected) {
                userCoord = {
                    lat: 6.2019443,
                    lng: -75.5892001,
                    obra: 'userPosition',
                    position: 0
                }
                setIrPlace({
                    ...irPlace,
                    state: true,
                    using: true,
                    coordenadasInicial: {
                        lat: 6.2019443,
                        lng: -75.5892001,
                        obra: 'userPosition',
                        position: 0
                    },
                })
                setTimeout(() => {
                    setconfirmMyDirection(true)
                    makeRuta(0, true)
                }, 1000)
            }
            if (selected && selected === 'true' && !biosepticos && !coordenadas) {
                userCoord = {
                    lat: 6.2019443,
                    lng: -75.5892001,
                    obra: 'userPosition',
                    position: 0
                }
                showed.map((key, i) => {
                    if (key.nombre === irPlace.selected) {
                        userCoord = {
                            ...key.direccion.coordenadas,
                            obra: 'userPosition',
                            position: i
                        }
                    }
                })
                setTimeout(() => {
                    setconfirmMyDirection(true)
                    makeRuta(0)
                }, 1000)
            }
            if (coordenadas && coordenadas === 'true' && !selected && !biosepticos) {
                console.log(5);

                setIrPlace({
                    ...irPlace,
                    state: true,
                    using: true,
                    coordenadasInicial: {
                        lat: irPlace.ubicacionMapSelected.lat,
                        lng: irPlace.ubicacionMapSelected.lng,
                        obra: 'userPosition',
                        position: 0
                    },
                    ubicacionMapSelected: {
                        ...irPlace.ubicacionMapSelected,
                        mapSelectactive: true
                    }
                })
                setTimeout(() => {
                    setconfirmMyDirection(true)
                    makeRuta(0, true)
                }, 1000)
            }

        }


    }

    const makeRuta = async (time, init) => {
        maxValue = showed.length
        if (init) {
            maxValue = showed.length

            if (time < maxValue) {
                setIrPlace({
                    ...irPlace,
                    state: true,
                    using: true,
                    coordenadasInicial: irPlace.ubicacionMapSelected.state ? {
                        lat: irPlace.ubicacionMapSelected.lat,
                        lng: irPlace.ubicacionMapSelected.lng,
                        obra: 'userPosition',
                        position: 0
                    } :
                        {
                    ...irPlace.coordenadasInicial,
                    obra: 'userPosition',
                    position: 0
                },
                    coordenadas: {
                    ...showed[time].direccion.coordenadas,
                    obra: showed[time].nombre,
                    position: time
                },
                })
            setTimeout(() => {
                if (time < maxValue) {
                    setconfirmMyDirection(true)
                    continueRuta(time, true)
                }
            }, 1000);
        } else {
            setTimeout(() => {
                console.log('acabo con usuario', times);
                inValue = 0

                makeRuta(0);
            }, 1000);
        }
    } else {

        if (time < maxValue && inValue < maxValue) {
        setIrPlace({
            ...irPlace,
            state: true,
            using: true,
            coordenadasInicial: {
                ...showed[time].direccion.coordenadas,
                obra: showed[time].nombre, position: time
            },
            coordenadas: {
                ...showed[inValue].direccion.coordenadas,
                obra: showed[inValue].nombre, position: inValue
            }
        })
        setElPercent(((100 / showed.length) * time) + (((100 / showed.length) / showed.length) * inValue))

    }
    if (time < maxValue && !(inValue < maxValue)) {
        setTimeout(() => {
            setElPercent(((100 / showed.length) * time + 1) + (((100 / showed.length) / showed.length) * inValue))
            inValue = 0;
            rutastime = (times);
            setInTimes(time + 1)
            makeRuta(time + 1);

        }, 2000)
    }
    if (time < maxValue && inValue < maxValue) {
        setTimeout(() => {
            if (inValue < maxValue) {
                setElPercent(((100 / showed.length) * time) + (((100 / showed.length) / showed.length) * inValue))

                setconfirmMyDirection(true)
                continueRuta(time)
            }
        }, 1000);
    } else {
        setTimeout(() => {
            if ((((100 / showed.length) * time) + (((100 / showed.length) / showed.length) * inValue)) >= 100) {
                setElPercent(0)
                crearOptRuta();
                setReadyRuta(true)
            }
        }, 2000);

    }
}
    }
const continueRuta = async (time, init) => {
    if (init) {
        setTimeout(() => {
            setconfirmMyDirection(false)
            let clickBtn = document.getElementById('crearLaRuta')
            clickBtn.click()
            setTimeout(() => {
                setIrPlace({
                    ...irPlace,
                    state: false,
                    using: false,
                })
                makeRuta(time + 1, init)
            }, 800);
        }, 800);
    } else {
        if (time < maxValue && inValue < maxValue) {
            setTimeout(() => {
                setconfirmMyDirection(false)
                inValue = inValue + 1
                let clickBtn = document.getElementById('crearLaRuta')
                clickBtn.click()
                setTimeout(() => {
                    setIrPlace({
                        ...irPlace,
                        state: false,
                        using: false,
                    })
                    makeRuta(time)
                }, 800);
            }, 800);
        } else {

            setIrPlace({
                ...irPlace,
                state: false,
                using: false,
            })


    /*             setTimes([])
     */        }
    }
}
let ubicacionIni = { lat: 6.2019443, lng: -75.5892001, state: false, mapSelectactive: false }
const mapSelect = (value) => {
    ubicacionIni = { ...irPlace.ubicacionMapSelected, lat: value.lat, lng: value.lng, state: true }
    userCoord = {
        lat: value.lat, lng: value.lng, obra: 'userPosition',
        position: 0
    }
    setIrPlace({ ...irPlace, ubicacionMapSelected: { ...ubicacionIni, lat: value.lat, lng: value.lng, state: true } })
}

useEffect(() => {
    let obrasName = []
    showed.map((key, i) => {
        obrasName.push(key.nombre)
    })
    setIrPlace({ ...irPlace, obrasName: obrasName })
}, [])



return (
    <>
        <div id={`idShow-${parseInt(Math.random() * 9999)}`} className='container-bio' onClick={(e) => {
            e.preventDefault(); willShow(showed)
        }}>
            {elPercent < 100 && elPercent > 0 && <><h2>RUTA PLANEADA :</h2><PercentComp elPercent={parseInt(elPercent)} /></>}
            {showed.length === 2 && <span onClick={(e) => {
                e.preventDefault(); crearOptRuta()
            }} className="pointer">Ver ruta </span>}
            {showed.length > 2 && <span onClick={readyRuta ? (e) => {
                e.preventDefault(); crearOptRuta()
            } : (e) => {
                e.preventDefault(); setIrPlace({ ...irPlace, inSelect: true })
            }} className="pointer">{readyRuta ? 'Ver ruta recomendada' : 'crear ruta recomendada'}</span>}
            {showed.length > 2 && irPlace.inSelect && <>
                {!irPlace.mapSelect && !irPlace.obraSelect && <span onClick={readyRuta ? (e) => {
                    e.preventDefault(); crearOptRuta()
                } : (e) => {
                    e.preventDefault(); setIrPlace({ ...irPlace, ubicacionMapSelected: { ...irPlace.ubicacionMapSelected, mapSelectactive: false, state: false }, mapSelect: false, obraSelect: false, obraSelected: '', biosepticosSelect: false }); myPosition()
                }} className="pointer">DESDE MI UBICACION</span>}
                {!irPlace.mapSelect && !irPlace.obraSelect && <span onClick={readyRuta ? (e) => {
                    e.preventDefault(); crearOptRuta()
                } : (e) => {
                    e.preventDefault(); setIrPlace({ ...irPlace, ubicacionMapSelected: { ...irPlace.ubicacionMapSelected, mapSelectactive: false, state: false }, mapSelect: false, obraSelect: false, obraSelected: '', biosepticosSelect: true }); myPosition('true')
                }} className="pointer">DESDE BIOSEPTICOS</span>}
                {irPlace.mapSelect ? <span onClick={(e) => {
                    e.preventDefault(); setIrPlace({ ...irPlace, ubicacionMapSelected: { ...irPlace.ubicacionMapSelected, mapSelectactive: false, state: false }, mapSelect: false, obraSelect: false, obraSelected: '', biosepticosSelect: false });
                }} className="pointer">VOLVER</span> : !irPlace.obraSelect && <span onClick={readyRuta ? (e) => {
                    e.preventDefault(); crearOptRuta()
                } : (e) => {
                    e.preventDefault(); setIrPlace({ ...irPlace, mapSelect: true, obraSelect: false, ubicacionMapSelected: { ...irPlace.ubicacionMapSelected, state: true }, obraSelected: '' })
                }} className="pointer">ESCOGER EN EL MAPA</span>}
                {irPlace.obraSelect && <span onClick={(e) => {
                    e.preventDefault(); setIrPlace({ ...irPlace, ubicacionMapSelected: { ...irPlace.ubicacionMapSelected, mapSelectactive: false, state: false, active: false }, mapSelect: false, obraSelect: false, obraSelected: '', biosepticosSelect: false });
                }} className="pointer">VOLVER</span>}
                {!irPlace.mapSelect &&
                    <span onClick={readyRuta ? (e) => {
                        e.preventDefault(); crearOptRuta()
                    } : (e) => {
                        e.preventDefault();
                        setIrPlace({ ...irPlace, ubicacionMapSelected: { ...irPlace.ubicacionMapSelected, mapSelectactive: false, state: false }, mapSelect: false, biosepticosSelect: false });
                    }} className="pointer">{irPlace.obraSelected !== '' ? 'OBRA EN ESPECIFICO ' : <SelectComp funtions={((e) => { e.preventDefault; setIrPlace({ ...irPlace, obraSelect: true, obraSelected: e.target.value }) })} items={irPlace.obrasName} />} </span>}
            </>}
            {
                irPlace.obraSelected !== '' && <><span onClick={(e) => {
                    e.preventDefault(); myPosition(false, 'true')
                }} className="pointer">EMPEZAR EN {irPlace.obraSelected} </span></>
            }
            {
                irPlace.ubicacionMapSelected.state && <><span onClick={readyRuta ? (e) => {
                    e.preventDefault(); crearOptRuta()
                } : (e) => {
                    e.preventDefault(); ubicacionIni = { ...ubicacionIni, state: true, mapSelectactive: true }; setIrPlace({ ...irPlace, ubicacionMapSelected: { ...irPlace.ubicacionMapSelected, ...ubicacionIni } }); myPosition(false, false, 'true')
                }} className="pointer">DESDE latitud : {irPlace.ubicacionMapSelected.lat} longitud :{irPlace.ubicacionMapSelected.lng} </span></>
            }
            {
                irPlace.mapSelect && !irPlace.ubicacionMapSelected.mapSelectactive &&
                <><ContenedorMaps mapSelect={mapSelect} inMapSelect defaultLocation={irPlace.coordenadasInicial} />
                </>
            }
            {inObra.selected === '' ? <div className="dia">
                <p className="centert flex-p-between">
                    <span className="treintraytres">{'Nombre'}</span>
                    <span className="treintraytres">{'contacto'}</span>
                    <span className="treintraytres">{'zona'}</span></p>

                {showed.map((key, i) => {
                    return (
                        <>
                            <p className="centert flex-p-between ">
                                <span className="treintraytres"><h2>{key.contact.obra}</h2> </span>
                                <span className="treintraytres"  >
                                    <span>-{key.contact.nombre}</span>
                                    <span onClick={(e) => {
                                        e.preventDefault(); 
                                        setActiveUser({
                                            ...activeUser,
                                            userInfo: {
                                                ...activeUser.userInfo,
                                                datosContacto: {
                                                    ...activeUser.userInfo.datosContacto,
                                                    ...key.contact,
                                                    direccion: {
                                                        ...activeUser.userInfo.datosContacto.direccion,
                                                        ...key.direccion
                                                    }
                                                }
                                            }
                                        }); setInObra({
                                            ...inObra,
                                            selected: key.id, action: 'contact', data: key.contact
                                        })
                                    }} className="pointer">ver info</span>
                                </span>
                                <span className="treintraytres">
                                    <span>{key.direccion.ciudad}-{key.direccion.barrio}</span>
                                    <span onClick={(e) => {
                                        e.preventDefault();
                                        setActiveUser({
                                            ...activeUser,
                                            userInfo: {
                                                ...activeUser.userInfo,
                                                datosContacto: {
                                                    ...activeUser.userInfo.datosContacto,
                                                    direccion: {
                                                        ...activeUser.userInfo.datosContacto.direccion,
                                                        ...key.direccion

                                                    }
                                                }
                                            }
                                        }); setInObra({
                                            ...inObra,
                                            selected: key.id, action: 'direccion', data: key.direccion
                                        })
                                    }} className="pointer">mas</span>
                                </span>
                            </p>
                        </>
                    )
                })}
                {!(listos.length > 0) ? <>SIN ACTVIVIDAD</> :
                <>
                COMPLETADOS
                {listos.map((key, i) => {
                    return (
                        <>
                            <p className="bgColor-green centert flex-p-between ">
                                <span className="treintraytres"><h2>{key.contact.obra}</h2> </span>
                                <span className="treintraytres"  >
                                    <span>-{key.contact.nombre}</span>
                                    <span onClick={(e) => {
                                        e.preventDefault(); 
                                        setActiveUser({
                                            ...activeUser,
                                            userInfo: {
                                                ...activeUser.userInfo,
                                                datosContacto: {
                                                    ...activeUser.userInfo.datosContacto,
                                                    ...key.contact,
                                                    direccion: {
                                                        ...activeUser.userInfo.datosContacto.direccion,
                                                        ...key.direccion
                                                    }
                                                }
                                            }
                                        }); setInObra({
                                            ...inObra,
                                            selected: key.id, action: 'contact', data: key.contact
                                        })
                                    }} className="pointer">ver info</span>
                                </span>
                                <span className="treintraytres">
                                    <span>{key.direccion.ciudad}-{key.direccion.barrio}</span>
                                    <span onClick={(e) => {
                                        e.preventDefault();
                                        setActiveUser({
                                            ...activeUser,
                                            userInfo: {
                                                ...activeUser.userInfo,
                                                datosContacto: {
                                                    ...activeUser.userInfo.datosContacto,
                                                    direccion: {
                                                        ...activeUser.userInfo.datosContacto.direccion,
                                                        ...key.direccion

                                                    }
                                                }
                                            }
                                        }); setInObra({
                                            ...inObra,
                                            selected: key.id, action: 'direccion', data: key.direccion
                                        })
                                    }} className="pointer">mas</span>
                                </span>
                            </p>
                        </>
                    )
                })}
                </>}

            </div> : <>
                {
                    inObra.action === 'contact' &&
                    <><h2> contacto obra {inObra.data.obra}</h2>
                        persona a cargo : {inObra.data.nombre}
                        <PersComp adress contact inselected={'contactData'} actualizeData={console.log} setActiveUser={console.log} activeUser={activeUser} permision={activeUser.userInfo.userObj.appPermisions} objCss={objCss} objStrings={objStrings} />
                    </>

                }
                {
                    inObra.action === 'direccion' &&
                    <><h2>direccion obra {inObra.data.obra}</h2>
                        <PersComp inselected={'contactData'} adress actualizeData={console.log} setActiveUser={console.log} activeUser={activeUser} permision={activeUser.userInfo.userObj.appPermisions} objCss={objCss} objStrings={objStrings} />
                    </>

                }

                <span onClick={(e) => {
                    e.preventDefault(); setInObra({
                        ...inObra,
                        selected: '', action: '', data: ''
                    })
                }} className="pointer">volver</span>
            </>}

        </div>
        {irPlace.using && <>

            {!confirmMyDirection ?
                <>
                    <ContenedorMaps ruteando inTimes={inTimes} times={times} setTimes={setTimes} setIrPlace={setIrPlace} irPlace={irPlace} inOperacion={{
                        state: irPlace.state,
                        inicio: irPlace.coordenadasInicial,
                        final: irPlace.coordenadas
                    }} adressViewIn defaultLocation={irPlace.coordenadas} />
                    {inAdress && (irPlace.state) && irPlace.coordenadasInicial !== { lat: 6.2476376, lng: -75.56581530000001 } && <>
                        <span onClick={(e) => { e.preventDefault(); setconfirmMyDirection(true) }} className='pointer'>
                        </span></>}
                </>
                :
                <>
                    {inAdress &&
                        <><ContenedorMaps ruteando inTimes={inTimes} times={times} setTimes={setTimes} setIrPlace={setIrPlace} irPlace={irPlace} inOperacion={{
                            state: irPlace.state,
                            inicio: irPlace.coordenadasInicial,
                            final: irPlace.coordenadas
                        }} adressViewIn defaultLocation={irPlace.coordenadasInicial} />
                        </>}

                    <span onClick={(e) => { e.preventDefault(); setconfirmMyDirection(false) }} className='pointer'>
                    </span>
                    <span onClick={(e) => { e.preventDefault(); setconfirmMyDirection(false) }} className='pointer'>
                    </span>
                </>}
        </>}
        {/* <span onClick={(e) => { e.preventDefault(); console.log(times, rutastime); }} className='pointer'>
                AQUI
            </span> */}


    </>
)
}
export default VisorTipoObra