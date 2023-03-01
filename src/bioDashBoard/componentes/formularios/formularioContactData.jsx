import InputComp from "@/components/commons/input"
import StringsObj, { UserObj } from "@/engine/content"
import StylesObj from "@/styles/stylesObj"
import { useEffect, useState } from "react"
import { ObjContacto } from "@/bioApp/models/modelosUsuario"
import AdressAdd from "@/bioApp/componentes/adressAdd"

const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const FormularioContactData = (props) => {

    const { userData = userStructure, setReqState = console.log, reqState = { reqId: Number(), state: false, peticion: '', type: ''  ,inList: [] }, setPopUp = console.log, objStrings = objStringsInit, objCss = objCssInit, sendData = console.log, showed = 'inicio' } = props

    const [sending, setSending] = useState(false)
    const [ready, setReady] = useState(false)
    const [personalObj, setPersonalObj] = useState(ObjContacto)
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
        /* const value = e.target.value
        let oldData = newUserData
        oldData.nombre = value
        setNewUserData({
            ...newUserData,
            nombre: oldData.nombre
        }) */
    }
    useEffect(() => {
        if (personalObj.correoElectronico.length > 3 && personalObj.telefonoPrincipal.length > 3) {
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
                        <h1>
                            DATOS PERSONALES
                        </h1>
                        <form action="" className="form-center">
                            <div className="form-default formInput">
                                <div className={objCss.forms.personalData.miniSection}>
                                    correo Electronico
                                    <InputComp type={'email'} id={'correoElectronico'} value={personalObj.correoElectronico} placeholder={'correo Electronico'} funtions={handleCreate} required />
                                    telefono Principal
                                    <InputComp type={'number'} id={'telefonoPrincipal'} value={personalObj.telefonoPrincipal} placeholder={'telefono Principal'} funtions={handleCreate} required />
                                    telefono secundario
                                    <InputComp type={'number'} id={'telefonoSecundario'} value={personalObj.telefonoSecundario} placeholder={'telefono secundario'} funtions={handleCreate} required />
                                </div>
                                <div className={objCss.forms.personalData.miniSectionAdress}>
                                    <AdressAdd userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} objCss={objCss} objStrings={objStrings} send={sendCity} />                                </div>

                            </div>
                            <br />
                            {ready && <button className="formInput-btn" onClick={(e) => { e.preventDefault; sendData('contact', personalObj) }}>
                                Actualizar
                            </button>}
                        </form>
                    </>
            }

        </>
    )
}
export default FormularioContactData