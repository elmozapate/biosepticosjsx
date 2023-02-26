

import StylesObj from "@/styles/stylesObj"
import StringsObj, { UserObj } from "@/engine/content"
import { EmpresaObj } from "../models/modelosUsuario"
import { useEffect, useState } from "react"
import FormularioDatosNuevoServicio from "@/bioDashBoard/componentes/formularios/formularioDatosNuevoServicio"
import { EstadosServicios, EstadosServiciosObj, EstadosServiciosObjShort, EstadosUser, EstadosUsersObj, EstadosUsersObjShort } from "../models/selectores"
import ServiceSelector from "./serviceSelector"
import RevisarServicios from "./revisarServicios"
import { ModeloBiosepticos } from "../models/modeloBiosepticos"
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const userStructure = UserObj()

const ContenedorServicios = (props) => {
    const { serviceStep={ data: {}, step: 0 }, seServiceStep=console.log,personalLogistico = false, actualizarEstado = console.log, modeloBiosepticos = ModeloBiosepticos, logistica = false, pedirMisServicios = console.log, sendNewServicio = console.log, creatingObra = console.log, misObras = { array: [] }, misServicios = { array: [] }, vehiculos = { array: [] }, setCreatingObra = console.log, activeEmpresa = EmpresaObj(), userData = userStructure, setPopUp = console.log, sideOpen = false, objStrings = objStringsInit, objCss = objCssInit, showed = 'inicio' } = props
    const [misServiciosSort, setMisServiciosSort] = useState(personalLogistico ? EstadosUsersObj : EstadosServiciosObj)

    const countMany = () => {
        
        let newSquema = personalLogistico ? EstadosUsersObjShort : EstadosServiciosObjShort
        if (personalLogistico) {

            let newSort = {
                conductores: [],
                auxiliares: [],
                administrativo: [],
                operativo: [],
                all: []
            }
            modeloBiosepticos.users.map((key, i) => {
                key.app && newSort.all.push(key)
                key.app && newSort[key.app.type].push(key)
            })
            EstadosUser.map((key) => {
                newSquema[key] = { array: newSort[key], many: newSort[key].length }
            })
        } else {
            let newSort = {
                verification: [],
                done: [],
                inactive: [],
                active: [],
                pending: [],
                all: misServicios.array
            }
            misServicios.array.map((key, i) => {
                if (key.shedule.estado !== 'completado') {
                    newSort.pending.push(key)
                }
            })
            misServicios.array.map((key, i) => {
                if (key.shedule.activo) {
                    newSort.active.push(key)

                }
            })
            misServicios.array.map((key, i) => {
                if (!key.shedule.activo) {
                    newSort.verification.push(key)

                }
            })
            misServicios.array.map((key, i) => {
                if (key.shedule.estado === 'completado') {
                    newSort.done.push(key)
                }
            })
            misServicios.array.map((key, i) => {
                if (key.shedule.estado === 'finalizado') {
                    newSort.inactive.push(key)
                }
            })
            EstadosServicios.map((key) => {
                newSquema[key] = { array: newSort[key], many: newSort[key].length }
            })
        }
        return newSquema

    }
    const sortBy = (sort = 'all') => {
        const resCount = countMany()
        setMisServiciosSort({
            ...misServiciosSort,
            sort: sort === 'reload' ? misServiciosSort.sort : sort,
            ...resCount,
        })
    }
    useEffect(() => {
        /* !logistica && pedirMisServicios(activeEmpresa.id)
        !logistica &&console.log('00000'); */
        /* countMany() */
    }, [])
    useEffect(() => {
        countMany()
        sortBy('reload')
    }, [misServicios, modeloBiosepticos])
    return (
        <>
            {!logistica && <button onClick={(e) => { e.preventDefault(); setCreatingObra(true) }}>CREAR SERVICIO</button>}

            {
                !creatingObra && (!personalLogistico ? misServicios.array : modeloBiosepticos.users).length > 0 ?
                    <>

                        <RevisarServicios logistica={personalLogistico} misServicios={!personalLogistico ? misServicios.array : modeloBiosepticos.users} misServiciosSort={misServiciosSort} sortBy={sortBy} />

                    </> :
                    <>{!logistica ?
                        <>
                            {
                                !creatingObra && !misServicios.array.length > 0 ?
                                    <>
                                        NO TIENES SERVICIOS
                                        <button onClick={(e) => { e.preventDefault(); setCreatingObra(true) }}>CREAR SERVICIO</button>
                                    </>
                                    :
                                    <FormularioDatosNuevoServicio serviceStep={serviceStep} seServiceStep={seServiceStep} setCreatingObra={setCreatingObra} sendData={sendNewServicio} misObras={misObras} userData={userData} setPopUp={setPopUp} sideOpen={sideOpen} activeEmpresa={activeEmpresa} objCss={objCss} objStrings={objStrings} showed={showed} back={setCreatingObra} />
                            }                    </> : <>
                            {
                                <RevisarServicios actualizarEstado={actualizarEstado} logistica={logistica} misServicios={misServicios} misServiciosSort={misServiciosSort} sortBy={sortBy} />
                                /*  modeloBiosepticos.users.map((key, i) => {
                                     return (
                                         <>{key.app && <p id={`pid-${i}`}>
                                             <span id={`pidspan-${i}`}>
                                                 <span id={`pidspandos-${i}`}>   {key.app.type}  :</span>
                                                 <span id={`pidspantres-${i}`}>  {key.datosPersonales.nombre}  {key.datosPersonales.apellido}</span>
 
                                             </span>
                                         </p>}</>
                                     )
                                 }) */
                            }

                        </>
                    }
                    </>
            }
            <div>

                <div className="flex-row just-space">
                    <h2>{logistica ? 'PERSONAL' : 'SERVICIOS'}</h2>
                    <ServiceSelector userSort={personalLogistico} misServiciosSort={misServiciosSort} sortBy={sortBy} />

                </div>
            </div>
        </>
    )
}
export default ContenedorServicios