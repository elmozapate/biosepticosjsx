
import GooglMapsComp from "@/components/commons/googleMaps"
import { Socket } from "@/middleware/routes/connect/socket/socketOn"
import { useEffect, useState } from "react"

const socket = Socket
let asks = []
const ContenedorMaps = (props) => {
    const { irPlace = { state: false, coordenadas: { lat: 6.2476376, lng: -75.56581530000001 } }, setIrPlace = console.log, inOperacion = { state: false, inicio: { lat: 6.2476376, lng: -75.56581530000001 }, final: { lat: 6.2476376, lng: -75.56581530000001 } }, adressViewIn = false, defaultLocation = { lat: 6.2476376, lng: -75.56581530000001 }, getId = console.log, normal = false, rastreado = false, receptor = false, visorObj = {} } = props
    const [mapCenter, setMapCenter] = useState(defaultLocation)
    const [goPlace, setGoPlace] = useState({ ok:false,state: false, funtion: console.log })
    const [mapCenterGo, setMapCenterGo] = useState({ inicio: inOperacion.inicio, final: inOperacion.final })
    const [lasDireccionesResult, setLasDireccionesResult] = useState({
        state: false,
        direcciones: []
    })
    const setMapCenterFuntion = (value) => {
        setMapCenter({ ...value })
        setMapCenterGo({
            ...mapCenterGo,
            inicio: { ...value }
        })
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
    return (
        <>
            <GooglMapsComp goPlace={goPlace} setGoPlace={setGoPlace} adressViewIn={adressViewIn} visorObj={visorObj} normal={normal} rastreado={rastreado} receptor={receptor} setLasDireccionesResult={setLasDireccionesResult} lasDireccionesResult={lasDireccionesResult} mapCenterGo={mapCenterGo} irALugar={irALugar} mapCenter={mapCenter} setMapCenterFuntion={setMapCenterFuntionDos} setMapCenter={setMapCenterFuntion} />
            {
                (!irPlace.state || (irPlace.state && irPlace.coordenadas === { lat: 6.2476376, lng: -75.56581530000001 })) ?
                    <>
                        {irPlace.coordenadas === { lat: 6.2476376, lng: -75.56581530000001 } && <span onClick={(e) => {
                            e.preventDefault();
                            irAelLugar()
                        }}>{(!irPlace.state && irPlace.coordenadas === { lat: 6.2476376, lng: -75.56581530000001 }) ? 'LLEGAR' : 'ACCEDER A MI UBICACION'} </span>}
                    </> :
                    <>
                        {goPlace.state && <span onClick={(e) => {
                            e.preventDefault(); goPlace.funtion()
                        }}>VER RUTA </span>}
                        {goPlace.ok && <span onClick={(e) => {
                            e.preventDefault(); irALugar()
                        }}>llevame </span>}
                    </>
            }
        </>
    )
}
export default ContenedorMaps