import InputComp from "@/components/commons/input"
import StringsObj, { UserObj } from "@/engine/content"
import StylesObj from "@/styles/stylesObj"
import { useEffect, useState } from "react"
import ModeloUsuario, { ObjDatosPersonales } from "@/bioApp/models/modelosUsuario"
import SelectComp from "@/components/commons/selector"
import { generos, nacionalidad, tipoDeDocumento } from "@/bioApp/models/selectores"
import DateSelect from "@/components/commons/dateSelect"

const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const FormularioPersonalData = (props) => {

    const { userFullModel = ModeloUsuario(), userData = userStructure, setReqState = console.log, reqState = { reqId: Number(), state: false, peticion: '', type: ''  ,inList: [] }, setPopUp = console.log, objStrings = objStringsInit, objCss = objCssInit, sendData = console.log, showed = 'inicio' } = props

    const [sending, setSending] = useState(false)
    const [ready, setReady] = useState(false)
    const [personalObj, setPersonalObj] = useState(userFullModel.datosPersonales)
    const handleCreate = (e) => {
        e.preventDefault()
        const value = e.target.value
        const id = e.target.id
        setPersonalObj({
            ...personalObj,
            [id]: value
        })
    }

    useEffect(() => {
        if (personalObj.nombre.length > 3 && personalObj.apellido.length > 3 && !isNaN(Date.parse(personalObj.fechaDeNacimiento)) && personalObj.genero !== '' && personalObj.nacionalidad !== '' && personalObj.tipoDeDocumento !== '' && personalObj.numeroDeDocumento.length > 4) {
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
                                    Nombre/s
                                    <InputComp type={'text'} id={'nombre'} value={personalObj.nombre} placeholder={'Nombre de Usuario'} funtions={handleCreate} required />
                                    Apellido/s

                                    <InputComp type={'text'} id={'apellido'} value={personalObj.apellido} placeholder={'Apellidos'} funtions={handleCreate} required />
                                </div>
                                <div className={objCss.forms.personalData.miniSection}>
                                    Fecha de Nacimiento
                                    <DateSelect Atype MaxDate={false} personalObj={personalObj} startDate={personalObj.fechaDeNacimiento} setStartDate={setPersonalObj} />
                                    <SelectComp item={'genero'} items={generos} funtions={handleCreate} id={'genero'} required />
                                    <SelectComp item={'nacionalidad'} items={nacionalidad} funtions={handleCreate} id={'nacionalidad'} required />
                                </div>
                                <div className={objCss.forms.personalData.miniSection}>
                                    <SelectComp item={'tipoDeDocumento'} items={tipoDeDocumento} funtions={handleCreate} id={'tipoDeDocumento'} required />
                                    Numero De Documento
                                    <InputComp type={'text'} id={'numeroDeDocumento'} value={personalObj.numeroDeDocumento} placeholder={'Numero De Documento'} funtions={handleCreate} required />
                                </div>

                            </div>
                            <br />
                            {ready && <button className="formInput-btn" onClick={(e) => { e.preventDefault; sendData('personal', personalObj) }}>
                                Actualizar
                            </button>}
                        </form>
                    </>
            }

        </>
    )
}
export default FormularioPersonalData
