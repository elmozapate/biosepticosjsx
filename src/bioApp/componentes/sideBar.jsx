import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import { ArraySelector, ArraySelectorEmpresas, ArraySelectorVendedores } from "../models/modelosSelector"
import SmallViews from "./smallViews"
import { useEffect } from "react"
import { UserObj } from "@/engine/content"

const userStructure = UserObj()
const emptyArray = []
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const SideBar = (props) => {
    const { userData = userStructure, setReqState = console.log, reqState = { reqId: Number(), state: false, peticion: '', type: ''  ,inList: [] }, setPopUp = console.log, objStrings = objStringsInit, sideOpen = false, setSideOpen = console.log, objCss = objCssInit, willShow = console.log, showed = 'inicio' } = props

    let listener = false
    let listenerExit = false

    useEffect(() => {
        listenerExit = document.getElementById(objCss.app.sideNav)
        listener = document.getElementById(objCss.app.sideNav)
        listener.addEventListener("mouseenter", (e) => {
            e.preventDefault()
            if (!sideOpen) {
                setSideOpen(true)
            }
        }, false);
        listenerExit.addEventListener("mouseleave", (e) => {
            e.preventDefault()
            setSideOpen(false)

        }, false);

    }, [])
    return (
        <div id={objCss.app.sideNav} className={sideOpen ? objCss.app.sideNavOpen : objCss.app.sideNav}>
            {(userData.type === 'operativeUser' ? ArraySelector : userData.type === 'vendedor' ? ArraySelectorVendedores : userData.type === 'clientUser' ? ArraySelectorEmpresas : emptyArray).map((key, i) => {
                return (<div id={(parseInt(Math.random() * 9999999999)).toString()}>
                    {userData[(userData.type === 'operativeUser' ? 'appPermisions' : userData.type === 'vendedor' ? 'sellPermisions' : userData.type === 'clientUser' ? 'companyPermisions' : '')][key] &&
                        <SmallViews numberOf={i} sideOpen={sideOpen} isShowed={showed} objCss={objCss} objStrings={objStrings} showed={key} willShow={willShow} />
                    }</div>)
            })}

        </div>
    )
}
export default SideBar