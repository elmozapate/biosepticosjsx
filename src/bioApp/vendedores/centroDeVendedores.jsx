import AppContainer from "../componentes/contenedorPrincipal";
import TarjetaDeServicio from "../models/serviceInfo"
import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import { UserObj } from "@/engine/content"
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()

const CentroDeVendedores = (props) => {

    const { setPopUp = console.log, pedirEmpresas = console.log, userData = userStructure, objStrings = objStringsInit, objCss = objCssInit } = props
    return (
        <>
            <AppContainer pedirEmpresas={pedirEmpresas} userData={userData} setPopUp={setPopUp} objCss={objCss} objStrings={objStrings} />

        </>
    )
}
export default CentroDeVendedores