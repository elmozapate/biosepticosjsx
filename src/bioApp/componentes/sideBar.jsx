import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import { ArraySelector } from "../models/modelosSelector"
import SmallViews from "./smallViews"
import { useEffect } from "react"
import { UserObj } from "@/engine/content"
const userStructure = UserObj()

const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const SideBar = (props) => {
    const { userData=userStructure,objStrings = objStringsInit, sideOpen = false, setSideOpen = console.log, objCss = objCssInit, willShow = console.log, showed = 'inicio' } = props

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
        <>
            <div id={objCss.app.sideNav} className={sideOpen ? objCss.app.sideNavOpen : objCss.app.sideNav}>
                {ArraySelector.map((key, i) => {
                    return (<>
                    {userData.appPermisions[key] && 
                        <SmallViews numberOf={i} sideOpen={sideOpen} isShowed={showed} objCss={objCss} objStrings={objStrings} showed={key} willShow={willShow} />
                    }</>)
                })}

            </div>
        </>
    )
}
export default SideBar