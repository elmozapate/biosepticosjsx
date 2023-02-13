import StylesObj from "@/styles/stylesObj"
import { PopUpObj, UserObj } from "@/engine/content";
import RegisterComponent from "@/auth/registerComponent";
import LoginComponent from "@/auth/loginComponent";
import { useEffect } from "react";

const objCssInit = StylesObj()
const AbsoluteBox = (props) => {
    const userStructure = UserObj()
    const { setPopUp = console.log, inSending = false, popUp = { active: false, type: '' }, objCss = objCssInit, userData = userStructure } = props
    useEffect(() => {
        /*   if (userData.nombre.length > 2 && userData.password.length > 3 && userData.passwordRepeat.length > 3) {
              setTrueData(true)
          } */
    }, [userData])
    return (
        <>
            {
                popUp.active ?
                    <div /* onClick={(e) => { e.preventDefault(); const popNew = PopUpObj(); popUp.funtions.setPopUp(popNew) }} */
                        className={objCss.absoluteBox.main}>
                        <div className={objCss.absoluteBox.cardBox}>
                            {
                                popUp.type === 'inVerification' && <><h1>                        VERIFICANDO::::
                                </h1></>
                            }
                            {
                                popUp.type === 'emailConfirmation' && <><h1>POR FAVOR REVISA TU CORREO</h1> <br />
                                    <button onClick={(e) => { e.preventDefault(); popUp.funtions.setPopUp(PopUpObj()); popUp.funtions.setUserData({ ...userData, type: 'newUser' }) }}>ACEPTAR </button></>
                            }
                            {
                                popUp.type === 'register' && <RegisterComponent popUp={popUp} objCss={objCss} userData={userData} setPopUp={setPopUp} />
                            }
                            {
                                popUp.type === 'changePassword' && <RegisterComponent popUp={popUp} objCss={objCss} userData={userData} setPopUp={setPopUp} changePassword />
                            }
                            {
                                popUp.type === 'login' && <LoginComponent inSending={inSending} popUp={popUp} objCss={objCss} userData={userData} setPopUp={setPopUp} />
                            }
                            {
                                popUp.type === 'acceptBox' &&
                                <>
                                    {
                                        popUp.name === 'newUser' &&
                                        <> <div className="no-transform">
                                            Este es el nombre de usuario : {popUp.data.nombre} <br />Esta es la clave temporal : {popUp.data.password} <br /> Porfavor guardar datos
                                        </div>
                                            <br />
                                            <button onClick={(e) => { e.preventDefault(); popUp.funtions.setPopUp(PopUpObj()) }}>ACEPTAR </button>
                                        </>
                                    }
                                    {
                                        popUp.name === 'permisionEdit' &&
                                        <>
                                            PERMISOS CAMBIADOOS CON EXITO
                                            <br />
                                            <button onClick={(e) => { e.preventDefault(); popUp.funtions.setPopUp(PopUpObj()) }}>ACEPTAR </button>
                                        </>
                                    }
                                </>
                            }
                        </div>

                    </div>
                    : <></>
            }
        </>
    )
}

export default AbsoluteBox