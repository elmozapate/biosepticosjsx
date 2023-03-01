import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import { UserObj } from "@/engine/content"
import FormularioAppUser from "./formularioUserApp"
import SelectorTipoBioseptico from "../dependencias/selectorTipoBioseptico"
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()

const NewEntry = (props) => {

    const { userData = userStructure, setReqState = console.log, reqState = { reqId: Number(), state: false, peticion: '', type: ''  ,inList: [] }, setPopUp = console.log, objStrings = objStringsInit, objCss = objCssInit, willShow = console.log, inSection = 'inicio' } = props
    return (
        <>
            {
                inSection === 'usuariosApp' && <FormularioAppUser userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} objStrings={objStrings} objCss={objCss} />
            }
            {
                inSection === 'bioSepticos' && <SelectorTipoBioseptico userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} objStrings={objStrings} objCss={objCss} />
            }

        </>
    )
}
export default NewEntry