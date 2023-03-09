import DateSelect from "@/components/commons/dateSelect"
import SelectComp from "@/components/commons/selector"
import MiddlewareSelector from "@/middleware/askSelector"
import { Socket } from "@/middleware/routes/connect/socket/socketOn"
import { useEffect, useState } from "react"
import { ModeloBiosepticos } from "../models/modeloBiosepticos"
import { EstadosServiciosObj } from "../models/selectores"
const socket = Socket

let resId = 0

const RevisarServicios = (props) => {
    const { dateSelected = {
        active: false,
        servicios: { array: [] },
        dia: {},
        asignarRuta: { state: false, data: {} }
    }, setDateSelected = console.log, setReqState = console.log, reqState = { reqId: Number(), state: false, peticion: '', type: '', inList: [] }, modeloBiosepticos = ModeloBiosepticos, rutaDia = '', vehiculosDispo = { array: [], arrayAll: [] }, verDiaVehiculo = console.log, obras = { array: [] }, rutas = { rutas: [] }, inCalendario = false, logistica = false, misServiciosSort = EstadosServiciosObj, actualizarEstado = console.log, sortBy = console.log, misServicios = { array: [] } } = props
    const [inAsign, setInAsign] = useState({ state: false, obj: { id: '', value: {}, ready: false } })
    const getDireccion = (key, typo) => {
        let direccion = 'SIN DATOS'
        obras.array.map((keyObra, iObra) => {
            if (keyObra.id === key.obra) {
                direccion = keyObra.direccion[typo] === '' ? 'SIN DATOS' : keyObra.direccion[typo]
            }
        })
        return direccion
    }
    const editarSevicio = (value, state) => {
        if (!state) {
            let props = {}
            let sended = false
            modeloBiosepticos.vehiculos.map((key, i) => {
                if (key.datosLegales.placa === (inAsign.obj.value.split(' ')[inAsign.obj.value.split(' ').length - 1]).split('-')[1]) {
                    vehiculosDispo.arrayAll.map((keyV, iV) => {
                        if (keyV.vehiculo === key.id && !sended) {
                            props = {
                                servicio: value,
                                rutaIndividual: vehiculosDispo.arrayAll[iV].id,
                                conductor: vehiculosDispo.arrayAll[iV].encargados.conductor,
                                auxiliar: vehiculosDispo.arrayAll[iV].encargados.auxiliar,
                                ruta: rutaDia,
                                vehiculo: vehiculosDispo.arrayAll[iV].vehiculo,
                            }
                            sended = true
                        }
                    })
                }
            })
            asignarlaRuta(props)

        } else {
            let props = {}
            modeloBiosepticos.rutasIndividuales.map((key, i) => {
                if (key.id === value.ruta) {
                    props = {
                        servicio: value,
                        rutaIndividual: value.ruta,
                        conductor: value.encargadosDeRuta.encargados.conductor,
                        auxiliar: value.encargadosDeRuta.encargados.auxiliar,
                        ruta: value.encargadosDeRuta.rutaDia,
                        vehiculo: key.vehiculo,
                    }
                }
            })
            desAsignarlaRuta(props);
        }
    }
    const asignarlaRuta = (props) => {
        const res = MiddlewareSelector({
            ask: 'edit-servicios', data: props
        })
        resId = res
    }
    const desAsignarlaRuta = (props) => {
        const res = MiddlewareSelector({
            ask: 'edit-servicios-delete', data: props
        })
        resId = res
    }
    useEffect(() => {
        socket.on("bioApp", (msg) => {
            const actionTodo = msg.actionTodo
            const Data = msg.dataIn
            switch (actionTodo) {
                case 'dataRes-editServicios':
                    if (parseInt(msg.resId) === parseInt(resId)) {
                        setInAsign({ state: false, obj: { value: {}, ready: false, id: '' } })
                    }
                    break;
                default:
                    break;
            }
        })
    }, [])
    return (
        <div className="service-list">
            <>
                {!logistica ? <>

                    {
                        (misServiciosSort.sort ? misServiciosSort[misServiciosSort.sort] : misServicios).array.length > 0 ? <>
                            <table>
                                <thead>
                                    <tr>
                                        {!inCalendario ? <th className={inCalendario ? '' : "mediumSize"} >id</th> : <></>}
                                        <th className={inCalendario ? 'small' : "bigSize"} >TIPO</th>
                                        <th className={inCalendario ? 'medium' : "mediumSize"}>CANTIDAD</th>
                                        <th className={inCalendario ? 'big' : "bigSizeS"} >PROGRAMADO</th>
                                        {!inCalendario ? <th className={inCalendario ? 'big' : "mediumSize"} >ESTADO</th> : <></>}
                                        {inCalendario ? <th className={inCalendario ? 'medium' : ""} >Departamento</th> : <></>}
                                        {inCalendario ? <th className={inCalendario ? 'medium' : ""} >Ciudad</th> : <></>}
                                        {inCalendario ? <th className={inCalendario ? 'medium' : ""}>Sector</th> : <></>}
                                        {inCalendario ? <th className={inCalendario ? 'medium' : ""} >ASIGNACION</th> : <></>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {(misServiciosSort[misServiciosSort.sort]) && (misServiciosSort[misServiciosSort.sort]).array && (misServiciosSort[misServiciosSort.sort]).array.map((key, i) => {
                                        let nowDate = key.shedule.fechaDeInicio.split('T')[0].toString().split('-')
                                        let diaAentrar = parseInt(new Date().toLocaleDateString().split('/')[0]),
                                            mesAentrar = parseInt(new Date().toLocaleDateString().split('/')[1]),
                                            anoAentrar = parseInt(new Date().toLocaleDateString().split('/')[2]);
                                        return (
                                            key.id && ((inCalendario && key.shedule.activo) || !inCalendario) && <tr className={(!(parseInt(nowDate[0]) >= anoAentrar && parseInt(nowDate[1]) >= mesAentrar && parseInt(nowDate[2]) >= diaAentrar) && (key.shedule.estado !== 'completado')) ?(key.shedule.estado === 'programado') ? 'bgColor-blue' : key.shedule.estado !== 'completado' ? 'bgColor-red' : '':key.shedule.estado !== 'completado'?!(parseInt(nowDate[0]) >= anoAentrar && parseInt(nowDate[1]) >= mesAentrar && parseInt(nowDate[2]) >= diaAentrar)?'bgColor-red':(parseInt(nowDate[0]) >= anoAentrar && parseInt(nowDate[1]) >= mesAentrar && parseInt(nowDate[2]) === diaAentrar)?'bgColor-yellow':'bgColor-blue':'bgColor-green'} id={`safe-${i}`
                                            }>
                                                {!inCalendario ? <td className={inCalendario ? 'small' : "mediumSize"} id={`safeb-${i}`}>{` ${key.id.split('-')[1]}`}</td> : <></>}
                                                <td className={inCalendario ? 'small' : "bigSize"} id={`safefdb-${i}`}>{inCalendario ? (key.tipoDeServicio.tipo === 'Alquiler de baños' ? 'SAB' : 'SRSO') : key.tipoDeServicio.tipo}</td>
                                                <td className={inCalendario ? 'medium' : "mediumSize"} id={`safdeb-${i}`}>{key.tipoDeServicio.cantidad}</td>
                                                <td className={inCalendario ? 'big' : "bigSizeS"} id={`sdfafe-${i}`}> {key.shedule.estado === 'inactivo' ? 'SIN PROGRAMAR' : key.shedule.estado} </td>
                                                {!inCalendario ? <td className={inCalendario ? 'medium' : "mediumSize"} id={`safeab-${i}`} onClick={(e) => { e.preventDefault(); actualizarEstado({ tipo: key.tipoDeServicio.tipo, accion: 'estado', valor: !key.shedule.activo }) }} >{key.shedule.activo ? 'ACTIVO' : 'INACTIVO'}</td> : <></>}
                                                {inCalendario ? <td className={inCalendario ? 'medium' : "mediumSize"} >{

                                                    getDireccion(key, 'departamento')
                                                }</td> : <></>}
                                                {inCalendario ? <td className={inCalendario ? 'medium' : ""} >{
                                                    getDireccion(key, 'ciudad')

                                                }</td> : <></>}
                                                {inCalendario ? <td className={inCalendario ? 'medium' : ""}>{
                                                    getDireccion(key, 'barrio')

                                                }</td> : <></>}
                                                {inCalendario ? <td className={inCalendario ? 'medium' : ""}>{key.ruta !== '' ? <>{key.ruta}{key.shedule.estado === 'programado' && (parseInt(nowDate[0]) >= anoAentrar && parseInt(nowDate[1]) >= mesAentrar && parseInt(nowDate[2]) >= diaAentrar) && <span className="pointer" onClick={(e) => {
                                                    e.preventDefault(); editarSevicio(key, true)
                                                }}>DESASIGNAR</span>}</> : !inAsign.state ? (parseInt(nowDate[0]) >= anoAentrar && parseInt(nowDate[1]) >= mesAentrar && parseInt(nowDate[2]) >= diaAentrar) && <span className="pointer" onClick={(e) => {
                                                    e.preventDefault();
                                                    verDiaVehiculo(key); setInAsign({ ...inAsign, state: true, obj: { ...inAsign.obj, id: key.id } })
                                                }}>ASIGNAR</span> : <>{key.id === inAsign.obj.id && < SelectComp item={'encargado'} items={vehiculosDispo.array} funtions={(e) => {
                                                    e.preventDefault();
                                                    setInAsign({ ...inAsign, obj: { ...inAsign.obj, ready: true, value: e.target.value } })

                                                }} id={'encargado'} required />}
                                                    {
                                                        inAsign.obj.ready && inAsign.obj.id === key.id ?
                                                            <button onClick={(e) => {
                                                                e.preventDefault();
                                                                editarSevicio(key)
                                                                /*  setInAsign({ state: false, obj: { value: {}, ready: false, id: '' } }) */

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
                            <p id={`pidspan-0`}>
                                <span className="bigSizeS" id={`pidspandos-s0`}>   TIPO</span>
                                <span className="bigSize" id={`pidspantres-s0`}> USUARIO</span>
                                <span className="mediumSize" id={`pidspancuatros-0`}> MAS INFO</span>

                            </p>
                            {misServiciosSort[misServiciosSort.sort].array.map((key, i) => {
                                return (
                                    <>{key.app && <p id={`pid-${i}`}>
                                        <span className="bigSizeS" id={`pidspantres-${i}`}>   {key.app.type} </span>
                                        <span className="bigSize" id={`pidspandos-${i}`}> {key.datosPersonales.nombre}  {key.datosPersonales.apellido.split(' ')[0]}</span>
                                        <span className="pointer mediumSize" id={`pidspancuatro-${i}`}> VER</span>

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