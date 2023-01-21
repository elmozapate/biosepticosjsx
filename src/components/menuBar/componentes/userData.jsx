import StringsObj, { UserObj } from "@/engine/content"
import StylesObj from "@/styles/stylesObj"
import Registered from "./registered"
import UnRegistered from "./unRegistered"
const userStructure = UserObj()

const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const UserData = (props) => {
    const { objStrings = objStringsInit, userData = userStructure, cleanUserData = console.log, objCss = objCssInit, setUserData = console.log } = props
    return (
        <>
            <div className={objCss.barraNav.dataContainer}>
                {
                    userData.status === 'unRegistered' ?
                        <UnRegistered setUserData={setUserData} objStrings={objStrings}/> : <Registered setUserData={setUserData} userData={userData} objCss={objCss} objStrings={objStrings} cleanUserData={cleanUserData} />

                }
            </div>
        </>
    )
}

export default UserData