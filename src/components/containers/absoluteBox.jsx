import StylesObj from "@/styles/stylesObj"
import { UserObj } from "@/engine/content";
import RegisterComponent from "@/auth/registerComponent";
import LoginComponent from "@/auth/loginComponent";
import { useEffect } from "react";

const objCssInit = StylesObj()
const AbsoluteBox = (props) => {
    const userStructure = UserObj()
    const { popUp = { active: false, type: '' }, objCss = objCssInit, userData = userStructure } = props
    useEffect(() => {
        /*   if (userData.nombre.length > 2 && userData.password.length > 3 && userData.passwordRepeat.length > 3) {
              setTrueData(true)
          } */
        console.log(userData, 'trueData',popUp);
    }, [userData])
    return (
        <>
            {
                popUp.active ?
                    <div /* onClick={(e) => { e.preventDefault(); const popNew = PopUpObj(); popUp.funtions.setPopUp(popNew) }} */
                        className={objCss.absoluteBox.main}>
                        <div className={objCss.absoluteBox.cardBox}>
                            {
                                popUp.type === 'register' && <RegisterComponent popUp={popUp} objCss={objCss} userData={userData} />
                            }
                             {
                                popUp.type === 'changePassword' && <RegisterComponent popUp={popUp} objCss={objCss} userData={userData} changePassword/>
                            }
                            {
                                popUp.type === 'login' && <LoginComponent popUp={popUp} objCss={objCss} userData={userData} />
                            }
                        </div>

                    </div>
                    : <></>
            }
        </>
    )
}

export default AbsoluteBox