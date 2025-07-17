import { InterfazRegistro } from "@/auth/interfaz"
import { useEffect, useState } from "react"
import AbsoluteBox from "@/components/containers/absoluteBox"
import MenuBar from "@/components/menuBar/menuBar"
import { UserObj } from "@/engine/content"
import PageIndex from "@/pages/homePage/pageIndex"
import Declaraciones from "./declaraciones"
import { PopUpObj } from "@/engine/content";
import { LoginAuth } from "@/auth/login"
import { RegisterAuth } from "@/auth/register"
import CentroDeLogistica from "@/bioApp/logistica/centroDeLogistica"
import DashBoard from "@/bioDashBoard/dashBoard"
import EnvM from "@/envMachetero"
import MiddlewareSelector from "@/middleware/askSelector"
import ModeloUsuario, { EmpresaObj } from "@/bioApp/models/modelosUsuario"
import CentroDeEmpresas from "@/bioApp/empresas/centroDeEmpresas"
import FormularioNuevo from "@/bioDashBoard/componentes/formularios/formularioNuevo"
import { ObjPermisos } from "@/bioApp/models/modelosPermisos"
import { Socket, SocketOn } from "@/middleware/routes/connect/socket/socketOn"
import CentroDeVendedores from "@/bioApp/vendedores/centroDeVendedores"
import { ModeloBiosepticos } from "@/bioApp/models/modeloBiosepticos"
import ReqComponent from "@/components/containers/reqComponent"
import CentroDeBiosepticos from "@/bioApp/logistica/centroDeBiosepticos"
const envM = EnvM()
const plantillaUSuario = ModeloUsuario()
const socket = Socket
const popUpStructure = PopUpObj()
const objCssInit = Declaraciones({ language: 'spanish', type: 'styles' }).styles
const objStringsInit = Declaraciones({ language: 'spanish', type: 'text' }).text
const userStructure = UserObj()
let res = 0
let userActual = userStructure
let modelActual = plantillaUSuario

