import { EmpresaObj } from "@/bioApp/models/modelosUsuario"
import StringsObj, { UserObj } from "@/engine/content"
import StylesObj from "@/styles/stylesObj"
const userStructure = UserObj()

const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const Logo = (props) => {
    const { userData = userStructure, setReqState = console.log, reqState = { reqId: Number(), state: false, peticion: '', type: ''  ,inList: [] }, setPopUp = console.log, objStrings = objStringsInit, objCss = objCssInit, misEmpresas = {
        seleccionada: '', empresas: [], itemSelectioned: EmpresaObj()
    }, } = props
    return (
        <>
            <div className={objCss.barraNav.logoContainer}>
                {objStrings.pageTittle}
                {userData.type === 'clientUser' && <span>{misEmpresas.seleccionada} </span>}
            </div>
        </>
    )
}

export default Logo