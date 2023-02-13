import ModeloUsuario, { ObjPermisions } from "@/bioApp/models/modelosUsuario"
import InputComp from "@/components/commons/input"
import StringsObj, { UserObj } from "@/engine/content"
import MiddlewareSelector from "@/middleware/askSelector"
import StylesObj from "@/styles/stylesObj"
import { useEffect, useState } from "react"
import PermisionComp from "./permisionComp"
import { Socket } from "@/middleware/routes/connect/socket/socketOn"
let cheking = ObjPermisions
const socket = Socket
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
let resId = 0

const FormularioAppUser = (props) => {

    const { userModel = ModeloUsuario(), setWillShow = console.log, inAsk = 'newUser', userType = '', willShows = '', onlyAccess = [{ type: '', perms: {} }], sinPermisos = false, userData = userStructure, setPopUp = console.log, objStrings = objStringsInit, objCss = objCssInit, willShow = console.log, showed = 'inicio' } = props
    const [inPerms, setInperms] = useState(ObjPermisions)
    const [sending, setSending] = useState(false)
    const [ready, setReady] = useState(false)
    const [newUserData, setNewUserData] = useState({
        nombre: '',
        permisions: ObjPermisions,
        onlyAccess: onlyAccess,
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
            ask: inAsk, data: newUserData, id: userData.id, type: willShows
        })
        resId = res

    }
    useEffect(() => {
        newUserData.nombre.length > 3 ? setReady(true) : setReady(false)
        cheking = {
            console: false,
            logistica: false,
            empresas: false,
            vendedores: false,
            bioseptico: false
        }
        willShows === '' && setInperms({
            console: false,
            logistica: false,
            empresas: false,
            vendedores: false,
            bioseptico: false
        });
        if (willShows !== '') {
            onlyAccess.map((key, i) => {
                if (key.type === 'console' || key.type === 'logistica' || key.type === 'empresa' || key.type === 'vendedores' || key.type === 'bioseptico') { cheking[key.type] = true } else { cheking[key.type] = false }
            })
        }

        setInperms(cheking);
    }, [newUserData])

    willShows !== '' && useEffect(() => {
        socket.on("bioApp", (msg) => {
            const actionTodo = msg.actionTodo
            const Data = msg.dataIn
            switch (actionTodo) {
                case 'newBioRes':
                    if (parseInt(msg.resId) === parseInt(resId)) {
                        setSending(false)
                        setWillShow('')
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

                <>

                    {sending ? <>ENVIANDO::::::</> :
                        <form className="form-center">
                            <div className="form-default formInput">

                                CREAR USUARIO
                                <br />
                                <InputComp classN='color-black' type={'text'} id={'nombre'} value={newUserData.nombre} placeholder={'Nombre de Usuario'} funtions={handleCreate} required />
                                <br />
                                {
                                    !sinPermisos && < PermisionComp inPerms={inPerms} willShows={willShows} onlyAccess={onlyAccess} funtions={setPermisions} objCss={objCss} />
                                }                                    {ready && <button className={willShows !== 'color-black' && "color-black"} onClick={(e) => { e.preventDefault; createUser() }}>
                                    Crear
                                </button>}
                            </div>
                        </form>}
                </>

            }

        </>
    )
}
export default FormularioAppUser