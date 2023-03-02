import StringsObj from "@/engine/content"
import StylesObj from "@/styles/stylesObj"
import { useEffect, useState } from "react"
import CrearRutasVehiculo from "../componentes/crearRutasVehiculo"
import DateView from "../componentes/dateView"
import { ModeloBiosepticos } from "../models/modeloBiosepticos"
import { ModeloVehiculo } from "../models/modeloVehiculo"
import { EstadosServiciosObj } from "../models/selectores"
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const RevisarVehiculos = (props) => {
    const { vehiculo = ModeloVehiculo, modeloBiosepticos = ModeloBiosepticos, objStrings = objStringsInit, objCss = objCssInit, misServiciosSort = EstadosServiciosObj, actualizarEstado = console.log, sortBy = console.log, misServicios = { array: [] } } = props
    const [modoCrearVehiculo, setModoCrearVehiculo] = useState({
        mode: 'mes'
    })
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

                        if (parseInt(fechaCuted[0]) === parseInt(fechaCompCuted[0]) && parseInt(fechaCuted[1]) === parseInt(fechaCompCuted[1]) && parseInt(fechaCuted[2]) === parseInt(fechaCompCuted[2])) {
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
                                            <>
                                                <DateView vehiculo={inOperativo.vehiculo} modeloBiosepticos={modeloBiosepticos} modo={modoCrearVehiculo.mode} verRuta crearRuta />
                                            </>
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
                                    <p id={`safe-${i}`}><p className="smallSize p " >ID     :</p>  <span className= 'mediumSize'>{` ${key.id.split('-')[1]}`}</span>    <p className="mediumSize p">PLACA : </p>  <span className= 'mediumSize'>{key.datosLegales.placa}</span>      <p className="mediumSize p">RUTA HOY:</p>  <span className= 'mediumSize'>{verDiaVehiculo(key)}</span>    <p className="mediumSize p ">ESTADO:</p>  <span className="pointer smallSize" onClick={(e) => { e.preventDefault(); actualizarEstado({ tipo: 'vehiculo', accion: 'estado', valor: !key.datosOperativos.activo, vehiculo: key.id }) }}> {key.datosOperativos.activo ?'si':'no'}</span> <span className="pointer mediumSize" onClick={(e) => { e.preventDefault(); setInOperativo({ ...inOperativo, vehiculo: key, active: true }) }}> OPERACION </span> </p>
                                </>
                            )
                        })}</> : <>SIN SERVICIOS</>
                }
            </>
        </div>
    )
}
export default RevisarVehiculos