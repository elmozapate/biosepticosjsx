import { ObjPermisions } from "@/bioApp/models/modelosUsuario";
import StylesObj from "@/styles/stylesObj";
import { useState } from "react";
const objCssInit = StylesObj()

const PermisionComp = (props) => {
    const { funtions = console.log, objCss = objCssInit } = props
    const [permisions, setPermisions] = useState(ObjPermisions)
    const [inChange, setInChange] = useState(true)
    return (
        <>
            <div >
                <div onClick={!inChange ? console.log : (e) => { e.preventDefault; setPermisions({ ...permisions, console: !permisions.console }) }}>Consola {permisions.console ? '  ✓  '+'sss' : '  X  '}</div>
                <div onClick={!inChange ? console.log : (e) => { e.preventDefault; setPermisions({ ...permisions, logistica: !permisions.logistica }) }}>Logistica {permisions.logistica ? '  ✓  ' : '  X  '}</div>
                <div onClick={!inChange ? console.log : (e) => { e.preventDefault; setPermisions({ ...permisions, empresas: !permisions.empresas }) }}>Empresas {permisions.empresas ? '  ✓  ' : '  X  '}</div>
                <div onClick={!inChange ? console.log : (e) => { e.preventDefault; setPermisions({ ...permisions, vendedores: !permisions.vendedores }) }}>Ventas {permisions.vendedores ? '  ✓  ' : '  X  '}</div>
                <button onClick={(e) => { e.preventDefault; setInChange(!inChange),funtions(permisions) }}>
                    {inChange ? 'Aceptar' : 'Modificar'}
                </button>
            </div>

        </>
    )
}
export default PermisionComp