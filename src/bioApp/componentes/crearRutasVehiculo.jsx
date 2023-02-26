import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import { ModeloVehiculo } from "../models/modeloVehiculo"
import { useState } from "react"
import DateView from "./dateView"
import { ModeloBiosepticos } from "../models/modeloBiosepticos"
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const CrearRutasVehiculo = (props) => {

    const { modeloBiosepticos = ModeloBiosepticos, vehiculo = ModeloVehiculo, setInOperativo = console.log, inOperativo = { active: false, inMode: '' }, objStrings = objStringsInit, objCss = objCssInit } = props
    const [modoCrearVehiculo, setModoCrearVehiculo] = useState({
        mode: ''
    })
    return (
        <div className="colFlex">
            {
                modoCrearVehiculo.mode === '' ? <>
                    <span className="pointer" onClick={(e) => { e.preventDefault(); setModoCrearVehiculo({ ...modoCrearVehiculo, mode: 'dia' }) }}> CREAR RUTA DIA </span>
                    <span className="pointer" onClick={(e) => { e.preventDefault(); setModoCrearVehiculo({ ...modoCrearVehiculo, mode: 'semana' }) }}> CREAR RUTAs SEMANA</span>
                    <span className="pointer" onClick={(e) => { e.preventDefault(); setModoCrearVehiculo({ ...modoCrearVehiculo, mode: 'mes' }) }}> CREAR RUTAs MES </span>
                </>
                    :
                    <>
                        <DateView vehiculo={vehiculo} modeloBiosepticos={modeloBiosepticos} modo={modoCrearVehiculo.mode} crearRuta />
                    </>
            }
            <span className="pointer" onClick={modoCrearVehiculo.mode === '' ? (e) => { e.preventDefault(); setInOperativo({ ...inOperativo, inMode: '' }) } : (e) => { e.preventDefault(); setModoCrearVehiculo({ ...modoCrearVehiculo, mode: '' }) }}> VOLVER </span>
        </div>
    )
}
export default CrearRutasVehiculo