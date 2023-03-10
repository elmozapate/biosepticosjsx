import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const CardView = (props) => {

    const { willShow = console.log, showed = '', objStrings = objStringsInit, objCss = objCssInit } = props
    return (
        <>
            <div id={`idShow-${parseInt(Math.random() * 9999)}`} className={objCss.app.cardView} onClick={(e) => {
                e.preventDefault(); willShow(showed)
            }}>
                {showed}
            </div>

        </>
    )
}
export default CardView