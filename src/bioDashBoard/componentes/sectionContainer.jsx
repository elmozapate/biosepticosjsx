import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import { UserObj } from "@/engine/content"
import CentroRapido from "./centroRapido/centroRapido"
import Logistica from "./dependencias/logistica"
import Empresas from "./dependencias/empresas"
import Estadisticas from "./dependencias/estadisticas"
import UsuariosApp from "./dependencias/usuariosApp"
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()

const SectionContainer = (props) => {
    const { users={array:[]},pedirEmpresas=console.log,empresas = { array: [] }, sideOpen = false, objStrings = objStringsInit, objCss = objCssInit, showed = 'inicio' } = props
    return (
        <>
            <div className={showed === 'inicio' || showed === 'centro rapido' ? objCss.dashBoard.sectionContainerCard : objCss.dashBoard.sectionContainerCardLarge}>
                {
                    showed === 'centro rapido' && <CentroRapido objCss={objCss} objStrings={objStrings} showed={showed} />
                }
                {
                    showed === 'bioSepticos' && <Logistica objCss={objCss} objStrings={objStrings} showed={showed} />
                }
                {
                    showed === 'empresas' && <Empresas pedirEmpresas={pedirEmpresas} empresas={empresas} objCss={objCss} objStrings={objStrings} showed={showed} />
                }
                {
                    showed === 'estadisticas' && <Estadisticas objCss={objCss} objStrings={objStrings} showed={showed} />
                }
                {
                    showed === 'usuariosApp' && <UsuariosApp users={users} objCss={objCss} objStrings={objStrings} showed={showed} />
                }
            </div>

        </>
    )
}
export default SectionContainer