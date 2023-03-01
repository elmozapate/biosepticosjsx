import StringsObj, { UserObj } from "@/engine/content"
import StylesObj from "@/styles/stylesObj"
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const UnRegistered = (props) => {
    const { objStrings = objStringsInit, userData = userStructure, setReqState = console.log, reqState = { reqId: Number(), state: false, peticion: '', type: ''  ,inList: [] }, setPopUp = console.log, objCss = objCssInit, setUserData = console.log } = props
    return (
        <>
            <p onClick={(e) => { e.preventDefault(), setUserData('register') }}>Registrate</p>
            <p onClick={(e) => { e.preventDefault(), setUserData('login') }}>Login</p>

        </>
    )
}

export default UnRegistered