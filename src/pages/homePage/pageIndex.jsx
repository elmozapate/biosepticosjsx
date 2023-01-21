import StylesObj from "@/styles/stylesObj"
import StringsObj from "../../engine/content"

const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const PageIndex = (props) => {
    const { objStrings = objStringsInit, objCss = objCssInit } = props
    return (
        <>
            <div className={objCss.page.main}>
                HOLA {objStrings.homePage.intro}
            </div>

        </>
    )
}

export default PageIndex