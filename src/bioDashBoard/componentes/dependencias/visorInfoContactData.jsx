import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import { UserObj } from "@/engine/content"
import { ArrayContactData, ArrayContactDataAdress } from "@/bioApp/models/modelosSelector"
import ModeloUsuario from "@/bioApp/models/modelosUsuario"
import { useState } from "react"
const usuarioDefault = ModeloUsuario()
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const VisorInfoContactData = (props) => {
    const { actualizeData = console.log, activeUser = { selectOp: '', userInfo: usuarioDefault }, setActiveUser = console.log, objStrings = objStringsInit, objCss = objCssInit, selectioned = { active: false, inSelection: 'default' }, usersAll = { array: [] } } = props
    const [inAdress, setInAdress] = useState({
        state: false
    })
    return (
        <>
            {!inAdress.state ? <>
                <h1> INFORMACION DE CONTACTO</h1>
                {activeUser.userInfo.app.dataRequired ?
                    <>
                        SIN INFORMACION
                        <button /* onClick={(e) => { e.preventDefault(); setInData({ ...inData, selected: 'contactData' }) }} */>LLENAR</button>

                    </>
                    :
                    <>
                        {ArrayContactData.map((key, i) => {
                            return (
                                <><p id={`pid-${i}`}>
                                    <span id={`pidspan-${i}`}>
                                        <span id={`pidspandos-${i}`}>   {key}  :</span>
                                        <span id={`pidspantres-${i}`}>   {activeUser.userInfo.datosContacto[key]}</span>
                                    </span>
                                </p></>
                            )
                        })}
                    </>
                }
                <div onClick={(e) => { e.preventDefault(); setInAdress({ ...inAdress, state: true }) }}>
                    VER DIRECCION
                </div>
            </>
                :
                <>
                    <h1> INFORMACION DE CONTACTO-DIRECCION</h1>
                    {activeUser.userInfo.app.dataRequired ?
                        <>
                            SIN INFORMACION
                            <button /* onClick={(e) => { e.preventDefault(); setInData({ ...inData, selected: 'contactData' }) }} */>LLENAR</button>

                        </>
                        :
                        <>
                            {ArrayContactDataAdress.map((key, i) => {
                                return (
                                    <><p id={`pid-${i}`}>
                                        <span id={`pidspan-${i}`}>
                                            <span id={`pidspandos-${i}`}>   {key}  :</span>
                                            <span id={`pidspantres-${i}`}>   {activeUser.userInfo.datosContacto.direccion[key]}</span>
                                        </span>
                                    </p></>
                                )
                            })}                </>}

                    <button onClick={(e) => { e.preventDefault(); setInAdress({ ...inAdress, state: false }) }}>REGRESAR</button>

                </>}

        </>
    )
}
export default VisorInfoContactData