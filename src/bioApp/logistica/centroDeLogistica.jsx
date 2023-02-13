import AppContainer from "../componentes/contenedorPrincipal";
import TarjetaDeServicio from "../models/serviceInfo"
import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import { UserObj } from "@/engine/content"
import { ModeloBiosepticos } from "../models/modeloBiosepticos";
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()

const CentroDeLogistica = (props) => {

    const { PedirBiosepticos = console.log, pedirEmpresas = console.log, servicios = { array: [] }, vehiculos = { array: [] }, actualizarEstado = console.log, modeloBiosepticos = { vehiculos: [], ...ModeloBiosepticos }, userData = userStructure, setPopUp = console.log, objStrings = objStringsInit, objCss = objCssInit } = props
    return (
        <>
            <AppContainer PedirBiosepticos={PedirBiosepticos} servicios={servicios} modeloBiosepticos={modeloBiosepticos} actualizarEstado={actualizarEstado} vehiculos={vehiculos} pedirEmpresas={pedirEmpresas} userData={userData} setPopUp={setPopUp} objCss={objCss} objStrings={objStrings} />

        </>
    )
}
export default CentroDeLogistica