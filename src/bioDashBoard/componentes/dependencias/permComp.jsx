import { ObjPermisos } from "@/bioApp/models/modelosPermisos"
import { ArraySelector } from "@/bioApp/models/modelosSelector"
import ModeloUsuario from "@/bioApp/models/modelosUsuario"
import StringsObj from "@/engine/content"
import StylesObj from "@/styles/stylesObj"
import { useEffect, useState } from "react"

const usuarioDefault = ModeloUsuario()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const PermComp = (props) => {
    const { inVendedores = false, inEmpresas = false, actualizeData = console.log, activeUser = { selectOp: '', userInfo: usuarioDefault }, setActiveUser = console.log, permision = ObjPermisos, permisionArray = ArraySelector, objStrings = objStringsInit, objCss = objCssInit, selectioned = { active: false, inSelection: 'default' }, usersAll = { array: [] } } = props
    const [editData, setEditData] = useState({
        active: true,
    })

    return (
        <>
            <button onClick={(e) => {
                e.preventDefault();
                setEditData({
                    ...editData,
                    active: !editData.active
                });
                !editData.active && actualizeData(inVendedores ? 'sellPermisions' : inEmpresas ? 'companyPermisions' : 'permision')

            }}>
                {!editData.active ? <>SALVAR</> : <>EDITAR</>}
            </button>
            {inEmpresas && 'empresas'}
            {inVendedores && 'vendedores'}
            {permisionArray.map((key, i) => {
                return (
                    <>
                        <p id={`idff-${i}`}>{editData.active ? <>{key}---{permision[key] && 'OK'}</>
                            :
                            <>
                                {key} -----
                                {
                                    <span onClick={(e) => {
                                        e.preventDefault(); setActiveUser({
                                            ...activeUser,
                                            userInfo: {
                                                ...activeUser.userInfo,
                                                userObj: {
                                                    ...activeUser.userInfo.userObj,
                                                    [inVendedores ? 'sellPermisions' : inEmpresas ? 'companyPermisions' : 'appPermisions']: {
                                                        ...activeUser.userInfo.userObj[inVendedores ? 'sellPermisions' : inEmpresas ? 'companyPermisions' : 'appPermisions'],
                                                        [key]: permision[key] ? false : true
                                                    },
                                                },
                                            }

                                        })
                                    }}>
                                        {
                                            <>
                                                {permision[key] ? '  OTORGADO' : '  OTORGAR'}
                                            </>
                                        }
                                    </span>
                                }
                            </>
                        }</p>
                    </>
                )
            })}
        </>
    )
}
export default PermComp