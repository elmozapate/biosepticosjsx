import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import { useEffect, useState } from "react"
import PersComp from "@/bioDashBoard/componentes/dependencias/persComp"
import ModeloUsuario from "../models/modelosUsuario"
import ContenedorMaps from "./contenedorMaps"
import PercentComp from "./percentComp"
import { rewrites } from "next.config"
import SelectComp from "@/components/commons/selector"
import BioRuta from "./bioRuta"
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
let cargando = false
let newToSearchE = []
let finalResults = []
let orderedFinalFixArraySort = []
let allDatas = []
let resSearhE = []
let orderedFinalFixArray = []
let orderedFinalArray = []
let resOrderedTime = []
let resOrdered = []
let resultados = []
let newTimes = []
let userCoord = {
    lat: 0, lng: 0, obra: '',
    position: -1
}
let choose = {
    ubicacionActual: false,
    biosepticosSelect: false,
    obraSelect: false,
    mapSelectactiveState: false,
}
let localPercent = 1
const VisorTipoObra = (props) => {
    const { userModel = ModeloUsuario, willShow = console.log, listos = [], showed = [], objStrings = objStringsInit, objCss = objCssInit } = props
    const [inObra, setInObra] = useState({
        selected: '',
        action: '',
        data: {}
    })
    const [elTiempo, setElTiempo] = useState({
        hora: 0,
        min: 0,
        seg: 0,
        restante: 99,
        mensaje: ''
    })
    const [resultsArray, setResultsArray] = useState({ state: false, array: [] })
    const [inSearching, setinSearching] = useState({ state: false })
    const [readyRuta, setReadyRuta] = useState(false)
    const [times, setTimes] = useState([[]])
    const [timesReady, setTimesReady] = useState([[]])
    const [inTimes, setInTimes] = useState(0)
    const [elPercent, setElPercent] = useState(0)
    const [inAdress, setInAdress] = useState({
        state: true
    })
    const [irPlace, setIrPlace] = useState({
        ubicacionActual: false, mapSelectactiveState: false, funtionOk: false, biosepticosSelect: false, inSelect: false, mapSelect: false, obraSelect: false, obraSelected: '', obrasName: [], ubicacionMapSelected: { lat: 6.2019443, lng: -75.5892001, state: false, mapSelectactive: false },
        using: false, state: false, go: false, coordenadas: { obra: '', position: -1, lat: 6.2476376, lng: -75.565815100000001 }, coordenadasInicial: { obra: '', position: -1, lat: 6.2019443, lng: -75.5892001 }, funtion: async () => { console.log }
    })
    const [confirmMyDirection, setconfirmMyDirection] = useState(false)
    const [activeUser, setActiveUser] = useState({
        selectOp: '',
        userInfo: ModeloUsuario()
    })
    const [startSearching, setStartSearching] = useState(false)
    let elTimeReady = [[]]
    let rutastime = []
    let inValue = 0
    let maxValue = showed.length
    const sheduleCreator = (array, father, valuesIn, tiempoIn, distanciaIn) => {
        let resArray = []
        array.map((key, i) => {
            let distancia = distanciaIn + key.item.distance
            let tiempo = tiempoIn + key.item.time
            let newArreglo = []
            let newValues = key.values
            elTimeReady[key.position].map((keyMap, iMap) => {
                const keyMapVar = { ...keyMap, time: tiempo + keyMap.time, distance: parseInt(distancia + keyMap.distance) }
                newValues = key.values
                let isShedule = false
                newValues.map((keyComp, iComp) => {
                    if (keyComp === iMap) {
                        isShedule = true
                    }
                })
                if (!isShedule && newValues.length < elTimeReady[key.position].length) {
                    newValues.push(iMap)
                    newArreglo.push({ tiempo: parseInt(parseInt(tiempo + keyMap.time)), distancia: parseInt(distancia + keyMap.distance), item: keyMapVar, position: iMap, values: newValues })
                    let resArrayReq = sheduleCreator(newArreglo, father, [], parseInt(parseInt(tiempo)), distancia)
                    newValues.length + 1 < elTimeReady[key.position].length ? resArray.push(resArrayReq) : resArray.push({ tiempo: tiempo + keyMap.time, distancia: parseInt(distancia + keyMap.distance), item: keyMapVar, position: iMap, values: newValues })

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

        const res = sheduleCreator(elArreglo, father, [], 0, 0)
        console.log(res);
        return res

    }
    let timeCount = 0
    let segundosCount = 0
    let segundosCountAprox = 0
    let minutesCount = 0
    let lastPercent = 0
    let restante = 99
    let lastMensaje = ''
    let segundosCountIn = 0
    const doFrame = () => {
        if (cargando) {
            timeCount = timeCount + 1
            if (timeCount === 60) {
                timeCount = 1
                segundosCountAprox = segundosCountAprox + 1
                segundosCount = segundosCount + 1
                segundosCountIn = segundosCountIn + 1
                console.log('segundo mas', segundosCount);
                setElTiempo({
                    ...elTiempo,
                    hora: parseInt(parseInt(segundosCountIn / 60) / 60),
                    min: parseInt(parseInt(segundosCountIn / 60) - parseInt(parseInt(parseInt(segundosCountIn / 60) / 60) * 60)),
                    seg: parseInt(segundosCountIn - parseInt(parseInt(segundosCountIn / 60) * 60)),
                    mensaje: lastMensaje,
                    restante: restante

                })
            }
            if (segundosCount === 60) {
                segundosCount = 0
                minutesCount = minutesCount + 1
                console.log('minuto mas', minutesCount);
            }
            if (segundosCountAprox === 10) {
                let dataPercent = localPercent - lastPercent
                let faltante = 100 - localPercent
                let aproximado = !isNaN((parseInt((faltante) / (dataPercent / 10)))) ? (parseInt((faltante) / (dataPercent / 10))) : 99.9
                lastPercent = localPercent
                let mensaje = aproximado > 0 ? `${parseInt(parseInt(aproximado / 60) / 60)} horas con ${parseInt(parseInt(parseInt(aproximado / 60) - parseInt(parseInt(parseInt(aproximado / 60) / 60) * 60)))} minutos con ${parseInt(aproximado - parseInt(parseInt(aproximado / 60) * 60)) < 9 ? 0 : ''}${parseInt(aproximado - parseInt(parseInt(aproximado / 60) * 60))} segundos ` : lastMensaje
                console.log(mensaje, 'mensaje');
                restante = aproximado
                segundosCountAprox = 0
                setElTiempo({
                    ...elTiempo,
                    hora: parseInt(parseInt(segundosCount / 60) / 60),
                    min: parseInt(parseInt(segundosCount / 60) - parseInt(parseInt(parseInt(segundosCount / 60) / 60) * 60)),
                    seg: parseInt(segundosCount - parseInt(parseInt(segundosCount / 60) * 60)),
                    mensaje: mensaje,
                    restante: restante

                })
                lastMensaje = mensaje

            }


        }

        requestAnimationFrame(doFrame)

    }

    const crearOptRuta = async () => {
        newToSearchE = []
        resSearhE = []
        setElPercent(0)
        localPercent = 1
        newTimes = []
        let theFastest = { item: {}, tiempo: 0 }
        if (irPlace.obraSelect) {
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
                resSearhE.push(await sheduleCreators(newTimes, newToSearchE, parseInt(times[0][index].time), index, 0))
            }
            resultados = []
            resSearhE.map((key, i) => {
                let resultadosLocales = []
                key.map((keyM, iM) => {
                    resultadosLocales.push(keyM.values)
                })
                resultados.push({ position: i, searchs: resultadosLocales })
            })
            resOrdered = []
            resultados.map((key, i) => {
                let resOrderedIn = []
                key.searchs.map((keyS, iS) => {
                    resOrderedIn.push(keyS)

                })
                resOrdered.push({ array: resOrderedIn, position: i })
            })
            resOrderedTime = []
            resOrdered.map((key, i) => {
                key.array.map((keyA, iA) => {
                    let rutaTime = 0
                    let rutaDistance = 0
                    keyA.map((keyIetM, itM) => {
                        if (itM + 1 < keyA.length) {
                            try {
                                rutaDistance = rutaDistance + elTimeReady[keyIetM][keyA[itM + 1]].distance
                                rutaTime = rutaTime + elTimeReady[keyIetM][keyA[itM + 1]].time

                            } catch (error) {
                                console.log(error, elTimeReady, keyIetM, keyA, itM, keyA[itM + 1]);

                            }
                        }
                        /*                         rutaTime = rutaTime + times[key.position][keyA]
                         */
                    })
                    resOrderedTime.push({ ruta: key.position, order: keyA, distance: rutaDistance, time: rutaTime })
                })

            })
            finalResults = []
            if (!choose.obraSelect) {
                let inLaRuta = -1
                let inElChoose = 0
                resOrderedTime.map((key, i) => {
                    if (inLaRuta !== key.ruta) {
                        inLaRuta = key.ruta
                        inElChoose = 0
                    } else {
                        inElChoose = inElChoose + 1
                    }

                    let finalTime = 0
                    let finalDistance = 0
                    finalDistance = key.distance + times[0][key.order[0]].distance
                    finalTime = key.time + times[0][key.order[0]].time
                    finalResults.push({ time: finalTime, distance: finalDistance, search: key.ruta, choose: inElChoose })

                })
                orderedFinalFixArray = []
                orderedFinalArray = []
                finalResults.map((key, i) => {
                    orderedFinalArray.push({})
                    orderedFinalFixArray.push(key.time)
                })
                orderedFinalFixArraySort = orderedFinalFixArray.sort()
                orderedFinalFixArraySort.map((key, i) => {
                    finalResults.map((keyComp, iComp) => {
                        if (key === keyComp.time) {
                            orderedFinalArray[i] = keyComp
                        }
                    })
                })
                allDatas = []
                for (let index = 0; index < orderedFinalArray.length; index++) {
                    const element = resultados[orderedFinalArray[index].search].searchs[orderedFinalArray[index].choose]
                    allDatas.push({ order: element, distance: orderedFinalArray[index].distance, time: orderedFinalArray[index].time })
                }
                setTimes([[]])
                cargando = false
                setinSearching({ ...inSearching, state: false })
                setTimesReady([[]])
                setIrPlace({
                    ...irPlace,
                    ubicacionActual: false, mapSelectactiveState: false, funtionOk: false, biosepticosSelect: false, inSelect: false, mapSelect: false, obraSelect: false, obraSelected: '', obrasName: [], ubicacionMapSelected: { lat: 6.2019443, lng: -75.5892001, state: false, mapSelectactive: false },
                    using: false, state: false, go: false, funtion: async () => { console.log }
                })
                elTimeReady = [[]]
                rutastime = []
                inValue = 0
                setInTimes(0)
                setResultsArray({ state: true, array: allDatas })
            } else {
                console.log(userCoord.position);
            }
        }


    }

    const doRuta = (position) => {
        let fastestNew = []
        fastestNew = resultados[orderedFinalArray[position].search].searchs[orderedFinalArray[position].choose]
        let rutaPlaneadaArray = []
        for (let index = 0; index < showed.length; index++) {
            const element = showed[showed.length > 2 ? fastestNew[index] : index];
            rutaPlaneadaArray.push(element.direccion.coordenadas)
        }
        let url = `https://www.google.com/maps/dir/${irPlace.obraSelect ? '' : `${userCoord.lat},${userCoord.lng}/`}`
        for (let index = 0; index < showed.length; index++) {
            const element = rutaPlaneadaArray[index];
            url = url + `${element.lat},${element.lng}/`
        }
        window.open(url)
    }
    const myPosition = (biosepticos, selected, coordenadas) => {
        newToSearchE = []; finalResults = []; orderedFinalFixArraySort = []; allDatas = []; resSearhE = []; orderedFinalFixArray = []; orderedFinalArray = []; resOrderedTime = []; resOrdered = []; resultados = []; newTimes = [];
        cargando = true
        setStartSearching(false)
        doFrame()
        setinSearching({
            ...inSearching,
            state: true
        })
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
                        ubicacionActual: true,
                        coordenadasInicial: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            obra: 'userPosition',
                            position: 0
                        },
                    })
                    choose.ubicacionActual = true
                    setTimeout(() => {
                        setconfirmMyDirection(true)
                        makeRuta(0, true, 'ubicacionActual')
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
                choose.biosepticosSelect = true

                setTimeout(() => {
                    setconfirmMyDirection(true)
                    makeRuta(0, true, 'biosepticosSelect')
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
                choose.obraSelect = true

                setTimeout(() => {
                    setconfirmMyDirection(true)
                    makeRuta(0, false, 'obraSelect')
                }, 1000)
            }
            if (coordenadas && coordenadas === 'true' && !selected && !biosepticos) {
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
                choose.mapSelectactiveState = true
                setTimeout(() => {
                    setconfirmMyDirection(true)
                    makeRuta(0, true, 'mapSelectactiveState')
                }, 1000)
            }

        }


    }

    const makeRuta = async (time, init, state) => {

        maxValue = showed.length
        if (init) {
            maxValue = showed.length
            !choose.obraSelect && setElPercent(((100 / (showed.length + 1)) * time) + (((100 / (showed.length + 1)) / (showed.length + 1)) * inValue))

            if (time < maxValue) {
                state ? setIrPlace({
                    ...irPlace,
                    state: true,
                    [state]: true,
                    using: true,
                    mapSelectactiveState: true,
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
                }) :
                    setIrPlace({
                        ...irPlace,
                        state: true,
                        using: true,
                        mapSelectactiveState: true,
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
                }, 600);
            } else {
                setTimeout(() => {
                    inValue = 0
                    makeRuta(0);
                }, 600);
            }
        } else {
            setStartSearching(true)
            if (time < maxValue && inValue < maxValue) {
                setElPercent(((100 / (showed.length)) * time) + (((100 / (showed.length)) / (showed.length)) * inValue))
                state ? setIrPlace({
                    ...irPlace,
                    state: true,
                    using: true,
                    [state]: true,
                    coordenadasInicial: {
                        ...showed[time].direccion.coordenadas,
                        obra: showed[time].nombre, position: time
                    },
                    coordenadas: {
                        ...showed[inValue].direccion.coordenadas,
                        obra: showed[inValue].nombre, position: inValue
                    }
                }) : setIrPlace({
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
                setElPercent(((100 / (showed.length)) * time) + (((100 / (showed.length)) / (showed.length)) * inValue))
                localPercent = ((100 / (showed.length)) * time) + (((100 / (showed.length)) / (showed.length)) * inValue) > 0 ? ((100 / (showed.length)) * time) + (((100 / (showed.length)) / (showed.length)) * inValue) : 1

            }
            if (time < maxValue && !(inValue < maxValue)) {
                setTimeout(() => {
                    localPercent = ((100 / (showed.length)) * time) + (((100 / (showed.length)) / (showed.length)) * inValue) > 0 ? ((100 / (showed.length)) * time) + (((100 / (showed.length)) / (showed.length)) * inValue) : 1
                    inValue = 0;
                    rutastime = (times);
                    setInTimes(time + 1)
                    makeRuta(time + 1);

                }, 1000)
            }
            if (time < maxValue && inValue < maxValue) {
                setTimeout(() => {
                    if (inValue < maxValue) {
                        setElPercent(((100 / (showed.length)) * time) + (((100 / (showed.length)) / (showed.length)) * inValue))
                        localPercent = ((100 / (showed.length)) * time) + (((100 / (showed.length)) / (showed.length)) * inValue) > 0 ? ((100 / (showed.length)) * time) + (((100 / (showed.length)) / (showed.length)) * inValue) : 1
                        setconfirmMyDirection(true)
                        continueRuta(time)
                    }
                }, 1000);
            } else {
                setTimeout(() => {
                    if ((((100 / (showed.length)) * time) + (((100 / (showed.length)) / (showed.length)) * inValue)) >= 100) {
                        setElPercent(0)
                        crearOptRuta();
                        setReadyRuta(true)
                    }
                }, 1000);

            }
        }
    }
    const setTimesFuntion = (value) => {
        setTimes(value)
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
                }, 600);
            }, 600);
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
                    }, 600);
                }, 600);
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
    const back = () => {
        setReadyRuta(false)
        setResultsArray({ ...resultsArray, state: false })
        userCoord = {
            lat: 0, lng: 0, obra: '',
            position: -1
        }
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
                {inSearching.state && <div className="loading-ruta">
                    <div className='loader-body'>
                        {!(startSearching) ? <span >PREPARANDO TODO</span> : <span>CREANDO TODAS LAS RUTAS
                        </span>}

                        <br />
                        <p>
                        </p>
                        <div className='loader-container'>
                            <div className='loader'></div>
                            <div className='loader2'>                            </div>
                            {elPercent < 100 && elPercent > 0 && <div className="center-value">
                                <span><PercentComp elPercent={parseInt(elPercent)} /></span>
                            </div>}
                        </div>
                        {elTiempo.seg > 0 && elTiempo.restante > 0 && <p>
                            <span className="text-center">Transcurrido {elTiempo.hora}h {elTiempo.min}m {elTiempo.seg}s</span>
                            <br />
                            <span className="text-center">  TIEMPO APROXIMADO</span>
                            <br />
                            <span className="text-center"> {elTiempo.mensaje}</span>
                        </p>}
                    </div>
                </div>}

                {!inSearching.state &&
                    <>
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
                    </>
                }
                {
                    irPlace.mapSelect && !irPlace.mapSelectactiveState &&
                    <><ContenedorMaps mapSelect={mapSelect} inMapSelect irPlace={irPlace} defaultLocation={irPlace.coordenadasInicial} />
                    </>
                }
                {
                    !inSearching.state && <>  {inObra.selected === '' ? <div className="dia">
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
                    </>
                }
                {resultsArray.state && <><BioRuta elTiempo={elTiempo} doRuta={doRuta} showed={showed} resultsArray={resultsArray} back={back} /></>}
            </div>
            {irPlace.using && <>

                {!confirmMyDirection ?
                    <>
                        <ContenedorMaps ruteando inTimes={inTimes} times={times} setTimes={setTimesFuntion} setIrPlace={setIrPlace} irPlace={irPlace} inOperacion={{
                            state: irPlace.state,
                            inicio: irPlace.coordenadasInicial,
                            final: irPlace.coordenadas
                        }} adressViewIn defaultLocation={irPlace.coordenadas} />
                        {inAdress && (irPlace.state) && irPlace.coordenadasInicial !== { lat: 6.2476376, lng: -75.565815100000001 } && <>
                            <span onClick={(e) => { e.preventDefault(); setconfirmMyDirection(true) }} className='pointer'>
                            </span></>}
                    </>
                    :
                    <>
                        {inAdress &&
                            <><ContenedorMaps ruteando inTimes={inTimes} times={times} setTimes={setTimesFuntion} setIrPlace={setIrPlace} irPlace={irPlace} inOperacion={{
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
        </>
    )
}
export default VisorTipoObra