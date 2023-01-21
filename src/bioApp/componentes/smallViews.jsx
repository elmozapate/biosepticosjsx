import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const SmallViews = (props) => {

    const { numberOf=0, objStrings = objStringsInit, objCss = objCssInit, isShowed = '', sideOpen = false, willShow = console.log, showed = 'inicio' } = props
    return (
        <>
            <div className={`${!sideOpen ? objCss.app.smallViews : objCss.app.smallViewsOpen} ${isShowed === showed ? objCss.app.smallViewsSelected : ' '}`}
                onClick={(e) => {
                    e.preventDefault(); willShow(showed)
                }}>

                {sideOpen ?
                    showed : <>{numberOf}</>}
            </div>

        </>
    )
}
export default SmallViews