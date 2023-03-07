
import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import { useEffect, useState } from "react"
import PersComp from "@/bioDashBoard/componentes/dependencias/persComp"
import ModeloUsuario from "../models/modelosUsuario"
import ContenedorMaps from "./contenedorMaps"
import PercentComp from "./percentComp"
import { rewrites } from "next.config"
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const VisorTipoObra = (props) => {
    const { userModel = ModeloUsuario, willShow = console.log, showed = [], objStrings = objStringsInit, objCss = objCssInit } = props
    const [inObra, setInObra] = useState({
        selected: '',
        action: '',
        data: {}
    })
    const [readyRuta, setReadyRuta] = useState(false)
    const [times, setTimes] = useState([[]])
    const [inTimes, setInTimes] = useState(0)
    const [elPercent, setElPercent] = useState(0)
    const [inAdress, setInAdress] = useState({
        state: true
    })
    const [irPlace, setIrPlace] = useState({
        funtionOk: false,
        using: false, state: false, go: false, coordenadas: { lat: 6.2476376, lng: -75.56581530000001 }, coordenadasInicial: { lat: 6.2176376, lng: -75.56581530000001 }, funtion: async () => { console.log }
    })
    const [confirmMyDirection, setconfirmMyDirection] = useState(false)
    const [activeUser, setActiveUser] = useState({
        selectOp: '',
        userInfo: ModeloUsuario()
    })
    let rutastime = []
    let inValue = 0
    let maxValue = showed.length
    const sheduleCreator = (array, father, valuesIn, tiempoIn, inStage) => {
        /*         console.log(array, valuesIn, tiempo, father, inStage, 'aca');
         */
        let resArray = []
        console.log(tiempoIn);
        array.map((key, i) => {
            let tiempo = tiempoIn + key.item.time
            let newArreglo = []
            let newValues = key.values
            times[key.position].map((keyMap, iMap) => {
                const keyMapVar = { ...keyMap, time: tiempo + keyMap.time }
                console.log(keyMapVar, 'keyMapVar');
                newValues = key.values
                let isShedule = false
                newValues.map((keyComp, iComp) => {
                    if (keyComp === iMap) {
                        isShedule = true
                    }
                })
                if (!isShedule && newValues.length < times[key.position].length) {
                    console.log(tiempo);
                    newValues.push(iMap)
                    newArreglo.push({ tiempo: parseInt(parseInt(tiempo)), item: keyMapVar, position: iMap, values: newValues })
                    let resArrayReq = sheduleCreator(newArreglo, father, [], parseInt(parseInt(tiempo)))
                    newValues.length + 1 < times[key.position].length ? resArray.push(resArrayReq) : resArray.push({ tiempo: tiempo, item: keyMapVar, position: iMap, values: newValues })

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

        const res = sheduleCreator(elArreglo, father, [], 0)
        console.log(res);
        return res

        /*     let rutasRes = []
            let valuesIn = values
            let allRutasCalc = []
            const stringMa = () => {
                let stringOut = ''
                values.map((keyIn, iIn) => {
                    stringOut = stringOut + (iIn === 0 ? `f${keyIn}-` : `h-${iIn}-${keyIn} `)
                })
                return stringOut
            }
            const element = { estado: false, hijos: [], id: inStage === 0 ? `father-${father}` : stringMa(), tiempo: Number() }
            for (let iM = 0; iM < times[father].length; iM++) {
                console.log(father, iM, inStage, values);
                let isSearchP = false
                valuesIn = values
                valuesIn.map((keyS, iS) => {
                    if (iM === keyS) {
                        isSearchP = true
                    }
                })
                if (!isSearchP && valuesIn.length < times[father].length) {
                    valuesIn.push(iM)
    
                    const keyM = array[iM]
    
                    for (let index = 0; index < times[father].length; index++) {
                        let valuesInDeep = valuesIn
                        const stringMakeD = () => {
                            let stringOut = ''
                            valuesIn.map((keyIn, iIn) => {
                                stringOut = stringOut + (`h${inStage}-${keyIn}-`)
                            })
                            return stringOut
                        }
                        let isSearch = false
                        valuesIn.map((keyS, iS) => {
                            if (index === parseInt(keyS)) {
                                isSearch = true
                            }
                        })
                        if (valuesInDeep.length < times[father].length + 1 && !isSearch) {
                            const elemento = times[iM][father]
                            valuesInDeep.push(index)
                            rutasRes.push({
                                hijos: await sheduleCreators(array, valuesInDeep, parseInt(tiempo) + parseInt(elemento.time), index, inStage + 1),
                                id: stringMakeD(),
                                tiempo: parseInt(tiempo) + parseInt(elemento.time)
                            })
                            if (!(valuesInDeep.length < times[father].length)) {
                                console.log(rutasRes[rutasRes.length - 1].hijos);
                            }
                        }
                    }
                }
    
            }
            return rutasRes */
    }

    let newToSearchE = []

    const crearOptRuta = async () => {
        newToSearchE = []
        let resSearhE = []
        setElPercent(0)
        let theFastest = { item: {}, tiempo: 0 }

        if (showed.length > 2) {
            for (let index = 0; index < showed.length; index++) {
                newToSearchE = []
                newToSearchE.push(index)
                resSearhE.push(await sheduleCreators(times, newToSearchE, 1, index))
            }
            console.log(resSearhE[0][0].item.time);
            if (resSearhE[0] && resSearhE[0][0] && resSearhE[0][0].item && resSearhE[0][0].item.time) {
                theFastest = { item: resSearhE[0][0], tiempo: 999999999999 }

            }
            resSearhE.map((key, i) => {
                key.map((keyComp, iComp) => {
                    console.log(keyComp.item.time);
                    if (keyComp.item.time + keyComp.tiempo < theFastest.tiempo) {
                        console.log(keyComp, 'aca');
                        theFastest = { item: keyComp, tiempo: keyComp.item.time + keyComp.tiempo }
                    }
                })
            })
            console.log(theFastest);
        }
        let rutaPlaneadaArray = []
        for (let index = 0; index < showed.length; index++) {
            const element = showed[showed.length > 2 ? theFastest.item.values[index] : index];
            rutaPlaneadaArray.push(element.direccion.coordenadas)

        }
        let url = 'https://www.google.com/maps/dir/'
        for (let index = 0; index < showed.length; index++) {
            const element = rutaPlaneadaArray[index];
            url = url + `${element.lat},${element.lng}/`
        }
        window.open(url)

    }
    const makeRuta = async (time = 0) => {
        maxValue = showed.length
        console.log(times);
        if (time === 0) {
            setElPercent(0)
            inValue < maxValue && navigator.geolocation.getCurrentPosition(
                function (position) { // success cb
                    setIrPlace({
                        ...irPlace,
                        state: true,
                        using: true,
                        coordenadasInicial: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        },
                        coordenadas: showed[inValue].direccion.coordenadas
                    })
                    console.log('asass');
                    setElPercent(((100 / showed.length) * time) + (((100 / showed.length) / showed.length) * inValue))
                }
            );
            if (time < maxValue && !(inValue < maxValue)) {
                setTimeout(() => {
                    inValue = 0;
                    rutastime = (times);
                    setInTimes(1)
                    makeRuta(1);
                }, 2000)
            }
        } else {
            if (time < maxValue && inValue < maxValue) {
                setIrPlace({
                    ...irPlace,
                    state: true,
                    using: true,
                    coordenadasInicial: showed[time].direccion.coordenadas,
                    coordenadas: showed[inValue].direccion.coordenadas
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
    const continueRuta = async (time) => {
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

    return (
        <>
            <div id={`idShow-${parseInt(Math.random() * 9999)}`} className='container-bio' onClick={(e) => {
                e.preventDefault(); willShow(showed)
            }}>
                {elPercent < 100 && elPercent > 0 && <><h2>RUTA PLANEADA :</h2><PercentComp elPercent={parseInt(elPercent)} /></>}
                {showed.length === 2 && <span onClick={(e) => {
                        e.preventDefault(), crearOptRuta()
                    }} className="pointer">Ver ruta </span>}
                    {showed.length > 2 && <span onClick={readyRuta ? (e) => {
                        e.preventDefault(), crearOptRuta()
                    } : (e) => {
                        e.preventDefault(), makeRuta()
                    }} className="pointer">{readyRuta ? 'Ver ruta recomendada' : 'crear ruta recomendada'}</span>}
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
                                            e.preventDefault(); console.log(activeUser.userInfo.datosContacto.direccion, key);
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
                        e.preventDefault(), setInObra({
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