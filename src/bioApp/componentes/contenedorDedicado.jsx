import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const AppSideContainer = (props) => {
    const { sideOpen = false, objStrings = objStringsInit, objCss = objCssInit, showed = 'inicio' } = props
    return (
        <>
            <div className={sideOpen?objCss.app.sideContainer:objCss.app.sideContainerOpen}>
                <h1 className={objCss.app.sectionTitle}>{showed} </h1>
            </div>

        </>
    )
}

export default AppSideContainer