import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import AppContainer from "@/bioApp/componentes/contenedorPrincipal"
import { ModeloBiosepticos } from "@/bioApp/models/modeloBiosepticos"
import { useState } from "react"
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const DashBoard = (props) => {
    const { actualizarEstado = console.log, modeloBiosepticos = ModeloBiosepticos , vehiculos = { array: [] }, usersAll = { array: [] }, pedirEmpresas = console.log, users = { array: [] }, empresas = { array: [] }, userData = userStructure, setPopUp = console.log, objStrings = objStringsInit, objCss = objCssInit } = props
    const [selectioned, setSelectioned] = useState('centro rapido')

    return (
        <AppContainer selectioned={selectioned} setSelectioned={setSelectioned} modeloBiosepticos={modeloBiosepticos} actualizarEstado={actualizarEstado} vehiculos={vehiculos} usersAll={usersAll} pedirEmpresas={pedirEmpresas} empresas={empresas} users={users} userData={userData} setPopUp={setPopUp} objCss={objCss} objStrings={objStrings} inUse={'dashBoard'} />
    )
}
export default DashBoard