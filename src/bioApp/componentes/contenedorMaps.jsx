
import GooglMapsComp from "@/components/commons/googleMaps"
import { Socket } from "@/middleware/routes/connect/socket/socketOn"
import { useEffect, useState } from "react"

const socket = Socket
let asks = []
const ContenedorMaps = (props) => {
    const { mapSelect = console.log, inMapSelect = false, inTimes = 0, ruteando = false, times = [[]], setTimes = console.log, irPlace = { funtionOk: false, using: false, state: false, go: false, coordenadas: { lat: 6.2476376, lng: -75.56581530000001 }, coordenadasInicial: { lat: 6.2476376, lng: -75.56581530000001 }, funtion: console.log }, setIrPlace = console.log, inOperacion = { state: false, inicio: { lat: 6.2476376, lng: -75.56581530000001 }, final: { lat: 6.2476376, lng: -75.56581530000001 } }, adressViewIn = false, defaultLocation = { lat: 6.2476376, lng: -75.56581530000001 }, getId = console.log, normal = false, rastreado = false, receptor = false, visorObj = {} } = props
    const [mapCenter, setMapCenter] = useState(defaultLocation)
    const [goPlace, setGoPlace] = useState({ funtionOk: false, go: false, ok: false, state: false, funtion: console.log })
    const [mapCenterGo, setMapCenterGo] = useState(ruteando ? { inicio: irPlace.coordenadasInicial, final: irPlace.coordenadas } : { inicio: inOperacion.inicio, final: inOperacion.final })
    const [lasDireccionesResult, setLasDireccionesResult] = useState({
        state: false,
        direcciones: []
    })
    const setMapCenterFuntion = (value) => {
        if (inMapSelect) {
            setMapCenter({ ...value })
            mapSelect(value)
        } else {
            setMapCenter({ ...value })
            setMapCenterGo({
                ...mapCenterGo,
                inicio: { ...value }
            })
        }

    }
    const setMapCenterFuntionDos = (value) => {
        setMapCenter({ ...value })
        setMapCenterGo({
            ...mapCenterGo,
            final: { ...value }
        })
    }
    const irALugar = () => {
        window.open(`http://maps.google.com/maps?saddr=${mapCenterGo.inicio.lat},${mapCenterGo.inicio.lng}&daddr=${mapCenterGo.final.lat},${mapCenterGo.final.lng}`)
    }

    useEffect(() => {
        if (receptor) {
            socket.on('bioSepticosMapAdminGet', (msg) => {
                let askDone = true
                asks.map((key, i) => {
                    if (key === msg.ask) {
                        askDone = false
                    }
                })
                if (msg.sala === visorObj.id) {

                    const actionTodo = msg.actionTodo
                    const Data = msg.dataIn
                    const usersMapRes = msg.dataIn.usersMap
                    switch (actionTodo) {
                        case 'dataRes-visorObjLocation':
                            setMapCenter({
                                ...mapCenter,
                                ...Data,
                                ip: visorObj.ip,
                                id: visorObj.id,
                            })
                            break;
                        default:
                            break;
                    }
                    asks.push(msg.ask)

                }

            })
        }


    }, [visorObj])
    useEffect(() => {
        if (rastreado) {
            navigator.geolocation.watchPosition(
                function (position) { // success cb
                    setMapCenter({
                        ...mapCenter,
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    })
                    socket.emit('bioSepticosMap', {
                        'dataIn': {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        },
                        actionTodo: "userObjLocation",
                        ...visorObj,
                        type: 'obj',
                        ip: visorObj.ip,
                        id: visorObj.id,
                        reqId: parseInt(Math.random() * 999999)
                    });
                }
            );
            socket.on(`bioSepticosMapObj`, (msg) => {
                const actionTodo = msg.actionTodo
                switch (actionTodo) {
                    case 'dataAsk-userObj':
                        check()
                        break;
                    default:
                        break;
                }
            })
        }
    }, [visorObj, rastreado])

    const check = () => {
        navigator.geolocation.getCurrentPosition(
            function (position) { // success cb
                setMapCenter({
                    ...mapCenter,
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                })
                socket.emit('bioSepticosMap', {
                    'dataIn': {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    },
                    actionTodo: "userObjLocation",
                    ...visorObj,
                    type: 'obj',
                    ip: visorObj.ip,
                    id: visorObj.id,
                    reqId: parseInt(Math.random() * 999999)
                });
            }
        );
    }
    const irAelLugar = () => {
        navigator.geolocation.getCurrentPosition(
            function (position) { // success cb
                setIrPlace({
                    ...irPlace,
                    state: true,
                    coordenadas: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }
                })
            }
        );
    }

    return (
        <>
            <GooglMapsComp inMapSelect={inMapSelect} inTimes={inTimes} times={times} setTimes={setTimes} setIrPlace={setIrPlace} irPlace={irPlace} goPlace={goPlace} setGoPlace={setGoPlace} adressViewIn={adressViewIn} visorObj={visorObj} normal={normal} rastreado={rastreado} receptor={receptor} setLasDireccionesResult={setLasDireccionesResult} lasDireccionesResult={lasDireccionesResult} mapCenterGo={mapCenterGo} irALugar={irALugar} mapCenter={mapCenter} setMapCenterFuntion={setMapCenterFuntionDos} setMapCenter={setMapCenterFuntion} />
            {
                !inMapSelect && ((goPlace.funtionOk && !irPlace.state) || (irPlace.state && irPlace.coordenadas === { lat: 6.2476376, lng: -75.56581530000001 })) ?
                    <>
                        {<span onClick={(e) => {
                            e.preventDefault();
                            irAelLugar()
                        }}>{(!irPlace.state && irPlace.coordenadas === { lat: 6.2476376, lng: -75.56581530000001 }) ? irPlace.using ? '.' : 'LLEGAR' : irPlace.using ? '.' : 'ACCEDER A MI UBICACION'} </span>}
                    </> :
                    <>
                        {!inMapSelect && goPlace.funtionOk && <span id="crearLaRuta" onClick={(e) => {
                            e.preventDefault(); goPlace.funtion()
                        }}>{irPlace.using ? '.' : 'VER RUTA'}</span>}
                        {!inMapSelect && goPlace.ok && <span onClick={(e) => {
                            e.preventDefault(); irALugar()
                        }}>{irPlace.using ? '.' : 'llevame'} </span>}
                    </>
            }
        </>
    )
}
export default ContenedorMaps