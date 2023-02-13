import ModeloUsuario, { ObjPermisions } from "@/bioApp/models/modelosUsuario";
import StylesObj from "@/styles/stylesObj";
import { useEffect, useState } from "react";
const objCssInit = StylesObj()
const usuarioDefault = ModeloUsuario()

const PermisionComp = (props) => {
    const { inPerms = {
        console: false,
        logistica: false,
        empresas: false,
        vendedores: false,
        bioseptico: false
    }, willShows = '', onlyAccess = [{ type: '', perms: {} }], inActualize = false, activeUser = { selectOp: '', userInfo: usuarioDefault }, setActiveUser = console.log, funtions = console.log, objCss = objCssInit } = props
    const [permisions, setPermisions] = useState(inActualize ? activeUser.userInfo.userObj.permisions : onlyAccess[0].type !== '' || willShows === '' ? ObjPermisions : ObjPermisions)
    const [inChange, setInChange] = useState(inActualize ? false : true)

    useEffect(() => {
        let cheking = {
            console: false,
            logistica: false,
            empresas: false,
            vendedores: false,
            bioseptico: false
        }
        if (willShows !== '') {
            onlyAccess.map((key, i) => {
                if (key.type === 'console' || key.type === 'logistica' || key.type === 'empresa' || key.type === 'vendedores' || key.type === 'bioseptico') { cheking[key.type] = true } else { cheking[key.type] = false }
            })
            setPermisions({ ...cheking })
        }
    }, [willShows])
    return (
        <>
            <div >

                {(onlyAccess[0].type === '' || (onlyAccess[0].type !== '' && inPerms.console)) && <div onClick={!inChange ? console.log : (e) => { e.preventDefault; onlyAccess[0].type === '' && setPermisions({ ...permisions, console: !permisions.console }) }}>Consola {permisions.console ? '  ✓  ' : '  X  '}</div>}
                {(onlyAccess[0].type === '' || (onlyAccess[0].type !== '' && inPerms.logistica)) && <div onClick={!inChange ? console.log : (e) => { e.preventDefault; onlyAccess[0].type === '' && setPermisions({ ...permisions, logistica: !permisions.logistica }) }}>Logistica {permisions.logistica ? '  ✓  ' : '  X  '}</div>}
                {(onlyAccess[0].type === '' || (onlyAccess[0].type !== '' && inPerms.empresas)) && <div onClick={!inChange ? console.log : (e) => { e.preventDefault; onlyAccess[0].type === '' && setPermisions({ ...permisions, empresas: !permisions.empresas }) }}>Empresas {permisions.empresas ? '  ✓  ' : '  X  '}</div>}
                {(onlyAccess[0].type === '' || (onlyAccess[0].type !== '' && inPerms.vendedores)) && <div onClick={!inChange ? console.log : (e) => { e.preventDefault; onlyAccess[0].type === '' && setPermisions({ ...permisions, vendedores: !permisions.vendedores }) }}>Ventas {permisions.vendedores ? '  ✓  ' : '  X  '}</div>}
                {(onlyAccess[0].type === '' || (onlyAccess[0].type !== '' && inPerms.bioseptico)) && <div onClick={!inChange ? console.log : (e) => { e.preventDefault; setPermisions({ ...permisions, bioseptico: !permisions.bioseptico }) }}>Bioseptico {permisions.bioseptico ? '  ✓  ' : '  X  '}</div>}
                {onlyAccess[0].type === '' && <button onClick={(e) => { e.preventDefault; !inChange ? console.log : funtions(permisions); setInChange(!inChange) }}>
                    {inChange ? 'Aceptar' : 'Modificar'}
                </button>}
            </div>

        </>
    )
}
export default PermisionComp