import FormularioCrearRutaVehiculo from "@/bioDashBoard/componentes/formularios/formularioCrearRutaVehiculo"
import FormularioAppUser from "@/bioDashBoard/componentes/formularios/formularioUserApp"
import InputComp from "@/components/commons/input"
import SelectComp from "@/components/commons/selector"
import StringsObj, { laSemana, MonthShedule, UserObj } from "@/engine/content"
import { CrearCalendario, CrearRutaDiaria } from "@/middleware/askSelector"
import StylesObj from "@/styles/stylesObj"
import { useEffect, useState } from "react"
import ContenedorServicios from "../empresas/contenedorServicios"
import RevisarServicios from "../empresas/revisarServicios"
import ServiceSelector from "../empresas/serviceSelector"
import { crearMesPlaneado, ModeloBiosepticos } from "../models/modeloBiosepticos"
import { ObjRutaDia } from "../models/modeloRutaIndividual"
import { ModeloVehiculo } from "../models/modeloVehiculo"
import { EstadosServicios, EstadosServiciosObj, EstadosUsersObj } from "../models/selectores"
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const userStructure = UserObj()
const DateView = (props) => {
    const { vehiculo = ModeloVehiculo, modo = 'dia', crearRuta = false, rutasIn = false, obras = { array: [] }, rutas = { array: [] }, objStrings = objStringsInit, objCss = objCssInit, userData = userStructure, servicios = { array: [] }, modeloBiosepticos = ModeloBiosepticos, calendario = false } = props
    const [misServiciosSort, setMisServiciosSort] = useState(EstadosServiciosObj)
    const [rutaSelected, setRutaSelected] = useState({
        modo: modo,
        semana: -1,
        dias: [],
        stage: 0,
        mes: parseInt(new Date().toLocaleDateString().split('/')[1]) - 1,
        ano: parseInt(new Date().toLocaleDateString().split('/')[2])
    })
    const mesMaximo = parseInt(new Date().toLocaleDateString().split('/')[1]) - 1

    const [fecha, setfecha] = useState({
        diaAentrar: parseInt(new Date().toLocaleDateString().split('/')[0]),
        mesAentrar: parseInt(new Date().toLocaleDateString().split('/')[1]) - 1,
        anoAentrar: parseInt(new Date().toLocaleDateString().split('/')[2]),
    })
    const [vehiculosDispo, setVehiculosDispo] = useState({ array: [] })
    const [mes, setMes] = useState({
        array: calendario ? modeloBiosepticos.calendario.ano : []
    })
    const [dateSelected, setDateSelected] = useState({
        active: false,
        servicios: { array: [] },
        dia: {},
        asignarRuta: { state: false, data: {} }
    })
    let theDate2 = new Date()
    theDate2.setMonth(fecha.mesAentrar)
    theDate2.setDate(fecha.diaAentrar)
    theDate2.setFullYear(fecha.anoAentrar)
    const ckekarRutas = (value) => {
        let many = 0
        let rutaHayada = []
        modeloBiosepticos.rutasIndividuales.map((key, i) => {
            const reqFecha = key.fecha.split('-')
            if (parseInt(reqFecha[0]) === value.dia.dia && parseInt(reqFecha[1]) === (value.dia.mes + 1) && parseInt(reqFecha[2]) === value.dia.ano) {
                many++
                rutaHayada.push(key)
            }
        })
        return { state: many, array: rutaHayada }
    }
    const theDate = { numDate: theDate2, extraDate: Date(theDate2).split(' ') }
    const appDate = {
        dia: fecha.diaAentrar,
        mes: fecha.mesAentrar,
        año: fecha.anoAentrar,
        hora: theDate.extraDate[4].split(':').slice(0, -1).toString().replace(',', ':'),
        diaSemana: theDate.extraDate[0],
        zonaHoraria: theDate.extraDate[5],
        pais: theDate.extraDate[theDate.extraDate.length - 1],
        date: theDate2
    }
    let monthArray = []
    let lastday = 1
    const makeMonth = (anoEn, mesEn, diaEn, semanaEn, calendario, newMonth) => {
        if (!calendario) {
            monthArray = []
            lastday = 1
            for (let index = 0; index < 32; index++) {
                let monthDay = new Date()
                monthDay.setFullYear(anoEn ? anoEn : fecha.anoAentrar)
                monthDay.setMonth(mesEn ? mesEn : fecha.mesAentrar)
                monthDay.setDate(((index + 1)))

                const theDateMonth = monthDay.toLocaleDateString()
                const theDateCutedMonth = theDateMonth.split('/')
                if (parseInt(theDateCutedMonth[1]) === parseInt(mesEn ? mesEn : appDate.mes) + 1 /* && parseInt(theDateCutedMonth[0]) >= lastday */) {
                    newMonth && CrearRutaDiaria((ObjRutaDia({ mes: mesEn, dia: (index + 1) }, userData.id)))
                    lastday = parseInt(theDateCutedMonth[0])
                    monthArray.push(monthDay);
                }
            }
            if (diaEn && diaEn > 0) {
                setMes({
                    ...mes,
                    array: MonthShedule(monthArray, fecha.mesAentrar, fecha.anoAentrar, fecha.diaAentrar)
                })
            }
        } else {
            if (modeloBiosepticos.calendario && modeloBiosepticos.calendario.ano && modeloBiosepticos.calendario.ano.length > 0) {
                setMes({
                    ...mes,
                    array: modeloBiosepticos.calendario.ano[fecha.mesAentrar].mesObj
                })
            }
        }
        return (!calendario ? MonthShedule(monthArray, mesEn, anoEn, diaEn, semanaEn) : {}
        )


    }

    const crearNuevoAno = () => {
        const añoPlaeando = []
        let ultimaSemana = 0
        for (let index = 0; index < 12; index++) {
            const mesNuevo = makeMonth(2023, index, -1, ultimaSemana, false, true)
            ultimaSemana = mesNuevo[mesNuevo.length - 1].dias[mesNuevo[mesNuevo.length - 1].dias.length - 1].dia === 'off' ? (mesNuevo[mesNuevo.length - 1].numSemana) - 1 : (mesNuevo[mesNuevo.length - 1].numSemana);
            añoPlaeando.push(crearMesPlaneado(2023, index, mesNuevo))

        }
        CrearCalendario(añoPlaeando)
    }

    const handle = (e) => {
        e.preventDefault();
        const id = e.target.id
        const value = e.target.value
        setfecha({
            ...fecha,
            [id]: parseInt(value)
        })
    }
    const checkDia = (dia) => {
        let makeArray = []
        dia && dia.servicios && dia.servicios.map((keyPp, iPp) => {
            servicios.array.map((key, i) => {
                if (key.id === keyPp) {
                    makeArray.push(key)
                }
            })
        })
        setDateSelected({
            ...dateSelected,
            active: true,
            servicios: { array: makeArray },
            dia: dia
        })
        countMany()

    }

    const crearSemanaRuta = (semana) => {
        let semanaArray = []
        mes.array.map((key, i) => {
            key.dias.map((keyDias, iDias) => {
                if (i === semana && keyDias.dia !== 'off') {
                    semanaArray.push(key.dias[iDias].dia)
                }
            })

        })
        setRutaSelected({
            ...rutaSelected,
            dias: semanaArray,
            semana: semana
        })
    }
    const crearMesRutaVehiculo = () => {
        let mewArray = []
        mes.array.map((key, i) => {
            key.dias.map((keyDias, iDias) => {
                if (keyDias.dia !== 'off' && parseInt(keyDias.dia) >= fecha.diaAentrar) {
                    mewArray.push(keyDias.dia)
                }
            })
        })
        setRutaSelected({
            ...rutaSelected,
            dias: mewArray
        })
    }

    const checkDiaRuta = (dia) => {
        let makeArray = []
        rutas.array.map((keyRutas, iRutas) => {
            let resDia = keyRutas.fecha.split('T')[0]
            let reqDia = dia
            if (reqDia.dia !== 'off' && parseInt(resDia.split('-')[0]) === parseInt(reqDia['año']) && parseInt(resDia.split('-')[1]) === (parseInt(reqDia.mes) + 1) && parseInt(resDia.split('-')[2]) === (parseInt(reqDia.dia))) {
                makeArray.push(keyRutas)
            }
        })

        setDateSelected({
            ...dateSelected,
            active: true,
            servicios: { array: makeArray },
            dia: {
                ano: parseInt(dia['año']),
                mes: parseInt(dia.mes),
                dia: parseInt(dia.dia)
            }
        })
    }
    const countMany = () => {
        if (!rutasIn) {
            let newSquema = EstadosUsersObj
            let newSort = {
                verification: [],
                done: [],
                inactive: [],
                active: [],
                pending: [],
                all: dateSelected.servicios.array
            }
            dateSelected.servicios.array.map((key, i) => {
                if (key.shedule.estado !== 'completado') {
                    newSort.pending.push(key)
                }
            })
            dateSelected.servicios.array.map((key, i) => {
                if (key.shedule.activo) {
                    newSort.active.push(key)

                }
            })
            dateSelected.servicios.array.map((key, i) => {
                if (!key.shedule.activo) {
                    newSort.verification.push(key)

                }
            })
            dateSelected.servicios.array.map((key, i) => {
                if (key.shedule.estado === 'completado') {
                    newSort.done.push(key)
                }
            })
            dateSelected.servicios.array.map((key, i) => {
                if (key.shedule.estado === 'finalizado') {
                    newSort.inactive.push(key)
                }
            })
            EstadosServicios.map((key) => {
                newSquema[key] = { array: newSort[key], many: newSort[key].length }
            })
            return newSquema
        }

    }
    const sortBy = (sort) => {
        const resCount = countMany()
        setMisServiciosSort({
            ...misServiciosSort,
            ...resCount,
            sort: sort,
        })
        setDateSelected({
            ...dateSelected,
            array: resCount[sort].array
        })
    }
    const getDayRutas = (key, iSemana) => {

        let haveRutas = false;
        rutas.array.map((keyRutas, iRutas) => {
            let resDia = keyRutas.fecha.split('T')[0]
            let reqDia = key.dias[iSemana]

            if (key.dias[iSemana].dia !== 'off' && parseInt(resDia.split('-')[0]) === parseInt(reqDia['año']) && parseInt(resDia.split('-')[1]) === (parseInt(reqDia.mes) + 1) && parseInt(resDia.split('-')[2]) === (parseInt(reqDia.dia))) {
                haveRutas = 'ready'
                keyRutas.servicios && keyRutas.servicios.length > 0 ?
                    keyRutas.servicios.map((keySerRuta, iSerRuta) => {
                        servicios.array.map((keyServicios, iServicios) => {
                            if (keySerRuta === keyServicios.id
                            ) {
                                if (keyServicios.shedule.estado === "inactivo") {
                                    haveRutas = 'warning'
                                    return haveRutas
                                }
                                if (keyServicios.shedule.estado === "programado") {
                                    haveRutas = 'programado'

                                }
                                /* else {
                                    haveRutas = true

                                } */

                            }
                        })
                    })

                    : haveRutas = false
            }
        })
        return haveRutas
    }
    const setDiasRuta = (dia) => {
        const value = getStateDiaRuta(dia)
        if ((parseInt(dia) >= parseInt(fecha.diaAentrar))) {
            let oldArray = rutaSelected
            let arraydias = rutaSelected.dias;
            let newArray = []
            let inOut = false
            arraydias.map((keyMap, iMap) => {
                if (keyMap === dia) {
                    inOut = true
                }

            })
            let otherArray = []
            oldArray.dias.map((keyMap, iMap) => {
                if (keyMap === dia) {
                    console.log;
                } else {
                    otherArray.push(keyMap)

                }
            })
            oldArray.dias = value && rutaSelected.modo === 'variosDias' ? otherArray : rutaSelected.dias
            if (!inOut && !(value && rutaSelected.modo === 'variosDias')) {
                rutaSelected.modo === 'dia' && !value ? newArray.push(dia) : rutaSelected.modo === 'variosDias' && !value ? arraydias.push(dia) : console.log('falta');
            }
            (value && rutaSelected.modo === 'variosDias')
            setRutaSelected((value && rutaSelected.modo === 'variosDias' ? { ...oldArray } :
                {
                    ...rutaSelected, dias: (value && rutaSelected.modo === 'variosDias') ? otherArray : rutaSelected.modo === 'dia' ? newArray : rutaSelected.modo === 'variosDias' ? arraydias : []
                }))

        }


    }
    const verDiaVehiculo = (key) => {
        let vehiculosDia = []
        modeloBiosepticos.vehiculos.map((keyComp, i) => {
            let idVeh = keyComp.id
            modeloBiosepticos.rutasIndividuales.map((keyInd, iInd) => {
                if (keyInd.vehiculo === idVeh) {
                    const fecha = keyInd.fecha
                    const fechaCuted = fecha.split('-')
                    const fechaCompCuted = key.shedule.fechaDeInicio.toString().split('T')[0].split('-')
                    if (parseInt(fechaCuted[0]) === parseInt(fechaCompCuted[2]) && parseInt(fechaCuted[1]) === parseInt(fechaCompCuted[1]) && parseInt(fechaCuted[2]) === parseInt(fechaCompCuted[0])) {
                        modeloBiosepticos.users.map((keyUser, iUser) => {
                            if (keyUser.id === keyInd.encargados.conductor) {
                                console.log(keyComp, keyInd.encargados.conductor, `${keyUser.id} ${keyUser.datosPersonales.nombre} ${keyUser.datosPersonales.apellido.split(' ')[0]} VEH-${keyComp.datosLegales.placa}`);
                                console.log(vehiculosDia);
                                vehiculosDia.push(`${keyUser.id} ${keyUser.datosPersonales.nombre} ${keyUser.datosPersonales.apellido.split(' ')[0]} VEH-${keyComp.datosLegales.placa}`)
                            }
                        })
                    }
                }
            })


        })
        setVehiculosDispo({ ...vehiculosDispo, array: vehiculosDia })
    }
    const getStateDiaRuta = (dia) => {
        let arraydias = rutaSelected.dias;
        let state = false
        arraydias.map((keyMap, iMap) => {
            if (parseInt(keyMap) === parseInt(dia)) {
                state = true
            }
        })
        return state
    }
    const newServices = () => {
        let newServices = []
        dateSelected.servicios.array.map((key, i) => {
            key.servicios && key.servicios.map((keyS, iS) => {
                newServices.push(keyS)

            })

        })
        return newServices
    }
    useEffect(() => {
        makeMonth(fecha.anoAentrar, fecha.mesAentrar, fecha.diaAentrar, false, calendario)
    }, [modeloBiosepticos.calendario])
    useEffect(() => {
        !calendario && makeMonth(fecha.anoAentrar, fecha.mesAentrar, fecha.diaAentrar, false, calendario)
    }, [fecha])

    useEffect(() => {
        dateSelected.active && !rutasIn && countMany()
        dateSelected.active && !rutasIn && sortBy('all')
    }, [dateSelected.active])
    useEffect(() => {
        if (dateSelected.active && !rutasIn) {
            checkDia(dateSelected.dia)
            countMany()
            sortBy(misServiciosSort.sort)
        }
    }, [modeloBiosepticos.calendario])

    return (<>
        <>
            {dateSelected.active ? <div className='absolutedialog flex-row center'>
                <div className="flex-column">
                    {
                        rutasIn ?
                            <>
                                <div className="flex-row just-space service-list column">{
                                    dateSelected.asignarRuta.state ?
                                        <>
                                            ELIGE  EL SERVICIO A ASIGNAR
                                            <SelectComp item={'servicio'} items={newServices()}/*  funtions={handle} */ id={'servicio'} required />
                                            <button onClick={(e) => {
                                                e.preventDefault();
                                                setDateSelected({
                                                    ...dateSelected,
                                                    asignarRuta: { ...dateSelected.asignarRuta, state: false },
                                                })
                                            }}>volver</button>

                                        </>
                                        :
                                        <>
                                            <div>
                                                <p>{'  RUTAS  '} <span> fecha  : {dateSelected.dia.dia} - {dateSelected.dia.mes + 1} - {dateSelected.dia.ano} </span>{
                                                    dateSelected.servicios.array.map((key, i) => {
                                                        return (<>
                                                            <p> <span>ID:{key.id}</span><span>Rutas:{ckekarRutas(dateSelected).state}</span><span>Servicios:{key.servicios && key.servicios.length}</span> </p>
                                                        </>)
                                                    })

                                                }</p>
                                                <div className="stadisticsLargeRow" >

                                                    <p>Total: <span className="bgColor-blue">{0}</span></p>
                                                    <p>  Activos: <span className="bgColor-yellow">{0}</span>
                                                    </p>
                                                    <p> Pendientes: <span className="bgColor-red">{0}</span></p>
                                                    <p> En Ruta: <span className="bgColor-orange">{0}</span></p>
                                                    <p> Ok: <span className="bgColor-green">{0}</span></p>

                                                </div>


                                            </div>
                                            {
                                                dateSelected.servicios.array.length > 0 ? <>

                                                    {
                                                        rutasIn && ckekarRutas(dateSelected).state ? <>
                                                            {ckekarRutas(dateSelected).array.map((keyRuta, iRuta) => {
                                                                return (
                                                                    <><div className="flex-row">
                                                                        Id : <spam>{keyRuta.id}</spam>A cargo : <span>{keyRuta.encargados.conductor}</span> Servicios : <span>{keyRuta.servicios && keyRuta.servicios.length}</span><span onClick={(e) => { e.preventDefault(); setDateSelected({ ...dateSelected, asignarRuta: { state: true, data: { id: keyRuta.id, encargado: keyRuta.conductor } } }) }} className="pointer"> ver o dar servicios</span></div>
                                                                    </>
                                                                )

                                                            })}
                                                        </> : <>NO TIENES RUTAS INDIVIDUALES PARA ESTE DIA</>
                                                    }

                                                </> : <>
                                                    NO TIENES RUTA PARA HOY
                                                    <button onClick={(e) => {
                                                        e.preventDefault();

                                                    }}>CREAR RUTA DIARIA</button>
                                                </>
                                            }
                                            <button onClick={(e) => {
                                                e.preventDefault();
                                                setDateSelected({
                                                    ...dateSelected,
                                                    active: false,
                                                    servicios: { array: [] }
                                                })
                                            }}>volver</button>
                                        </>}</div>
                            </> : <>
                                <div className="flex-row just-space ">
                                    <h2>{'SERVICIOS'}</h2>   <button onClick={(e) => {
                                        e.preventDefault();
                                        setDateSelected({
                                            ...dateSelected,
                                            active: false,
                                            servicios: { array: [] }
                                        })
                                    }}>volver</button>
                                    <ServiceSelector userSort={false} misServiciosSort={misServiciosSort} sortBy={sortBy} />

                                </div>
                                <RevisarServicios vehiculosDispo={vehiculosDispo} verDiaVehiculo={verDiaVehiculo} obras={obras} rutas={rutas} inCalendario logistica={false} misServicios={dateSelected.servicios} sortBy={sortBy} misServiciosSort={misServiciosSort} />
                            </>
                    }

                </div>



            </div> : <></>}
            <div className='flex-row'>
                {calendario && mes.array && mes.array.length > 0 && <div className="stadistics-column">
                    {calendario && <div id={`idds-`} className={'row-space'}>
                        {fecha.mesAentrar > 0 ? <span onClick={(e) => {
                            e.preventDefault();
                            const dateOf = fecha.mesAentrar
                            setMes({
                                ...mes,
                                array: modeloBiosepticos.calendario.ano[dateOf - 1].mesObj
                            })
                            setfecha({
                                ...fecha,
                                mesAentrar: (dateOf) - 1
                            });
                        }}>MES ANTERIOR</span> : <div></div>}
                        {fecha.mesAentrar < 11 && <span onClick={(e) => {
                            e.preventDefault();
                            const dateOf = fecha.mesAentrar;
                            setMes({
                                ...mes,
                                array: modeloBiosepticos.calendario.ano[dateOf + 1].mesObj
                            })
                            setfecha({
                                ...fecha,
                                mesAentrar: dateOf + 1
                            });
                        }}>MES SIGUIENTE</span>}

                    </div>}
                    <h2>INFORMACION</h2>
                    <p>  Total Servicios : <span className="bgColor-blue">{modeloBiosepticos.calendario.ano[fecha.mesAentrar].totalServicios}</span></p>
                    <p> Servicios Activos : <span className="bgColor-yellow">{modeloBiosepticos.calendario.ano[fecha.mesAentrar].serviciosActivos}</span></p>
                    <p>Servicios Pendientes : <span className="bgColor-red">{modeloBiosepticos.calendario.ano[fecha.mesAentrar].serviciosPendientes}</span></p>
                    <p>Servicios Realizados : <span className="bgColor-green">{modeloBiosepticos.calendario.ano[fecha.mesAentrar].serviciosRealizados}</span></p>
                </div>}
                <div id={`iddsas`} className='column'>
                    {!calendario && !crearRuta && <div div >
                        <p>
                            SELECCIONE El MES                </p>

                        <SelectComp item={'mesAentrar'} items={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]} funtions={handle} id={'mesAentrar'} required month />
                        <p> SELECCIONE El AÑO
                        </p>
                        {!calendario && <InputComp type={'number'} id={'anoAentrar'} userData={fecha} value={fecha.anoAentrar} placeholder={'año'} funtions={handle} required />}
                    </div>}
                    <div id={`idds-`} className={calendario ? 'rowBig-header rowBig' : 'row'}>

                        {modo === 'mes' &&
                            <span className={`pointer ${rutaSelected.modo === 'dia' ? 'bgColor-green' : ''}`} onClick={(e) => { e.preventDefault(); crearMesRutaVehiculo() }}> CREAR RUTA MENSUAL</span>

                        }


                        {
                            laSemana.map((keySemana, iSemana) => {
                                return (
                                    <>
                                        {(keySemana === 'servicios' && calendario) || (keySemana !== 'servicios' && calendario) && <div className='day-header' id={`iddssh-${iSemana}`}>
                                            {keySemana}

                                        </div>}
                                    </>
                                )
                            })

                        }

                    </div>
                    {
                        crearRuta && (rutaSelected.modo === 'dia' || rutaSelected.modo === 'variosDias') &&
                        <>
                            <span className={`pointer ${rutaSelected.modo === 'dia' ? 'bgColor-green' : ''}`} onClick={(e) => { e.preventDefault(); setRutaSelected({ ...rutaSelected, modo: 'dia' }) }}> CREAR RUTAs UN DIA </span>
                            <span className={`pointer ${rutaSelected.modo === 'variosDias' ? 'bgColor-green' : ''}`} onClick={(e) => { e.preventDefault(); setRutaSelected({ ...rutaSelected, modo: 'variosDias' }) }}> CREAR RUTAs VARIOS DIAS </span>
                        </>
                    }
                    {
                        crearRuta && rutaSelected.dias && rutaSelected.dias.length > 0 ?
                            rutaSelected.stage == 0 ?
                                <span className={`pointer`} onClick={(e) => { e.preventDefault(); setRutaSelected({ ...rutaSelected, stage: 1 }) }}> SIGUIENTE </span> :
                                <>
                                    <span className={`pointer`} onClick={(e) => { e.preventDefault(); setRutaSelected({ ...rutaSelected, stage: 0 }) }}> atras </span>
                                    <FormularioCrearRutaVehiculo vehiculo={vehiculo} rutaSelected={rutaSelected} modeloBiosepticos={modeloBiosepticos} />
                                </>
                            : <></>
                    }
                    {
                        mes.array && mes.array.length > 0 && rutaSelected.stage == 0 ? mes.array.map((key, i) => {
                            let activeDays = 0

                            return (
                                <>

                                    <div id={`idds-`} className={calendario ? 'rowBig' : 'row'}>

                                        {
                                            laSemana.map((keySemana, iSemana) => {
                                                if (key && key.dias && key.dias[iSemana] && key.dias[iSemana].dia !== 'off' && (parseInt(key.dias[iSemana].dia) >= parseInt(fecha.diaAentrar))) {
                                                    activeDays = activeDays + 1
                                                }
                                                return (
                                                    <>
                                                        {(keySemana !== 'servicios' && !calendario) || (keySemana !== 'servicios' && calendario) ?
                                                            <div onClick={crearRuta ? rutaSelected.modo !== 'semana' ? (e) => {
                                                                e.preventDefault(); key && key.dias && key.dias[iSemana] && setDiasRuta(key.dias[iSemana].dia)

                                                            } : (e) => {
                                                                e.preventDefault(); console.log

                                                            } : rutasIn ? (e) => {
                                                                e.preventDefault();
                                                                key && key.dias && key.dias[iSemana] && key.dias[iSemana].dia !== 'off' ? (checkDiaRuta(key.dias[iSemana])/* , setfecha({
                                                                ...fecha,
                                                                diaAentrar: parseInt(key.dias[iSemana].dia)
                                                            }) */) : console.log('otromes');

                                                            } : calendario ? (e) => {
                                                                e.preventDefault();
                                                                key && key.dias && key.dias[iSemana] && key.dias[iSemana].dia !== 'off' ? (checkDia(key.dias[iSemana], iSemana)/* , setfecha({
                                                                ...fecha,
                                                                diaAentrar: parseInt(key.dias[iSemana].dia)
                                                            }) */) : console.log('otromes');

                                                            } : (e) => {
                                                                e.preventDefault();
                                                                key && key.dias && key.dias[iSemana] && key.dias[iSemana].dia !== 'off' ? (setfecha({
                                                                    ...fecha,
                                                                    diaAentrar: parseInt(key.dias[iSemana].dia)
                                                                })) : console.log('otromes');

                                                            }
                                                            } className={`day ${crearRuta ? key && key.dias && key.dias[iSemana] && (parseInt(key.dias[iSemana].dia) >= parseInt(fecha.diaAentrar)) ? getStateDiaRuta(key.dias[iSemana].dia) ? 'bgColor-green' : 'bgColor-yellow' : 'bgColor-blue' : rutasIn ? (getDayRutas(key, iSemana)) ? (getDayRutas(key, iSemana)) === 'warning' ? 'bgColor-red' : (getDayRutas(key, iSemana)) === 'ready' ? 'bgColor-green' : 'bgColor-yellow' : 'bgColor-blue' : (key.dias && key.dias[iSemana] && key.dias[iSemana].hoy ? 'bgColor-yellow' : '')}`} id={`iddss-${iSemana}-${i}`}>
                                                                {key.dias && key.dias[iSemana] && key.dias[iSemana].dia !== 'off' ?
                                                                    <>
                                                                        {key.dias[iSemana].dia}
                                                                        {calendario &&
                                                                            <div className="stadistics">
                                                                                <span className="bgColor-blue">{key.dias && key.dias[iSemana] && key.dias[iSemana].totalServicios}</span>
                                                                                <span className="bgColor-yellow">{key.dias && key.dias[iSemana] && key.dias[iSemana].serviciosActivos}</span>
                                                                                <span className="bgColor-red">{key.dias && key.dias[iSemana] && key.dias[iSemana].serviciosPendientes}</span>
                                                                                <span className="bgColor-green">{key.dias && key.dias[iSemana] && key.dias[iSemana].serviciosRealizados}</span>
                                                                            </div>

                                                                        }

                                                                    </> : '.'}
                                                            </div> : calendario ?
                                                                <div className="stadisticsLarge" >

                                                                    <p>totalServicios: <span className="bgColor-blue">{key.totalServicios && key.totalServicios}</span></p>
                                                                    <br />
                                                                    <p>serviciosActivos: <span className="bgColor-yellow">{key.serviciosActivos && key.serviciosActivos}</span></p>
                                                                    <br />
                                                                    <p>serviciosPendientes: <span className="bgColor-red">{key.serviciosPendientes && key.serviciosPendientes}</span></p>
                                                                    <br />
                                                                    <p>serviciosRealizados: <span className="bgColor-green">{key.serviciosRealizados && key.serviciosRealizados}</span></p>
                                                                </div> : crearRuta && rutaSelected.modo === 'semana' && activeDays > 0 && rutaSelected.semana !== i ? <span className="pointer" onClick={(e) => { e.preventDefault(); crearSemanaRuta(i, iSemana) }}>
                                                                    SELECCIONAR </span> : <></>
                                                        }
                                                    </>
                                                )
                                            })

                                        }

                                    </div>
                                    {crearRuta && rutaSelected.semana === i ?
                                        <div className="flex-row center">
                                            <span onClick={(e) => { e.preventDefault; setRutaSelected({ ...rutaSelected, dias: [], semana: -1 }) }} className="pointer">Eliminar</span>
                                            <span className="pointer">Seleccionar Dias</span>
                                        </div> : <></>}
                                </>
                            )

                        }) :
                            <>
                                {calendario && <button onClick={(e) => { e.preventDefault(); crearNuevoAno() }}>
                                    CREAR PRIMER AÑO
                                </button>}
                            </>
                    }
                    {modo === 'mes' &&
                        <>
                            {<>
                                <div id={`idds-`} className={'row-space'}>
                                    {fecha.mesAentrar > mesMaximo ? <span onClick={(e) => {
                                        e.preventDefault();
                                        const dateOf = fecha.mesAentrar
                                        setfecha({
                                            ...fecha,
                                            diaAentrar: parseInt(new Date().toLocaleDateString().split('/')[0]),
                                            mesAentrar: (dateOf) - 1
                                        });
                                        makeMonth(fecha.anoAentrar, (dateOf) - 1, fecha.diaAentrar, false, calendario)
                                        setRutaSelected({
                                            ...rutaSelected,
                                            mes: (dateOf) - 1
                                        });
                                    }}>MES ANTERIOR</span> : <></>}
                                    {fecha.mesAentrar === mesMaximo ? <span onClick={(e) => {
                                        e.preventDefault();
                                        const dateOf = fecha.mesAentrar
                                        setfecha({
                                            ...fecha,
                                            mesAentrar: (dateOf) + 1,
                                            diaAentrar: 1
                                        });
                                        setRutaSelected({
                                            ...rutaSelected,
                                            mes: (dateOf) + 1
                                        });
                                        makeMonth(fecha.anoAentrar, (dateOf) - 1, fecha.diaAentrar, false, calendario)
                                    }}>MES SIGUIENTE</span> : <></>}
                                </div>

                            </>
                            }
                        </>
                    }
                </div>

            </div>
        </>

    </>)
}
export default DateView