import ObjShedule, { ObjDias } from "@/bioApp/models/modeloShedule";
import ModeloUsuario, { ObjPermisions } from "@/bioApp/models/modelosUsuario";
import StylesObj from "@/styles/stylesObj";
import { useState } from "react";
const objCssInit = StylesObj()
const usuarioDefault = ModeloUsuario()

const DaysComp = (props) => {
    const { dias = ObjDias, setPermisions = console.log, inActualize = false, activeUser = { selectOp: '', userInfo: usuarioDefault }, setActiveUser = console.log, funtions = console.log, objCss = objCssInit } = props
    const [inChange, setInChange] = useState(inActualize ? false : true)
    return (
        <>
            <div >
                <div onClick={!inChange ? console.log : (e) => { e.preventDefault; setPermisions({ ...dias, lunes: !dias.lunes }) }}>lunes {dias.lunes ? '  ✓  ' : '  X  '}</div>
                <div onClick={!inChange ? console.log : (e) => { e.preventDefault; setPermisions({ ...dias, martes: !dias.martes }) }}>martes {dias.martes ? '  ✓  ' : '  X  '}</div>
                <div onClick={!inChange ? console.log : (e) => { e.preventDefault; setPermisions({ ...dias, miercoles: !dias.miercoles }) }}>miercoles {dias.miercoles ? '  ✓  ' : '  X  '}</div>
                <div onClick={!inChange ? console.log : (e) => { e.preventDefault; setPermisions({ ...dias, jueves: !dias.jueves }) }}>jueves {dias.jueves ? '  ✓  ' : '  X  '}</div>
                <div onClick={!inChange ? console.log : (e) => { e.preventDefault; setPermisions({ ...dias, viernes: !dias.viernes }) }}>viernes {dias.viernes ? '  ✓  ' : '  X  '}</div>
                <div onClick={!inChange ? console.log : (e) => { e.preventDefault; setPermisions({ ...dias, sabado: !dias.sabado }) }}>sabado {dias.sabado ? '  ✓  ' : '  X  '}</div>

                <button onClick={(e) => { e.preventDefault; /* !inChange ? console.log : funtions(dias);  */setInChange(!inChange) }}>
                    {inChange ? 'Aceptar' : 'Modificar'}
                </button>
            </div>

        </>
    )
}
export default DaysComp