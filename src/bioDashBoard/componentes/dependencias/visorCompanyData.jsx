import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import { UserObj } from "@/engine/content"
import { ArrayCompanyData, ArrayContactDataAdress, ArrayPersonalData } from "@/bioApp/models/modelosSelector"
import ModeloUsuario, { EmpresaObj } from "@/bioApp/models/modelosUsuario"
import { useState } from "react"
const usuarioDefault = ModeloUsuario()

const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const VisorCompanyData = (props) => {
    const { actualizeData = console.log, activeEmpresa = EmpresaObj(), setactiveEmpresa = console.log, objStrings = objStringsInit, objCss = objCssInit, selectioned = { active: false, inSelection: 'default' }, usersAll = { array: [] } } = props
    const [inAdress, setInAdress] = useState(false)
    return (
        <div className="flex-column">
            <h1> INFORMACION EMPRESA{inAdress && '--DIRECCION'}</h1>
            {/* activeEmpresa.userInfo.app.dataRequired */1 === 2 ?
                <>
                    SIN INFORMACION
                    <button /* onClick={(e) => { e.preventDefault(); setInData({ ...inData, selected: 'contactData' }) }} */>LLENAR</button>

                </>
                :
                <>
                    {
                        inAdress ?
                            <>
                                <div>
                                    {ArrayContactDataAdress.map((key, i) => {
                                        return (
                                            <><p id={`pid-${i}`}>
                                                <span id={`pidspan-${i}`}>
                                                    <span id={`pidspandos-${i}`}>   {key}  :</span>
                                                    <span id={`pidspantres-${i}`}>   {activeEmpresa.contact.direccion[key]}</span>

                                                </span>
                                            </p></>
                                        )
                                    })}
                                </div>
                                <span onClick={(e) => { e.preventDefault(); setInAdress(false) }} id={`pidspantres-sas`}>   volver</span>
                            </>
                            :
                            <div>
                                {ArrayCompanyData.map((key, i) => {
                                    return (
                                        <><p id={`pid-${i}`}>
                                            <span id={`pidspan-${i}`}>
                                                <span id={`pidspandos-${i}`}>   {key}  :</span>
                                                {key === 'direccion' ?
                                                    <span onClick={(e) => { e.preventDefault(); setInAdress(true) }} id={`pidspantres-${i}`}>   ver</span>

                                                    :
                                                    <span id={`pidspantres-${i}`}>   {activeEmpresa.contact[key]}</span>
                                                }
                                            </span>
                                        </p></>
                                    )
                                })}
                                DEUDA ACTUAL                                                                {activeEmpresa.legal.cartera.cartera}

                            </div>
                    }
                </>
            }

        </div>
    )
}
export default VisorCompanyData