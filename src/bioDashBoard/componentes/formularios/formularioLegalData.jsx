import InputComp from "@/components/commons/input"
import StringsObj, { UserObj } from "@/engine/content"
import MiddlewareSelector from "@/middleware/askSelector"
import StylesObj from "@/styles/stylesObj"
import { useEffect, useState } from "react"
import PermisionComp from "./permisionComp"
import EnvM from "@/envMachetero"
import io from "socket.io-client"
import { EmpresaObj, ObjContacto, ObjDatosPersonales } from "@/bioApp/models/modelosUsuario"
import SelectComp from "@/components/commons/selector"
import { generos, nacionalidad, tipoDeDocumento } from "@/bioApp/models/selectores"
import DateSelect from "@/components/commons/dateSelect"
import AdressAdd from "@/bioApp/componentes/adressAdd"
import { Socket } from "@/middleware/routes/connect/socket/socketOn"
import SelectorVendedores from "@/components/commons/selectorVendedores"
let resId = 0
const socket = Socket
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const FormularioLegalData = (props) => {

    const { userFullModel = EmpresaObj(), userData = userStructure, setPopUp = console.log, objStrings = objStringsInit, objCss = objCssInit, sendData = console.log, showed = 'inicio' } = props
    const [vendedores, setVendedores] = useState({ array: [] })

    const [sending, setSending] = useState(false)
    const [ready, setReady] = useState(false)
    const [personalObj, setPersonalObj] = useState(userFullModel.legal)
    const handleCreate = (e) => {
        e.preventDefault()
        const value = e.target.value
        const id = e.target.id
        setPersonalObj({
            ...personalObj,
            [id]: value
        })
    }
    const resVendedores = () => {
        const res = MiddlewareSelector({
            ask: 'getVendedores', id: userData.id
        })
        resId = res

    }
    useEffect(() => {
        socket.on("bioApp", (msg) => {
            const actionTodo = msg.actionTodo
            const Data = msg.dataIn
            switch (actionTodo) {
                case 'askVendedoresRes':
                    if (parseInt(msg.resId) === parseInt(resId)) {
                        setVendedores({ ...vendedores, array: msg.vendedores })
                    }
                    break;
                default:
                    break;
            }
        })
    }, [])
    useEffect(() => {
        resVendedores()
    }, [])
    useEffect(() => {
        if (personalObj.documento.length > 5 && personalObj.vendedor.length > 4) {
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
                            DATOS LEGALES
                        </h1>
                        {ready && <button className="formInput-btn" onClick={(e) => { e.preventDefault; sendData('contact', personalObj) }}>
                            Actualizar
                        </button>}
                        <form action="" className="form-center">
                            <div className="form-default formInput">
                                <div className={objCss.forms.personalData.miniSection}>
                                    DOCUMENTO
                                    <InputComp userData={personalObj} checkedIn={personalObj.documento > 0 && true} type={'number'} id={'documento'} value={personalObj.documento} placeholder={'documento'} funtions={handleCreate} required />
                                    VENDEDOR
                                    <SelectorVendedores userData={personalObj} item={'vendedor'} value={personalObj.vendedor} items={vendedores.array} funtions={handleCreate} id={'vendedor'} required />

                                    <InputComp userData={personalObj} checkedIn={personalObj.vendedor && personalObj.vendedor.id !== '' && true} type={'text'} id={'vendedor'} value={personalObj.vendedor} placeholder={'vendedor'} funtions={handleCreate} required />
                                    REPRESENTANTE
                                    <p>{userData.nombre}</p>
                                </div>
                            </div>

                        </form>
                    </>
            }

        </>
    )
}
export default FormularioLegalData