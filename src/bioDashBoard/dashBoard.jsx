import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import AppContainer from "@/bioApp/componentes/contenedorPrincipal"
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const DashBoard = (props) => {
    const {users={array:[]},userData=userStructure, objStrings = objStringsInit, objCss = objCssInit } = props
    return (
        <>
            <AppContainer users={users} userData={userData} objCss={objCss} objStrings={objStrings} inUse={'dashBoard'} />

        </>
    )
}
export default DashBoard