import InputComp from "@/components/commons/input"
import StringsObj, { UserObj } from "@/engine/content"
import StylesObj from "@/styles/stylesObj"
import { useEffect, useState } from "react"
import SelectComp from "@/components/commons/selector"
import { SemanaArray, TipoDeServicios } from "@/bioApp/models/selectores"
import DateSelect from "@/components/commons/dateSelect"
import TarjetaDeServicio from "@/bioApp/models/serviceInfo"
import DaysComp from "./daysSelector"
import { ObjDias } from "@/bioApp/models/modeloShedule"
import { EmpresaObj } from "@/bioApp/models/modelosUsuario"


const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const FormularioDatosNuevoServicio = (props) => {

    const { misObras = { array: [] }, userData = userStructure, setCreatingObra = console.log, setPopUp = console.log, objStrings = objStringsInit, objCss = objCssInit, sendData = console.log, showed = 'inicio', activeEmpresa = EmpresaObj() } = props
    const [obrasExistentes, setObrasExistentes] = useState([])
    const [serviceStep, seServiceStep] = useState({ data: {}, step: 0 })
    const [endDate, setEndDate] = useState({ state: false })

    const [sending, setSending] = useState(false)
    const [ready, setReady] = useState(false)
    const [personalObj, setPersonalObj] = useState({ servicio: TarjetaDeServicio() })
    const handleCreateCant = (e) => {
        e.preventDefault()
        const value = e.target.value
        setPersonalObj({
            ...personalObj,
            servicio: {
                ...personalObj.servicio,
                tipoDeServicio: {
                    ...personalObj.servicio.tipoDeServicio,
                    cantidad: parseInt(value)
                }
            }
        })
    }
    const handleCreateCantDias = (e) => {
        e.preventDefault()
        const value = e.target.value
        setPersonalObj({
            ...personalObj,
            servicio: {
                ...personalObj.servicio,
                shedule: {
                    ...personalObj.servicio.shedule,
                    diasPorSemana: parseInt(value),
                    dias: ObjDias
                }
            }
        })
    }
    const handleCreateObra = (data) => {
        const value = data.target.value
        if (value === 'NUEVA OBRA') {
            setPersonalObj({
                ...personalObj,
                servicio: {
                    ...personalObj.servicio,
                    obra: 'new',
                    cliente: userData.id
                }
            })
        } else {
            misObras.array.map((key, i) => {
                if (key.nombre === value) {
                    setPersonalObj({
                        ...personalObj,
                        servicio: {
                            ...personalObj.servicio,
                            obra: key.id
                        }
                    })
                }
            })
        }
    }
    const handleCreateService = (data) => {
        data.preventDefault()
        const value = data.target.value
        setPersonalObj({
            ...personalObj,
            servicio: {
                ...personalObj.servicio,
                tipoDeServicio: {
                    ...personalObj.servicio.tipoDeServicio,
                    tipo: value,
                    valor: value.split(' ')[0] === 'Alquiler' ? 400000 : 20000
                }
            }
        })
    }
    const handleCreateDays = (data) => {
        const value = data
        let daysShedule = 0
        SemanaArray.map((key, i) => {
            if (value[key]) {
                daysShedule = daysShedule + 1
            }
        })
        daysShedule <= parseInt(personalObj.servicio.shedule.diasPorSemana) && setPersonalObj({
            ...personalObj,
            servicio: {
                ...personalObj.servicio,
                shedule: {
                    ...personalObj.servicio.shedule,
                    dias: value
                }
            }
        })
    }
    const nextStep = (value = '+') => {
        const inStep = serviceStep.step
        if (serviceStep.step === 0 && personalObj.servicio.obra === 'NUEVA OBRA') {

        } else {
            seServiceStep({ ...serviceStep, step: value === '+' ? (inStep + 1) : (inStep - 1) })
        }
    }
    useEffect(() => {
        setPersonalObj({
            ...personalObj,
            servicio: {
                ...personalObj.servicio,
                cliente: userData.id,
                empresa: activeEmpresa.id
            }
        })
    }, [])
    useEffect(() => {
        let getObrasArray = ['NUEVA OBRA']
        misObras.array.map((key, i) => {
            getObrasArray.push(key.nombre)
        })
        setObrasExistentes(getObrasArray)
        let daysShedule = 0
        SemanaArray.map((key, i) => {
            if (personalObj.servicio.shedule.dias[key]) {
                daysShedule = daysShedule + 1
            }
        })
        if ((serviceStep.step === 0 && personalObj.servicio.obra !== '') || (serviceStep.step === 1 && personalObj.servicio.tipoDeServicio.tipo !== '') || (serviceStep.step === 2 && personalObj.servicio.tipoDeServicio.cantidad > 0) || (serviceStep.step === 3 && personalObj.servicio.shedule.fechaDeInicio !== '') || (serviceStep.step === 4 && daysShedule === parseInt(personalObj.servicio.shedule.diasPorSemana) && personalObj.servicio.shedule.diasPorSemana > 0) || serviceStep.step === 5) {
            setReady(true)
        } else {
            setReady(false)
        }
    }, [personalObj, serviceStep])

    return (
        <>
            {
                sending ? <>ENVIANDO::::::</> :
                    <div >
                        <h1>
                            DATOS DE LA OBRA
                        </h1>
                        <form action="" className="form-center">
                            {serviceStep.step === 0 && <div className="form-default formInput">
                                SELECCIONAR OBRA
                                <SelectComp item={'obra'} items={obrasExistentes} funtions={handleCreateObra} id={'obra'} required />
                            </div>}
                            {serviceStep.step === 1 && <div className="form-default formInput">
                                SELECCIONAR SERVICIO
                                <SelectComp item={'servicio'} items={TipoDeServicios} funtions={handleCreateService} id={'servicio'} required />
                            </div>}
                            {serviceStep.step === 2 && <div className="form-default formInput">
                                Cantidad
                                {
                                    personalObj.servicio.tipoDeServicio.tipo === 'Alquiler de baños' ?
                                        <>
                                            Cantidad
                                            <InputComp type={'number'} min={1} max={200} id={'cantidad'} value={personalObj.servicio.tipoDeServicio} placeholder={'cantidad'} funtions={handleCreateCant} required />
                                        </>
                                        :
                                        <>
                                            Cantidad en LT
                                            <InputComp type={'number'} min={1000} id={'cantidad'} value={personalObj.servicio.tipoDeServicio} placeholder={'cantidad'} funtions={handleCreateCant} required />
                                        </>
                                }
                            </div>}
                            {serviceStep.step === 3 && <div className="form-default formInput">
                                Fecha De Inicio

                                <DateSelect Btype MinDate={new Date(new Date().setDate(new Date().getDate() + 1))} MaxDate={new Date(new Date().setMonth(new Date().getMonth() + 3))} personalObj={personalObj} startDate={personalObj.servicio.shedule.fechaDeInicio} setStartDate={setPersonalObj} />
                                {personalObj.servicio.shedule.fechaDeInicio !== '' && <>
                                    <p onClick={(e) => {
                                        e.preventDefault; setEndDate({ ...endDate, state: !endDate.state })
                                    }}>INCLUIR FECHA FINAL {!endDate.state ? '__ X__ ' : '__ ✓ '}</p>
                                    {endDate.state && <DateSelect Ctype MaxDate={false}
                                        personalObj={personalObj} startDate={personalObj.servicio.shedule.fechaDeFinal} setStartDate={setPersonalObj} />}
                                </>}
                            </div>}
                            {serviceStep.step === 4 && <div className="form-default formInput">
                                DIAS PROGRAMADOS POR SEMANA PARA MANTENIMIENTO Y RECOLECCIÓN
                                {

                                    <>
                                        <InputComp type={'number'} min={1} max={6} id={'dias'} value={personalObj.servicio.shedule.diasPorSemana} placeholder={'dias'} funtions={handleCreateCantDias} required />
                                        {personalObj.servicio.shedule.diasPorSemana > 0 &&
                                            <DaysComp setPermisions={handleCreateDays} dias={personalObj.servicio.shedule.dias} funtions={handleCreateDays} objCss={objCss} />
                                        }
                                    </>
                                }
                            </div>}
                            {ready && <button className="formInput-btn" onClick={(e) => {
                                e.preventDefault; serviceStep.step < 5 ? nextStep() : sendData(personalObj);
                            }}>
                                {serviceStep.step < 5 ? 'CONTINUAR' : 'CREAR SERVICIO'}
                            </button>}
                            {<button className="formInput-btn" onClick={(e) => {
                                e.preventDefault; serviceStep.step === 0 ? setCreatingObra(false) : nextStep('-');
                            }}>
                                {serviceStep.step === 0 ? 'CANCELAR' : 'REGRESAR'}
                            </button>}
                        </form>
                    </div>
            }

        </>
    )
}
export default FormularioDatosNuevoServicio
