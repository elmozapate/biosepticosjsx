import { EmpresaObj } from "@/bioApp/models/modelosUsuario"
import StringsObj, { UserObj } from "@/engine/content"
import StylesObj from "@/styles/stylesObj"
import Logo from "./componentes/logo"
import UserInfo from "./componentes/userInfo"

const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const userStructure = UserObj()

const MenuBar = (props) => {
    const { onMobil = { state: false, device: { iPhone: false, android: false, tablet: false, phone: false, mobile: false } }, misEmpresas = {
        seleccionada: '', empresas: [], itemSelectioned: EmpresaObj()
    }, setMisEmpresas = console.log, startCreating = false, setStartCreating = console.log, inSending = false, misEmpresasRes = { array: [] }, userData = userStructure, setReqState = console.log, reqState = { reqId: Number(), state: false, peticion: '', type: '', inList: [] }, setPopUp = console.log, cleanUserData = console.log, setUserData = console.log, PedirObras = console.log, pedirMisServicios = console.log, changeLanguage = console.log, objStrings = objStringsInit, objCss = objCssInit } = props
    return (
        <>
            <div className={objCss.barraNav.main}>
                {(onMobil.state||!onMobil.state )&& <Logo userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} misEmpresas={misEmpresas} objCss={objCss} objStrings={objStrings} />}
                <UserInfo PedirObras={PedirObras} onMobil={onMobil}
                    pedirMisServicios={pedirMisServicios} misEmpresas={misEmpresas} setMisEmpresas={setMisEmpresas} startCreating={startCreating} setStartCreating={setStartCreating} misEmpresasRes={misEmpresasRes} inSending={inSending} objCss={objCss} objStrings={objStrings} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} setUserData={setUserData} cleanUserData={cleanUserData} changeLanguage={changeLanguage} />

            </div>
        </>
    )
}

export default MenuBar