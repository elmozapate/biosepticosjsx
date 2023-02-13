import { EstadosServiciosObj } from "../models/selectores"

const RevisarServicios = (props) => {
    const { logistica = false, misServiciosSort = EstadosServiciosObj, actualizarEstado = console.log, sortBy = console.log, misServicios = { array: [] } } = props
    return (
        <div className="service-list">
            <>
                {!logistica ? <>

                    {
                        (misServiciosSort.sort ? misServiciosSort[misServiciosSort.sort] : misServicios).array.length > 0 ? <>
                            <table>
                                <thead>
                                    <tr> <th >id:</th>
                                        <th >TIPO:</th>
                                        <th >CANTIDAD:</th>
                                        <th >PROGRAMADO:</th>
                                        <th >ESTADO:</th></tr>
                                </thead>
                                <tbody>                            {(misServiciosSort[misServiciosSort.sort]) && (misServiciosSort[misServiciosSort.sort]).array && (misServiciosSort[misServiciosSort.sort]).array.map((key, i) => {
                                    return (
                                        key.id && <tr id={`safe-${i}`}>
                                            <td id={`safeb-${i}`}>{` ${key.id.split('-')[1]}`}</td>
                                            <td id={`safefdb-${i}`}>{key.tipoDeServicio.tipo}</td>
                                            <td id={`safdeb-${i}`}>{key.tipoDeServicio.cantidad}</td>
                                            <td id={`sdfafe-${i}`}> {key.shedule.estado === 'inactivo' ? 'SIN PROGRAMAR' : key.shedule.estado} </td>
                                            <td id={`safeab-${i}`} onClick={(e) => { e.preventDefault(); actualizarEstado({ tipo: key.tipoDeServicio.tipo, accion: 'estado', valor: !key.shedule.activo }) }} >{key.shedule.activo ? 'ACTIVO' : 'INACTIVO'}</td>
                                        </tr>
                                    )
                                })}
                                </tbody>

                            </table>
                        </> : <>SIN SERVICIOS</>
                    }
                </> : <>
                    {

                        misServiciosSort[misServiciosSort.sort] && (misServiciosSort[misServiciosSort.sort]).array.length > 0 ? <>

                            {misServiciosSort[misServiciosSort.sort].array.map((key, i) => {
                                return (
                                    <>{key.app && <p id={`pid-${i}`}>
                                        <span id={`pidspan-${i}`}>
                                            <span id={`pidspandos-${i}`}>   {key.app.type}  :</span>
                                            <span id={`pidspantres-${i}`}>  {key.datosPersonales.nombre}  {key.datosPersonales.apellido.split(' ')[0]}</span>

                                        </span>
                                    </p>}</>
                                )
                            })}
                        </> : <>SIN SERVICIOS</>
                    }</>}
            </>
        </div >
    )
}
export default RevisarServicios