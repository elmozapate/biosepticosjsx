import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import { UserObj } from "@/engine/content"
import { ArraySection } from "@/bioApp/models/modelosSelector"
import CardView from "@/bioApp/componentes/cardView"
import SectionContainer from "./sectionContainer"
import MenuContainer from "./menuContainer"
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()

const DashMenu = (props) => {

    const { userData = userStructure, objStrings = objStringsInit, objCss = objCssInit, willShow = console.log, showed = 'inicio' } = props
    return (
        <>

            <MenuContainer objCss={objCss} objStrings={objStrings} showed={showed}  willShow={willShow} />


        </>
    )
}
export default DashMenu