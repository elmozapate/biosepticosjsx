import StringsObj from "@/engine/content"
import StylesObj from "@/styles/stylesObj"

const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const Logo = (props) => {
    const { objStrings = objStringsInit, objCss = objCssInit } = props
    return (
        <>
            <div className={objCss.barraNav.logoContainer}>
                {objStrings.pageTittle}
            </div>
        </>
    )
}

export default Logo