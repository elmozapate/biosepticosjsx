import ModeloUsuario, { ObjPermisions } from "@/bioApp/models/modelosUsuario"
import StringsObj, { UserObj } from "@/engine/content"
import MiddlewareSelector from "@/middleware/askSelector"
import StylesObj from "@/styles/stylesObj"
import { useEffect, useState } from "react"
import { Socket } from "@/middleware/routes/connect/socket/socketOn"
import { ModeloBiosepticos } from "@/bioApp/models/modeloBiosepticos"
import SelectComp from "@/components/commons/selector"
import ObjRutaIndividual from "@/bioApp/models/modeloRutaIndividual"
import { ModeloVehiculo } from "@/bioApp/models/modeloVehiculo"
let cheking = ObjPermisions
const socket = Socket
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
let resId = 0

const FormularioCrearRutaVehiculo = (props) => {

    const { back = console.log, vehiculo = ModeloVehiculo, rutaSelected = {}, modeloBiosepticos = ModeloBiosepticos, userModel = ModeloUsuario(), setWillShow = console.log, inAsk = 'newUser', userType = '', willShows = '', onlyAccess = [{ type: '', perms: {} }], sinPermisos = false, userData = userStructure, setReqState = console.log, reqState = { reqId: Number(), state: false, peticion: '', type: ''  ,inList: [] }, setPopUp = console.log, objStrings = objStringsInit, objCss = objCssInit, willShow = console.log, showed = 'inicio' } = props
    const [newUserData, setNewUserData] = useState({
        conductor: '',
        auxiliar: '',
        idAuxiliar: '',
        idConductor: ''
    })
    const IdsEqipo = ((() => {
        let losConductores = { conductores: [], auxiliares: [] }
        modeloBiosepticos.users.map((key, i) => {
            if (key.app.type === 'conductores') {
                losConductores.conductores.push(key.id)
            }
            if (key.app.type === 'auxiliares') {
                losConductores.auxiliares.push(key.id)
            }
        })
        return losConductores
    }))
    const equipos = IdsEqipo()
    const [conductores, setConductores] = useState((() => {
        let losConductores = []
        modeloBiosepticos.users.map((key, i) => {
            if (key.app.type === 'conductores') {
                losConductores.push(key.datosPersonales.nombre)
            }
        })
        return losConductores
    }))
    const [auxiliares, setAuxiliares] = useState((() => {
        let losAuxiliares = []
        modeloBiosepticos.users.map((key, i) => {
            if (key.app.type === 'auxiliares') {
                losAuxiliares.push(key.datosPersonales.nombre)
            }
        })
        return losAuxiliares
    }))
    const [sending, setSending] = useState(false)
    const [ready, setReady] = useState(false)
    const handleCreate = (e) => {
        e.preventDefault()
        const value = e.target.value
        const id = e.target.id
        if (id === 'conductor') {
            conductores.map((key, i) => {
                if (key === value) {
                    setNewUserData({
                        ...newUserData,
                        [id]: value,
                        idConductor: equipos.conductores[i]
                    })
                }
            })
        }
        if (id === 'auxiliar') {
            auxiliares.map((key, i) => {
                if (key === value) {
                    setNewUserData({
                        ...newUserData,
                        [id]: value,
                        idAuxiliar: equipos.auxiliares[i]
                    })
                }
            })
        }

    }
    const continueCreating = (value) => {
        setSending(true)
        let newRutas = []
        rutaSelected.dias.map((key, i) => {
            const fechaIn = `${key}-${rutaSelected.mes + 1}-${rutaSelected.ano}`
            newRutas.push(ObjRutaIndividual(vehiculo.id, { conductor: value.idConductor, auxiliar: value.idAuxiliar }, fechaIn, 'moet'))
        })
        crearlasRutas(newRutas);
    }
    const crearlasRutas = (newRutas) => {
        const res = MiddlewareSelector({
            ask: 'crearRutaVehiculo', data: newRutas
        })
        resId = res
    }
    useEffect(() => {
        socket.on("bioApp", (msg) => {
            const actionTodo = msg.actionTodo
            const Data = msg.dataIn
            switch (actionTodo) {
                case 'newVehiculoShedule':
                    if (parseInt(msg.resId) === parseInt(resId)) {
                        setSending(false)
                        back(true)
                    }
                    break;
                default:
                    break;
            }
        })
    }, [])
    useEffect(() => {
        newUserData.conductor.length > 3 ? setReady(true) : setReady(false)
    }, [newUserData])

    return (
        <>
            {

                <>

                    {sending ? <>ENVIANDO::::::</> :
                        <form className="form-center">
                            <div className="form-default formInput">
                                <div className="colFlex">
                                    <h1>ELIJA EL EQUIPO DE TRABAJO</h1>

                                    CONDUCTOR
                                    <SelectComp item={'conductor'} items={conductores} funtions={handleCreate} id={'conductor'} required />

                                    AUXILIAR

                                    <SelectComp item={'auxiliar'} items={auxiliares} funtions={handleCreate} id={'auxiliar'} required />

                                    {ready && <button className={willShows !== 'color-black' && "color-black"} onClick={(e) => { e.preventDefault; continueCreating(newUserData) }}>
                                        CREAR RUTA
                                    </button>
                                    }
                                </div>
                            </div>
                        </form>}
                </>

            }

        </>
    )
}
export default FormularioCrearRutaVehiculo