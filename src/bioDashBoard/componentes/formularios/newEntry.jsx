import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import { UserObj } from "@/engine/content"
import FormularioAppUser from "./formularioUserApp"
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()

const NewEntry = (props) => {

    const { userData = userStructure, objStrings = objStringsInit, objCss = objCssInit, willShow = console.log, inSection = 'inicio' } = props
    console.log(inSection);
    return (
        <>
            {
                inSection === 'usuariosApp' ? <FormularioAppUser objStrings={objStrings} objCss={objCss} />
                    : <>En Construccion....</>

            }

        </>
    )
}
export default NewEntry