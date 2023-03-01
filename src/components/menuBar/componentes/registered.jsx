import { EmpresaObj } from "@/bioApp/models/modelosUsuario"
import StringsObj, { UserObj } from "@/engine/content"
import StylesObj from "@/styles/stylesObj"
import { useEffect, useState } from "react"
import NavMenu from "./menu"
import NavMenuEmpresas from "./menuEmpresas"
import PhotoContainer from "./photoContainer"
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const Registered = (props) => {
    const { PedirObras = console.log, pedirMisServicios = console.log, misEmpresas = {
        seleccionada: '', empresas: [], itemSelectioned: EmpresaObj()
    }, setMisEmpresas = console.log, startCreating = false, setStartCreating = console.log, misEmpresasRes = { array: [] }, objStrings = objStringsInit, setUserData = console.log, userData = userStructure, setReqState = console.log, reqState = { reqId: Number(), state: false, peticion: '', type: ''  ,inList: [] }, setPopUp = console.log, objCss = objCssInit, cleanUserData = console.log } = props
    const [menuOpen, setMenuOpen] = useState(false)
    const [menuOpenEmpresas, setMenuOpenEmpresas] = useState(false)
    useEffect(() => {
        document.addEventListener("click", function (e) {
            e.preventDefault()
            e.target.id && e.target.id.split('-') && e.target.id.split('-')[0] === 'nav' && !menuOpen ? console.log : setMenuOpen(false);
            e.target.id && e.target.id.split('-') && e.target.id.split('-')[0] === 'navEmpresas' && !menuOpenEmpresas ? console.log : setMenuOpenEmpresas(false);
        })
    }, [])
    return (
        <>
            <p  onClick={(e) => { e.preventDefault(); userData.type === 'clientUser' && setMenuOpenEmpresas(!menuOpenEmpresas) }} className={'mr-head'/* objCss.barraNav.menuActivator */} id={userData.type === 'clientUser' ? "navEmpresas-menu-section" : "nav-menu-section"}>{`${userData.type === 'operativeUser' ? 'CENTRO DE LOGISTICA' : userData.type === 'vendedor' ? 'VENDEDORES' : userData.type === 'clientUser' ? 'EMPRESAS' : userData.type === 'adminUser' ? 'CONSOLA ADMINISTRATIVA' : ''}    `}</p>
            <div  id="nav-menu" className={objCss.barraNav.menuActivator.toString()} onClick={(e) => { e.preventDefault(); setMenuOpen(!menuOpen) }}>
                {
                    menuOpenEmpresas && userData.type === 'clientUser' && <NavMenuEmpresas PedirObras={PedirObras}
                        pedirMisServicios={pedirMisServicios} setMisEmpresas={setMisEmpresas} misEmpresas={misEmpresas} misEmpresasRes={misEmpresasRes} startCreating={startCreating} setStartCreating={setStartCreating} objStrings={objStrings} setMenuOpen={setMenuOpen} setUserData={setUserData} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} cleanUserData={cleanUserData} />
                }


                {
                    menuOpen && <NavMenu objStrings={objStrings} setMenuOpen={setMenuOpen} setUserData={setUserData} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} cleanUserData={cleanUserData} />
                }
                <p  id="nav-menu-p">|||</p>

                <p  id="nav-menu-pa">{userData.nombre}</p>
                <PhotoContainer setMenuOpen={setMenuOpen} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} objStrings={objStrings} objCss={objCss} />


            </div>
        </>
    )
}

export default Registered