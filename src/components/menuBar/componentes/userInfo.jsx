import StringsObj, { UserObj } from "@/engine/content"
import StylesObj from "@/styles/stylesObj"
import LanguageSelect from "./languageSelect"
import UserData from "./userData"
const userStructure = UserObj()

const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const UserInfo = (props) => {
    const { objStrings = objStringsInit, userData = userStructure, objCss = objCssInit, setUserData = console.log, changeLanguage = console.log, cleanUserData = console.log } = props
    return (
        <>
            <div className={objCss.barraNav.infoContainer}>
                <UserData objStrings={objStrings} cleanUserData={cleanUserData} userData={userData} objCss={objCss} setUserData={setUserData} />
                <LanguageSelect objStrings={objStrings} objCss={objCss} changeLanguage={changeLanguage} />
            </div>
        </>
    )
}

export default UserInfo