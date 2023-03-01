import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import { useState } from "react"
import { ArraySelector, ArraySection, ArraySelectorEmpresas, ArraySelectorVendedores } from "../models/modelosSelector"
import CardView from "./cardView"
import { UserObj } from "@/engine/content"
import SideBar from "./sideBar"
import AppSideContainer from "./contenedorDedicado"
import DashMenu from "@/bioDashBoard/componentes/menu"
import SectionContainer from "@/bioDashBoard/componentes/sectionContainer"
import { EmpresaObj } from "../models/modelosUsuario"
import { ModeloBiosepticos } from "../models/modeloBiosepticos"
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const Selector = (props) => {
    const {userModel=userStructure, obras = { array : [ ] }, rutas= { rutas: [ ] },PedirBiosepticos = console.log, actualizarEstado = console.log, modeloBiosepticos = ModeloBiosepticos , servicios = { array: [] }, vehiculos = { array: [] }, pedirMisServicios = console.log, sendNewServicio = console.log, creatingObra = false, PedirObras = console.log, setCreatingObra = console.log, misObras = { array: [] }, misServicios = { array: [] }, miEmpresa = EmpresaObj(), vendedoresIn = false, empresasIn = false, usersAll = { array: [] }, pedirEmpresas = console.log, empresas = { array: [] }, users = { array: [] }, companies = { array: [] }, userData = userStructure, setReqState = console.log, reqState = { reqId: Number(), state: false, peticion: '', type: ''  ,inList: [] }, setPopUp = console.log, objStrings = objStringsInit, objCss = objCssInit, dashBoard = false } = props

    const [selectioned, setSelectioned] = useState(dashBoard ? 'centro rapido' : 'inicio')
    const [sideOpen, setSideOpen] = useState(false)
    return (
        <>
            {
                dashBoard ?
                    <>
                        <div  className={selectioned === 'inicio' || selectioned === 'centro rapido' ? objCss.dashBoard.sectionContainer : objCss.dashBoard.sectionContainerLarge}>
                            <DashMenu setReqState={setReqState} reqState={reqState} users={users} showed={selectioned} willShow={setSelectioned} sideOpen={sideOpen} objCss={objCss} objStrings={objStrings} />
                            {ArraySection.map((key, i) => {
                                return (<>
                                    {selectioned === key /* || (selectioned === 'inicio' && key === 'centro rapido') */ &&
                                        <>
                                            {

                                                <SectionContainer modeloBiosepticos={modeloBiosepticos} actualizarEstado={actualizarEstado} vehiculos={vehiculos} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} usersAll={usersAll} empresas={empresas} pedirEmpresas={pedirEmpresas} users={users} companies={companies} sideOpen={sideOpen} objCss={objCss} objStrings={objStrings} showed={key} willShow={setSelectioned} />

                                            }
                                        </>
                                    }
                                </>)
                            })}
                        </div>
                    </>
                    :
                    <>  {
                        selectioned === 'inicio' ?
                            <div className={objCss.app.cardContainer}>
                                {(vendedoresIn ? ArraySelectorVendedores : empresasIn ? ArraySelectorEmpresas : ArraySelector).map((key, i) => {
                                    return (<>
                                        {
                                            <>
                                                {
                                                    userData[(vendedoresIn ? 'sellPermisions' : empresasIn ? 'companyPermisions' : 'appPermisions')][key] && key !== 'inicio' &&
                                                    <CardView objCss={objCss} objStrings={objStrings} showed={key} willShow={setSelectioned} />

                                                }
                                            </>
                                        }
                                    </>)
                                })}
                            </div> :
                            <>
                                <SideBar userModel={userModel} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} setSideOpen={setSideOpen} sideOpen={sideOpen} objCss={objCss} objStrings={objStrings} showed={selectioned} willShow={setSelectioned} />
                                <AppSideContainer userModel={userModel} obras={obras} rutas={rutas} actualizarEstado={actualizarEstado} PedirBiosepticos={PedirBiosepticos} servicios={servicios} modeloBiosepticos={modeloBiosepticos} vehiculos={vehiculos} sendNewServicio={sendNewServicio} misServicios={misServicios} PedirObras={PedirObras}
                                    pedirMisServicios={pedirMisServicios} empresas={empresas} creatingObra={creatingObra} setCreatingObra={setCreatingObra} misObras={misObras} activeEmpresa={miEmpresa} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} users={users} sideOpen={sideOpen} objCss={objCss} objStrings={objStrings} showed={selectioned} />
                            </>

                    }
                    </>
            }
        </>
    )
}
export default Selector