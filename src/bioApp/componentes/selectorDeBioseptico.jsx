import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import { useEffect, useState } from "react"
import { UserObj } from "@/engine/content"
import ModeloUsuario, { EmpresaObj } from "../models/modelosUsuario"
import { ModeloBiosepticos } from "../models/modeloBiosepticos"
import { SelectorDiasApp } from "../models/selectores"
import VisorTipoServicio from "./visorTipoServicio"
import VisorTipoObra from "./visorTipoObra"
import VisorTipoSector from "./visorTipoSector"
import DateSelect from "@/components/commons/dateSelect"
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const SelectorDeBioseptico = (props) => {
    const { dataBioseptico = {
        servicios: [],
        rutas: [],
        obras: [],
        rutasIndividuales: [],
        dia: ''
    }, userModel = ModeloUsuario(), obras = { array: [] }, rutas = { rutas: [] }, PedirBiosepticos = console.log, actualizarEstado = console.log, modeloBiosepticos = ModeloBiosepticos, servicios = { array: [] }, vehiculos = { array: [] }, pedirMisServicios = console.log, sendNewServicio = console.log, creatingObra = false, PedirObras = console.log, setCreatingObra = console.log, misObras = { array: [] }, misServicios = { array: [] }, miEmpresa = EmpresaObj(), vendedoresIn = false, empresasIn = false, usersAll = { array: [] }, pedirEmpresas = console.log, empresas = { array: [] }, users = { array: [] }, companies = { array: [] }, userData = userStructure, setReqState = console.log, reqState = { reqId: Number(), state: false, peticion: '', type: '', inList: [] }, setPopUp = console.log, objStrings = objStringsInit, objCss = objCssInit, dashBoard = false } = props
    const modeloDia = {
        id: '',
        servicios: [],
        obras: [],
        sectores: [],
        dia: ''
    }
    const [dateCalendar, setDateCalendar] = useState(new Date())
    const [selectioned, setSelectioned] = useState(dashBoard ? 'centro rapido' : 'inicio')
    const [sideOpen, setSideOpen] = useState(false)
    const [rutasMias, setRutasMias] = useState({
        hoy: modeloDia,
        manana: modeloDia,
        ayer: modeloDia,
        seleccionado: modeloDia

    })

    const revisarMisRutas = (value) => {
        const diaAentrar = parseInt(new Date().toLocaleDateString().split('/')[0])
        const mesAentrar = parseInt(new Date().toLocaleDateString().split('/')[1])
        const anoAentrar = parseInt(new Date().toLocaleDateString().split('/')[2])
        let newData = {
            hoy: modeloDia,
            manana: modeloDia,
            ayer: modeloDia,
            seleccionado: modeloDia
        }
        dataBioseptico.rutasIndividuales.map((key, i) => {
            const newdiaAentrar = parseInt(key.fecha.split('-')[0])
            const newmesAentrar = parseInt(key.fecha.split('-')[1])
            const newanoAentrar = parseInt(key.fecha.split('-')[2])
            if (diaAentrar === newdiaAentrar &&
                mesAentrar === newmesAentrar &&
                anoAentrar === newanoAentrar) {
                let obrasArray = []
                let serviciosArray = []
                dataBioseptico.obras.map((keyDo, iDo) => {
                    const newdiaAentrarObra = parseInt(keyDo.fecha.split('-')[0])
                    const newmesAentrarObra = parseInt(keyDo.fecha.split('-')[1])
                    const newanoAentrarObra = parseInt(keyDo.fecha.split('-')[2])
                    if (newdiaAentrarObra === diaAentrar &&
                        newmesAentrarObra === mesAentrar &&
                        newanoAentrarObra === anoAentrar) {
                        let isIn = false
                        obrasArray.map((keyCompO, iCompO) => {
                            if (keyCompO === keyDo.obra) {
                                isIn = true
                            }
                        })
                        !isIn && obrasArray.push(keyDo.obra);


                    }
                })
                dataBioseptico.servicios.map((keyDo, iDo) => {
                    const newdiaAentrarObra = parseInt(keyDo.fecha.split('-')[0])
                    const newmesAentrarObra = parseInt(keyDo.fecha.split('-')[1])
                    const newanoAentrarObra = parseInt(keyDo.fecha.split('-')[2])
                    if (newdiaAentrarObra === diaAentrar &&
                        newmesAentrarObra === mesAentrar &&
                        newanoAentrarObra === anoAentrar) {
                        serviciosArray.push(keyDo.servicio);


                    }
                })
                newData.hoy = { ...rutasMias.hoy, id: key.id, servicios: serviciosArray, obras: obrasArray, dia: `${diaAentrar}-${mesAentrar + 1}-${anoAentrar}` }
            }
            if (diaAentrar - 1 === newdiaAentrar &&
                mesAentrar === newmesAentrar &&
                anoAentrar === newanoAentrar) {
                let obrasArray = []
                let serviciosArray = []
                dataBioseptico.obras.map((keyDo, iDo) => {
                    const newdiaAentrarObra = parseInt(keyDo.fecha.split('-')[0])
                    const newmesAentrarObra = parseInt(keyDo.fecha.split('-')[1])
                    const newanoAentrarObra = parseInt(keyDo.fecha.split('-')[2])
                    if (newdiaAentrarObra === diaAentrar - 1 &&
                        newmesAentrarObra === mesAentrar &&
                        newanoAentrarObra === anoAentrar) {
                        let isIn = false
                        obrasArray.map((keyCompO, iCompO) => {
                            if (keyCompO === keyDo.obra) {
                                isIn = true
                            }
                        })
                        !isIn && obrasArray.push(keyDo.obra);

                    }
                })
                dataBioseptico.servicios.map((keyDo, iDo) => {
                    const newdiaAentrarObra = parseInt(keyDo.fecha.split('-')[0])
                    const newmesAentrarObra = parseInt(keyDo.fecha.split('-')[1])
                    const newanoAentrarObra = parseInt(keyDo.fecha.split('-')[2])
                    if (newdiaAentrarObra === diaAentrar - 1 &&
                        newmesAentrarObra === mesAentrar &&
                        newanoAentrarObra === anoAentrar) {
                        serviciosArray.push(keyDo.servicio);


                    }
                })
                newData.ayer = { ...rutasMias.ayer, id: key.id, servicios: serviciosArray, obras: obrasArray, dia: `${diaAentrar - 1}-${mesAentrar + 1}-${anoAentrar}` }
            }
            if (diaAentrar + 1 === newdiaAentrar &&
                mesAentrar === newmesAentrar &&
                anoAentrar === newanoAentrar) {
                let obrasArray = []
                let serviciosArray = []
                dataBioseptico.obras.map((keyDo, iDo) => {
                    const newdiaAentrarObra = parseInt(keyDo.fecha.split('-')[0])
                    const newmesAentrarObra = parseInt(keyDo.fecha.split('-')[1])
                    const newanoAentrarObra = parseInt(keyDo.fecha.split('-')[2])
                    if (newdiaAentrarObra === diaAentrar + 1 &&
                        newmesAentrarObra === mesAentrar &&
                        newanoAentrarObra === anoAentrar) {
                        let isIn = false
                        obrasArray.map((keyCompO, iCompO) => {
                            if (keyCompO === keyDo.obra) {
                                isIn = true
                            }
                        })
                        !isIn && obrasArray.push(keyDo.obra);

                    }
                })
                dataBioseptico.servicios.map((keyDo, iDo) => {
                    const newdiaAentrarObra = parseInt(keyDo.fecha.split('-')[0])
                    const newmesAentrarObra = parseInt(keyDo.fecha.split('-')[1])
                    const newanoAentrarObra = parseInt(keyDo.fecha.split('-')[2])
                    if (newdiaAentrarObra === diaAentrar + 1 &&
                        newmesAentrarObra === mesAentrar &&
                        newanoAentrarObra === anoAentrar) {
                        serviciosArray.push(keyDo.servicio);


                    }
                })
                newData.manana = { ...rutasMias.manana, id: key.id, servicios: serviciosArray, obras: obrasArray, dia: `${diaAentrar + 1}-${mesAentrar + 1}-${anoAentrar}` }
            }

        })
        const newdiaAentrarSelecteDate = parseInt(dateCalendar.toLocaleDateString().split('/')[0])
        const newmesAentrarSelecteDate = parseInt(dateCalendar.toLocaleDateString().split('/')[1])
        const newanoAentrarSelecteDate = parseInt(dateCalendar.toLocaleDateString().split('/')[2])
        let elreturn = false
        if ((diaAentrar !== newdiaAentrarSelecteDate && mesAentrar === newmesAentrarSelecteDate &&
            anoAentrar === newanoAentrarSelecteDate) || ((diaAentrar === newdiaAentrarSelecteDate || diaAentrar !== newdiaAentrarSelecteDate) &&
                (mesAentrar !== newmesAentrarSelecteDate ||
                    anoAentrar !== newanoAentrarSelecteDate))) {
            dataBioseptico.rutasIndividuales.map((key, i) => {
                const newdiaAentrar = parseInt(key.fecha.split('-')[0])
                const newmesAentrar = parseInt(key.fecha.split('-')[1])
                const newanoAentrar = parseInt(key.fecha.split('-')[2])
                elreturn = true
                if (newdiaAentrarSelecteDate === newdiaAentrar &&
                    newmesAentrarSelecteDate === newmesAentrar &&
                    newanoAentrarSelecteDate === newanoAentrar) {
                    console.log('eo');
                    let obrasArray = []
                    let serviciosArray = []
                    dataBioseptico.obras.map((keyDo, iDo) => {
                        const newdiaAentrarObra = parseInt(keyDo.fecha.split('-')[0])
                        const newmesAentrarObra = parseInt(keyDo.fecha.split('-')[1])
                        const newanoAentrarObra = parseInt(keyDo.fecha.split('-')[2])
                        if (newdiaAentrarObra === newdiaAentrarSelecteDate &&
                            newmesAentrarObra === newmesAentrarSelecteDate &&
                            newanoAentrarObra === newanoAentrarSelecteDate) {
                            let isIn = false
                            obrasArray.map((keyCompO, iCompO) => {
                                if (keyCompO === keyDo.obra) {
                                    isIn = true
                                }
                            })
                            !isIn && obrasArray.push(keyDo.obra);

                        }
                    })
                    dataBioseptico.servicios.map((keyDo, iDo) => {
                        const newdiaAentrarObra = parseInt(keyDo.fecha.split('-')[0])
                        const newmesAentrarObra = parseInt(keyDo.fecha.split('-')[1])
                        const newanoAentrarObra = parseInt(keyDo.fecha.split('-')[2])
                        if (newdiaAentrarObra === newdiaAentrarSelecteDate &&
                            newmesAentrarObra === newmesAentrarSelecteDate &&
                            newanoAentrarObra === newanoAentrarSelecteDate) {
                            serviciosArray.push(keyDo.servicio);


                        }
                    })
                    newData.seleccionado = { ...rutasMias.seleccionado, id: key.id, servicios: serviciosArray, obras: obrasArray, dia: `${newdiaAentrarSelecteDate}-${newmesAentrarSelecteDate + 1}-${newanoAentrarSelecteDate}` }
                }

            })

        } else {
            elreturn = false

        }
        !value && setRutasMias({ ...newData })
        return elreturn
    }
    useEffect(() => {
        revisarMisRutas()
    }, [dataBioseptico, modeloBiosepticos, dateCalendar])
    return (
        <>
            <div className="flex-column-entregas">

                {
                    selectioned === 'inicio' ?
                        < >
                            <div>
                                <h1> CENTRO DE INTERACCIONES BIOSEPTICOS</h1>
                                <h2>USUARIO : {`${userModel.datosPersonales.nombre} ${userModel.datosPersonales.apellido}`}</h2>
                            </div>
                            <div className="container-bio">

                                {
                                    SelectorDiasApp.map((keyS, iS) => {
                                        return (
                                            <>
                                                <div className="dia" id={`asdsadsa${iS}`}>
                                                    <p className="flex-p-between"><span>RUTA DE {keyS} :  {rutasMias[keyS].dia} </span> <span>{rutasMias[keyS].id}</span> </p>
                                                    <p >
                                                        <p className="flex-p-between"><span> SERVICIOS</span>  <span className="gap-min"><span>TOTAL : {rutasMias[keyS].servicios.length}</span><span className='pointer' onClick={(e) => { e.preventDefault(); setSelectioned(`${keyS}-SERVICIOS`) }}>ver</span> </span></p>
                                                        <p className="flex-p-between"><span> OBRAS</span> <span className="gap-min"><span>TOTAL : {rutasMias[keyS].obras.length}</span><span className='pointer' onClick={(e) => { e.preventDefault(); setSelectioned(`${keyS}-OBRAS`) }}>ver</span> </span></p>
                                                        <p className="flex-p-between"> <span> SECTORES</span> <span className="gap-min"><span>TOTAL : {rutasMias[keyS].sectores.length}</span><span className='pointer' onClick={(e) => { e.preventDefault(); setSelectioned(`${keyS}-SECTORES`) }}>ver</span> </span></p>
                                                    </p>
                                                </div>
                                            </>
                                        )
                                    })
                                }

                                <div className="dia" id={`asdsadsadd`}>
                                    <p className="flex-p-between"><span>BUSCAR POR FECHA </span> <span> <DateSelect Dtype MinDate={new Date(new Date().setMonth(new Date().getMonth() - 2))} MaxDate={new Date(new Date().setMonth(new Date().getMonth() + 2))} startDate={dateCalendar} setStartDate={setDateCalendar} /></span> </p>
                                    {revisarMisRutas(true) &&
                                        rutasMias.seleccionado.id === '' || rutasMias.seleccionado.id == '' ? <>SIN RUTA PARA ESTE DIA</> : <div className="dia" id={`asdsadsaasas`}>
                                        <p className="flex-p-between"><span>RUTA DE {dateCalendar.toLocaleDateString()} </span> <span>{rutasMias.seleccionado.id}</span> </p>
                                        <p >
                                            <p className="flex-p-between"><span> SERVICIOS</span>  <span className="gap-min"><span>TOTAL : {rutasMias.seleccionado.servicios.length}</span><span className='pointer' onClick={(e) => { e.preventDefault(); setSelectioned(`seleccionado-SERVICIOS`) }}>ver</span> </span></p>
                                            <p className="flex-p-between"><span> OBRAS</span> <span className="gap-min"><span>TOTAL : {rutasMias.seleccionado.obras.length}</span><span className='pointer' onClick={(e) => { e.preventDefault(); setSelectioned(`seleccionado-OBRAS`) }}>ver</span> </span></p>
                                            <p className="flex-p-between"> <span> SECTORES</span> <span className="gap-min"><span>TOTAL : {rutasMias.seleccionado.sectores.length}</span><span className='pointer' onClick={(e) => { e.preventDefault(); setSelectioned(`seleccionado-SECTORES`) }}>ver</span> </span></p>
                                        </p>
                                    </div>}

                                </div>

                            </div>

                        </> :
                        <>
                            {selectioned.split('-')[0] === 'hoy' && selectioned.split('-')[1] === 'SERVICIOS' ? <>
                                A ENTREGAR
                            </> :
                                <>
                                    {selectioned.split('-')[1] === 'SERVICIOS' && <><h1>SERVICIOS DIA {rutasMias[selectioned.split('-')[0]].dia}</h1>
                                        <VisorTipoServicio empresas={empresas} showed={rutasMias[selectioned.split('-')[0]].servicios} /></>}
                                    {selectioned.split('-')[1] === 'OBRAS' && <><h1>OBRAS DIA {rutasMias[selectioned.split('-')[0]].dia}</h1>
                                        <VisorTipoObra empresas={empresas} showed={rutasMias[selectioned.split('-')[0]].obras} /></>}
                                    {selectioned.split('-')[1] === 'SECTORES' && <><h1>SECTORES DIA {rutasMias[selectioned.split('-')[0]].dia}</h1>
                                        <VisorTipoSector empresas={empresas} showed={rutasMias[selectioned.split('-')[0]].sectores} /></>}

                                </>
                            }

                            <span className='pointer' onClick={(e) => { e.preventDefault(); setSelectioned('inicio') }}>VOLVER</span>
                        </>

                }
                {/*   {dataBioseptico.rutasIndividuales.map((key, i) => {
                    return (
                        <>
                            <p>{key.id}</p>
                        </>
                    )
                })} */}
            </div>
        </>
    )
}
export default SelectorDeBioseptico