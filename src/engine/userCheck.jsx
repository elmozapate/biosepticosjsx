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
import io from "socket.io-client"
import MiddlewareSelector from "@/middleware/askSelector"
import ModeloUsuario, { EmpresaObj } from "@/bioApp/models/modelosUsuario"
import CentroDeEmpresas from "@/bioApp/empresas/centroDeEmpresas"
import FormularioNuevo from "@/bioDashBoard/componentes/formularios/formularioNuevo"
import { ObjPermisos } from "@/bioApp/models/modelosPermisos"
import { Socket, SocketOn } from "@/middleware/routes/connect/socket/socketOn"
import CentroDeVendedores from "@/bioApp/vendedores/centroDeVendedores"
import { ModeloBiosepticos } from "@/bioApp/models/modeloBiosepticos"
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
    const { usersArray = [], setUsersArray = [] } = props
    const [userData, setUserName] = useState(userStructure)
    const [userModel, setUserModel] = useState(plantillaUSuario)
    const [empresas, setEmpresas] = useState({ array: [] })
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
    const sendData = () => {
        const req = RegisterAuth(userData, usersArray)
        res = req
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
    const sendLogin = () => {
        res = LoginAuth(userData, usersArray)


    }
    const changePassword = () => {
        const req = MiddlewareSelector({ ask: 'changePassword', data: userData })
        res = req
    }
    const sendNewServicio = (servicio) => {
        console.log('jjjjj',servicio);
        const req = MiddlewareSelector({ ask: 'setServicio', data: servicio })
        res = req
    }
    const PedirObras = (data) => {
        const req = MiddlewareSelector({ ask: 'askObras', data: data })
        res = req
    }
    const PedirBiosepticos = (data) => {
        const req = MiddlewareSelector({ ask: 'askBioseptico', data: data })
        res = req
    }
    const PedirVehiculos = (data) => {
        const req = MiddlewareSelector({ ask: 'askVehiculos', data: data })
        res = req
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
    }
    const pedirMisEmpresas = (model = userModel.app.relationed.empresas) => {
        const req = MiddlewareSelector({ ask: 'askCompanies', data: model })
        res = req

    }
    const pedirMisServicios = (model = userModel.app.relationed.empresas) => {
        const req = MiddlewareSelector({ ask: 'askServicios', data: model })
        res = req

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
    }
    const resMisEmpresas = () => {
        const req = MiddlewareSelector({
            ask: 'getMisEmpresasVendedor', id: userData.id
        })
        res = req
    }
    const socketDo = (msg) => {
        console.log(msg);
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
            if (msg.res === 'ok') {
                setUserModel({
                    ...userModel,
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
        if (actionTodo === 'dataRes-askEmpresas' ) {
            if (msg.res === 'ok') {
                setMisEmpresasRes({ ...misEmpresasRes, array: msg.empresas })
                if (msg.empresas.length === 1) {
                    setMisEmpresas({
                        ...misEmpresas,
                        seleccionada: msg.empresas[0].contact.nombre,
                        itemSelectioned: msg.empresas[0],
                        empresas: msg.empresas
                    })
/*                     PedirObras({ id: msg.empresas[0].id, user: userData.id })
 */                } else {
                    setMisEmpresas({
                        ...misEmpresas,
                        empresas: msg.empresas
                    })
                }
/*                 resMisEmpresas()
 */            }
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
                            type: userActual.type,
                        })
                        setUserModel({
                            ...modelActual,
                            ...key,
                            userObj: {
                                ...key.userObj,
                                type: userActual.type
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
                setUserName({ ...userData, ...msg.body, passwordRepeat: '' })
                userActual = { ...userData, ...msg.body, passwordRepeat: '' }

                const modelUser = ModeloUsuario({
                    ...userData,
                    ...msg.body, passwordRepeat: '', status: 'registered', appPermisions: userComeData.userObj.appPermisions
                })

                if (msg.body.passwordChange) {
                    const funtions = { setUserData: setUserData, sendData: sendData, setPopUp: setPopUp, sendLogin: sendLogin, changePassword: changePassword }
                    const resPopUp = InterfazRegistro('changePassword', funtions)
                    setPopUp(resPopUp)
                    setUserName({
                        ...userData,
                        ...msg.body, passwordRepeat: '', status: 'registered'
                    })
                    userActual = {
                        ...userData,
                        ...msg.body, passwordRepeat: '', status: 'registered'
                    }
                    setUserModel({ ...userModel, ...modelUser })
                    modelActual = {
                        ...userModel, ...modelUser
                    }


                    /*                     dataEntry()
                     */
                } else {
                    setTimeout(() => {
                        setUserName({ ...userData, ...msg.body, passwordRepeat: '', status: 'registered', appPermisions: userComeData.userObj.appPermisions })
                        setUserModel({ ...userModel, ...modelUser, ...msg.fullUser })
                        userActual = { ...userData, ...msg.body, passwordRepeat: '', status: 'registered', appPermisions: userComeData.userObj.appPermisions }
                        modelActual = { ...userModel, ...modelUser, ...msg.fullUser }
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
        pedirMisServicios(misEmpresas.itemSelectioned.id)
        PedirObras({ id: misEmpresas.itemSelectioned.id, user: userData.id })
    }, [misEmpresas.itemSelectioned])


    return (
        <>
            <SocketOn socketDo={socketDo} setPopUp={setPopUp} />
            <MenuBar PedirObras={PedirObras}
                pedirMisServicios={pedirMisServicios} startCreating={startCreating} setStartCreating={setStartCreating} misEmpresas={misEmpresas} setMisEmpresas={setMisEmpresas} misEmpresasRes={misEmpresasRes} inSending={inSending} objCss={objCss} objStrings={objStrings} cleanUserData={cleanUserData} userData={userData} setPopUp={setPopUp} changeLanguage={changeLanguage} setUserData={setUserDataApp} />
            {
                userData.type === 'newUser' &&
                <>
                    <PageIndex objCss={objCss} objStrings={objStrings} />
                </>
            }
            {userModel.userObj.emailConfirmation ? <></> : (userData.type !== 'newUser' && userModel.userObj.dataRequired) || (userData.type === 'createUserData' && userModel.userObj.dataRequired) ?
                <FormularioNuevo userData={userData} setPopUp={setPopUp} setUserData={setUserModel} objCss={objCss} objStrings={objStrings} />
                : <>

                    {
                        userData.type === 'clientUser' && userData.permisions.empresas &&
                        <>
                            {

                                <CentroDeEmpresas sendNewServicio={sendNewServicio} creatingObra={creatingObra} setCreatingObra={setCreatingObra} misObras={misObras} misServicios={misServicios} PedirObras={PedirObras}
                                    pedirMisServicios={pedirMisServicios} startCreating={startCreating} setStartCreating={setStartCreating} misEmpresas={misEmpresas} setMisEmpresas={setMisEmpresas} pedirEmpresas={pedirMisEmpresas} misEmpresasRes={misEmpresasRes} userModel={userModel} userData={userData} setPopUp={setPopUp} objCss={objCss} objStrings={objStrings} />

                            }

                        </>
                    }
                    {
                        userData.type === 'vendedor' && userData.permisions.vendedores &&
                        <>
                            <CentroDeVendedores actualizarEstado={actualizarEstado} startCreating={startCreating} setStartCreating={setStartCreating} userData={userData} setPopUp={setPopUp} objCss={objCss} objStrings={objStrings} />

                        </>
                    }
                    {
                        userData.type === 'operativeUser' && userData.permisions.logistica &&
                        <>
                            <CentroDeLogistica obras={obras} rutas={rutas} PedirBiosepticos={PedirBiosepticos} servicios={servicios} modeloBiosepticos={modeloBiosepticos} actualizarEstado={actualizarEstado} vehiculos={vehiculos} userData={userData} setPopUp={setPopUp} objCss={objCss} objStrings={objStrings} />
                        </>
                    }
                    {
                        userData.type === 'adminUser' && userData.permisions.console &&
                        <>
                            <DashBoard modeloBiosepticos={modeloBiosepticos} actualizarEstado={actualizarEstado} vehiculos={vehiculos} empresas={empresas} usersAll={usersAll} users={users} pedirEmpresas={pedirEmpresas} userData={userData} setPopUp={setPopUp} objCss={objCss} objStrings={objStrings} />
                        </>
                    }
                </>}
            <AbsoluteBox inSending={inSending} userData={userData} setPopUp={setPopUp} objCss={objCss} popUp={popUp} />
        </>
    )
}
export default UserCheck