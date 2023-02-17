import StylesObj from "@/styles/stylesObj"
import StringsObj, { UserObj } from "@/engine/content"
import SelectorFuncionEmpresas from "../empresas/selectorFuncionEmpresas"
import { EmpresaObj } from "../models/modelosUsuario"
import { ModeloBiosepticos } from "../models/modeloBiosepticos"
import ContenedorServicios from "../empresas/contenedorServicios"
import RevisarVehiculos from "../empresas/revisarVehiculos"
import RevisarMisEmpresas from "../empresas/revisarMisEmpresas"
import { useEffect, useState } from "react"
import DateView from "./dateView"
import GooglMapsComp from "@/components/commons/googleMaps"
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const userStructure = UserObj()

const AppSideContainer = (props) => {
    const { obras = { array: [] }, rutas = { array: [] }, PedirBiosepticos = console.log, actualizarEstado = console.log, modeloBiosepticos = { vehiculos: [], ...ModeloBiosepticos }, servicios = { array: [] }, vehiculos = { array: [] }, empresas = { array: [] }, sendNewServicio = console.log, PedirObras = console.log, pedirMisServicios = console.log, creatingObra = false, setCreatingObra = console.log, misObras = { array: [] }, misServicios = { array: [] }, userData = userStructure, setPopUp = console.log, activeEmpresa = EmpresaObj(), sideOpen = false, objStrings = objStringsInit, objCss = objCssInit, showed = 'inicio' } = props
    const [mapCenter, setMapCenter] = useState({ lat: 27.672932021393862, lng: 85.31184012689732 })
    const [mapCenterGo, setMapCenterGo] = useState({ inicio: { lat: 27.672932021393862, lng: 85.31184012689732 }, final: { lat: 27.672932021393862, lng: 85.31184012689732 } })

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
        console.log(mapCenterGo);
        window.open(`http://maps.google.com/maps?saddr=${mapCenterGo.inicio.lat},${mapCenterGo.inicio.lng}&daddr=${mapCenterGo.final.lat},${mapCenterGo.final.lng}`)
    }
    useEffect(() => {
        PedirBiosepticos()
        navigator.geolocation.getCurrentPosition(
            function (position) { // success cb
                console.log(position);
                setMapCenter({
                    ...mapCenter,
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                })
            },
            function () { // fail cb
            }


        );
        /*  let id = */
        (navigator.geolocation.watchPosition(position => {
            console.log(position.coords.latitude, position.coords.longitude, 'eoo', {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
        }));

/*         navigator.geolocation.clearWatch(id);
 */    }, [])
    useEffect(() => {
        actualizarEstado()
    }, [modeloBiosepticos])
    return (
        <>
            <div className={sideOpen ? objCss.app.sideContainer : objCss.app.sideContainerOpen}>
                {
                    !userData[userData.type === 'operativeUser' ? 'appPermisions' : userData.type === 'vendedor' ? 'sellPermisions' : userData.type === 'clientUser' ? 'companyPermisions' : ''][showed] ?
                        <>
                            <h1 className={objCss.app.sectionTitle}>NO DISPONIBLE </h1></> :
                        <div className="flex-column max-h">

                            {userData.type === 'clientUser' && <SelectorFuncionEmpresas sendNewServicio={sendNewServicio} PedirObras={PedirObras} empresas={empresas}
                                pedirMisServicios={pedirMisServicios} creatingObra={creatingObra} setCreatingObra={setCreatingObra} misObras={misObras} misServicios={misServicios} userData={userData} setPopUp={setPopUp} sideOpen={sideOpen} activeEmpresa={activeEmpresa} objCss={objCss} objStrings={objStrings} showed={showed} />}
                            {userData.type === 'operativeUser' &&
                                <>
                                    {showed === 'servicios' &&
                                        <><h1> {showed}</h1>
                                            <ContenedorServicios logistica pedirMisServicios={pedirMisServicios} sendNewServicio={sendNewServicio} creatingObra={creatingObra} misObras={misObras} misServicios={servicios} setCreatingObra={setCreatingObra} activeEmpresa={activeEmpresa} userData={userData} setPopUp={setPopUp} sideOpen={sideOpen} objStrings={objStrings} objCss={objCss} showed={showed} />

                                        </>}
                                    {showed === 'personalLogistico' &&
                                        <><h1> {showed}</h1>
                                            <ContenedorServicios personalLogistico modeloBiosepticos={modeloBiosepticos} actualizarEstado={actualizarEstado} logistica pedirMisServicios={pedirMisServicios} sendNewServicio={sendNewServicio} creatingObra={creatingObra} misObras={misObras} misServicios={servicios} setCreatingObra={setCreatingObra} activeEmpresa={activeEmpresa} userData={userData} setPopUp={setPopUp} sideOpen={sideOpen} objStrings={objStrings} objCss={objCss} showed={showed} />

                                        </>}
                                </>
                            }
                            {userData.type === 'operativeUser' &&
                                showed === 'vehiculos' &&
                                <>
                                    <RevisarVehiculos modeloBiosepticos={modeloBiosepticos} actualizarEstado={actualizarEstado} misServicios={vehiculos} misServiciosSort={vehiculos}  /* sortBy={sortBy} */ />

                                </>
                            }
                            {userData.type === 'operativeUser' &&
                                showed === 'calendario' &&
                                <>
                                    <DateView obras={obras} rutas={rutas} calendario userData={userData} servicios={servicios} actualizarEstado={actualizarEstado} misServicios={vehiculos} misServiciosSort={vehiculos} modeloBiosepticos={modeloBiosepticos} />

                                </>
                            }
                            {userData.type === 'operativeUser' &&
                                showed === 'rutas' &&
                                <>
                                    <DateView servicios={servicios} rutas={rutas} rutasIn objStrings={objStrings} objCss={objCss} actualizarEstado={actualizarEstado} misServicios={vehiculos} misServiciosSort={vehiculos} modeloBiosepticos={modeloBiosepticos} />
                                </>
                            }
                            {userData.type === 'operativeUser' &&
                                showed === 'requerimientos' &&
                                <>
                                    <GooglMapsComp normal setLasDireccionesResult={setLasDireccionesResult} lasDireccionesResult={lasDireccionesResult} mapCenterGo={mapCenterGo} irALugar={irALugar} mapCenter={mapCenter} setMapCenterFuntion={setMapCenterFuntionDos} setMapCenter={setMapCenterFuntion} servicios={servicios} rutas={rutas} rutasIn objStrings={objStrings} objCss={objCss} actualizarEstado={actualizarEstado} misServicios={vehiculos} misServiciosSort={vehiculos} modeloBiosepticos={modeloBiosepticos} />
                                </>
                            }
                            {userData.type === 'operativeUser' &&
                                showed === 'historial' &&
                                <>
                                    <GooglMapsComp receptor setLasDireccionesResult={setLasDireccionesResult} lasDireccionesResult={lasDireccionesResult} mapCenterGo={mapCenterGo} irALugar={irALugar} mapCenter={mapCenter} setMapCenterFuntion={setMapCenterFuntionDos} setMapCenter={setMapCenterFuntion} servicios={servicios} rutas={rutas} rutasIn objStrings={objStrings} objCss={objCss} actualizarEstado={actualizarEstado} misServicios={vehiculos} misServiciosSort={vehiculos} modeloBiosepticos={modeloBiosepticos} />
                                </>
                            }
                            {userData.type === 'operativeUser' &&
                                showed === 'novedades' &&
                                <>
                                    <GooglMapsComp rastreado setLasDireccionesResult={setLasDireccionesResult} lasDireccionesResult={lasDireccionesResult} mapCenterGo={mapCenterGo} irALugar={irALugar} mapCenter={mapCenter} setMapCenterFuntion={setMapCenterFuntionDos} setMapCenter={setMapCenterFuntion} servicios={servicios} rutas={rutas} rutasIn objStrings={objStrings} objCss={objCss} actualizarEstado={actualizarEstado} misServicios={vehiculos} misServiciosSort={vehiculos} modeloBiosepticos={modeloBiosepticos} />
                                </>
                            }
                            {userData.type === 'vendedor' &&
                                showed === 'clientes' &&
                                <>
                                    <RevisarMisEmpresas userData={userData} misServicios={vehiculos} misServiciosSort={vehiculos} /* sortBy={sortBy} */ />

                                </>
                            }

                        </div>
                }
            </div>

        </>
    )
}

export default AppSideContainer