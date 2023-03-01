import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import { UserObj } from "@/engine/content"
import MenuContainer from "./menuContainer"
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()

const DashMenu = (props) => {

    const { userData = userStructure, setReqState = console.log, reqState = { reqId: Number(), state: false, peticion: '', type: ''  ,inList: [] }, setPopUp = console.log, objStrings = objStringsInit, objCss = objCssInit, willShow = console.log, showed = 'inicio' } = props
    return (
<>
<MenuContainer setReqState={setReqState} reqState={reqState} objCss={objCss} objStrings={objStrings} showed={showed} willShow={willShow} />

</>


    )
}
export default DashMenu