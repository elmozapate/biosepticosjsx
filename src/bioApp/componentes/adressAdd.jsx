import InputComp from "@/components/commons/input"
import StringsObj, { UserObj } from "@/engine/content"
import StylesObj from "@/styles/stylesObj"
import { useEffect, useState } from "react"
import { EmpresaObj, ObjContacto } from "@/bioApp/models/modelosUsuario"
import SelectComp from "@/components/commons/selector"
import { CitySelector } from "../models/modelosSelector"
import { Socket } from "@/middleware/routes/connect/socket/socketOn"
import GooglMapsComp from "@/components/commons/googleMaps"
import InputCompAdress from "@/components/commons/inputAdress"
import { ObjDireccion } from "../models/modeloDireccion"

const socket = Socket
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const AdressAdd = (props) => {

    const { inEmpresa = false, empresa = '', userData = userStructure, setReqState = console.log, reqState = { reqId: Number(), state: false, peticion: '', type: '', inList: [] }, setPopUp = console.log, objStrings = objStringsInit, objCss = objCssInit, send = console.log, showed = 'inicio' } = props
    const [placeInfo, setplaceInfo] = useState({ departamentos: [], ciudades: [], selected: '', selectedCity: '' })

    const [adressSend, setAdressSend] = useState(false)
    const [buscarPorNombre, setBuscarPorNombre] = useState(false)
    const [adressView, setAdressView] = useState({ state: false, centre: { ltn: 6.1576585, lgn: -75872710271 }, map: false })
    const [sending, setSending] = useState(false)
    const [ready, setReady] = useState(false)
    const [personalObj, setPersonalObj] = useState(inEmpresa ? EmpresaObj().contact : ObjContacto)
    const handleCreate = (e) => {
        e.preventDefault()
        const value = e.target.value
        const id = e.target.id
        setPersonalObj({
            ...personalObj,
            direccion: {
                ...personalObj.direccion,
                [id]: value
            }
        })
        if (id === 'barrio') {
            send(personalObj)
        }
    }
    const selectDepartamento = (e) => {
        e.preventDefault()
        const value = e.target.value
        const id = e.target.id
        let newArray = []
        let inDepartamento = ''
        let find = false
        CitySelector.map((key, i) => {
            if (key.departamento === e.target.value && !find) {
                newArray = key.ciudades
                inDepartamento = key.departamento
                find = true
            }
        })
        if (find) {
            setplaceInfo({ ...placeInfo, ciudades: newArray, selected: inDepartamento })
            setPersonalObj({
                ...personalObj,
                direccion: {
                    ...personalObj.direccion,
                    departamento: inDepartamento
                }
            })
        }

    }
    const selectCiudad = (e) => {
        e.preventDefault()
        const value = e.target.value
        const id = e.target.id
        setplaceInfo({ ...placeInfo, selectedCity: value })
        setPersonalObj({
            ...personalObj,
            direccion: {
                ...personalObj.direccion,
                ciudad: value
            }
        })
        send(personalObj)

    }
    const handleCreateAll = (value) => {
        setPersonalObj({
            ...personalObj,
            direccion: {
                ...personalObj.direccion,
                ...value

            }
        })
        send({
            ...personalObj,
            direccion: {
                ...personalObj.direccion,
                ...value

            }
        })
        setAdressView({
            ...adressView,
            state: true
        })

    }
    useEffect(() => {
        let newArray = []
        CitySelector.map((key, i) => {
            newArray.push(key.departamento)
        })
        setplaceInfo({ ...placeInfo, departamentos: newArray })
    }, [])
    useEffect(() => {
        if (!buscarPorNombre && !adressView.state) {
            if (personalObj.direccion.barrio.length > 3) {
                setReady(true)
            } else {
                setReady(false)

            }
        }
    }, [personalObj, buscarPorNombre])

    return (
        <>
            {
                sending ? <>ENVIANDO::::::</> :
                    <>{adressSend ?
                        <>
                            direccion ={`${personalObj.direccion.otros} ${personalObj.direccion.departamento} ${personalObj.direccion.ciudad} ${personalObj.direccion.barrio} ${personalObj.direccion.viaSelecionada} ${personalObj.direccion.numero} ${personalObj.direccion.letra} ${personalObj.direccion.primerNumDireccion} ${personalObj.direccion.primerLetra} ${personalObj.direccion.segundoNumDireccion} ${personalObj.direccion.segundaLetra} ${personalObj.direccion.coordenadas.lat} ${personalObj.direccion.coordenadas.lng}`}
                        </> : <>
                            {adressView.map ? <>
                                <div className="flex-row">
                                    <span onClick={(e) => {
                                        e.preventDefault(); setPersonalObj({
                                            ...personalObj,
                                            direccion: {
                                                ...ObjDireccion,
                                                otros: ''
                                            }
                                        }); setAdressView({
                                            ...adressView,
                                            map: false
                                        })
                                    }}>VOLVER ACA NO ES</span>
                                    <span onClick={(e) => {
                                        e.preventDefault(); setPersonalObj({
                                            ...personalObj,
                                            direccion: {
                                                ...personalObj.direccion,
                                                coordenadas: adressView.centre
                                            }
                                        });
                                        send({
                                            ...personalObj,
                                            direccion: {
                                                ...personalObj.direccion,
                                                coordenadas: adressView.centre
                                            }
                                        })
                                        setAdressSend(true)

                                    }
                                    }>ACA SI ES</span>
                                </div>
                                <GooglMapsComp normal setAdressView={setAdressView} adressView={adressView} adressData={{ ...personalObj.direccion, empresa: inEmpresa ? '' : '' }}/* setMapCenter={setMapCenter} */ />

                            </> : <>
                                <h2>
                                    DIRECCION
                                </h2>
                                <form action="" className="adress-form form-center ">
                                    BUSCAR POR
                                    <div className="flex-row">
                                        <span className="formInput-btn-small" onClick={(e) => {
                                            e.preventDefault; setBuscarPorNombre(false); setPersonalObj({
                                                ...personalObj,
                                                direccion: {
                                                    ...ObjDireccion,
                                                    otros: ''
                                                }
                                            });
                                            send({
                                                ...personalObj,
                                                direccion: {
                                                    ...ObjDireccion,
                                                    otros: ''
                                                }
                                            })
                                        }}>
                                            DIRECCION
                                        </span>
                                        <span className="formInput-btn-small" onClick={(e) => {
                                            e.preventDefault; setBuscarPorNombre(true); handleCreateAll(); setReady(true); setPersonalObj({
                                                ...personalObj,
                                                direccion: {
                                                    ...ObjDireccion,
                                                    otros: ''

                                                }
                                            });
                                            send({
                                                ...personalObj,
                                                direccion: {
                                                    ...ObjDireccion,
                                                    otros: ''
                                                }
                                            })
                                        }}>
                                            NOMBRE
                                        </span>

                                    </div>
                                    {
                                        buscarPorNombre ?
                                            <>
                                                <InputComp type={'text'} id={'otros'} value={personalObj.direccion.otros} placeholder={'NOMBRE DEL LUGAR'} funtions={handleCreate} required />
                                            </>
                                            :
                                            <>
                                                {
                                                    <>
                                                        <SelectComp item={'departamento'} items={placeInfo.departamentos} funtions={selectDepartamento} ID={'departamento'} required inAdress />
                                                        {
                                                            placeInfo.selected !== '' &&
                                                            <SelectComp item={'ciudad'} items={placeInfo.ciudades} funtions={selectCiudad} ID={'ciudad'} required inAdress />

                                                        }
                                                        {
                                                            placeInfo.selectedCity !== '' && <InputComp type={'text'} id={'barrio'} value={personalObj.direccion.barrio} placeholder={'barrio'} funtions={handleCreate} required />
                                                        }
                                                        {
                                                            placeInfo.selectedCity !== '' && <InputCompAdress setAdressView={setAdressView} adressView={adressView} personalObj={personalObj} value={personalObj.direccion} placeholder={'barrio'} funtions={handleCreateAll} required />
                                                        }

                                                    </>
                                                }
                                            </>
                                    }

                                    <br />
                                    {ready && <>
                                        {buscarPorNombre ? <GooglMapsComp soloAdress setAdressView={setAdressView} adressView={adressView} adressData={{ ...personalObj.direccion, empresa: inEmpresa ? '' : '' }}/* setMapCenter={setMapCenter} */ /> : <button className="formInput-btn" onClick={(e) => { e.preventDefault; }}>
                                            CONFIRMAR DIRECCION
                                        </button>}

                                    </>}
                                </form>
                            </>}
                        </>}</>
            }

        </>
    )
}
export default AdressAdd

