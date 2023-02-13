import { EmpresaObj } from "@/bioApp/models/modelosUsuario"
import StringsObj, { UserObj } from "@/engine/content"
import StylesObj from "@/styles/stylesObj"
import Logo from "./componentes/logo"
import UserInfo from "./componentes/userInfo"

const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const userStructure = UserObj()

const MenuBar = (props) => {
    const { misEmpresas = {
        seleccionada: '', empresas: [], itemSelectioned: EmpresaObj()
    }, setMisEmpresas = console.log, startCreating = false, setStartCreating = console.log, inSending = false, misEmpresasRes = { array: [] }, userData = userStructure, setPopUp = console.log, cleanUserData = console.log, setUserData = console.log, PedirObras = console.log, pedirMisServicios = console.log, changeLanguage = console.log, objStrings = objStringsInit, objCss = objCssInit } = props
    return (
        <>
            <div className={objCss.barraNav.main}>
                <Logo userData={userData} setPopUp={setPopUp} misEmpresas={misEmpresas} objCss={objCss} objStrings={objStrings} />
                <UserInfo PedirObras={PedirObras}
                    pedirMisServicios={pedirMisServicios} misEmpresas={misEmpresas} setMisEmpresas={setMisEmpresas} startCreating={startCreating} setStartCreating={setStartCreating} misEmpresasRes={misEmpresasRes} inSending={inSending} objCss={objCss} objStrings={objStrings} userData={userData} setPopUp={setPopUp} setUserData={setUserData} cleanUserData={cleanUserData} changeLanguage={changeLanguage} />

            </div>
        </>
    )
}

export default MenuBar