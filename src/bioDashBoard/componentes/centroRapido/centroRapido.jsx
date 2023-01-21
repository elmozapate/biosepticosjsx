import StringsObj from "@/engine/content"
import StylesObj from "@/styles/stylesObj"

const objCssInit = StylesObj()
const objStringsInit = StringsObj()

const CentroRapido = (props) => {

    const { objStrings = objStringsInit, objCss = objCssInit,showed='centro rapido' } = props
    return (
        <>
                <h1 className={objCss.app.sectionTitle}>{showed} </h1>

        </>
    )
}
export default CentroRapido