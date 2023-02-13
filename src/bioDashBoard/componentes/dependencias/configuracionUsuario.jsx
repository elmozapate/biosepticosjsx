import ModeloUsuario from "@/bioApp/models/modelosUsuario"
import StringsObj from "@/engine/content"
import StylesObj from "@/styles/stylesObj"
import { useEffect, useState } from "react"
import PermComp from "./permComp"
import MiddlewareSelector from "@/middleware/askSelector"
import PersComp from "./persComp"
import EnvM from "@/envMachetero"
import io from "socket.io-client"
import TableHistorialApp from "@/components/containers/table"
import PermisionComp from "../formularios/permisionComp"
import { Socket } from "@/middleware/routes/connect/socket/socketOn"
import { ArraySelectorEmpresas, ArraySelectorVendedores } from "@/bioApp/models/modelosSelector"


const socket = Socket
const usuarioDefault = ModeloUsuario()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
let res = Number()

const ConfiguracionUsuario = (props) => {

    const { inHistorial = false, objStrings = objStringsInit, objCss = objCssInit, selectioned = { active: false, inSelection: 'default' }, usersAll = { array: [] } } = props
    const [activeUser, setActiveUser] = useState({
        selectOp: '',
        userInfo: usuarioDefault
    })
    const actualizeData = (type) => {
        res = MiddlewareSelector({ ask: `edit-${type}`, user: activeUser.userInfo })
    }
    const sendNewPerms = (newData) => {
        res = MiddlewareSelector({ ask: `newPerms`, id: activeUser.userInfo.id, permisions: newData })
    }
    useEffect(() => {
        usersAll.array.map((key, i) => {
            if (key.id === selectioned.inSelection) {
                setActiveUser({
                    ...activeUser,
                    userInfo: key
                })
            }
        })
    }, [usersAll])

    return (
        <>
            {
                inHistorial &&
                < TableHistorialApp activeUser={activeUser} objCss={objCss} objStrings={objStrings} />

            }
            {
                !inHistorial && activeUser.selectOp === '' ?
                    <>
                        <div onClick={(e) => {
                            e.preventDefault();
                            setActiveUser({
                                ...activeUser,
                                selectOp: 'personalInfo'
                            })
                        }}>
                            VER O MODIFICAR INFORMACION PERSONAL
                        </div>
                        {activeUser.userInfo.userObj.permisions.logistica && <div onClick={(e) => {
                            e.preventDefault();
                            setActiveUser({
                                ...activeUser,
                                selectOp: 'permissions'
                            })
                        }}>
                            VER O MODIFICAR PERMISOS LOGISTICA
                        </div>}
                        {activeUser.userInfo.userObj.permisions.empresas && <div onClick={(e) => {
                            e.preventDefault();
                            setActiveUser({
                                ...activeUser,
                                selectOp: 'permissionsCompanies'
                            })
                        }}>
                            VER O MODIFICAR PERMISOS EMPRESAS
                        </div>}
                        {activeUser.userInfo.userObj.permisions.vendedores && <div onClick={(e) => {
                            e.preventDefault();
                            setActiveUser({
                                ...activeUser,
                                selectOp: 'permissionsVendedores'
                            })
                        }}>
                            VER O MODIFICAR PERMISOS VENDEDORES
                        </div>}
                        <div onClick={(e) => {
                            e.preventDefault();
                            setActiveUser({
                                ...activeUser,
                                selectOp: 'access'
                            })
                        }}>
                            VER O MODIFICAR ACCESOS
                        </div>
                    </>
                    :
                    <>
                        {
                            activeUser.selectOp === 'permissions' &&
                            <PermComp actualizeData={actualizeData} setActiveUser={setActiveUser} activeUser={activeUser} permision={activeUser.userInfo.userObj.appPermisions} objCss={objCss} objStrings={objStrings} />
                        }
                        {
                            activeUser.selectOp === 'permissionsCompanies' &&
                            <PermComp inEmpresas actualizeData={actualizeData} setActiveUser={setActiveUser} activeUser={activeUser} permision={activeUser.userInfo.userObj.companyPermisions} objCss={objCss} permisionArray={ArraySelectorEmpresas} objStrings={objStrings} />
                        }
                        {
                            activeUser.selectOp === 'permissionsVendedores' &&
                            <PermComp inVendedores actualizeData={actualizeData} setActiveUser={setActiveUser} activeUser={activeUser} permision={activeUser.userInfo.userObj.sellPermisions} objCss={objCss} permisionArray={ArraySelectorVendedores} objStrings={objStrings} />
                        }
                        {
                            activeUser.selectOp === 'personalInfo' &&
                            <PersComp actualizeData={actualizeData} setActiveUser={setActiveUser} activeUser={activeUser} permision={activeUser.userInfo.userObj.appPermisions} objCss={objCss} objStrings={objStrings} />
                        }
                        {
                            activeUser.selectOp === 'access' &&
                            < PermisionComp inActualize setActiveUser={setActiveUser} activeUser={activeUser} funtions={sendNewPerms} objCss={objCss} />

                        }
                        <button className={objCss.mario} onClick={(e) => {
                            e.preventDefault();
                            setActiveUser({
                                ...activeUser,
                                selectOp: ''
                            })
                        }}>volver</button>
                    </>
            }
        </>
    )

}

export default ConfiguracionUsuario