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
import ContenedorMaps from "./contenedorMaps"
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const userStructure = UserObj()

const AppSideContainer = (props) => {
    const {userModel=userStructure, obras = { array: [] }, rutas = { array: [] }, PedirBiosepticos = console.log, actualizarEstado = console.log, modeloBiosepticos = ModeloBiosepticos, servicios = { array: [] }, vehiculos = { array: [] }, empresas = { array: [] }, sendNewServicio = console.log, PedirObras = console.log, pedirMisServicios = console.log, creatingObra = false, setCreatingObra = console.log, misObras = { array: [] }, misServicios = { array: [] }, userData = userStructure, setReqState = console.log, reqState = { reqId: Number(), state: false, peticion: '', type: ''  ,inList: [] }, setPopUp = console.log, activeEmpresa = EmpresaObj(), sideOpen = false, objStrings = objStringsInit, objCss = objCssInit, showed = 'inicio' } = props
    const [serviceStep, seServiceStep] = useState({ data: {}, step: 0 })


    /*         navigator.geolocation.clearWatch(id);
     */
    const modeloInicial = {
        normal: false,
        rastreado: false,
        receptor: false,
    }
    const [stateMap, setStateMap] = useState(modeloInicial)
    const hacerUsuario = (value) => {
        setStateMap({
            ...modeloInicial,
            [value]: true,
        })
        return true
    }


    useEffect(() => {
        if (showed === 'requerimientos') {
            hacerUsuario('normal')
        }
        if (showed === 'historial') {
            hacerUsuario('rastreado')
        }
        if (showed === 'novedades') {
            hacerUsuario('receptor')
        }
    }, [showed])

    return (
        <>
            <div className={sideOpen ? objCss.app.sideContainer : objCss.app.sideContainerOpen}>
                {
                    !userData[userData.type === 'operativeUser' ? 'appPermisions' : userData.type === 'vendedor' ? 'sellPermisions' : userData.type === 'clientUser' ? 'companyPermisions' : ''][showed] ?
                        <>
                            <h1 className={objCss.app.sectionTitle}>NO DISPONIBLE </h1></> :
                        <div className="flex-column max-h">

                            {userData.type === 'clientUser' && <SelectorFuncionEmpresas   userModel={userModel} serviceStep={serviceStep} seServiceStep={seServiceStep} sendNewServicio={sendNewServicio} PedirObras={PedirObras} empresas={empresas}
                                pedirMisServicios={pedirMisServicios} creatingObra={creatingObra} setCreatingObra={setCreatingObra} misObras={misObras} misServicios={misServicios} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} sideOpen={sideOpen} activeEmpresa={activeEmpresa} objCss={objCss} objStrings={objStrings} showed={showed} />}
                            {userData.type === 'operativeUser' &&
                                <>
                                    {showed === 'servicios' &&
                                        <><h1> {showed}</h1>
                                            <ContenedorServicios serviceStep={serviceStep} seServiceStep={seServiceStep} logistica pedirMisServicios={pedirMisServicios} sendNewServicio={sendNewServicio} creatingObra={creatingObra} misObras={misObras} misServicios={servicios} setCreatingObra={setCreatingObra} activeEmpresa={activeEmpresa} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} sideOpen={sideOpen} objStrings={objStrings} objCss={objCss} showed={showed} />

                                        </>}
                                    {showed === 'personalLogistico' &&
                                        <><h1> {showed}</h1>
                                            <ContenedorServicios  serviceStep={serviceStep} seServiceStep={seServiceStep} personalLogistico modeloBiosepticos={modeloBiosepticos} actualizarEstado={actualizarEstado} logistica pedirMisServicios={pedirMisServicios} sendNewServicio={sendNewServicio} creatingObra={creatingObra} misObras={misObras} misServicios={servicios} setCreatingObra={setCreatingObra} activeEmpresa={activeEmpresa} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} sideOpen={sideOpen} objStrings={objStrings} objCss={objCss} showed={showed} />

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
                                showed === 'calendario' ?
                                <>
                                    <DateView showed={showed} obras={obras} rutas={rutas} calendario userData={userData} setReqState={setReqState} reqState={reqState} servicios={servicios} actualizarEstado={actualizarEstado} misServicios={vehiculos} misServiciosSort={vehiculos} modeloBiosepticos={modeloBiosepticos} />

                                </> : showed === 'rutas' ?
                                    <>
                                        <DateView showed={showed} servicios={servicios} rutas={rutas} rutasIn objStrings={objStrings} objCss={objCss} actualizarEstado={actualizarEstado} misServicios={vehiculos} misServiciosSort={vehiculos} modeloBiosepticos={modeloBiosepticos} />
                                    </> : <></>
                            }

                            {userData.type === 'operativeUser' &&
                                showed === 'requerimientos' ?
                                <>{<ContenedorMaps normal={stateMap.normal} receptor={stateMap.receptor} rastreado={stateMap.rastreado} />}</> : <></>
                            }
                            {userData.type === 'operativeUser' &&
                                showed === 'historial' ?
                                <>
                                    {<ContenedorMaps receptor={stateMap.receptor} normal={stateMap.normal} rastreado={stateMap.rastreado} />
                                    }
                                </> : <></>
                            }
                            {userData.type === 'operativeUser' &&
                                showed === 'novedades' ?
                                <>
                                    {<ContenedorMaps rastreado={stateMap.rastreado} receptor={stateMap.receptor} normal={stateMap.normal} />
                                    }
                                </> : <></>
                            }
                            {userData.type === 'vendedor' &&
                                showed === 'clientes' &&
                                <>
                                    <RevisarMisEmpresas userData={userData} setReqState={setReqState} reqState={reqState} misServicios={vehiculos} misServiciosSort={vehiculos} /* sortBy={sortBy} */ />

                                </>
                            }

                        </div>
                }
            </div>

        </>
    )
}

export default AppSideContainer