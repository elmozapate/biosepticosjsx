import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import { useEffect, useState } from "react"
import { UserObj } from "@/engine/content"
import CrearEmpresa from "./crearEmpresas"
import ModeloUsuario, { EmpresaObj } from "../models/modelosUsuario"
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const SelectorEmpresas = (props) => {
    const { PedirObras = console.log, pedirMisServicios = console.log, startCreating = false, setStartCreating = console.log, setMisEmpresas = console.log, userModel = ModeloUsuario(), misEmpresas = { seleccionada: '', empresas: [], itemSelectioned: EmpresaObj() }, pedirEmpresas = console.log, empresas = { array: [] }, users = { array: [] }, userData = userStructure, setPopUp = console.log, objStrings = objStringsInit, objCss = objCssInit, inUse = 'app' } = props
    const ingresarEnEmpresa = (empresa) => {
        setMisEmpresas({
            ...misEmpresas,
            seleccionada: empresa.contact.nombre,
            itemSelectioned: empresa
        })
        PedirObras({ id: empresa.id, user: userData.id })
    }
   
    return (
        <>
            {
                <>
                    {
                        misEmpresas.empresas.length === 0 &&
                        <>
                            <CrearEmpresa firstTime userModel={userModel} userData={userData} setPopUp={setPopUp} objCss={objCss} objStrings={objStrings} />
                        </>
                    }
                    {

                        misEmpresas.empresas.length > 0 && <>
                            {startCreating ?
                                <>
                                    <CrearEmpresa userModel={userModel} userData={userData} setPopUp={setPopUp} objCss={objCss} objStrings={objStrings} back={setStartCreating} />
                                </>
                                :
                                <div className="flex-column">
                                    <button onClick={(e) => { e.preventDefault(); setStartCreating(true) }}>Crear Empresa</button>
                                    <div>
                                        <h3>                                    SELECIONAR EMPRESA
                                        </h3>
                                        {misEmpresas.empresas.map((key, i) => {
                                            return (
                                                <>
                                                    <p id={`selectorEmpresas-${i}`} onClick={(e) => { e.preventDefault(); ingresarEnEmpresa(key) }}>{key.contact.nombre}</p>
                                                </>
                                            )
                                        })}
                                    </div>
                                </div>
                            }

                        </>
                    }
                </>
            }
        </>
    )
}
export default SelectorEmpresas