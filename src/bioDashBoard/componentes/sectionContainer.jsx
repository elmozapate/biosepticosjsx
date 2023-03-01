import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import { UserObj } from "@/engine/content"
import CentroRapido from "./centroRapido/centroRapido"
import Logistica from "./dependencias/logistica"
import Empresas from "./dependencias/empresas"
import Estadisticas from "./dependencias/estadisticas"
import UsuariosApp from "./dependencias/usuariosApp"
import { ModeloBiosepticos } from "@/bioApp/models/modeloBiosepticos"
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()

const SectionContainer = (props) => {
    const { actualizarEstado = console.log, setPopUp = console.log, modeloBiosepticos = { vehiculos: [], ...ModeloBiosepticos }, userData = { userData }, setReqState = console.log, reqState = { reqId: Number(), state: false, peticion: '', type: ''  ,inList: [] }, usersAll = { array: [] }, vehiculos = { array: [] }, users = { array: [] }, pedirEmpresas = console.log, empresas = { array: [] }, sideOpen = false, objStrings = objStringsInit, objCss = objCssInit, showed = 'inicio' } = props
    return (
        <div id={(parseInt(Math.random() * 9999999999)).toString()} className={showed === 'inicio' || showed === 'centro rapido' ? objCss.dashBoard.sectionContainerCard : objCss.dashBoard.sectionContainerCardLarge}>
            {
                showed === 'centro rapido' && <CentroRapido objCss={objCss} objStrings={objStrings} showed={showed} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} />
            }
            {
                showed === 'bioSepticos' && <Logistica modeloBiosepticos={modeloBiosepticos} actualizarEstado={actualizarEstado} vehiculos={vehiculos} objCss={objCss} objStrings={objStrings} showed={showed} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} />
            }
            {
                showed === 'empresas' && <Empresas pedirEmpresas={pedirEmpresas} empresas={empresas} objCss={objCss} objStrings={objStrings} showed={showed} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} />
            }
            {
                showed === 'estadisticas' && <Estadisticas objCss={objCss} objStrings={objStrings} showed={showed} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} />
            }
            {
                showed === 'usuariosApp' && <UsuariosApp usersAll={usersAll} users={users} objCss={objCss} objStrings={objStrings} showed={showed} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} />
            }
        </div>

    )
}
export default SectionContainer