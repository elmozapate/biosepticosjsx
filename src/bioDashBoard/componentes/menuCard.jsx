import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import { UserObj } from "@/engine/content"
import { ArraySection } from "@/bioApp/models/modelosSelector"
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()

const MenuCard = (props) => {

    const { userData = userStructure, objStrings = objStringsInit, objCss = objCssInit, willShow = console.log, showed = '', isShowed = 'inicio', selectioned='inicio'} = props
    return (
        <>
            <div 
            onClick={(e)=>{e.preventDefault;willShow(showed)}}
            className={`${showed=== isShowed?objCss.dashBoard.sectionContainerMenuItemSelected:' '}  ${isShowed === 'inicio'||isShowed === 'centro rapido' ? objCss.dashBoard.sectionContainerMenuItem : objCss.dashBoard.sectionContainerMenuItemLarge}`}>
                {showed}
            </div>
        </>
    )
}
export default MenuCard