import StringsObj, { UserObj } from "@/engine/content"
import StylesObj from "@/styles/stylesObj"
import { useEffect, useState } from "react"
import NavMenu from "./menu"
import PhotoContainer from "./photoContainer"
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const Registered = (props) => {
    const { objStrings = objStringsInit, setUserData = console.log, userData = userStructure, objCss = objCssInit, cleanUserData = console.log } = props
    const [menuOpen, setMenuOpen] = useState(false)
    useEffect(() => {
        document.addEventListener("click", function (e) {
            e.preventDefault()
            e.target.id&&e.target.id.split('-')&&e.target.id.split('-')[0]?console.log:setMenuOpen(false)
                })
    }, [])
    return (
        <>
            <div id="nav-menu" className={objCss.barraNav.menuActivator} onClick={(e) => { e.preventDefault(); setMenuOpen(!menuOpen) }}>
                {
                    menuOpen && <NavMenu objStrings={objStrings} setMenuOpen={setMenuOpen} setUserData={setUserData} userData={userData} cleanUserData={cleanUserData} />
                }
                <p id="nav-menu-p">|||</p>

                <p id="nav-menu-pa">{userData.nombre}</p>
                <PhotoContainer menuOpen={menuOpen} setMenuOpen={setMenuOpen} userData={userData} objStrings={objStrings} objCss={objCss} />


            </div>
        </>
    )
}

export default Registered