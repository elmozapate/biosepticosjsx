import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import AppContainer from "@/bioApp/componentes/contenedorPrincipal"
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const DashBoard = (props) => {
    const { pedirEmpresas = console.log, users = { array: [] },empresas = { array: [] }, userData = userStructure, objStrings = objStringsInit, objCss = objCssInit } = props
    return (
        <>
            <AppContainer pedirEmpresas={pedirEmpresas} empresas={empresas} users={users} userData={userData} objCss={objCss} objStrings={objStrings} inUse={'dashBoard'} />

        </>
    )
}
export default DashBoard