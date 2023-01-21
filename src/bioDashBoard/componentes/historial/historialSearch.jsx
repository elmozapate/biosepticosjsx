
import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import { UserObj } from "@/engine/content"
import Liquidador from "@/liquidador/liquidador"
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()

const HistorialSearch = (props) => {

    const { userData = userStructure, objStrings = objStringsInit, objCss = objCssInit, willShow = console.log, showed = 'inicio' } = props
    return (
        <>

            <Liquidador />

        </>
    )
}
export default HistorialSearch