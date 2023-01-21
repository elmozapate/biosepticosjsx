import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import { UserObj } from "@/engine/content"
import { ArraySection } from "@/bioApp/models/modelosSelector"
import MenuCard from "./menuCard"
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()

const MenuContainer = (props) => {

    const { userData = userStructure, objStrings = objStringsInit, objCss = objCssInit, willShow = console.log, showed = '', isShowed = 'inicio', selected = 'inicio' } = props
    return (
        <>
            <div className={showed === 'inicio'||showed === 'centro rapido' ? objCss.dashBoard.sectionContainerMenu : objCss.dashBoard.sectionContainerMenuLarge}>
                {
                    ArraySection.map((key, i) => {
                        return (
                            <>
                                <MenuCard showed={key} objCss={objCss} objStrings={objStrings} isShowed={showed}  willShow={willShow}/>
                            </>
                        )
                    })
                }

            </div>
        </>
    )
}
export default MenuContainer