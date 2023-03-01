import InputComp from "@/components/commons/input"
import StringsObj, { UserObj } from "@/engine/content"
import StylesObj from "@/styles/stylesObj"
import { useEffect, useState } from "react"
import AdressAdd from "@/bioApp/componentes/adressAdd"
import ObraObj from "@/bioApp/models/modeloObra"
import { EmpresaObj } from "@/bioApp/models/modelosUsuario"
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const FormularioDatosObra = (props) => {

    const { obrasExistentes = [], activeEmpresa = EmpresaObj(), userData = userStructure, setReqState = console.log, reqState = { reqId: Number(), state: false, peticion: '', type: ''  ,inList: [] }, setPopUp = console.log, objStrings = objStringsInit, objCss = objCssInit, sendData = console.log, showed = 'inicio' } = props

    const [sending, setSending] = useState(false)
    const [ready, setReady] = useState(false)
    const [personalObj, setPersonalObj] = useState({
        ...ObraObj().contact, direccion: ObraObj().direccion,
    })
    const handleCreate = (e) => {
        e.preventDefault()
        const value = e.target.value
        const id = e.target.id
        setPersonalObj({
            ...personalObj,
            [id]: value
        })
    }
    const sendCity = (adress) => {
        setPersonalObj({
            ...personalObj,
            direccion: adress.direccion
        })
    }
    useEffect(() => {
        if (personalObj.nombre.length > 3 && personalObj.obra.length > 3 && personalObj.correoElectronico !== '' && personalObj.telefonoPrincipal !== '' && personalObj.telefonoSecundario !== '' && personalObj.direccion.departamento !== '' && personalObj.direccion.ciudad !== '' && personalObj.direccion.barrio !== '') {
            setReady(true)
        } else {
            setReady(false)

        }
    }, [personalObj])

    return (
        <>
            {
                sending ? <>ENVIANDO::::::</> :
                    <>
                        {ready && <button className="formInput-btn" onClick={(e) => { e.preventDefault; sendData('personal', personalObj) }}>
                            Actualizar
                        </button>}
                        <h1>
                            DATOS DE LA OBRA
                        </h1>

                        <form action="" className="form-center">
                            <div className="form-default formInput">
                                <div className={objCss.forms.personalData.miniSection}>
                                    Nombre de la Obra
                                    <InputComp type={'text'} id={'obra'} value={personalObj.obra} placeholder={'Nombre de la Obra'} funtions={handleCreate} required />
                                    Nombre de Contacto
                                    <InputComp type={'text'} id={'nombre'} value={personalObj.nombre} placeholder={'Nombre de Contacto'} funtions={handleCreate} required />
                                    Cargo
                                    <InputComp type={'text'} id={'cargo'} value={personalObj.cargo} placeholder={'Cargo'} funtions={handleCreate} required />

                                    Correo Electronico
                                    <InputComp type={'email'} id={'correoElectronico'} value={personalObj.correoElectronico} placeholder={'correo Electronico'} funtions={handleCreate} required />
                                    telefono Principal
                                    <InputComp type={'number'} id={'telefonoPrincipal'} value={personalObj.telefonoPrincipal} placeholder={'telefono Principal'} funtions={handleCreate} required />
                                    telefono secundario
                                    <InputComp type={'number'} id={'telefonoSecundario'} value={personalObj.telefonoSecundario} placeholder={'telefono secundario'} funtions={handleCreate} required />
                                </div>
                                <div className={objCss.forms.personalData.miniSectionAdress}>
                                    <AdressAdd inEmpresa /* empresa={activeEmpresa.contact.nombre} */ userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} objCss={objCss} objStrings={objStrings} send={sendCity} />
                                </div>
                            </div>
                            <br />

                        </form>
                    </>
            }

        </>
    )
}
export default FormularioDatosObra