const UserCheck = (props) => {
    const { usersArray = [], setUsersArray = [], onMobil = { state: false, device: { iPhone: false, android: false, tablet: false, phone: false, mobile: false } } } = props
    const [reqState, setReqState] = useState({
        reqId: Number(),
        state: false,
        peticion: '',
        type: '',
        inList: []
    })
    const [userData, setUserName] = useState(userStructure)
    const [userModel, setUserModel] = useState(plantillaUSuario)
    const [empresas, setEmpresas] = useState({ array: [] })
    const [dataBioseptico, setDataBioseptico] = useState({
        servicios: [],
        rutas: [],
        obras: [],
        rutasIndividuales: []
    })
    const [vehiculos, setVehiculos] = useState({ array: [] })
    const [creatingObra, setCreatingObra] = useState(false)
    const [obras, setObras] = useState({ array: [] })
    const [rutas, setRutas] = useState({ array: [] })
    const [servicios, setServicios] = useState({ array: [] })
    const [misEmpresasRes, setMisEmpresasRes] = useState({ array: [], obras: [] })
    const [misObras, setMisObras] = useState({ array: [] })
    const [misServicios, setMisServicios] = useState({ array: [] })
    const [users, setUsers] = useState({ array: [] })
    const [usersAll, setUsersAll] = useState({ array: [], arrayAppUsers: [] })
    const [objCss, setObjCss] = useState(objCssInit)
    const [inSending, setInSending] = useState(false)
    const [startCreating, setStartCreating] = useState(false)
    const [popUp, setPopUp] = useState(popUpStructure)
    const [modeloBiosepticos, setModeloBiosepticos] = useState(ModeloBiosepticos)
    const [objStrings, setObjStrings] = useState(objStringsInit)
    const [misEmpresas, setMisEmpresas] = useState({
        seleccionada: '',
        empresas: misEmpresasRes.array,
        itemSelectioned: EmpresaObj(),
    })
    const changeLanguage = (language = 'spanish') => {
        const newText = Declaraciones({ language: language, type: 'text' }).text
        setObjStrings(newText)
    }
    const setUserData = (e) => {
        e.preventDefault()
        const id = e.target.id; const value = e.target.value
        let oldData = userData
        oldData[id] = value;
        setUserName({ ...oldData })
        userActual = ({ ...oldData })

    }
    const sendLogin = () => {
        const req = LoginAuth(userData, usersArray)
        res = req
        let newInList = reqState.inList
        let isSend = false
        newInList.map((key, i) => {
            if (key.id === req) {
                isSend = true
            }
        })
        if (!isSend) {
            newInList.push({ id: req, valor: 'login' })
            setReqState({
                ...reqState,
                state: true,
                reqId: reqState.reqId !== 0 && reqState.reqId !== '' ? reqState.reqId : req,
                peticion: reqState.peticion !== '' ? reqState.peticion : 'login',
                inList: newInList
            })
        }

    }
    const sendData = () => {
        const req = RegisterAuth(userData, usersArray)
        res = req
        let newInList = reqState.inList
        let isSend = false
        newInList.map((key, i) => {
            if (key.id === req) {
                isSend = true
            }
        })
        if (!isSend) {
            newInList.push({ id: req, valor: 'login' })
            setReqState({
                ...reqState,
                state: true,
                reqId: reqState.reqId !== 0 && reqState.reqId !== '' ? reqState.reqId : req,
                peticion: reqState.peticion !== '' ? reqState.peticion : 'login',
                inList: newInList
            })
        }
        if (res === 0) {
            setUserName({
                ...userData, status: 'registered', permisions: {
                    ...userData.permisions,
                    configuracion: true
                }
            })
            userActual = ({
                ...userData, status: 'registered', permisions: {
                    ...userData.permisions,
                    configuracion: true
                }
            })

            let newArray = usersArray.array
            newArray.push({
                ...userData, status: 'registered', permisions: {
                    ...userData.permisions,
                    configuracion: true
                }
            })
            setUsersArray({ ...usersArray, array: newArray })
            setTimeout(() => {
                setPopUp(popUpStructure)
            }, 500);
        } else {
            window.alert('Nombre de usuario Existente !!!')
        }



    }

    const changePassword = () => {
        const req = MiddlewareSelector({ ask: 'changePassword', data: userData })
        res = req
        let newInList = reqState.inList
        let isSend = false
        newInList.map((key, i) => {
            if (key.id === req) {
                isSend = true
            }
        })
        if (!isSend) {
            newInList.push({ id: req, valor: 'changePassword' })
            setReqState({
                ...reqState,
                state: true,
                reqId: reqState.reqId !== 0 && reqState.reqId !== '' ? reqState.reqId : req,
                peticion: reqState.peticion !== '' ? reqState.peticion : 'changePassword',
                inList: newInList
            })
        }
    }
    const sendNewServicio = (servicio) => {
        const req = MiddlewareSelector({ ask: 'setServicio', data: servicio, id: userData.id })
        res = req
        let newInList = reqState.inList
        let isSend = false
        newInList.map((key, i) => {
            if (key.id === req) {
                isSend = true
            }
        })
        if (!isSend) {
            newInList.push({ id: req, valor: 'setServicio' })
            setReqState({
                ...reqState,
                state: true,
                reqId: reqState.reqId !== 0 && reqState.reqId !== '' ? reqState.reqId : req,
                peticion: reqState.peticion !== '' ? reqState.peticion : 'setServicio',
                inList: newInList
            })
        }
    }
    const PedirObras = (data) => {
        const req = MiddlewareSelector({ ask: 'askObras', data: data })
        res = req
        /*  let newInList = reqState.inList
         let isSend = false
         newInList.map((key, i) => {
             if (key.id === req) {
                 isSend = true
             }
         })
         if (!isSend) {
             newInList.push({ id: req, valor: 'askObras' })
             setReqState({
                 ...reqState,
                 state: true,
                 reqId: reqState.reqId !== 0 && reqState.reqId !== '' ? reqState.reqId : req,
                 peticion: reqState.peticion !== '' ? reqState.peticion : 'askObras',
                 inList: newInList
             })
         } */
    }
    const PedirBiosepticos = (data) => {
        const req = MiddlewareSelector({ ask: 'askBioseptico', data: data })
        res = req
        let newInList = reqState.inList
        let isSend = false
        newInList.map((key, i) => {
            if (key.id === req) {
                isSend = true
            }
        })
        if (!isSend) {
            newInList.push({ id: req, valor: 'askBioseptico' })
            setReqState({
                ...reqState,
                state: true,
                reqId: reqState.reqId !== 0 && reqState.reqId !== '' ? reqState.reqId : req,
                peticion: reqState.peticion !== '' ? reqState.peticion : 'askBioseptico',
                inList: newInList
            })
        }
    }
    const PedirVehiculos = (data) => {
        const req = MiddlewareSelector({ ask: 'askVehiculos', data: data })
        res = req
        let newInList = reqState.inList
        let isSend = false
        newInList.map((key, i) => {
            if (key.id === req) {
                isSend = true
            }
        })
        if (!isSend) {
            newInList.push({ id: req, valor: 'askVehiculos' })
            setReqState({
                ...reqState,
                state: true,
                reqId: reqState.reqId !== 0 && reqState.reqId !== '' ? reqState.reqId : req,
                peticion: reqState.peticion !== '' ? reqState.peticion : 'askVehiculos',
                inList: newInList
            })
        }
    }
    const cleanUserData = () => {
        setUserName({ ...userStructure })
        userActual = ({
            ...userStructure,
        })
        window.location.reload()
    }
    const pedirEmpresas = (userIn = userData) => {
        const req = MiddlewareSelector({ ask: 'pedirEmpresas', data: userIn })
        res = req
        let newInList = reqState.inList
        let isSend = false
        newInList.map((key, i) => {
            if (key.id === req) {
                isSend = true
            }
        })
        if (!isSend) {
            newInList.push({ id: req, valor: 'pedirEmpresas' })
            setReqState({
                ...reqState,
                state: true,
                reqId: reqState.reqId !== 0 && reqState.reqId !== '' ? reqState.reqId : req,
                peticion: reqState.peticion !== '' ? reqState.peticion : 'pedirEmpresas',
                inList: newInList
            })
        }
    }
    const pedirMisEmpresas = (inEmpesas = false, model = userModel.app.relationed.empresas) => {
        const req = MiddlewareSelector({ ask: 'askCompanies', data: model })
        res = req
        if (!inEmpesas) {
            let newInList = reqState.inList
            let isSend = false
            newInList.map((key, i) => {
                if (key.id === req) {
                    isSend = true
                }
            })
            if (!isSend) {
                newInList.push({ id: req, valor: 'askCompanies' })
                setReqState({
                    ...reqState,
                    state: true,
                    reqId: reqState.reqId !== 0 && reqState.reqId !== '' ? reqState.reqId : req,
                    peticion: reqState.peticion !== '' ? reqState.peticion : 'askCompanies',
                    inList: newInList
                })
            }
        }
        return req
    }
    const pedirMisServicios = (model = userModel.app.relationed.empresas) => {
        if (userModel.app.relationed.empresas.length > 0) {
            const req = MiddlewareSelector({ ask: 'askServicios', data: model })
            res = req

            /*    let newInList = reqState.inList
               let isSend = false
               newInList.map((key, i) => {
                   if (key.id === req) {
                       isSend = true
                   }
               })
               if (!isSend) {
                   newInList.push({ id: req, valor: 'askServicios' })
                   setReqState({
                       ...reqState,
                       state: true,
                       reqId: reqState.reqId !== 0 && reqState.reqId !== '' ? reqState.reqId : req,
                       peticion: reqState.peticion !== '' ? reqState.peticion : 'askServicios',
                       inList: newInList
                   })
               }*/
        }


    }
    const setUserDataApp = (type, value) => {
        if (type === 'changeType') {
            setUserName({ ...userData, type: value })
            userActual = ({ ...userData, type: value })
        } else {
            const funtions = { setUserData: setUserData, sendData: sendData, setPopUp: setPopUp, sendLogin: sendLogin }
            const resPopUp = InterfazRegistro(type, funtions)
            setPopUp(resPopUp)

        }

    }
    const actualizarEstado = (data) => {
        const req = MiddlewareSelector({ ask: 'actualizarEstado', data: data })
        res = req
        let newInList = reqState.inList
        let isSend = false
        newInList.map((key, i) => {
            if (key.id === req) {
                isSend = true
            }
        })
        if (!isSend) {
            newInList.push({ id: req, valor: 'actualizarEstado' })
            setReqState({
                ...reqState,
                state: true,
                reqId: reqState.reqId !== 0 && reqState.reqId !== '' ? reqState.reqId : req,
                peticion: reqState.peticion !== '' ? reqState.peticion : 'actualizarEstado',
                inList: newInList
            })
        }
    }
    const resMisEmpresas = () => {
        const req = MiddlewareSelector({ ask: 'getMisEmpresasVendedor', id: userData.id })
        res = req
        let newInList = reqState.inList
        let isSend = false
        newInList.map((key, i) => {
            if (key.id === req) {
                isSend = true
            }
        })
        if (!isSend) {
            newInList.push({ id: req, valor: 'getMisEmpresasVendedor' })
            setReqState({
                ...reqState,
                state: true,
                reqId: reqState.reqId !== 0 && reqState.reqId !== '' ? reqState.reqId : req,
                peticion: reqState.peticion !== '' ? reqState.peticion : 'getMisEmpresasVendedor',
                inList: newInList
            })
        }
    }
    const socketDo = (msg) => {
        const actionTodo = msg.actionTodo
        if (actionTodo === 'pedirEmpresasRes' && parseInt(res) === parseInt(msg.resId)) {
            if (msg.res === 'ok') {
                setEmpresas({ ...empresas, array: msg.empresas })
            }
        }

        if (actionTodo === 'askBiosepticosRes' && parseInt(res) === parseInt(msg.resId)) {
            if (msg.res === 'ok') {
                setModeloBiosepticos({ ...modeloBiosepticos, users: msg.biosepticos })
            }
        }
        if (actionTodo === 'dataRes-askVehiculos' && parseInt(res) === parseInt(msg.resId)) {
            if (msg.res === 'ok') {
                setVehiculos({ ...vehiculos, array: msg.vehiculos })
            }
        }

        if (actionTodo === 'calendarioRes') {
            if (msg.res === 'ok') {
                setModeloBiosepticos({ ...modeloBiosepticos, calendario: msg.calendario })
            }
        }
        if (actionTodo === 'dataRes-allServiciosData' /* && parseInt(res) === parseInt(msg.resId) */) {
            if (msg.res === 'ok') {
                /* setUserModel({
                    ...userModel,
                    ...msg.user
                }) */
                pedirMisServicios(msg.body.empresa)
                setCreatingObra(false)
                setStartCreating(false)
            }
        }
        if (actionTodo === 'dataRes-allEmpresaData' /* && parseInt(res) === parseInt(msg.resId) */) {
            let userComeData = { userObj: { appPermisions: ObjPermisos } }
            if (msg.res === 'ok') {
                userActual = { ...userData, ...msg.body, passwordRepeat: '', status: 'registered', type: onMobil.state ? 'bioseptico' : msg.body.type, appPermisions: userComeData.userObj.appPermisions }
                modelActual = {
                    ...userModel, ...modelUser, ...msg.fullUser, userObj: { ...msg.fullUser.userObj, type: onMobil.state ? 'bioseptico' : msg.fullUser.userObj.type }
                }
                setUserModel({
                    ...userModel,
                    userObj: { ...msg.fullUser.userObj, type: onMobil.state ? 'bioseptico' : msg.fullUser.userObj.type },
                    ...msg.user
                })
                pedirMisEmpresas(msg.user.app.relationed.empresas)
                setStartCreating(false)
            }
        }
        if (actionTodo === 'dataRes-allObrasData' /* && parseInt(res) === parseInt(msg.resId) */) {
            if (msg.res === 'ok') {
                setStartCreating(false)
                setCreatingObra(false)
            }
        }
        if (actionTodo === 'changePasswordRes' && parseInt(res) === parseInt(msg.resId)) {
            if (msg.res === 'ok') {
                setPopUp(popUpStructure)
                sendLogin()
            }
        }
        if (actionTodo === 'dataRes-askEmpresas') {
            if (msg.res === 'ok') {
                const lastEmpresas = misEmpresas
                setMisEmpresasRes({ ...misEmpresasRes, array: msg.empresas })
                if (msg.empresas.length === 1) {
                    setMisEmpresas({
                        ...misEmpresas,
                        seleccionada: msg.empresas[0].contact.nombre,
                        itemSelectioned: msg.empresas[0],
                        empresas: msg.empresas
                    })
                } else {
                    setMisEmpresas({
                        ...misEmpresas,
                        seleccionada: lastEmpresas.seleccionada,
                        itemSelectioned: lastEmpresas.seleccionada,
                        empresas: msg.empresas
                    })
                }
                if (userData.type === 'vendedor') {
                    resMisEmpresas()
                }
            }
        }
        if (actionTodo === 'dataRes-askObras') {
            if (msg.res === 'ok') {
                setMisObras({
                    array: msg.obras
                })
            }
        }
        if (actionTodo === 'dataRes-askServicios') {
            if (msg.res === 'ok') {
                setMisServicios({
                    array: msg.servicios
                })
            }
        }
        if (actionTodo === 'dataActualize') {
            if (msg.res === 'ok') {
                setEmpresas({ ...empresas, array: msg.empresas })
                setModeloBiosepticos({
                    ...modeloBiosepticos,
                    vehiculos: msg.vehiculos,
                    ...msg.modeloBiosepticos
                })
                setRutas({ ...rutas, array: msg.rutas })
                setVehiculos({ ...vehiculos, array: msg.vehiculos })
                setObras({ ...obras, array: msg.obras })
                setServicios({ ...servicios, array: msg.servicios })
                msg.users.map((key, i) => {
                    if (parseInt(key.id) === parseInt(userActual.id)) {

                        setUserName({
                            ...key.userObj,
                            type: onMobil.state ? 'bioseptico' : userActual.type,
                        })
                        setUserModel({
                            ...modelActual,
                            ...key,
                            userObj: {
                                ...key.userObj,
                                type: onMobil.state ? 'bioseptico' : userActual.type,
                            }
                        })
                    }
                })

                setUsersAll({ ...usersAll, array: msg.users, arrayAppUsers: msg.appUsers })
            }

        }
        if (actionTodo === 'dataRes-askEmpresasVendedor' && parseInt(res) === parseInt(msg.resId)) {
            /*  if (parseInt(msg.resId) === parseInt(res)) {
                 setMisEmpresas({ ...misEmpresas, array: msg.empresas })
             } */
        }

        if (actionTodo === 'loginRes' && parseInt(res) === parseInt(msg.resId)) {
            if (msg.res === 'ok') {
                setInSending(false)
                setUsers({ ...users, array: msg.users })
                setUsersAll({ ...usersAll, array: msg.usersAll })
                let userComeData = { userObj: { appPermisions: ObjPermisos } }
                msg.usersAll.map((key, i) => {
                    if (key.id === msg.body.id) {
                        userComeData = key
                        setUserName({ ...userData, appPermisions: { ...key.userObj.appPermisions } })
                        userActual = { ...userData, appPermisions: { ...key.userObj.appPermisions } }
                        pedirEmpresas(key.id)
                    }
                })
                setUserName({ ...userData, ...msg.body, passwordRepeat: '', type: onMobil.state ? 'bioseptico' : msg.body.type })
                userActual = { ...userData, ...msg.body, passwordRepeat: '', type: onMobil.state ? 'bioseptico' : msg.body.type }

                const modelUser = ModeloUsuario({
                    ...userData,
                    ...msg.body, passwordRepeat: '', status: 'registered', appPermisions: userComeData.userObj.appPermisions, userObj: { ...msg.fullUser.userObj, type: onMobil.state ? 'bioseptico' : msg.fullUser.userObj.type }
                })

                if (msg.body.passwordChange) {
                    const funtions = { setUserData: setUserData, sendData: sendData, setPopUp: setPopUp, sendLogin: sendLogin, changePassword: changePassword }
                    const resPopUp = InterfazRegistro('changePassword', funtions)
                    setPopUp(resPopUp)
                    setUserName({
                        ...userData,
                        ...msg.body, passwordRepeat: '', status: 'registered', type: onMobil.state ? 'bioseptico' : msg.body.type
                    })
                    userActual = {
                        ...userData,
                        ...msg.body,
                        type: onMobil.state ? 'bioseptico' : msg.body.type,
                        passwordRepeat: '', status: 'registered'
                    }
                    setUserModel({ ...userModel, ...modelUser })
                    modelActual = {
                        ...userModel, ...modelUser, userObj: { ...msg.fullUser.userObj, type: onMobil.state ? 'bioseptico' : msg.fullUser.userObj.type }
                    }


                    /*                     dataEntry()
                     */
                } else {
                    setTimeout(() => {
                        if (onMobil.state && userData.status !== 'unRegistered') {
                            setUserName({
                                ...userData,
                                type: 'bioseptico'
                            })
                        }
                        setUserName({ ...userData, ...msg.body, passwordRepeat: '', type: onMobil.state ? 'bioseptico' : msg.body.type, status: 'registered', appPermisions: userComeData.userObj.appPermisions })
                        setUserModel({
                            ...userModel, ...modelUser, ...msg.fullUser,
                            userObj: { ...msg.fullUser.userObj, type: onMobil.state ? 'bioseptico' : msg.fullUser.userObj.type }
                        })
                        userActual = { ...userData, ...msg.body, passwordRepeat: '', status: 'registered', type: onMobil.state ? 'bioseptico' : msg.body.type, appPermisions: userComeData.userObj.appPermisions }
                        modelActual = {
                            ...userModel, ...modelUser, ...msg.fullUser, userObj: { ...msg.fullUser.userObj, type: onMobil.state ? 'bioseptico' : msg.fullUser.userObj.type }
                        }
                        setPopUp(popUpStructure)
                        /*  PedirBiosepticos()
                     PedirVehiculos() */
/*                         pedirEmpresas(msg.fullUser.id)
 */                    }, 500);
                }
            }
            else {
                window.alert('mala clave o usuario')
            }
        }
        if (onMobil.state && userData.status !== 'unRegistered') {
            setUserName({
                ...userData,
                type: 'bioseptico'
            })
            setUserModel({
                ...userModel,
                userObj: {
                    ...userModel.userObj,
                    type: 'bioseptico'
                }
            })
        }
    }
    useEffect(() => {
        if (userModel.userObj.emailConfirmation && userData.type !== 'newUser' !== userData.type !== '') {
            setPopUp({
                ...popUp,
                active: true,
                type: 'emailConfirmation',
                funtions: { setPopUp: setPopUp, setUserData: setUserName }
            })
        } else {
            setPopUp({
                ...popUp,
                active: false,
                type: ''
            })
        }
    }, [userData.type])
    useEffect(() => {
        if (onMobil.state && userData.status !== 'unRegistered' && userModel.userObj.type !== 'bioseptico' && userData.type !== 'bioseptico') {
            setUserName({
                ...userData,
                type: 'bioseptico'
            })
            setUserModel({
                ...userModel,
                userObj: {
                    ...userModel.userObj,
                    type: 'bioseptico'
                }
            })
        }
    }, [onMobil, userData, userModel])
    useEffect(() => {
        pedirMisServicios(misEmpresas.itemSelectioned.id)
        PedirObras({ id: misEmpresas.itemSelectioned.id, user: userData.id })
    }, [misEmpresas.itemSelectioned])
    useEffect(() => {
        if (userModel.userObj.permisions.bioseptico) {
            let newvalues = {
                servicios: [],
                rutas: [],
                rutasIndividuales: [],
                obras: []
            }
            modeloBiosepticos.rutasIndividuales.map((key, i) => {
                if ((userModel.app.type === 'operativo') || (key.encargados[(userModel.app.type === 'conductores' ? 'conductor' : 'auxiliar')] === userModel.id)) {
                    newvalues.rutasIndividuales.push(key)
                    if (key.rutaDia !== '') {
                        newvalues.rutas.push(key.id)
                        key.servicios.map((keyS, iS) => {
                            servicios.array.map((keyServicios, iServicios) => {
                                if (keyServicios.id === keyS) {
                                    newvalues.servicios.push({ servicio: keyServicios, fecha: key.fecha })
                                    obras.array.map((keyO, iO) => {
                                        if (keyServicios.obra === keyO.id) {
                                            newvalues.obras.push({ obra: keyO, fecha: key.fecha })
                                        }
                                    })
                                }
                            })
                        })
                    }
                }
            })
            setDataBioseptico({
                ...dataBioseptico,
                ...newvalues
            })
        }
    }, [modeloBiosepticos, servicios, obras, rutas])

    return (
        <>
            <SocketOn socketDo={socketDo} setPopUp={setPopUp} />
            <MenuBar onMobil={onMobil} PedirObras={PedirObras}
                pedirMisServicios={pedirMisServicios} startCreating={startCreating} setStartCreating={setStartCreating} misEmpresas={misEmpresas} setMisEmpresas={setMisEmpresas} misEmpresasRes={misEmpresasRes} inSending={inSending} objCss={objCss} objStrings={objStrings} cleanUserData={cleanUserData} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} changeLanguage={changeLanguage} setUserData={setUserDataApp} />
            {
                userData.type === 'newUser' &&
                <>
                    <PageIndex objCss={objCss} objStrings={objStrings} />
                </>
            }
            {userModel.userObj.emailConfirmation ? <></> : (userData.type !== 'newUser' && userModel.userObj.dataRequired) || (userData.type === 'createUserData' && userModel.userObj.dataRequired) ?
                <FormularioNuevo setReqState={setReqState} reqState={reqState} userData={userData} setPopUp={setPopUp} setUserData={setUserModel} objCss={objCss} objStrings={objStrings} />
                : <>

                    {
                        userData.type === 'clientUser' && userData.permisions.empresas &&
                        <>
                            {

                                <CentroDeEmpresas sendNewServicio={sendNewServicio} creatingObra={creatingObra} setCreatingObra={setCreatingObra} misObras={misObras} misServicios={misServicios} PedirObras={PedirObras}
                                    pedirMisServicios={pedirMisServicios} startCreating={startCreating} setStartCreating={setStartCreating} misEmpresas={misEmpresas} setMisEmpresas={setMisEmpresas} pedirEmpresas={pedirMisEmpresas} misEmpresasRes={misEmpresasRes} userModel={userModel} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} objCss={objCss} objStrings={objStrings} />

                            }

                        </>
                    }
                    {
                        userData.type === 'vendedor' && userData.permisions.vendedores &&
                        <>
                            <CentroDeVendedores actualizarEstado={actualizarEstado} startCreating={startCreating} setStartCreating={setStartCreating} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} objCss={objCss} objStrings={objStrings} />

                        </>
                    }
                    {
                        userData.type === 'bioseptico' && userData.permisions.bioseptico &&
                        <>
                            <CentroDeBiosepticos onMobil={onMobil} empresas={empresas} userModel={userModel} dataBioseptico={dataBioseptico} obras={obras} rutas={rutas} PedirBiosepticos={PedirBiosepticos} servicios={servicios} modeloBiosepticos={modeloBiosepticos} actualizarEstado={actualizarEstado} vehiculos={vehiculos} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} objCss={objCss} objStrings={objStrings} />

                        </>
                    }
                    {
                        userData.type === 'operativeUser' && userData.permisions.logistica &&
                        <>
                            <CentroDeLogistica obras={obras} rutas={rutas} PedirBiosepticos={PedirBiosepticos} servicios={servicios} modeloBiosepticos={modeloBiosepticos} actualizarEstado={actualizarEstado} vehiculos={vehiculos} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} objCss={objCss} objStrings={objStrings} />
                        </>
                    }
                    {
                        userData.type === 'adminUser' && userData.permisions.console &&
                        <>
                            <DashBoard modeloBiosepticos={modeloBiosepticos} actualizarEstado={actualizarEstado} vehiculos={vehiculos} empresas={empresas} usersAll={usersAll} users={users} pedirEmpresas={pedirEmpresas} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} objCss={objCss} objStrings={objStrings} />
                        </>
                    }
                </>}
            <ReqComponent onMobil={onMobil} userData={userData} setReqState={setReqState} reqState={reqState} objCss={objCss} />
            <AbsoluteBox onMobil={onMobil} inSending={inSending} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} objCss={objCss} popUp={popUp} />
        </>
    )
}
export default UserCheck