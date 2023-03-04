import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import { useEffect, useState } from "react"
import Selector from "./selector"
import { UserObj } from "@/engine/content"
import SelectorEmpresas from "../empresas/selectorEmpresas"
import ModeloUsuario, { EmpresaObj } from "../models/modelosUsuario"
import { ModeloBiosepticos } from "../models/modeloBiosepticos"
import SelectorDeBioseptico from "./selectorDeBioseptico"
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const AppContainer = (props) => {
    const { dataBioseptico = {
        servicios: [],
        rutas: [],
        obras: [],
        rutasIndividuales: []
    }, obras = { array: [] }, rutas = { rutas: [] }, actualizarEstado = console.log, PedirBiosepticos = console.log, modeloBiosepticos = ModeloBiosepticos, servicios = { array: [] }, vehiculos = { array: [] }, sendNewServicio = console.log, creatingObra = false, setCreatingObra = console.log, misObras = { array: [] }, misServicios = { array: [] }, startCreating = false, PedirObras = console.log, pedirMisServicios = console.log, setStartCreating = console.log, userModel = ModeloUsuario(), misEmpresas = {
        seleccionada: '', empresas: [], itemSelectioned: EmpresaObj()
    }, setMisEmpresas = console.log, usersAll = { array: [] }, pedirEmpresas = console.log, empresas = { array: [] }, users = { array: [] }, userData = userStructure, setReqState = console.log, reqState = { reqId: Number(), state: false, peticion: '', type: '', inList: [] }, setPopUp = console.log, objStrings = objStringsInit, objCss = objCssInit, inUse = 'app' } = props
    const [startTransition, setStartTransition] = useState(false)
    useEffect(() => {
        setTimeout(() => {
            setStartTransition(true)
        }, 2000);
    }, [])
    return (
        <>
            {inUse === 'app' ?
                <>
                    <div id={(parseInt(Math.random() * 9999999999)).toString()} className={objCss.app.main}>
                        {userData.type === 'bioseptico' ?
                            startTransition ? <>
                                <SelectorDeBioseptico empresas={empresas} userModel={userModel} dataBioseptico={dataBioseptico} obras={obras} rutas={rutas} PedirBiosepticos={PedirBiosepticos} servicios={servicios} modeloBiosepticos={modeloBiosepticos} actualizarEstado={actualizarEstado} vehiculos={vehiculos} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} objCss={objCss} objStrings={objStrings} />

                            </> : <> {objStrings.app.introBio}</> : <></>
                        }
                        {userData.type === 'operativeUser' ?
                            startTransition ? <><Selector obras={obras} rutas={rutas} PedirBiosepticos={PedirBiosepticos} servicios={servicios} modeloBiosepticos={modeloBiosepticos} actualizarEstado={actualizarEstado} vehiculos={vehiculos} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} objCss={objCss} objStrings={objStrings} /></> : <> {objStrings.app.intro}</> : <></>
                        }
                        {userData.type === 'clientUser' ?
                            startTransition ?
                                <>
                                    {misEmpresas.seleccionada === '' ?
                                        <>
                                            <SelectorEmpresas PedirObras={PedirObras}
                                                pedirMisServicios={pedirMisServicios} startCreating={startCreating} setStartCreating={setStartCreating} userModel={userModel} misEmpresas={{ seleccionada: '', empresas: misEmpresas.empresas, itemSelectioned: EmpresaObj() }} setMisEmpresas={setMisEmpresas} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} objCss={objCss} objStrings={objStrings} />
                                        </> :
                                        <Selector userModel={userModel} empresas={empresas} empresasIn sendNewServicio={sendNewServicio} PedirObras={PedirObras}
                                            pedirMisServicios={pedirMisServicios} creatingObra={creatingObra} setCreatingObra={setCreatingObra} misObras={misObras} misServicios={misServicios} miEmpresa={misEmpresas.itemSelectioned} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} objCss={objCss} objStrings={objStrings} />
                                    }
                                </>
                                :
                                <>BIENVENIDOS AL CENTRO DE EMPRESAS BIO APP {/* objStrings.app.intro */}</> : <></>
                        }
                        {userData.type === 'vendedor' ?
                            startTransition ? <><Selector vendedoresIn userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} objCss={objCss} objStrings={objStrings} /></> : <>BIENVENIDOS AL CENTRO DE EMPRESAS BIO APP {/* objStrings.app.intro */}</> : <></>
                        }
                    </div>
                </> :
                <div className={objCss.dashBoard.main}>
                    {
                        startTransition ? <><Selector modeloBiosepticos={modeloBiosepticos} actualizarEstado={actualizarEstado} vehiculos={vehiculos} usersAll={usersAll} pedirEmpresas={pedirEmpresas} empresas={empresas} users={users} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} objCss={objCss} objStrings={objStrings} dashBoard /></> : <> {objStrings.dashBoard.intro}</>
                    }

                </div>
            }

        </>
    )
}

export default AppContainer