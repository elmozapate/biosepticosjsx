import StylesObj from "@/styles/stylesObj"
import StringsObj, { UserObj } from "@/engine/content"
import { EmpresaObj } from "../models/modelosUsuario"
import ContenedorObras from "./contenedorObras"
import ContenedorServicios from "./contenedorServicios"
import { ModeloBiosepticos } from "../models/modeloBiosepticos"
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const userStructure = UserObj()

const SelectorDedicadoFunciones = (props) => {
    const { modeloBiosepticos = ModeloBiosepticos, serviceStep = { data: {}, step: 0 }, setServiceStep = console.log, sendNewServicio = console.log, pedirMisServicios = console.log, creatingObra = console.log, misObras = { array: [] }, misServicios = { array: [] }, vehiculos = { array: [] }, setCreatingObra = console.log, activeEmpresa = EmpresaObj(), userData = userStructure, setReqState = console.log, reqState = { reqId: Number(), state: false, peticion: '', type: '', inList: [] }, setPopUp = console.log, sideOpen = false, objStrings = objStringsInit, objCss = objCssInit, showed = 'inicio' } = props
    return (
        <>
            {showed === 'obras' &&
                <>
                    <ContenedorObras creatingObra={creatingObra} misObras={misObras} misServicios={misServicios} setCreatingObra={setCreatingObra} activeEmpresa={activeEmpresa} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} sideOpen={sideOpen} objStrings={objStrings} objCss={objCss} showed={showed} />
                </>}
            {showed === 'servicios' &&
                <>
                    <ContenedorServicios modeloBiosepticos={modeloBiosepticos} serviceStep={serviceStep} setServiceStep={setServiceStep} pedirMisServicios={pedirMisServicios} sendNewServicio={sendNewServicio} creatingObra={creatingObra} misObras={misObras} misServicios={misServicios} setCreatingObra={setCreatingObra} activeEmpresa={activeEmpresa} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} sideOpen={sideOpen} objStrings={objStrings} objCss={objCss} showed={showed} />
                </>}
        </>
    )
}
export default SelectorDedicadoFunciones