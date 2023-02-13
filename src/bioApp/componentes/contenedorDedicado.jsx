import StylesObj from "@/styles/stylesObj"
import StringsObj, { UserObj } from "@/engine/content"
import SelectorFuncionEmpresas from "../empresas/selectorFuncionEmpresas"
import { EmpresaObj } from "../models/modelosUsuario"
import { ModeloBiosepticos } from "../models/modeloBiosepticos"
import ContenedorServicios from "../empresas/contenedorServicios"
import RevisarVehiculos from "../empresas/revisarVehiculos"
import RevisarMisEmpresas from "../empresas/revisarMisEmpresas"
import { useEffect } from "react"
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const userStructure = UserObj()

const AppSideContainer = (props) => {
    const { PedirBiosepticos = console.log, actualizarEstado = console.log, modeloBiosepticos = { vehiculos: [], ...ModeloBiosepticos }, servicios = { array: [] }, vehiculos = { array: [] }, empresas = { array: [] }, sendNewServicio = console.log, PedirObras = console.log, pedirMisServicios = console.log, creatingObra = false, setCreatingObra = console.log, misObras = { array: [] }, misServicios = { array: [] }, userData = userStructure, setPopUp = console.log, activeEmpresa = EmpresaObj(), sideOpen = false, objStrings = objStringsInit, objCss = objCssInit, showed = 'inicio' } = props
    useEffect(() => {
        PedirBiosepticos()
    }, [])
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
                                    <RevisarVehiculos actualizarEstado={actualizarEstado} misServicios={vehiculos} misServiciosSort={vehiculos} /* sortBy={sortBy} */ />
                                    {/* {vehiculos.array.map((key, i) => {
                                        return (
                                            <>
                                                <p>{`id: ${key.id.split('-')[1]}   PLACA: ${key.datosLegales.placa}    ESTADO: ${key.datosOperativos.activo ? 'si' : 'no'}    PROGRAMADO: ${key.datosOperativos.rutaActual !== '' ? key.datosOperativos.rutaActual : 'SIN RUTA'}`}</p>
                                            </>
                                        )
                                    })} */}
                                </>
                            }
                            {userData.type === 'vendedor' &&
                                showed === 'clientes' &&
                                <>
                                    <RevisarMisEmpresas userData={userData} misServicios={vehiculos} misServiciosSort={vehiculos} /* sortBy={sortBy} */ />
                                    {/* {vehiculos.array.map((key, i) => {
                                        return (
                                            <>
                                                <p>{`id: ${key.id.split('-')[1]}   PLACA: ${key.datosLegales.placa}    ESTADO: ${key.datosOperativos.activo ? 'si' : 'no'}    PROGRAMADO: ${key.datosOperativos.rutaActual !== '' ? key.datosOperativos.rutaActual : 'SIN RUTA'}`}</p>
                                            </>
                                        )
                                    })} */}
                                </>
                            }
                            {/* <SelectorFuncionEmpresas sendNewServicio={sendNewServicio} PedirObras={PedirObras}
                                pedirMisServicios={pedirMisServicios} creatingObra={creatingObra} setCreatingObra={setCreatingObra} misObras={misObras} misServicios={misServicios} userData={userData} setPopUp={setPopUp} sideOpen={sideOpen} activeEmpresa={activeEmpresa} objCss={objCss} objStrings={objStrings} showed={showed} /> */}
                        </div>
                }
            </div>

        </>
    )
}

export default AppSideContainer