import SelectComp from "@/components/commons/selector"
import { useState } from "react"
import { EstadosServiciosObj } from "../models/selectores"

const RevisarServicios = (props) => {
    const { vehiculosDispo = [], verDiaVehiculo = console.log, obras = { array: [] }, rutas = { rutas: [] }, inCalendario = false, logistica = false, misServiciosSort = EstadosServiciosObj, actualizarEstado = console.log, sortBy = console.log, misServicios = { array: [] } } = props
    const [inAsign, setInAsign] = useState({ state: false, obj: { id: '', value: {}, ready: false } })
    const getDireccion = (key, typo) => {
        console.log('asdaasas');
        let direccion = 'SIN DATOS'
        obras.array.map((keyObra, iObra) => {
            if (keyObra.id === key.obra) {
                direccion = keyObra.direccion[typo] === '' ? 'SIN DATOS' : keyObra.direccion[typo]
            }
        })
        return direccion
    }
    return (
        <div className="service-list">
            <>
                {!logistica ? <>

                    {
                        (misServiciosSort.sort ? misServiciosSort[misServiciosSort.sort] : misServicios).array.length > 0 ? <>
                            <table>
                                <thead>
                                    <tr>
                                        {!inCalendario ? <th >id</th> : <></>}
                                        <th className={inCalendario ? 'small' : ""} >TIPO</th>
                                        <th className={inCalendario ? 'medium' : ""}>CANTIDAD</th>
                                        <th className={inCalendario ? 'big' : ""} >PROGRAMADO</th>
                                        {!inCalendario ? <th >ESTADO</th> : <></>}
                                        {inCalendario ? <th className={inCalendario ? 'medium' : ""} >Departamento</th> : <></>}
                                        {inCalendario ? <th className={inCalendario ? 'medium' : ""} >Ciudad</th> : <></>}
                                        {inCalendario ? <th className={inCalendario ? 'medium' : ""}>Sector</th> : <></>}
                                        {inCalendario ? <th className={inCalendario ? 'medium' : ""} >ASIGNACION</th> : <></>}
                                    </tr>
                                </thead>
                                <tbody>                            {(misServiciosSort[misServiciosSort.sort]) && (misServiciosSort[misServiciosSort.sort]).array && (misServiciosSort[misServiciosSort.sort]).array.map((key, i) => {
                                    return (
                                        key.id && ((inCalendario && key.shedule.activo) || !inCalendario) && <tr tr id={`safe-${i}`
                                        }>
                                            {!inCalendario ? <td className={inCalendario ? 'small' : ""} id={`safeb-${i}`}>{` ${key.id.split('-')[1]}`}</td> : <></>}
                                            <td className={inCalendario ? 'small' : ""} id={`safefdb-${i}`}>{inCalendario ? (key.tipoDeServicio.tipo === 'Alquiler de baños' ? 'SAB' : 'SRSO') : key.tipoDeServicio.tipo}</td>
                                            <td className={inCalendario ? 'medium' : ""} id={`safdeb-${i}`}>{key.tipoDeServicio.cantidad}</td>
                                            <td className={inCalendario ? 'big' : ""} id={`sdfafe-${i}`}> {key.shedule.estado === 'inactivo' ? 'SIN PROGRAMAR' : key.shedule.estado} </td>
                                            {!inCalendario ? <td className={inCalendario ? 'medium' : ""} id={`safeab-${i}`} onClick={(e) => { e.preventDefault(); actualizarEstado({ tipo: key.tipoDeServicio.tipo, accion: 'estado', valor: !key.shedule.activo }) }} >{key.shedule.activo ? 'ACTIVO' : 'INACTIVO'}</td> : <></>}
                                            {inCalendario ? <td className={inCalendario ? 'medium' : ""} >{

                                                getDireccion(key, 'departamento')
                                            }</td> : <></>}
                                            {inCalendario ? <td className={inCalendario ? 'medium' : ""} >{
                                                getDireccion(key, 'ciudad')

                                            }</td> : <></>}
                                            {inCalendario ? <td className={inCalendario ? 'medium' : ""}>{
                                                getDireccion(key, 'barrio')

                                            }</td> : <></>}
                                            {inCalendario ? <td className={inCalendario ? 'medium' : ""}>{key.ruta !== '' ? key.ruta : !inAsign.state ? <span className="pointer" onClick={(e) => { e.preventDefault(); verDiaVehiculo(key); setInAsign({ ...inAsign, state: true, obj: { ...inAsign.obj, id: key.id } }) }}>ASIGNAR</span> : <>{key.id === inAsign.obj.id && < SelectComp item={'encargado'} items={vehiculosDispo.array} funtions={(e) => {
                                                e.preventDefault();
                                                setInAsign({ ...inAsign, obj: { ...inAsign.obj, ready: true, value: e.target.value } })

                                            }} id={'encargado'} required />}
                                                {
                                                    inAsign.obj.ready && inAsign.obj.id === key.id ?
                                                        <button onClick={(e) => {
                                                            e.preventDefault();
                                                            setInAsign({ state: false, obj: { value: {}, ready: false, id: '' } })

                                                        }} >SALVAR</button> : inAsign.obj.id === key.id &&
                                                        <><button onClick={(e) => {
                                                            e.preventDefault();
                                                            setInAsign({ state: false, obj: { value: {}, ready: false, id: '' } })

                                                        }} >cancelar</button></>
                                                }
                                            </>
                                            }</td> : <></>}
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