import InputComp from "@/components/commons/input"
import StringsObj, { UserObj } from "@/engine/content"
import StylesObj from "@/styles/stylesObj"
import { useEffect, useState } from "react"
import { EmpresaObj } from "@/bioApp/models/modelosUsuario"
import SelectComp from "@/components/commons/selector"
import { sectores } from "@/bioApp/models/selectores"
import AdressAdd from "@/bioApp/componentes/adressAdd"
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const FormularioDatosEmpresa = (props) => {

    const { userFullModel = EmpresaObj(), userData = userStructure, setReqState = console.log, reqState = { reqId: Number(), state: false, peticion: '', type: ''  ,inList: [] }, setPopUp = console.log, objStrings = objStringsInit, objCss = objCssInit, sendData = console.log, showed = 'inicio' } = props
    const [sending, setSending] = useState(false)
    const [ready, setReady] = useState(false)
    const [personalObj, setPersonalObj] = useState(userFullModel.contact)
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
        if (personalObj && personalObj.nombre && personalObj.nombre.length > 3 && personalObj.sector && personalObj.sector.length > 3 && personalObj.correoElectronico && personalObj.correoElectronico !== '' && personalObj.telefonoPrincipal && personalObj.telefonoPrincipal !== '' && personalObj.telefonoSecundario && personalObj.telefonoSecundario !== '') {
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
                            DATOS DE LA EMPRESA
                        </h1>
                        {ready && <button className="formInput-btn" onClick={(e) => { e.preventDefault; sendData('personal', personalObj) }}>
                            Actualizar
                        </button>}
                        <form action="" className="form-center">
                            <div className="form-default formInput">
                                <div className={objCss.forms.personalData.miniSection}>
                                    Nombre de la Empresa
                                    <InputComp userData={personalObj} type={'text'} id={'nombre'} value={personalObj.nombre} placeholder={'Nombre de la Empresa'} funtions={handleCreate} required />
                                    Sector
                                    <SelectComp userData={personalObj} item={'sector'} items={sectores} funtions={handleCreate} ID={'sector'} required />
                                    Correo Electronico
                                    <InputComp userData={personalObj} type={'email'} id={'correoElectronico'} value={personalObj.correoElectronico} placeholder={'correo Electronico'} funtions={handleCreate} required />
                                    telefono Principal
                                    <InputComp userData={personalObj} type={'number'} id={'telefonoPrincipal'} value={personalObj.telefonoPrincipal} placeholder={'telefono Principal'} funtions={handleCreate} required />
                                    telefono secundario
                                    <InputComp userData={personalObj} type={'number'} id={'telefonoSecundario'} value={personalObj.telefonoSecundario} placeholder={'telefono secundario'} funtions={handleCreate} required />
                                </div>
                                <div className={objCss.forms.personalData.miniSectionAdress}>
                                    <AdressAdd inEmpresa userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} objCss={objCss} objStrings={objStrings} send={sendCity} />
                                </div>
                            </div>
                        </form>
                    </>
            }

        </>
    )
}
export default FormularioDatosEmpresa
