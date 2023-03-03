import StylesObj from "@/styles/stylesObj"
import StringsObj, { UserObj } from "@/engine/content"
import VisorCompanyData from "@/bioDashBoard/componentes/dependencias/visorCompanyData"
import { EmpresaObj } from "../models/modelosUsuario"
import FormularioCrearObra from "@/bioDashBoard/componentes/formularios/formularioCrearObra"
import { useEffect, useState } from "react"
import ObraObj from "../models/modeloObra"
import ContenedorMaps from "../componentes/contenedorMaps"
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const userStructure = UserObj()

const ContenedorObras = (props) => {
    const { creatingObra = false, misObras = { array: [] }, misServicios = { array: [] }, setCreatingObra = console.log, activeEmpresa = EmpresaObj(), userData = userStructure, setReqState = console.log, reqState = { reqId: Number(), state: false, peticion: '', type: '', inList: [] }, setPopUp = console.log, sideOpen = false, objStrings = objStringsInit, objCss = objCssInit, showed = 'inicio' } = props
    const [inMaps, setinMaps] = useState({ state: false, coord: { lat: 6.2476376, lng: -75.56581530000001 } })

    return (
        <>
            {
                !creatingObra && misObras.array.length > 0 ?
                    <>
                        <button onClick={(e) => { e.preventDefault(); setCreatingObra(true) }}>CREAR OBRA</button>
                        {inMaps.state ? <>
                            <ContenedorMaps adressViewIn defaultLocation={inMaps.coord} />
                            <span onClick={(e) => { e.preventDefault(); setinMaps({ state: false, coord: { lat: 6.2476376, lng: -75.56581530000001 } }) }}> VOLVER</span>
                            <br />

                        </> :
                            <div className="service-list">
                                {<>
                                    <p id={`opopo-0o`}><span className="mediumSize"> OBRA</span> <span className="bigSizeS"> departamento</span><span className="bigSizeS"> ciudad</span><span className="mediumSize"> barrio</span><span className="mediumSize" id={`opopo-as-ssss`}></span></p>
                                    {misObras.array.map((key, i) => {
                                        return (
                                            <>
                                                <p id={`opopo-${i}`}> <span className="mediumSize">{key.nombre}</span> <span className="bigSizeS" id={`opopo-${i}-s`}>{key.direccion.departamento}</span><span className="bigSizeS" id={`opopo-${i}-ss`}>{key.direccion.ciudad}</span><span className="mediumSize" id={`opopo-${i}-ssss`}>{key.direccion.barrio}</span><span onClick={(e) => { e.preventDefault(); setinMaps({...inMaps, state: true, coord: key.direccion.coordenadas }) }} className="mediumSize pointer" id={`opopo-${i}-ssss`}>VER EN MAPS</span></p>
                                            </>
                                        )
                                    })}
                                </>
                                }

                            </div>}
                    </> :
                    <>
                        {
                            !creatingObra && !misObras.array.length > 0 ?
                                <>
                                    NO TIENES OBRAS
                                    <button onClick={(e) => { e.preventDefault(); setCreatingObra(true) }}>CREAR OBRA</button>
                                </>
                                :
                                <FormularioCrearObra userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} sideOpen={sideOpen} activeEmpresa={activeEmpresa} objCss={objCss} objStrings={objStrings} showed={showed} back={setCreatingObra} />
                        }
                    </>
            }
        </>
    )
}
export default ContenedorObras