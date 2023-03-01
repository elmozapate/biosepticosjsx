import ModeloUsuario, { EmpresaObj } from "@/bioApp/models/modelosUsuario"
import StringsObj, { UserObj } from "@/engine/content"
import MiddlewareSelector from "@/middleware/askSelector"
import StylesObj from "@/styles/stylesObj"
import { useEffect, useState } from "react"
import { Socket } from "@/middleware/routes/connect/socket/socketOn"
import FormularioDatosEmpresa from "./formularioDatosEmpresa"
import FormularioLegalData from "./formularioLegalData"
const socket = Socket
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
let resId = 0

const FormularioCrearEmpresa = (props) => {

    const { back = console.log, firstTimeIn = false, userModel = ModeloUsuario(), setUserData = console.log, userData = userStructure, setReqState = console.log, reqState = { reqId: Number(), state: false, peticion: '', type: ''  ,inList: [] }, setPopUp = console.log, objStrings = objStringsInit, objCss = objCssInit, willShow = console.log, showed = 'inicio' } = props
    const [firstTime, setFirstTime] = useState(firstTimeIn ? true : false)
    const [formSelected, setFormSelected] = useState({ selected: 'none', })
    const [userFullModel, setuserFullModel] = useState(EmpresaObj())
    const [sending, setSending] = useState(false)
    const [ready, setReady] = useState(false)
    const [newUserData, setNewUserData] = useState({
        personalData: false,
        legalData: false,
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
        let defaultValue = EmpresaObj()
        defaultValue = {
            ...defaultValue,
            ...userFullModel,
            legal: {
                ...userFullModel.legal,
                representante: userModel,
            },
        }
        const res = MiddlewareSelector({
            ask: `sendData-all-Empresas`, data: defaultValue
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
                        lastDataFull.legal = msg.body
                        setuserFullModel({
                            ...userFullModel,
                            ...lastDataFull
                        })
                        let lastData = newUserData
                        lastData.legalData = true
                        setNewUserData({ ...newUserData, ...lastData })
                        setFormSelected({ selected: 'none', })
                        setSending(false)
                    }
                    break;
                case 'dataRes-personalData':
                    if (parseInt(msg.resId) === parseInt(resId)) {
                        let lastDataFull = userFullModel
                        lastDataFull.contact = msg.body
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
                            type: userData.type === 'createUserData' ? 'newUser' : userData.type,
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

                        <><p><h2>{`${objStrings.companies.firsTime_0} `} : {` ${userData.nombre}`} </h2> {`${objStrings.companies.firsTime_1}`}</p></>

                        :
                        <>
                            {formSelected.selected === 'none' ?
                                <div className={objCss.companies.dataSelectorContainer}>

                                    <h1 className="capitalize">{objStrings.companies.dataForm}</h1>
                                    <div className={objCss.companies.dataSelector}>
                                        <div className={objCss.companies.selectorBox} onClick={(e) => { e.preventDefault(); setFormSelected({ ...formSelected, selected: 'personalData' }) }}>DATOS EMPRESA</div>
                                        <div className={objCss.companies.selectorBox} onClick={(e) => { e.preventDefault(); setFormSelected({ ...formSelected, selected: 'contactData' }) }}>INFORMACION LEGAL</div>
                                    </div>
                                    {
                                        newUserData.personalData && newUserData.legalData &&
                                        <>
                                            <button onClick={(e) => { e.preventDefault(); applyData(); }}>ENVIAR DATOS PERSONALES</button>
                                        </>
                                    }
                                    {
                                        !firstTimeIn && <button onClick={(e) => { e.preventDefault(); back(false) }}>Volver</button>
                                    }
                                </div>
                                :
                                <div className={objCss.companies.dataFormContainer}>
                                    {
                                        formSelected.selected === 'personalData' && <><FormularioDatosEmpresa userFullModel={userFullModel} sendData={sendData} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} objCss={objCss} objStrings={objStrings} /></>

                                    }
                                    {
                                        formSelected.selected === 'contactData' && <><FormularioLegalData sendData={sendData} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} objCss={objCss} objStrings={objStrings} userFullModel={userFullModel} /> </>

                                    }
                                    <br />
                                    {
                                        !firstTimeIn && <button onClick={(e) => { e.preventDefault(); back(false) }}>Volver</button>
                                    }

                                    <p onClick={(e) => { e.preventDefault(); setFormSelected({ ...formSelected, selected: 'none' }) }}>VOLVER</p>
                                </div>
                            }
                        </>
                }
            </div>
        </>
    )
}
export default FormularioCrearEmpresa
/* sending ?
<>ENVIANDO::::::</>
:
<form className={objCss.companies.dataForm} >
    <br />
    <InputComp type={'text'} id={'nombre'} value={newUserData.nombre} placeholder={'Nombre de Usuario'} funtions={handleCreate} required />
    <br />
    {ready && <button onClick={(e) => { e.preventDefault; createUser() }}>
        Crear
    </button>}
</form> */