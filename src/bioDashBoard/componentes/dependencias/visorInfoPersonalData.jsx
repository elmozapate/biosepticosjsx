import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import { UserObj } from "@/engine/content"
import { ArrayPersonalData } from "@/bioApp/models/modelosSelector"
import ModeloUsuario from "@/bioApp/models/modelosUsuario"
const usuarioDefault = ModeloUsuario()

const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const VisorInfoPersonalData = (props) => {
    const { actualizeData = console.log, activeUser = { selectOp: '', userInfo: usuarioDefault }, setActiveUser = console.log, objStrings = objStringsInit, objCss = objCssInit, selectioned = { active: false, inSelection: 'default' }, usersAll = { array: [] } } = props

    return (
        <>
            <h1> INFORMACION PERSONAL</h1>
            {activeUser.userInfo.app.dataRequired ?
                <>
                    SIN INFORMACION
                    <button /* onClick={(e) => { e.preventDefault(); setInData({ ...inData, selected: 'contactData' }) }} */>LLENAR</button>

                </>
                :
                <>
                    {
                        ArrayPersonalData.map((key, i) => {
                            return (
                                <><p id={`pid-${i}`}>
                                    <span id={`pidspan-${i}`}>
                                        <span id={`pidspandos-${i}`}>   {key}  :</span>
                                        <span id={`pidspantres-${i}`}>   {activeUser.userInfo.datosPersonales[key]}</span>

                                    </span>
                                </p></>
                            )
                        })
                    }
                </>
            }

        </>
    )
}
export default VisorInfoPersonalData