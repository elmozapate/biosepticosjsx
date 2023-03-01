import StylesObj from "@/styles/stylesObj"
import StringsObj, { UserObj } from "@/engine/content"
import VisorCompanyData from "@/bioDashBoard/componentes/dependencias/visorCompanyData"
import { EmpresaObj } from "../models/modelosUsuario"
import FormularioCrearObra from "@/bioDashBoard/componentes/formularios/formularioCrearObra"
import { useEffect, useState } from "react"
import SelectorDedicadoFunciones from "./selectorDedicadoFunciones"
import { ModeloBiosepticos } from "../models/modeloBiosepticos"
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const userStructure = UserObj()
const SelectorFuncionEmpresas = (props) => {
    const { modeloBiosepticos = ModeloBiosepticos, userModel = userStructure, serviceStep = { data: {}, step: 0 }, seServiceStep = console.log, sendNewServicio = console.log, creatingObra = false, PedirObras = console.log, pedirMisServicios = console.log, setCreatingObra = console.log, misObras = { array: [] }, empresas = { array: [] }, misServicios = { array: [] }, activeEmpresa = EmpresaObj(), userData = userStructure, setReqState = console.log, reqState = { reqId: Number(), state: false, peticion: '', type: '', inList: [] }, setPopUp = console.log, sideOpen = false, objStrings = objStringsInit, objCss = objCssInit, showed = 'inicio' } = props
    useEffect(() => {
        !creatingObra && userModel.app.relationed.empresas.length > 0 && PedirObras({ id: activeEmpresa.id, user: userData.id })
    }, [creatingObra]);
    return (
        <>
            {
                showed === 'empresa' &&
                <>
                    <VisorCompanyData empresas={empresas} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} sideOpen={sideOpen} activeEmpresa={activeEmpresa} objCss={objCss} objStrings={objStrings} showed={showed} />
                </>
            }
            {

                <SelectorDedicadoFunciones modeloBiosepticos={modeloBiosepticos} serviceStep={serviceStep} seServiceStep={seServiceStep} pedirMisServicios={pedirMisServicios} sendNewServicio={sendNewServicio} creatingObra={creatingObra} misObras={misObras} misServicios={misServicios} setCreatingObra={setCreatingObra} activeEmpresa={activeEmpresa} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} sideOpen={sideOpen} objStrings={objStrings} objCss={objCss} showed={showed} />

            }
        </>
    )
}
export default SelectorFuncionEmpresas