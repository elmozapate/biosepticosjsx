import StringsObj from "@/engine/content"
import StylesObj from "@/styles/stylesObj"
import { useEffect, useState } from "react"
import CrearRutasVehiculo from "../componentes/crearRutasVehiculo"
import { ModeloBiosepticos } from "../models/modeloBiosepticos"
import { EstadosServiciosObj } from "../models/selectores"
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const RevisarVehiculos = (props) => {
    const { modeloBiosepticos = ModeloBiosepticos, objStrings = objStringsInit, objCss = objCssInit, misServiciosSort = EstadosServiciosObj, actualizarEstado = console.log, sortBy = console.log, misServicios = { array: [] } } = props
    const [inOperativo, setInOperativo] = useState({
        active: false,
        vehiculo: {},
        inMode: ''
    })
    const verDiaVehiculo = (key) => {
        let rutaActiva = 'SIN RUTA'
        modeloBiosepticos.vehiculos.map((keyComp, i) => {
            let idVeh = keyComp.id
            if (key.id === idVeh) {
                modeloBiosepticos.rutasIndividuales.map((keyInd, iInd) => {
                    if (keyInd.vehiculo === idVeh) {

                        const fecha = new Date().toLocaleDateString()
                        const fechaCuted = fecha.split('/')
                        const fechaCompCuted = keyInd.fecha.split('-')
                        if (fechaCuted[0] === fechaCompCuted[0] && fechaCuted[1] === fechaCompCuted[1] && fechaCuted[2] === fechaCompCuted[2]) {
                            rutaActiva = keyInd.id.split('-')[1]
                        }
                    }
                })
            }


        })
        return rutaActiva
    }
    return (
        <div className="service-list">
            <>

                {inOperativo.active ?
                    <>
                        {
                            inOperativo.inMode === '' ? <>
                                <div className="colFlex">
                                    <span className="pointer" onClick={(e) => { e.preventDefault(); setInOperativo({ ...inOperativo, inMode: 'crear' }) }}> CREAR RUTA/S VEHICULO </span>
                                    <span className="pointer" onClick={(e) => { e.preventDefault(); setInOperativo({ ...inOperativo, inMode: 'modificar' }) }}> MODIFICAR RUTA/S VEHICULO </span>
                                    <span className="pointer" onClick={(e) => { e.preventDefault(); setInOperativo({ ...inOperativo, inMode: 'ver' }) }}> VER RUTA/S VEHICULO </span>
                                    <span className="pointer" onClick={(e) => { e.preventDefault(); setInOperativo({ ...inOperativo, inMode: 'historial' }) }}> HISTORIAL </span>
                                    <span className="pointer" onClick={(e) => { e.preventDefault(); setInOperativo({ ...inOperativo, active: false }) }}> VOLVER </span>
                                </div>
                            </> :
                                <>
                                    <div className="colFlex">

                                        {inOperativo.inMode === 'crear' && <>
                                            <CrearRutasVehiculo modeloBiosepticos={modeloBiosepticos} vehiculo={inOperativo.vehiculo} setInOperativo={setInOperativo} inOperativo={inOperativo} objStrings={objStrings} objCss={objCss} />
                                        </>}
                                        {inOperativo.inMode === 'modificar' && <>
                                        </>}
                                        {inOperativo.inMode === 'ver' && <>
                                        </>}
                                        {inOperativo.inMode === 'historial' && <>
                                        </>}
                                        <span className="pointer" onClick={(e) => { e.preventDefault(); setInOperativo({ ...inOperativo, inMode: '' }) }}> VOLVER </span>
                                    </div>

                                </>
                        }
                    </>
                    :
                    misServicios.array.length > 0 ? <>
                        {misServicios.array.map((key, i) => {
                            return (
                                <>
                                    <p id={`safe-${i}`}><p className="p">ID     :</p>  <span>{` ${key.id.split('-')[1]}`}</span>    <p className="p">PLACA : </p>  <span>{key.datosLegales.placa}</span>      <p className="p">RUTA HOY:</p>  <span>{verDiaVehiculo(key)}</span>    <p className="p">ESTADO:</p>  <span className="pointer" onClick={(e) => { e.preventDefault(); actualizarEstado({ tipo: 'vehiculo', accion: 'estado', valor: !key.datosOperativos.activo, vehiculo: key.id }) }}> {key.datosOperativos.activo ? 'si' : 'no'} </span> <span className="pointer" onClick={(e) => { e.preventDefault(); setInOperativo({ ...inOperativo, vehiculo: key, active: true }) }}> OPERACION </span> </p>
                                </>
                            )
                        })}</> : <>SIN SERVICIOS</>
                }
            </>
        </div>
    )
}
export default RevisarVehiculos