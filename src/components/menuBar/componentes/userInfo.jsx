import { EmpresaObj } from "@/bioApp/models/modelosUsuario"
import StringsObj, { UserObj } from "@/engine/content"
import StylesObj from "@/styles/stylesObj"
import LanguageSelect from "./languageSelect"
import UserData from "./userData"
const userStructure = UserObj()

const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const UserInfo = (props) => {
    const { onMobil = { state: false, device: { iPhone: false, android: false, tablet: false, phone: false, mobile: false } }, misEmpresas = {
        seleccionada: '', empresas: [], itemSelectioned: EmpresaObj()
    }, setMisEmpresas = console.log, PedirObras = console.log, pedirMisServicios = console.log, startCreating = false, setStartCreating = console.log, misEmpresasRes = { array: [] }, objStrings = objStringsInit, userData = userStructure, setReqState = console.log, reqState = { reqId: Number(), state: false, peticion: '', type: '', inList: [] }, setPopUp = console.log, objCss = objCssInit, setUserData = console.log, changeLanguage = console.log, cleanUserData = console.log } = props
    return (
        <>
            <div className={objCss.barraNav.infoContainer}>
                <UserData onMobil={onMobil} PedirObras={PedirObras}
                    pedirMisServicios={pedirMisServicios} misEmpresas={misEmpresas} setMisEmpresas={setMisEmpresas} startCreating={startCreating} setStartCreating={setStartCreating} misEmpresasRes={misEmpresasRes} objStrings={objStrings} cleanUserData={cleanUserData} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} objCss={objCss} setUserData={setUserData} />
                {!onMobil.state && <LanguageSelect objStrings={objStrings} objCss={objCss} changeLanguage={changeLanguage} />}
            </div>
        </>
    )
}

export default UserInfo