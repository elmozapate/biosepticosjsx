import InputComp from "@/components/commons/input"
import StringsObj, { UserObj } from "@/engine/content"
import StylesObj from "@/styles/stylesObj"
import { useEffect, useState } from "react"
import { ModeloVehiculo } from "@/bioApp/models/modeloVehiculo"

const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const FormularioVehiculoOperativeData = (props) => {
    const { userFullModel = ModeloVehiculo, userData = userStructure, setReqState = console.log, reqState = { reqId: Number(), state: false, peticion: '', type: ''  ,inList: [] }, setPopUp = console.log, objStrings = objStringsInit, objCss = objCssInit, sendData = console.log, showed = 'inicio' } = props
    const [sending, setSending] = useState(false)
    const [ready, setReady] = useState(false)
    const [personalObj, setPersonalObj] = useState(userFullModel.datosLegales)
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
        if (personalObj.cantidadPasajeros > 0) {
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
                                cantidad Pasajeros
                                <InputComp classN='color-black' min={1} max={5} type={'number'} id={'cantidadPasajeros'} value={personalObj.cantidadPasajeros} placeholder={'cantidad Pasajeros'} funtions={handleCreate} required />
                            </div>
                            <br />
                            {ready && <button className="formInput-btn color-black" onClick={(e) => { e.preventDefault; sendData('personal', personalObj) }}>
                                Actualizar
                            </button>}
                        </form>
                    </>
            }

        </>
    )
}
export default FormularioVehiculoOperativeData
