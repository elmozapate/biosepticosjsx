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

    const { inOperativo = {
        active: false,
        vehiculo: {},
        inMode: ''
    }, setInOperativo = console.log, setModoCrearVehiculo = {
        mode: ''
    }, diasDeVehiculoMes = [], setRutaSelected = console.log, back = console.log, vehiculo = ModeloVehiculo, rutaSelected = {
        dias: []/* newDias() */,
        stage: 0,
        mes: parseInt(new Date().toLocaleDateString().split('/')[1]) - 1,
        ano: parseInt(new Date().toLocaleDateString().split('/')[2])
    }, modeloBiosepticos = ModeloBiosepticos, userModel = ModeloUsuario(), setWillShow = console.log, inAsk = 'newUser', userType = '', willShows = '', onlyAccess = [{ type: '', perms: {} }], sinPermisos = false, userData = userStructure, setReqState = console.log, reqState = { reqId: Number(), state: false, peticion: '', type: '', inList: [] }, setPopUp = console.log, objStrings = objStringsInit, objCss = objCssInit, willShow = console.log, showed = 'inicio' } = props
    const [newUserData, setNewUserData] = useState({
        conductor: '',
        auxiliar: '',
        idAuxiliar: '',
        idConductor: ''
    })
    const IdsEqipo = ((() => {
        let losConductores = { conductores: [], auxiliares: [] }
        let ocupedUsers = []

        rutaSelected.dias.map((keyR, i) => {
            let diasInO = false
            diasDeVehiculoMes.map((keyO, iO) => {
                if (parseInt(keyR) === parseInt(keyO)) {
                    diasInO = true
                }
            })
            !diasInO && modeloBiosepticos.rutasIndividuales.map((key, i) => {
                let fechaComp = [keyR, rutaSelected.mes + 1, rutaSelected.ano]
                const fechita = key.fecha.split('-')
                if (parseInt(fechita[0]) === parseInt(fechaComp[0]) && parseInt(fechita[1]) === parseInt(fechaComp[1]) && parseInt(fechita[2]) === parseInt(fechaComp[2])) {
                    key.encargados.conductor !== '' && ocupedUsers.push({
                        conductores: key.encargados.conductor,
                        auxiliares: key.encargados.auxiliar,
                        dia: keyR,
                        ruta: key.id
                    })
                }
            })
        })

        modeloBiosepticos.users.map((key, i) => {
            if (key.app.type === 'conductores') {
                let isOcuped = false
                ocupedUsers.map((keyO, iO) => {
                    if (key.id === keyO.conductores) {
                        console.log('esta aca conductor', keyO.dia);
                        isOcuped = true
                    }
                })
                !isOcuped && losConductores.conductores.push(key.id)
            }
            if (key.app.type === 'auxiliares') {
                let isOcuped = false
                ocupedUsers.map((keyO, iO) => {
                    if (key.id === keyO.auxiliares) {
                        console.log('esta aca auxiliar', keyO.dia);
                        isOcuped = true
                    }
                })
                !isOcuped && losConductores.auxiliares.push(key.id)
            }
        })
        console.log(losConductores);

        return losConductores
    }))
    const equipos = IdsEqipo()
    const [conductores, setConductores] = useState((() => {
        let losConductores = []
        modeloBiosepticos.users.map((key, i) => {
            equipos.conductores.map((keyC, iC) => {
                if (keyC === key.id) {
                    if (key.app.type === 'conductores') {
                        losConductores.push(key.datosPersonales.nombre)
                    }
                }
            })

        })
        return losConductores
    }))
    const [auxiliares, setAuxiliares] = useState((() => {
        let losAuxiliares = []
        modeloBiosepticos.users.map((key, i) => {
            equipos.auxiliares.map((keyC, iC) => {
                if (keyC === key.id) {
                    if (key.app.type === 'auxiliares') {
                        losAuxiliares.push(key.datosPersonales.nombre)
                    }
                }
            })

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
            let yaReq = false
            diasDeVehiculoMes.map((keyO, iO) => {
                if (keyO === key) {
                    yaReq = true
                }
            })
            if (!yaReq) {
                const fechaIn = `${key}-${rutaSelected.mes + 1}-${rutaSelected.ano}`
                newRutas.push(ObjRutaIndividual(vehiculo.id, { conductor: value.idConductor, auxiliar: value.idAuxiliar }, fechaIn, 'moet'))
            }
        })
        crearlasRutas(newRutas);
    }
    const crearlasRutas = (newRutas) => {

        const res = MiddlewareSelector({
            ask: 'crearRutaVehiculo', data: newRutas
        })
        resId = res
        let newList = reqState.inList
        newList.push({
            id: res,
            tipo: 'crearRutaVehiculo'
        })
        setReqState({
            ...reqState,
            reqId: res, state: true, peticion: 'crearRutaVehiculo', type: '', inList: newList
        })
    }
    useEffect(() => {
        socket.on("bioApp", (msg) => {
            const actionTodo = msg.actionTodo
            const Data = msg.dataIn
            switch (actionTodo) {
                case 'dataRes-newVehiculoShedule':
                    if (parseInt(msg.resId) === parseInt(resId)) {
                        setRutaSelected({
                            modo: '',
                            semana: -1,
                            dias: []/* newDias() */,
                            stage: 0,
                            mes: parseInt(new Date().toLocaleDateString().split('/')[1]) - 1,
                            ano: parseInt(new Date().toLocaleDateString().split('/')[2])
                        })
                        setInOperativo({
                            ...inOperativo,
                            inMode: 'ver'
                        })
                        setTimeout(() => {
                            setModoCrearVehiculo({
                                mode: ''
                            })
                        }, 1000);
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
    useEffect(() => {
        IdsEqipo()
        let losConductores = []
        let losAuxiliares = []
        modeloBiosepticos.users.map((key, i) => {
            equipos.conductores.map((keyC, iC) => {
                if (keyC === key.id) {
                    if (key.app.type === 'conductores') {
                        losConductores.push(key.datosPersonales.nombre)
                    }
                }
            })
            equipos.auxiliares.map((keyC, iC) => {
                if (keyC === key.id) {
                    if (key.app.type === 'auxiliares') {
                        losAuxiliares.push(key.datosPersonales.nombre)
                    }
                }
            })

        })
        setConductores(losConductores)
        setAuxiliares(losAuxiliares)
    }, [diasDeVehiculoMes, rutaSelected])

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