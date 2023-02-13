import { EmpresaObj } from "@/bioApp/models/modelosUsuario"
import StringsObj, { UserObj } from "@/engine/content"
import StylesObj from "@/styles/stylesObj"
import { useState } from "react"
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const userStructure = UserObj()

const NavMenuEmpresas = (props) => {
    const { misEmpresas = {
        seleccionada: '', empresas: [], itemSelectioned: EmpresaObj()
    }, setMisEmpresas = console.log, startCreating = false, setStartCreating = console.log, misEmpresasRes = { array: [] }, objStrings = objStringsInit, userData = userStructure, setPopUp = console.log, PedirObras = console.log, pedirMisServicios = console.log, setMenuOpen = console.log, objCss = objCssInit, cleanUserData = console.log } = props
    const [selectingEmpresas, setSelectingEmpresas] = useState(false)
    return (
        <div id="navEmpresas-menu-div">

            <div id="navEmpresas-menu-abs" className="column-abs-empresas">
                {!selectingEmpresas && misEmpresas.empresas.length > 0 && <p id="navEmpresas-menu-opt-0" onClick={(e) => { e.preventDefault(); setMisEmpresas({ ...misEmpresas, seleccionada: '' }) }}>menu empresas</p>}
                {!selectingEmpresas && !startCreating && <p id="navEmpresas-menu-opt-0" onClick={(e) => { e.preventDefault(); setMisEmpresas({ ...misEmpresas, seleccionada: '' }); setStartCreating(true) }}>Crear empresas</p>}
                {misEmpresas.empresas.length > 0 && <p className="flex-column" id="navEmpresas-menu-opt-0" onClick={(e) => { e.preventDefault(); setSelectingEmpresas(!selectingEmpresas) }}>Mis empresas
                </p>}
                {selectingEmpresas && misEmpresas.empresas.map((key, i) => {
                    return (
                        <>
                            <p id={`navEmpresas-spanEmpresas-${i}`} onClick={(e) => { e.preventDefault(); setMisEmpresas({ ...misEmpresas, seleccionada: key.contact.nombre, itemSelectioned: key }); setSelectingEmpresas(false); PedirObras({ id: key.id, user: userData.id }); pedirMisServicios(key.id); setMenuOpen(false) }}>{key.contact.nombre}</p>
                        </>
                    )
                })}
                {selectingEmpresas && <p id={`navEmpresas-spanEmpresas-back`} onClick={(e) => { e.preventDefault(); setSelectingEmpresas(false) }}>VOLVER</p>
                }

            </div>
        </div >
    )
}

export default NavMenuEmpresas