import { ObjPermisions } from "@/bioApp/models/modelosUsuario"
import InputComp from "@/components/commons/input"
import StringsObj, { UserObj } from "@/engine/content"
import MiddlewareSelector from "@/middleware/askSelector"
import StylesObj from "@/styles/stylesObj"
import { useEffect, useState } from "react"
import PermisionComp from "./permisionComp"
import EnvM from "@/envMachetero"
import io from "socket.io-client"

const envM = EnvM()

const socket = io(envM.hostBack)
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
let resId = 0

const FormularioAppUser = (props) => {

    const { userData = userStructure, objStrings = objStringsInit, objCss = objCssInit, willShow = console.log, showed = 'inicio' } = props

    const [sending, setSending] = useState(false)
    const [ready, setReady] = useState(false)
    const [newUserData, setNewUserData] = useState({
        nombre: '',
        permisions: ObjPermisions
    })
    const handleCreate = (e) => {
        e.preventDefault()
        const value = e.target.value
        let oldData = newUserData
        oldData.nombre = value
        setNewUserData({
            ...newUserData,
            nombre: oldData.nombre
        })
    }
    const setPermisions = (permisionsGet = ObjPermisions) => {
        setNewUserData({
            ...newUserData,
            permisions: permisionsGet
        })
        setReady(true)
    }
    const createUser = () => {
        setSending(true)
        const res = MiddlewareSelector({
            ask: 'newUser', data: newUserData
        })
        resId = res

    }
    useEffect(() => {
        socket.on("bioApp", (msg) => {
            const actionTodo = msg.actionTodo
            const Data = msg.dataIn
            switch (actionTodo) {
                case 'newEntryRes':
                    if (parseInt(msg.resId) === parseInt(resId)) {
                        window.alert(`Este es el nombre de usuario${msg.body.nombre} <br/>Esta es la clave temporal ${msg.body.password} <br/> Porfavor guardar datos`)
                        setSending(false)
                    }
                    break;
                default:
                    break;
            }
        })
    }, [])
    return (
        <>
            {
                sending ? <>ENVIANDO::::::</> :
                    <form >
                        CREAR USUARIO
                        <br />
                        <InputComp type={'text'} id={'nombre'} value={newUserData.nombre} placeHolder={'Nombre de Usuario'} funtions={handleCreate} required />
                        <br />
                        < PermisionComp funtions={setPermisions} objCss={objCss} />
                        {ready && <button onClick={(e) => { e.preventDefault; createUser() }}>
                            Crear
                        </button>}
                    </form>}

        </>
    )
}
export default FormularioAppUser