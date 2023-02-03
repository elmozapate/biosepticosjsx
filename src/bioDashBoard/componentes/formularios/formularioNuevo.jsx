import ModeloUsuario, { ObjPermisions } from "@/bioApp/models/modelosUsuario"
import InputComp from "@/components/commons/input"
import StringsObj, { UserObj } from "@/engine/content"
import MiddlewareSelector from "@/middleware/askSelector"
import StylesObj from "@/styles/stylesObj"
import { useEffect, useState } from "react"
import EnvM from "@/envMachetero"
import io from "socket.io-client"
import FormularioPersonalData from "./formularioPersonalData"
import FormularioContactData from "./formularioContactData"

const envM = EnvM()

const socket = io(envM.hostBack)
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
let resId = 0

const FormularioNuevo = (props) => {

    const { setUserData = console.log, userData = userStructure, objStrings = objStringsInit, objCss = objCssInit, willShow = console.log, showed = 'inicio' } = props
    const [firstTime, setFirstTime] = useState(true)
    const [formSelected, setFormSelected] = useState({ selected: 'none', })
    const [userFullModel, setuserFullModel] = useState(ModeloUsuario())
    const [sending, setSending] = useState(false)
    const [ready, setReady] = useState(false)
    const [newUserData, setNewUserData] = useState({
        personalData: false,
        contactData: false,
    })
    const sendData = (type, personalObj) => {
        setSending(true)
        const res = MiddlewareSelector({
            ask: `sendData-${type}`, data: personalObj
        })
        resId = res

    }
    const applyData = () => {
        setSending(true)
        let defaultValue = ModeloUsuario()
        defaultValue = {
            ...defaultValue,
            ...userFullModel,
            id: userData.id,
            userObj: {
                ...userData,
                dataRequired: false
            },
            app: {
                ...defaultValue.app,
                permisions: userData.permisions,
                email: userFullModel.datosContacto.correoElectronico,
                user: userData.nombre,
                password: userData.password,
                data: { personal: true, contacto: true }
            }
        }
        const res = MiddlewareSelector({
            ask: `sendData-all`, data: defaultValue
        })
        resId = res
    }
    useEffect(() => {
        setTimeout(() => {
            setFirstTime(false)
        }, 3000);
        socket.on("bioApp", (msg) => {
            const actionTodo = msg.actionTodo
            const Data = msg.dataIn
            switch (actionTodo) {
                case 'dataRes-contactData':
                    if (parseInt(msg.resId) === parseInt(resId)) {
                        let lastDataFull = userFullModel
                        lastDataFull.datosContacto = msg.body
                        setuserFullModel({
                            ...userFullModel,
                            ...lastDataFull
                        })
                        let lastData = newUserData
                        lastData.contactData = true
                        setNewUserData({ ...newUserData, ...lastData })
                        setFormSelected({ selected: 'none', })
                        setSending(false)
                    }
                    break;
                case 'dataRes-personalData':
                    if (parseInt(msg.resId) === parseInt(resId)) {
                        let lastDataFull = userFullModel
                        lastDataFull.datosPersonales = msg.body
                        setuserFullModel({
                            ...userFullModel,
                            ...lastDataFull
                        })
                        let lastData = newUserData
                        lastData.personalData = true
                        setNewUserData({ ...newUserData, ...lastData })
                        setFormSelected({ selected: 'none', })
                        setSending(false)
                    }
                    break;
                case 'dataRes-allUserData':
                    if (parseInt(msg.resId) === parseInt(resId)) {
                        setUserData({
                            ...userData,
                            ...msg.body
                        })
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
            <div className={objCss.companies.main}>
                {
                    firstTime ?
                        <><p>{`${objStrings.companies.firsTime_0} ${userData.nombre} ${objStrings.companies.firsTime_1}`}</p></>
                        :
                        <>
                            {formSelected.selected === 'none' ?
                                <div className={objCss.companies.dataSelectorContainer}>

                                    <h1 className="capitalize">{objStrings.companies.dataForm}</h1>
                                    <div className={objCss.companies.dataSelector}>
                                        <div className={objCss.companies.selectorBox} onClick={(e) => { e.preventDefault(); setFormSelected({ ...formSelected, selected: 'personalData' }) }}>DATOS PERSONALES</div>
                                        <div className={objCss.companies.selectorBox} onClick={(e) => { e.preventDefault(); setFormSelected({ ...formSelected, selected: 'contactData' }) }}>INFORMACION DE CONTACTO</div>
                                    </div>
                                    {
                                        newUserData.contactData && newUserData.personalData &&
                                        <>
                                            <button onClick={(e) => { e.preventDefault(); applyData(); }}>ENVIAR DATOS PERSONALES</button>
                                        </>
                                    }
                                </div>
                                :
                                <div className={objCss.companies.dataFormContainer}>
                                    {
                                        formSelected.selected === 'personalData' && <><FormularioPersonalData sendData={sendData} userData={userData} objCss={objCss} objStrings={objStrings} /></>

                                    }
                                    {
                                        formSelected.selected === 'contactData' && <><FormularioContactData sendData={sendData} userData={userData} objCss={objCss} objStrings={objStrings} /> </>

                                    }
                                    <br />

                                    <p onClick={(e) => { e.preventDefault(); setFormSelected({ ...formSelected, selected: 'none' }) }}>VOLVER</p>
                                </div>
                            }
                        </>
                }
            </div>
        </>
    )
}
export default FormularioNuevo
/* sending ?
<>ENVIANDO::::::</>
:
<form className={objCss.companies.dataForm} >
    <br />
    <InputComp type={'text'} id={'nombre'} value={newUserData.nombre} placeHolder={'Nombre de Usuario'} funtions={handleCreate} required />
    <br />
    {ready && <button onClick={(e) => { e.preventDefault; createUser() }}>
        Crear
    </button>}
</form> */