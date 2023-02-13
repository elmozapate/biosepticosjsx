import StylesObj from "@/styles/stylesObj"
import { UserObj } from "@/engine/content";
import InputComp from "@/components/commons/input";
import BtnComp from "@/components/commons/btn";

const objCssInit = StylesObj()
const LoginComponent = (props) => {
    const { popUp = { funtions: { setUserData: console.log } }, objCss = objCssInit, userData = { UserObj }, inSending = false } = props
    return (
        <>
            <form className={objCss.forms.register.main}>
                <p>INGRESA TUS DATOS</p>
                <InputComp type={'text'} id={'nombre'} value={userData.nombre} placeholder={'nombre'} funtions={popUp.funtions.setUserData} required />
                <InputComp type={'password'} id={'password'} value={userData.password} placeholder={'password'} funtions={popUp.funtions.setUserData} required />
                <BtnComp text={'Enviar'} funtions={popUp.funtions.sendLogin} />

            </form>
            <BtnComp text={'Volver'} inSending={inSending} funtions={(e) => { e.preventDefault(); popUp.funtions.setPopUp({ ...popUp, active: false }) }} />
        </>
    )
}

export default LoginComponent