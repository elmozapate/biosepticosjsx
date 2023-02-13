import { EstadosServiciosObj } from "../models/selectores"

const RevisarVehiculos = (props) => {
    const { misServiciosSort = EstadosServiciosObj, actualizarEstado = console.log, sortBy = console.log, misServicios = { array: [] } } = props
    return (
        <div className="service-list">
            <>

                {
                    misServicios.array.length > 0 ? <>
                        {misServicios.array.map((key, i) => {
                            return (
                                <>
                                    <p id={`safe-${i}`}><p className="p">ID     :</p>  <span>{` ${key.id.split('-')[1]}`}</span>    <p className="p">PLACA : </p>  <span>{key.datosLegales.placa}</span>      <p className="p">PROGRAMADO:</p>  <span>{key.datosOperativos.rutaActual !== '' ? key.datosOperativos.rutaActual : 'SIN RUTA'}</span>    <p className="p">ESTADO:</p>  <span onClick={(e) => { e.preventDefault(); actualizarEstado({ tipo: 'vehiculo', accion: 'estado', valor: !key.datosOperativos.activo }) }}> {key.datosOperativos.activo ? 'si' : 'no'} </span>  </p>
                                </>
                            )
                        })}</> : <>SIN SERVICIOS</>
                }
            </>
        </div>
    )
}
export default RevisarVehiculos