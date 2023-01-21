import StylesObj from "@/styles/stylesObj"

const objCssInit = StylesObj()
const LanguageSelect = (props) => {
    const { changeLanguage = console.log, objCss = objCssInit } = props
    return (
        <>
            <div className={objCss.barraNav.languageSelect}>
                <p onClick={(e) => { e.preventDefault(); changeLanguage('spanish') }}>Español</p>
                <p onClick={(e) => { e.preventDefault(); changeLanguage('english') }}>Ingles</p>
            </div>
        </>
    )
}

export default LanguageSelect