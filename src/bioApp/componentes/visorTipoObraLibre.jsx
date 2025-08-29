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
import BioRutaLibre from "./bioRutaLibre"
import RutasMatrizGoogle from "@/components/commons/googlertutas"
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
const VisorTipoObraLibre = (props) => {
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
    const [timesa, setTimesa] = useState(0);
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
            }
            if (segundosCountAprox === 10) {
                let dataPercent = localPercent - lastPercent
                let faltante = 100 - localPercent
                let aproximado = !isNaN((parseInt((faltante) / (dataPercent / 10)))) ? (parseInt((faltante) / (dataPercent / 10))) : 99.9
                lastPercent = localPercent
                let mensaje = aproximado > 0 ? `${parseInt(parseInt(aproximado / 60) / 60)} horas con ${parseInt(parseInt(parseInt(aproximado / 60) - parseInt(parseInt(parseInt(aproximado / 60) / 60) * 60)))} minutos con ${parseInt(aproximado - parseInt(parseInt(aproximado / 60) * 60)) < 9 ? 0 : ''}${parseInt(aproximado - parseInt(parseInt(aproximado / 60) * 60))} segundos ` : lastMensaje
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


    const buildMapsDirUrl = (coords) => {
        // https://www.google.com/maps/dir/<lat,lng>/<lat,lng>/...
        const parts = coords.map(({ lat, lng }) => `${lat},${lng}`);
        return `https://www.google.com/maps/dir/${parts.join('/')}`;
    };

    // 2) Construye 1 o 2 URLs. Si hay >20 puntos, divide en dos:
    //    - url1: primeros 20
    //    - url2: desde el punto 20 en adelante, arrancando en el último punto de url1
    const buildMapsDirUrlsSplit = (path, maxFirst = 20) => {
        if (!Array.isArray(path) || path.length === 0) return [];

        if (path.length <= maxFirst) {
            return [buildMapsDirUrl(path)];
        }

        // Primer tramo: primeros 20
        const firstLeg = path.slice(0, maxFirst);

        // Segundo tramo:
        // Comienza en el último punto del primer tramo para que sea continuidad visual,
        // y luego continúa con el resto de puntos
        const secondStart = firstLeg[firstLeg.length - 1];
        const secondLegRest = path.slice(maxFirst);
        const secondLeg = [secondStart, ...secondLegRest];

        const url1 = buildMapsDirUrl(firstLeg);
        const url2 = buildMapsDirUrl(secondLeg);
        return [url1, url2];
    };


    /**
     * position: índice del resultado elegido en resultsArray.array
     * opts:
     *  - startCoord: {lat, lng} para iniciar en una coordenada custom (opcional)
     *  - includeReturn: true para regresar al punto inicial al final (opcional)
     *  - open: true para abrir la ruta en una nueva pestaña (default true)
     */
    const doRuta = (position, opts = {}) => {
        const { startCoord = null, includeReturn = false, open = true } = opts;

        if (!resultsArray?.array?.length) {
            console.error('resultsArray vacío o inválido');
            return;
        }
        const choice = resultsArray.array[position];
        if (!choice) {
            console.error('No existe ese índice en resultsArray.array:', position);
            return;
        }
        if (!Array.isArray(showed) || showed.length === 0) {
            console.error('showed vacío o inválido');
            return;
        }
        if (!Array.isArray(choice.order) || choice.order.length === 0) {
            console.error('El resultado no trae un order válido:', choice);
            return;
        }

        // 1) Orden de visita según el resultado elegido
        const orderedPoints = choice.order.map(i => {
            const obra = showed[i];
            const c = obra?.direccion?.coordenadas;
            if (!c || typeof c.lat !== 'number' || typeof c.lng !== 'number') {
                throw new Error(`Coordenadas inválidas en showed[${i}]`);
            }
            return { lat: c.lat, lng: c.lng };
        });

        // 2) Inserta origen si aplica
        const path = startCoord ? [startCoord, ...orderedPoints] : [...orderedPoints];

        // 3) Cierra el circuito (opcional)
        if (includeReturn && path.length > 1) {
            path.push(path[0]);
        }

        // 4) Construye 1 o 2 URLs según el tamaño
        const urls = buildMapsDirUrlsSplit(path, 20);

        console.log('Ruta seleccionada:', {
            position,
            order: choice.order,
            distance_m: choice.distance,
            time_s: choice.time,
            urls
        });

        if (open && typeof window !== 'undefined') {
            // abre todas las URLs (1 o 2)
            urls.forEach(u => window.open(u, '_blank', 'noopener'));
        }

        return urls; // devuelve array de 1 o 2 URLs
    };

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
        return
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
                    }, 10)
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
                }, 10)
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
                }, 10)
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
                }, 10)
            }

        }


    }

    const makeRuta = async (time, init, state) => {
        setTimesa(time)
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
                }, 10);
            } else {
                setTimeout(() => {
                    inValue = 0
                    makeRuta(0);
                }, 10);
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

                }, 10)
            }
            if (time < maxValue && inValue < maxValue) {
                setTimeout(() => {
                    if (inValue < maxValue) {
                        setElPercent(((100 / (showed.length)) * time) + (((100 / (showed.length)) / (showed.length)) * inValue))
                        localPercent = ((100 / (showed.length)) * time) + (((100 / (showed.length)) / (showed.length)) * inValue) > 0 ? ((100 / (showed.length)) * time) + (((100 / (showed.length)) / (showed.length)) * inValue) : 1
                        setconfirmMyDirection(true)
                        continueRuta(time)
                    }
                }, 10);
            } else {
                setTimeout(() => {
                    if ((((100 / (showed.length)) * time) + (((100 / (showed.length)) / (showed.length)) * inValue)) >= 100) {
                        setElPercent(0)
                        crearOptRuta();
                        setReadyRuta(true)
                    }
                }, 10);

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
                }, 10);
            }, 10);
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
                    }, 10);
                }, 10);
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
        console.log(showed);

        let obrasName = []
        showed.map((key, i) => {
            obrasName.push(key.nombre)
        })
        setIrPlace({ ...irPlace, obrasName: obrasName })
    }, [])
    return (
        <>
            {resultsArray.state && <><BioRutaLibre elTiempo={elTiempo} doRuta={doRuta} showed={showed} resultsArray={resultsArray} back={back} /></>}
            {!resultsArray.state && <div id={`idShow-${parseInt(Math.random() * 9999)}`} style={{ backgroundColor: 'white', color: 'black' }} className='container-bio' onClick={(e) => {
                e.preventDefault(); willShow(showed)
            }}>
                {inSearching.state && <div style={{ backgroundColor: 'white', color: 'black' }} className="loading-ruta">
                    <div style={{ backgroundColor: 'white', color: 'black' }} className='loader-body'>
                        {!(startSearching) ? <span >PREPARANDO TODO</span> : <span>CREANDO TODAS LAS RUTAS
                        </span>}

                        <br />
                        <p>
                        </p>
                        {1 === 1 ? <>
                            <RutasMatrizGoogle
                                obras={showed}
                                mode="DRIVING"   // DRIVING | WALKING | BICYCLING | TRANSIT
                                units="METRIC"
                                onDone={(res) => {
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
                                    setInTimes(0);
                                    setResultsArray({ state: true, array: res?.rutasEnFormato })
                                    console.log(res);
                                }}
                            />
                        </> : <div style={{ backgroundColor: 'white', color: 'black' }} className='loader-container'>
                            <div style={{ backgroundColor: 'white', color: 'black' }} className='loader'></div>
                            <div style={{ backgroundColor: 'white', color: 'black' }} className='loader2'>                            </div>
                            {elPercent < 100 && elPercent > 0 && <div style={{ backgroundColor: 'white', color: 'black' }} className="center-value">
                                <span><PercentComp elPercent={parseInt(elPercent)} /></span>
                            </div>}
                        </div>}
                        {elTiempo.seg > 0 && elTiempo.restante > 0 && <p>
                            <span style={{ backgroundColor: 'white', color: 'black' }} className="text-center">En Obra {timesa} de  {showed.length} </span>

                            <span style={{ backgroundColor: 'white', color: 'black' }} className="text-center">Transcurrido {elTiempo.hora}h {elTiempo.min}m {elTiempo.seg}s</span>
                            <br />
                            <span style={{ backgroundColor: 'white', color: 'black' }} className="text-center">  TIEMPO APROXIMADO</span>
                            <br />
                            <span style={{ backgroundColor: 'white', color: 'black' }} className="text-center"> {elTiempo.mensaje}</span>
                        </p>}
                    </div>
                </div>}

                {!inSearching.state &&
                    <>
                        {showed.length === 2 &&
                         <span onClick={(e) => {
                            e.preventDefault(); doFrame();
                            setinSearching({
                                ...inSearching,
                                state: true
                            })
                        }} style={{ backgroundColor: 'white', color: 'black' }} className="pointer">Ver ruta </span>}
                        {showed.length > 2 && <span onClick={readyRuta ? (e) => {
                            e.preventDefault(); doFrame();
                            setinSearching({
                                ...inSearching,
                                state: true
                            })
                        } : (e) => {
                            e.preventDefault(); setIrPlace({ ...irPlace, inSelect: true })
                        }} style={{ backgroundColor: 'white', color: 'black' }} className="pointer">{readyRuta ? 'Ver ruta recomendada' : 'crear ruta recomendada'}</span>}
                        {showed.length > 2 && irPlace.inSelect && <>
                            {!irPlace.mapSelect && !irPlace.obraSelect && <span onClick={readyRuta ? (e) => {
                                e.preventDefault(); doFrame();
                                setinSearching({
                                    ...inSearching,
                                    state: true
                                })
                            } : (e) => {
                                e.preventDefault(); setIrPlace({ ...irPlace, ubicacionMapSelected: { ...irPlace.ubicacionMapSelected, mapSelectactive: false, state: false }, mapSelect: false, obraSelect: false, obraSelected: '', biosepticosSelect: false }); myPosition()
                            }} style={{ backgroundColor: 'white', color: 'black' }} className="pointer">DESDE MI UBICACION</span>}
                            {!irPlace.mapSelect && !irPlace.obraSelect && <span onClick={readyRuta ? (e) => {
                                e.preventDefault(); doFrame();
                                setinSearching({
                                    ...inSearching,
                                    state: true
                                })
                            } : (e) => {
                                e.preventDefault(); setIrPlace({ ...irPlace, ubicacionMapSelected: { ...irPlace.ubicacionMapSelected, mapSelectactive: false, state: false }, mapSelect: false, obraSelect: false, obraSelected: '', biosepticosSelect: true }); myPosition('true')
                            }} style={{ backgroundColor: 'white', color: 'black' }} className="pointer">DESDE BIOSEPTICOS</span>}
                            {irPlace.mapSelect ? <span onClick={(e) => {
                                e.preventDefault(); setIrPlace({ ...irPlace, ubicacionMapSelected: { ...irPlace.ubicacionMapSelected, mapSelectactive: false, state: false }, mapSelect: false, obraSelect: false, obraSelected: '', biosepticosSelect: false });
                            }} style={{ backgroundColor: 'white', color: 'black' }} className="pointer">VOLVER</span> : !irPlace.obraSelect && <span onClick={readyRuta ? (e) => {
                                e.preventDefault(); doFrame();
                                setinSearching({
                                    ...inSearching,
                                    state: true
                                })
                            } : (e) => {
                                e.preventDefault(); setIrPlace({ ...irPlace, mapSelect: true, obraSelect: false, ubicacionMapSelected: { ...irPlace.ubicacionMapSelected, state: true }, obraSelected: '' })
                            }} style={{ backgroundColor: 'white', color: 'black' }} className="pointer">ESCOGER EN EL MAPA</span>}
                            {irPlace.obraSelect && <span onClick={(e) => {
                                e.preventDefault(); setIrPlace({ ...irPlace, ubicacionMapSelected: { ...irPlace.ubicacionMapSelected, mapSelectactive: false, state: false, active: false }, mapSelect: false, obraSelect: false, obraSelected: '', biosepticosSelect: false });
                            }} style={{ backgroundColor: 'white', color: 'black' }} className="pointer">VOLVER</span>}
                            {!irPlace.mapSelect &&
                                <span onClick={readyRuta ? (e) => {
                                    e.preventDefault(); doFrame();
                                    setinSearching({
                                        ...inSearching,
                                        state: true
                                    })
                                } : (e) => {
                                    e.preventDefault();
                                    setIrPlace({ ...irPlace, ubicacionMapSelected: { ...irPlace.ubicacionMapSelected, mapSelectactive: false, state: false }, mapSelect: false, biosepticosSelect: false });
                                }} style={{ backgroundColor: 'white', color: 'black' }} className="pointer">{irPlace.obraSelected !== '' ? 'OBRA EN ESPECIFICO ' : <SelectComp funtions={((e) => { e.preventDefault; setIrPlace({ ...irPlace, obraSelect: true, obraSelected: e.target.value }) })} items={irPlace.obrasName} />} </span>}
                        </>}
                        {
                            irPlace.obraSelected !== '' && <><span onClick={(e) => {
                                e.preventDefault(); myPosition(false, 'true')
                            }} style={{ backgroundColor: 'white', color: 'black' }} className="pointer">EMPEZAR EN {irPlace.obraSelected} </span></>
                        }
                        {
                            irPlace.ubicacionMapSelected.state && <><span onClick={readyRuta ? (e) => {
                                e.preventDefault(); doFrame();
                                setinSearching({
                                    ...inSearching,
                                    state: true
                                })
                            } : (e) => {
                                e.preventDefault(); ubicacionIni = { ...ubicacionIni, state: true, mapSelectactive: true }; setIrPlace({ ...irPlace, ubicacionMapSelected: { ...irPlace.ubicacionMapSelected, ...ubicacionIni } }); myPosition(false, false, 'true')
                            }} style={{ backgroundColor: 'white', color: 'black' }} className="pointer">DESDE latitud : {irPlace.ubicacionMapSelected.lat} longitud :{irPlace.ubicacionMapSelected.lng} </span></>
                        }
                    </>
                }
                {
                    irPlace.mapSelect && !irPlace.mapSelectactiveState &&
                    <><ContenedorMaps mapSelect={mapSelect} inMapSelect irPlace={irPlace} defaultLocation={irPlace.coordenadasInicial} />
                    </>
                }
          

            </div>}
            {irPlace.using && <>

                {!confirmMyDirection ?
                    <>
                        <ContenedorMaps ruteando inTimes={inTimes} times={times} setTimes={setTimesFuntion} setIrPlace={setIrPlace} irPlace={irPlace} inOperacion={{
                            state: irPlace.state,
                            inicio: irPlace.coordenadasInicial,
                            final: irPlace.coordenadas
                        }} adressViewIn defaultLocation={irPlace.coordenadas} />
                        {inAdress &&
                            irPlace?.state &&
                            (irPlace.coordenadasInicial?.lat !== 6.2476376 || irPlace.coordenadasInicial?.lng !== -75.5658151) && (
                                <span
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setconfirmMyDirection(true);
                                    }}
                                    style={{ backgroundColor: 'white', color: 'black' }} className="pointer"
                                >
                                    {/* contenido opcional aquí */}
                                </span>
                            )}

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

                        <span onClick={(e) => { e.preventDefault(); setconfirmMyDirection(false) }} style={{ backgroundColor: 'white', color: 'black' }} className='pointer'>
                        </span>
                        <span onClick={(e) => { e.preventDefault(); setconfirmMyDirection(false) }} style={{ backgroundColor: 'white', color: 'black' }} className='pointer'>
                        </span>
                    </>}
            </>}
            <div className="bio-wrap">
                    {!inSearching.state ? (
                        <>
                            <div className="headers">
                                <div>
                                    <div className="title">Obras</div>
                                    <div className="subtitle">Pendientes y completadas</div>
                                </div>
                            </div>

                            {/* Tabla “pendientes” */}
                            <div className="gridsc">
                                <section className="cards">
                                    <div className="rowss muted" style={{ fontWeight: 600 }}>
                                        <span className="pill">Nombre</span>
                                        <span className="pill">Contacto</span>
                                        <span className="pill">Zona</span>
                                    </div>

                                    {showed.map((obra) => (
                                        <div className="rowss" key={obra.id}>
                                            <span className="fzx">
                                                <strong>{obra?.contact?.obra}</strong>
                                            </span>

                                            <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                                <span>— {obra?.contact?.nombre}</span>
                                                <button
                                                    className="btn secondary"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setActiveUser((prev) => ({
                                                            ...prev,
                                                            userInfo: {
                                                                ...prev.userInfo,
                                                                datosContacto: {
                                                                    ...prev.userInfo.datosContacto,
                                                                    ...(obra?.contact || {}),
                                                                    direccion: {
                                                                        ...prev.userInfo.datosContacto.direccion,
                                                                        ...(obra?.direccion || {}),
                                                                    },
                                                                },
                                                            },
                                                        }));
                                                        setInObra({
                                                            ...inObra,
                                                            selected: obra.id,
                                                            action: "contact",
                                                            data: obra.contact,
                                                        });
                                                    }}
                                                >
                                                    ver info
                                                </button>
                                            </span>

                                            <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                                <span>
                                                    {obra?.direccion?.ciudad}-{obra?.direccion?.barrio}
                                                </span>
                                                <button
                                                    className="btn secondary"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setActiveUser((prev) => ({
                                                            ...prev,
                                                            userInfo: {
                                                                ...prev.userInfo,
                                                                datosContacto: {
                                                                    ...prev.userInfo.datosContacto,
                                                                    direccion: {
                                                                        ...prev.userInfo.datosContacto.direccion,
                                                                        ...(obra?.direccion || {}),
                                                                    },
                                                                },
                                                            },
                                                        }));
                                                        setInObra({
                                                            ...inObra,
                                                            selected: obra.id,
                                                            action: "direccion",
                                                            data: obra.direccion,
                                                        });
                                                    }}
                                                >
                                                    más
                                                </button>
                                            </span>
                                        </div>
                                    ))}
                                </section>

                                {/* Completados */}
                                {!(listos?.length > 0) ? (
                                    <div className="cards">
                                        <div className="muted">SIN ACTIVIDAD</div>
                                    </div>
                                ) : (
                                    <section className="cards">
                                        <div className="rowss">
                                            <span className="pill">COMPLETADOS</span>
                                        </div>

                                        {listos.map((obra) => (
                                            <div className="rowss" key={obra.id}>
                                                <span className="fzx">
                                                    <strong>{obra?.contact?.obra}</strong>
                                                </span>

                                                <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                                    <span>— {obra?.contact?.nombre}</span>
                                                    <button
                                                        className="btn secondary"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setActiveUser((prev) => ({
                                                                ...prev,
                                                                userInfo: {
                                                                    ...prev.userInfo,
                                                                    datosContacto: {
                                                                        ...prev.userInfo.datosContacto,
                                                                        ...(obra?.contact || {}),
                                                                        direccion: {
                                                                            ...prev.userInfo.datosContacto.direccion,
                                                                            ...(obra?.direccion || {}),
                                                                        },
                                                                    },
                                                                },
                                                            }));
                                                            setInObra({
                                                                ...inObra,
                                                                selected: obra.id,
                                                                action: "contact",
                                                                data: obra.contact,
                                                            });
                                                        }}
                                                    >
                                                        ver info
                                                    </button>
                                                </span>

                                                <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                                    <span>
                                                        {obra?.direccion?.ciudad}-{obra?.direccion?.barrio}
                                                    </span>
                                                    <button
                                                        className="btn secondary"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setActiveUser((prev) => ({
                                                                ...prev,
                                                                userInfo: {
                                                                    ...prev.userInfo,
                                                                    datosContacto: {
                                                                        ...prev.userInfo.datosContacto,
                                                                        direccion: {
                                                                            ...prev.userInfo.datosContacto.direccion,
                                                                            ...(obra?.direccion || {}),
                                                                        },
                                                                    },
                                                                },
                                                            }));
                                                            setInObra({
                                                                ...inObra,
                                                                selected: obra.id,
                                                                action: "direccion",
                                                                data: obra.direccion,
                                                            });
                                                        }}
                                                    >
                                                        más
                                                    </button>
                                                </span>
                                            </div>
                                        ))}
                                    </section>
                                )}
                            </div>
                        </>
                    ) : (
                        // Vista detalle (contacto / dirección)
                        <>
                            {inObra.action === "contact" && (
                                <section className="cards">
                                    <div className="headers">
                                        <div>
                                            <div className="title">Contacto obra: {inObra?.data?.obra}</div>
                                            <div className="subtitle">Persona a cargo: {inObra?.data?.nombre}</div>
                                        </div>
                                    </div>

                                    <PersComp
                                        adress
                                        contact
                                        inselected={"contactData"}
                                        actualizeData={console.log}
                                        setActiveUser={console.log}
                                        activeUser={activeUser}
                                        permision={activeUser.userInfo.userObj.appPermisions}
                                        objCss={objCss}
                                        objStrings={objStrings}
                                    />
                                </section>
                            )}

                            {inObra.action === "direccion" && (
                                <section className="cards">
                                    <div className="headers">
                                        <div>
                                            <div className="title">Dirección obra: {inObra?.data?.obra}</div>
                                            <div className="subtitle">
                                                {inObra?.data?.ciudad} — {inObra?.data?.barrio}
                                            </div>
                                        </div>
                                    </div>

                                    <PersComp
                                        inselected={"contactData"}
                                        adress
                                        actualizeData={console.log}
                                        setActiveUser={console.log}
                                        activeUser={activeUser}
                                        permision={activeUser.userInfo.userObj.appPermisions}
                                        objCss={objCss}
                                        objStrings={objStrings}
                                    />
                                </section>
                            )}

                            <div className="footer">
                                <span className="muted">Editar información de la obra seleccionada</span>
                                <div className="pager">
                                    <button
                                        className="btn secondary"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setInObra({ ...inObra, selected: "", action: "", data: "" });
                                        }}
                                    >
                                        Volver
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

        </>
    )
}
export default VisorTipoObraLibre