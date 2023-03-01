import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import Image from "next/image"
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const PhotoContainer = (props) => {
    const { menuOpen = false, setMenuOpen = console.log, userData = userStructure, setReqState = console.log, reqState = { reqId: Number(), state: false, peticion: '', type: ''  ,inList: [] }, setPopUp = console.log, objStrings = objStringsInit, objCss = objCssInit } = props
    return (
        <>
            <div
                onClick={(e) => { e.preventDefault(); setMenuOpen(!menuOpen) }}
                className={objCss.barraNav.photoContainer}>
                <Image
                    src={userData.avatar.withPhoto ? userData.avatar.url : "/image/avatar.svg"}
                    alt="Avatar"
                    width={50}
                    height={50}
                    id={"nav-Avatar"}
                />
            </div>

        </>
    )
}
export default PhotoContainer