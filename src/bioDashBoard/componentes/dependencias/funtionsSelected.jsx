import { ModeloBiosepticos } from "@/bioApp/models/modeloBiosepticos"
import StringsObj, { UserObj } from "@/engine/content"
import StylesObj from "@/styles/stylesObj"
import { useState } from "react"
import NewEntry from "../formularios/newEntry"
import HistorialSearch from "../historial/historialSearch"
import InteractiveTable from "../interactiveTable/interactiveTable"

const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const FuntionsSelected = (props) => {
    const { actualizarEstado = console.log, setPopUp = console.log, modeloBiosepticos = ModeloBiosepticos , usersAll = { array: [] }, empresas = { array: [] }, vehiculos = { array: [] }, users = { array: [] }, inShowed = '', inSection = '', objStrings = objStringsInit, objCss = objCssInit, showed = { state: false, function: 'centro rapido' }, userData = UserObj() } = props
    const [inProcess, setInprocess] = useState({
        state: true,
        process: ''
    })
    return (
        <>
            <div className={objCss.dashBoard.inFuntion}>
                {/*                 <h1>{showed.function}</h1>
 */}                {
                    inProcess.state && showed.function === 'crear' &&
                    <>
                        <NewEntry userData={userData} setPopUp={setPopUp} objCss={objCss} objStrings={objStrings} inSection={inShowed} setInprocess={setInprocess} inProcess={inProcess} />
                    </>
                }
                {
                    inProcess.state && showed.function === 'ver o modificar' &&
                    <>
                        <InteractiveTable modeloBiosepticos={modeloBiosepticos} actualizarEstado={actualizarEstado} vehiculos={vehiculos} usersAll={usersAll} empresas={empresas} users={users} objCss={objCss} objStrings={objStrings} inSection={inSection} inShowed={inShowed} setInprocess={setInprocess} inProcess={inProcess} />
                    </>
                }
                {
                    inProcess.state && showed.function === 'historial' &&
                    <>
                        <HistorialSearch usersAll={usersAll} empresas={empresas} inShowed={inShowed} users={users} objCss={objCss} objStrings={objStrings} inSection={inSection} setInprocess={setInprocess} inProcess={inProcess} />
                    </>
                }
            </div>
        </>
    )
}
export default FuntionsSelected