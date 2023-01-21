import StringsObj, { UserObj } from "@/engine/content"
import StylesObj from "@/styles/stylesObj"
import Logo from "./componentes/logo"
import UserInfo from "./componentes/userInfo"

const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const userStructure = UserObj()

const MenuBar = (props) => {
    const { userData = userStructure, cleanUserData = console.log, setUserData = console.log, changeLanguage = console.log, objStrings = objStringsInit, objCss = objCssInit } = props
    return (
        <>
            <div className={objCss.barraNav.main}>
                <Logo objCss={objCss} objStrings={objStrings} />
                <UserInfo objCss={objCss} objStrings={objStrings} userData={userData} setUserData={setUserData} cleanUserData={cleanUserData} changeLanguage={changeLanguage} />

            </div>
        </>
    )
}

export default MenuBar