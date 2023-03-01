import StringsObj, { UserObj } from "@/engine/content"
import MiddlewareSelector from "@/middleware/askSelector"
import StylesObj from "@/styles/stylesObj"
import { useEffect, useState } from "react"
import { Socket } from "@/middleware/routes/connect/socket/socketOn"
import { ModeloVehiculo } from "@/bioApp/models/modeloVehiculo"
import FormularioVehiculoData from "./formularioVehiculoData"
import FormularioVehiculoOperativeData from "./formularioVehiculoOperativeData"


const socket = Socket
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
let resId = 0

const FormularioVehiculo = (props) => {

    const { setWillShow = console.log, userModel = ModeloVehiculo, setUserData = console.log, userData = userStructure, setReqState = console.log, reqState = { reqId: Number(), state: false, peticion: '', type: ''  ,inList: [] }, setPopUp = console.log, objStrings = objStringsInit, objCss = objCssInit, willShow = console.log, showed = 'inicio' } = props
    const [formSelected, setFormSelected] = useState({ selected: 'none', })
    const [userFullModel, setuserFullModel] = useState(userModel)
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
        const res = MiddlewareSelector({
            ask: `sendNewCar`, data: { vehiculo: userFullModel, id: userData.id }
        })
        resId = res
    }
    useEffect(() => {
        socket.on("bioApp", (msg) => {
            const actionTodo = msg.actionTodo
            const Data = msg.dataIn
            switch (actionTodo) {
                case 'dataRes-contactData':
                    if (parseInt(msg.resId) === parseInt(resId)) {
                        let lastDataFull = userFullModel
                        lastDataFull.datosLegales = msg.body
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
                        lastDataFull.datosLegales = msg.body
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
                case 'dataRes-allVehiculoData':
                    if (parseInt(msg.resId) === parseInt(resId)) {
                        setSending(false)
/*                         setWillShow('')
 */                    }
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
                    {formSelected.selected === 'none' ?
                        <div >

                            <h1 className="capitalize">{objStrings.companies.dataForm}</h1>
                            <div className={objCss.companies.dataSelector}>
                                <div className={objCss.companies.selectorBox} onClick={(e) => { e.preventDefault(); setFormSelected({ ...formSelected, selected: 'personalData' }) }}>DATOS VEHICULO</div>
                                <div className={objCss.companies.selectorBox} onClick={(e) => { e.preventDefault(); setFormSelected({ ...formSelected, selected: 'contactData' }) }}>INFORMACION OPERATIVA</div>
                                {
                                    newUserData.contactData || newUserData.personalData ?
                                        <>
                                            <button className="color-black" onClick={(e) => { e.preventDefault(); applyData(); }}>CREAR VEHICULO</button>
                                        </> : <></>
                                }
                            </div>

                        </div>
                        :
                        <div >
                            {
                                formSelected.selected === 'personalData' && <><FormularioVehiculoData sendData={sendData} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} userFullModel={userFullModel} objCss={objCss} objStrings={objStrings} /></>

                            }
                            {
                                formSelected.selected === 'contactData' && <><FormularioVehiculoOperativeData userFullModel={userFullModel} sendData={sendData} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} objCss={objCss} objStrings={objStrings} /> </>
                            }
                            <br />

                            <p onClick={(e) => { e.preventDefault(); setFormSelected({ ...formSelected, selected: 'none' }) }}>VOLVER</p>
                        </div>
                    }
                </>
            }
        </>
    )
}
export default FormularioVehiculo