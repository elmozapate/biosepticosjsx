import InputComp from "@/components/commons/input"
import StringsObj, { UserObj } from "@/engine/content"
import MiddlewareSelector from "@/middleware/askSelector"
import StylesObj from "@/styles/stylesObj"
import { useEffect, useState } from "react"
import PermisionComp from "./permisionComp"
import EnvM from "@/envMachetero"
import io from "socket.io-client"
import { ObjContacto, ObjDatosPersonales } from "@/bioApp/models/modelosUsuario"
import SelectComp from "@/components/commons/selector"
import { generos, nacionalidad, tipoDeDocumento } from "@/bioApp/models/selectores"
import DateSelect from "@/components/commons/dateSelect"
import AdressAdd from "@/bioApp/componentes/adressAdd"
const envM = EnvM()

const socket = io(envM.hostBack)
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const FormularioContactData = (props) => {

    const { userData = userStructure, objStrings = objStringsInit, objCss = objCssInit, sendData = console.log, showed = 'inicio' } = props

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
        console.log(adress);
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
                                    <InputComp type={'email'} id={'correoElectronico'} value={personalObj.correoElectronico} placeHolder={'correo Electronico'} funtions={handleCreate} required />
                                    telefono Principal
                                    <InputComp type={'number'} id={'telefonoPrincipal'} value={personalObj.telefonoPrincipal} placeHolder={'telefono Principal'} funtions={handleCreate} required />
                                    telefono secundario
                                    <InputComp type={'number'} id={'telefonoSecundario'} value={personalObj.telefonoSecundario} placeHolder={'telefono secundario'} funtions={handleCreate} required />
                                </div>
                                <div className={objCss.forms.personalData.miniSectionAdress}>
                                    <AdressAdd userData={userData} objCss={objCss} objStrings={objStrings} send={sendCity} />                                </div>

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