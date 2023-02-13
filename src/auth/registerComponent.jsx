import StylesObj from "@/styles/stylesObj"
import { UserObj } from "@/engine/content";
import InputComp from "@/components/commons/input";
import BtnComp from "@/components/commons/btn";
import { useEffect, useState } from "react";

const objCssInit = StylesObj()
const RegisterComponent = (props) => {
    const { changePassword = false, popUp = { funtions: { setUserData: console.log } }, objCss = objCssInit, userData = { UserObj } } = props
    const [trueData, setTrueData] = useState(false)
    useEffect(() => {
        if ((changePassword || (!changePassword && userData.nombre.length > 2)) && userData.password.length > 3 && userData.passwordRepeat.length > 3 && userData.password == userData.passwordRepeat) {
            setTrueData(true)
        } else {
            setTrueData(false)
        }
    }, [userData])
    return (
        <>
            <form className={objCss.forms.register.main} onSubmit={(e) => { e.preventDefault() }} >
                <p> {!changePassword ? 'INGRESA TUS DATOS' : 'Ingresa Una Nueva Contaseña'}</p>
                {!changePassword && <InputComp type={'text'} id={'nombre'} value={userData.nombre} placeholder={'nombre'} funtions={popUp.funtions.setUserData} required />
                }                <InputComp type={'password'} id={'password'} value={userData.password} placeholder={'password'} funtions={popUp.funtions.setUserData} required />
                <InputComp type={'password'} id={'passwordRepeat'} value={userData.passwordRepeat} placeholder={'passwordRepeat'} funtions={popUp.funtions.setUserData} required />
                {
                    trueData && <BtnComp text={'Enviar'} funtions={!changePassword ? popUp.funtions.sendData : popUp.funtions.changePassword} />
                }
            </form>
            <BtnComp text={'Volver'} funtions={(e) => { e.preventDefault(); !changePassword ? popUp.funtions.setPopUp({ ...popUp, active: false }) : console.log }} />

        </>
    )
}

export default RegisterComponent