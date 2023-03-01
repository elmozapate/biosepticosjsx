import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import { UserObj } from "@/engine/content"
import { ArraySection } from "@/bioApp/models/modelosSelector"
import MenuCard from "./menuCard"
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()

const MenuContainer = (props) => {

    const { userData = userStructure, setReqState = console.log, reqState = { reqId: Number(), state: false, peticion: '', type: ''  ,inList: [] }, setPopUp = console.log, objStrings = objStringsInit, objCss = objCssInit, willShow = console.log, showed = '', isShowed = 'inicio', selected = 'inicio' } = props
    return (
        <div id={(parseInt(Math.random() * 9999999999)).toString()} className={showed === 'inicio' || showed === 'centro rapido' ? objCss.dashBoard.sectionContainerMenu : objCss.dashBoard.sectionContainerMenuLarge}>
            {
                ArraySection.map((key, i) => {
                    return (
                        <MenuCard showed={key} objCss={objCss} objStrings={objStrings} isShowed={showed} willShow={willShow} />
                    )
                })
            }

        </div>
    )
}
export default MenuContainer