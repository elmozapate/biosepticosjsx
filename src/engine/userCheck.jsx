import { InterfazRegistro } from "@/auth/interfaz"
import { useState } from "react"
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
import ModeloUsuario from "@/bioApp/models/modelosUsuario"
import CentroDeEmpresas from "@/bioApp/empresas/centroDeEmpresas"
import FormularioNuevo from "@/bioDashBoard/componentes/formularios/formularioNuevo"
const envM = EnvM()
const plantillaUSuario = ModeloUsuario()
const socket = io(envM.hostBack)
const popUpStructure = PopUpObj()
const objCssInit = Declaraciones({ language: 'spanish', type: 'styles' }).styles
const objStringsInit = Declaraciones({ language: 'spanish', type: 'text' }).text
const userStructure = UserObj()
const UserCheck = (props) => {
    const { usersArray = [], setUsersArray = [] } = props
    const [userData, setUserName] = useState(userStructure)
    const [userModel, setUserModel] = useState(plantillaUSuario)
    const [empresas, setEmpresas] = useState({ array: [] })
    const [users, setUsers] = useState({ array: [] })
    const [usersAll, setUsersAll] = useState({ array: [] })
    const [objCss, setObjCss] = useState(objCssInit)
    const [popUp, setPopUp] = useState(popUpStructure)
    const [objStrings, setObjStrings] = useState(objStringsInit)
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
    }
    const sendData = () => {
        const res = RegisterAuth(userData, usersArray)
        if (res === 0) {
            setUserName({
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
        const res = LoginAuth(userData, usersArray)
        socket.on("bioApp", (msg) => {
            const actionTodo = msg.actionTodo
            if (actionTodo === 'loginRes' && parseInt(res) === parseInt(msg.resId)) {
                if (msg.res === 'ok') {
                    setUsers({ ...users, array: msg.users })
                    setUsersAll({ ...usersAll, array: msg.usersAll })
                    setUserName({ ...userData, ...msg.body, passwordRepeat: '' })
                    console.log(msg.usersAll);
                    const modelUser = ModeloUsuario({
                        ...userData,
                        ...msg.body, passwordRepeat: '', status: 'registered'
                    })
                    if (msg.body.passwordChange) {
                        const funtions = { setUserData: setUserData, sendData: sendData, setPopUp: setPopUp, sendLogin: sendLogin, changePassword: changePassword }
                        const resPopUp = InterfazRegistro('changePassword', funtions)
                        setPopUp(resPopUp)
                        setUserName({
                            ...userData,
                            ...msg.body, passwordRepeat: '', status: 'registered'
                        })
                        setUserModel({ ...userModel, ...modelUser })

                        /*                     dataEntry()
                         */
                    } else {
                        setTimeout(() => {
                            setUserName({ ...userData, ...msg.body, passwordRepeat: '', status: 'registered' })
                            setUserModel({ ...userModel, ...modelUser })
                            setPopUp(popUpStructure)
                        }, 500);
                    }

                }
                else {
                    window.alert('mala clave o usuario')
                }
            }
        })

    }
    const changePassword = () => {
        const res = MiddlewareSelector({ ask: 'changePassword', data: userData })
        socket.on("bioApp", (msg) => {
            const actionTodo = msg.actionTodo
            if (actionTodo === 'changePasswordRes' && parseInt(res) === parseInt(msg.resId)) {
                if (msg.res === 'ok') {
                    setPopUp(popUpStructure)
                    sendLogin()

                }
            }
        })
    }
    const cleanUserData = () => {
        setUserName({ ...userStructure })
    }
    const pedirEmpresas = () => {
        const res = MiddlewareSelector({ ask: 'pedirEmpresas', data: userData })
        socket.on("bioApp", (msg) => {
            const actionTodo = msg.actionTodo
            if (actionTodo === 'pedirEmpresasRes' && parseInt(res) === parseInt(msg.resId)) {
                if (msg.res === 'ok') {
                    setEmpresas({ ...empresas, array: msg.empresas })
                }
            }
        })
    }
    const setUserDataApp = (type, value) => {
        if (type === 'changeType') {
            setUserName({ ...userData, type: value })
        } else {
            const funtions = { setUserData: setUserData, sendData: sendData, setPopUp: setPopUp, sendLogin: sendLogin }
            const resPopUp = InterfazRegistro(type, funtions)
            setPopUp(resPopUp)

        }

    }
    return (
        <>
            <MenuBar objCss={objCss} objStrings={objStrings} cleanUserData={cleanUserData} userData={userData} changeLanguage={changeLanguage} setUserData={setUserDataApp} />
            {
                userData.type === 'newUser' &&
                <>
                    <PageIndex objCss={objCss} objStrings={objStrings} />
                </>
            }
            {userData.type !== 'newUser' && userModel.userObj.dataRequired ?
                <FormularioNuevo userData={userData} setUserData={setUserModel} objCss={objCss} objStrings={objStrings} />
                : <>

                    {
                        userData.type === 'clientUser' &&
                        <>
                            {

                                <CentroDeEmpresas userData={userData} objCss={objCss} objStrings={objStrings} />

                            }

                        </>
                    }
                    {
                        userData.type === 'vendedor' &&
                        <>
                        </>
                    }
                    {
                        userData.type === 'operativeUser' &&
                        <>
                            <CentroDeLogistica userData={userData} objCss={objCss} objStrings={objStrings} />
                        </>
                    }
                    {
                        userData.type === 'adminUser' &&
                        <>
                            <DashBoard empresas={empresas} usersAll={usersAll} users={users} pedirEmpresas={pedirEmpresas} userData={userData} objCss={objCss} objStrings={objStrings} />
                        </>
                    }
                </>}
            <AbsoluteBox userData={userData} objCss={objCss} popUp={popUp} />
        </>
    )
}
export default UserCheck