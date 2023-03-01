import AppContainer from "../componentes/contenedorPrincipal";
import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import { UserObj } from "@/engine/content"
import { useEffect } from "react";
import ModeloUsuario, { EmpresaObj } from "../models/modelosUsuario";
import { Socket } from "@/middleware/routes/connect/socket/socketOn"
const socket = Socket

const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()

const CentroDeEmpresas = (props) => {
    const { sendNewServicio = console.log, creatingObra = false, setCreatingObra = console.log, misObras = { array: [] }, empresas = { array: [] }, misServicios = { array: [] }, vehiculos = { array: [] }, misEmpresas = {
        seleccionada: '', empresas: [], itemSelectioned: EmpresaObj()
    }, PedirObras = console.log, pedirMisServicios = console.log, setMisEmpresas = console.log, startCreating = false, setStartCreating = console.log, userModel = ModeloUsuario(), misEmpresasRes = { array: [] }, pedirEmpresas = console.log, userData = userStructure, setReqState = console.log, reqState = { reqId: Number(), state: false, peticion: '', type: '', inList: [] }, setPopUp = console.log, objStrings = objStringsInit, objCss = objCssInit } = props

    useEffect(() => {
        if (userModel.app.relationed.empresas.length > 0) {
            pedirEmpresas()
        }
    }, [userModel])

    return (
        <>
            <AppContainer empresas={empresas} sendNewServicio={sendNewServicio} creatingObra={creatingObra} setCreatingObra={setCreatingObra} misObras={misObras} misServicios={misServicios} PedirObras={PedirObras}
                pedirMisServicios={pedirMisServicios} misEmpresas={misEmpresas} setMisEmpresas={setMisEmpresas} startCreating={startCreating} setStartCreating={setStartCreating} userModel={userModel} pedirEmpresas={pedirEmpresas} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} objCss={objCss} objStrings={objStrings} />

        </>
    )
}
export default CentroDeEmpresas