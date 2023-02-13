import StylesObj from "@/styles/stylesObj"
import StringsObj, { UserObj } from "@/engine/content"
import VisorCompanyData from "@/bioDashBoard/componentes/dependencias/visorCompanyData"
import { EmpresaObj } from "../models/modelosUsuario"
import FormularioCrearObra from "@/bioDashBoard/componentes/formularios/formularioCrearObra"
import { useEffect, useState } from "react"
import ObraObj from "../models/modeloObra"
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const userStructure = UserObj()

const ContenedorObras = (props) => {
    const { creatingObra = false, misObras = { array: [] }, misServicios = { array: [] }, setCreatingObra = console.log, activeEmpresa = EmpresaObj(), userData = userStructure, setPopUp = console.log, sideOpen = false, objStrings = objStringsInit, objCss = objCssInit, showed = 'inicio' } = props
    return (
        <>
            {
                !creatingObra && misObras.array.length > 0 ?
                    <>
                        <button onClick={(e) => { e.preventDefault(); setCreatingObra(true) }}>CREAR OBRA</button>
                        <div className="service-list">
                            {
                                misObras.array.map((key, i) => {
                                    return (
                                        <>
                                            <p id={`opopo-${i}`}><p className="p"> OBRA:</p> <span>{key.nombre}</span> <p className="p"> departamento:</p><span id={`opopo-${i}-s`}>{key.direccion.departamento}</span><p className="p"> ciudad:</p><span id={`opopo-${i}-ss`}>{key.direccion.ciudad}</span><p className="p"> barrio:</p><span id={`opopo-${i}-ssss`}>{key.direccion.barrio}</span></p>
                                        </>
                                    )
                                })
                            }

                        </div>
                    </> :
                    <>
                        {
                            !creatingObra && !misObras.array.length > 0 ?
                                <>
                                    NO TIENES OBRAS
                                    <button onClick={(e) => { e.preventDefault(); setCreatingObra(true) }}>CREAR OBRA</button>
                                </>
                                :
                                <FormularioCrearObra userData={userData} setPopUp={setPopUp} sideOpen={sideOpen} activeEmpresa={activeEmpresa} objCss={objCss} objStrings={objStrings} showed={showed} back={setCreatingObra} />
                        }
                    </>
            }
        </>
    )
}
export default ContenedorObras