import { EmpresaObj } from "@/bioApp/models/modelosUsuario"
import StringsObj, { UserObj } from "@/engine/content"
import StylesObj from "@/styles/stylesObj"
import Registered from "./registered"
import UnRegistered from "./unRegistered"
const userStructure = UserObj()

const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const UserData = (props) => {
    const { misEmpresas = {
        seleccionada: '', empresas: [], itemSelectioned: EmpresaObj()
    }, setMisEmpresas = console.log, startCreating = false, PedirObras = console.log, pedirMisServicios = console.log, setStartCreating = console.log, misEmpresasRes = { array: [] }, objStrings = objStringsInit, userData = userStructure, setPopUp = console.log, cleanUserData = console.log, objCss = objCssInit, setUserData = console.log } = props
    return (
        <>
            <div className={objCss.barraNav.dataContainer}>
                {
                    userData.status === 'unRegistered' ?
                        <UnRegistered setUserData={setUserData} objStrings={objStrings} /> : <Registered PedirObras={PedirObras}
                            pedirMisServicios={pedirMisServicios} misEmpresas={misEmpresas} setMisEmpresas={setMisEmpresas} startCreating={startCreating} setStartCreating={setStartCreating} setUserData={setUserData} userData={userData} setPopUp={setPopUp} objCss={objCss} objStrings={objStrings} cleanUserData={cleanUserData} />

                }
            </div>
        </>
    )
}

export default UserData