import AppContainer from "../componentes/contenedorPrincipal";
import TarjetaDeServicio from "../models/serviceInfo"
import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import { UserObj } from "@/engine/content"
import { ModeloBiosepticos } from "../models/modeloBiosepticos";
import ModeloUsuario from "../models/modelosUsuario";
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()

const CentroDeBiosepticos = (props) => {

    const {onMobil = { state: false, device: { iPhone: false, android: false, tablet: false, phone: false, mobile: false } }, dataBioseptico = {
        servicios: [],
        rutas: [],
        obras: [],
        rutasIndividuales: []
    }, empresas = { array: [] }, obras = { array: [] }, rutas = { rutas: [] }, PedirBiosepticos = console.log, pedirEmpresas = console.log, servicios = { array: [] }, vehiculos = { array: [] }, actualizarEstado = console.log, modeloBiosepticos = ModeloBiosepticos, userData = userStructure, setReqState = console.log, reqState = { reqId: Number(), state: false, peticion: '', type: '', inList: [] }, setPopUp = console.log, objStrings = objStringsInit, objCss = objCssInit, userModel = ModeloUsuario() } = props
    return (
        <>
            <AppContainer onMobil={onMobil} empresas={empresas} userModel={userModel} dataBioseptico={dataBioseptico} obras={obras} rutas={rutas} PedirBiosepticos={PedirBiosepticos} servicios={servicios} modeloBiosepticos={modeloBiosepticos} actualizarEstado={actualizarEstado} vehiculos={vehiculos} pedirEmpresas={pedirEmpresas} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} objCss={objCss} objStrings={objStrings} />

        </>
    )
}
export default CentroDeBiosepticos