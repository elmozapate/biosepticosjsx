import AppContainer from "../componentes/contenedorPrincipal";
import TarjetaDeServicio from "../models/serviceInfo"
import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import { UserObj } from "@/engine/content"
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()

const CentroDeLogistica = (props) => {

    const {userData=userStructure, objStrings = objStringsInit, objCss = objCssInit } = props
    return (
        <>
            <AppContainer userData={userData} objCss={objCss} objStrings={objStrings} />

        </>
    )
}
export default CentroDeLogistica