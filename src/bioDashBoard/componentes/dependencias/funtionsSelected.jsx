import StringsObj from "@/engine/content"
import StylesObj from "@/styles/stylesObj"
import { useState } from "react"
import NewEntry from "../formularios/newEntry"
import HistorialSearch from "../historial/historialSearch"
import InteractiveTable from "../interactiveTable/interactiveTable"

const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const FuntionsSelected = (props) => {
    const { empresas = { array: [] },users = { array: [] }, inShowed = '', inSection = '', objStrings = objStringsInit, objCss = objCssInit, showed = { state: false, function: 'centro rapido' } } = props
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
                        <NewEntry objCss={objCss} objStrings={objStrings} inSection={inShowed} setInprocess={setInprocess} inProcess={inProcess} />
                    </>
                }
                {
                    inProcess.state && showed.function === 'ver o modificar' &&
                    <>
                        <InteractiveTable empresas={empresas} users={users} objCss={objCss} objStrings={objStrings} inSection={inSection} inShowed={inShowed} setInprocess={setInprocess} inProcess={inProcess} />
                    </>
                }
                {
                    inProcess.state && showed.function === 'historial' &&
                    <>
                        <HistorialSearch objCss={objCss} objStrings={objStrings} inSection={inSection} setInprocess={setInprocess} inProcess={inProcess} />
                    </>
                }
            </div>
        </>
    )
}
export default FuntionsSelected