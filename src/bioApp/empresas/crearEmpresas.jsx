import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import { useEffect, useState } from "react"
import { UserObj } from "@/engine/content"
import FormularioCrearEmpresa from "@/bioDashBoard/componentes/formularios/formularioCrearEmpresa"
import ModeloUsuario from "../models/modelosUsuario"
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
export const crearEmpresas = (userData = userData, misEmpresas = misEmpresas.empresas) => {

}
/* ingresarEmpresas(userData, misEmpresas.empresas)
 */const CrearEmpresa = (props) => {
    const { back = console.log, userModel = ModeloUsuario(), firstTime = false, misEmpresas = { seleccionada: '', empresas: [] }, pedirEmpresas = console.log, userData = userStructure, setReqState = console.log, reqState = { reqId: Number(), state: false, peticion: '', type: ''  ,inList: [] }, setPopUp = console.log, objStrings = objStringsInit, objCss = objCssInit } = props
    const [startCreating, setStartCreating] = useState(false)

    return (
        <>
            {
                firstTime ?
                    <div className="flex-column">
                        {
                            !startCreating ? <>
                                {`BIENVENIDO ${userData.nombre}`}
                                <br />
                                {` Para continuar debes primero crear tu primera EMPRESA`}
                                <button onClick={(e) => { e.preventDefault(); setStartCreating(true) }}>Crear Empresa</button>
                            </>
                                :
                                <>
                                    <FormularioCrearEmpresa firstTimeIn userModel={userModel} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} objCss={objCss} objStrings={objStrings} />
                                </>
                        }
                    </div> :
                    <div className="flex-column">
                        <FormularioCrearEmpresa back={back} userModel={userModel} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} objCss={objCss} objStrings={objStrings} />
                    </div>
            }
        </>
    )
}

export default CrearEmpresa