import InputComp from "@/components/commons/input"
import StringsObj, { UserObj } from "@/engine/content"
import MiddlewareSelector from "@/middleware/askSelector"
import StylesObj from "@/styles/stylesObj"
import { useEffect, useState } from "react"
import EnvM from "@/envMachetero"
import io from "socket.io-client"
import { EmpresaObj, ObjContacto } from "@/bioApp/models/modelosUsuario"
import SelectComp from "@/components/commons/selector"
import { CitySelector } from "../models/modelosSelector"
import { Socket } from "@/middleware/routes/connect/socket/socketOn"

const socket = Socket
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const AdressAdd = (props) => {

    const { inEmpresa = false, userData = userStructure, setPopUp = console.log, objStrings = objStringsInit, objCss = objCssInit, send = console.log, showed = 'inicio' } = props
    const [placeInfo, setplaceInfo] = useState({ departamentos: [], ciudades: [], selected: '', selectedCity: '' })
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
    }
    useEffect(() => {
        let newArray = []
        CitySelector.map((key, i) => {
            newArray.push(key.departamento)
        })
        setplaceInfo({ ...placeInfo, departamentos: newArray })
    }, [])
    useEffect(() => {
        if (personalObj.direccion.barrio.length > 3) {
            setReady(true)
        } else {
            setReady(false)

        }
    }, [personalObj])

    return (
        <>
            {
                sending ? <>ENVIANDO::::::</> :
                    <>
                        <h2>
                            DIRECCION
                        </h2>
                        <form action="" className="adress-form form-center ">
                            {
                                <>
                                    <SelectComp item={'departamento'} items={placeInfo.departamentos} funtions={selectDepartamento} id={'departamento'} required inAdress />
                                    {
                                        placeInfo.selected !== '' &&
                                        <SelectComp item={'ciudad'} items={placeInfo.ciudades} funtions={selectCiudad} id={'ciudad'} required inAdress />

                                    }
                                    {
                                        placeInfo.selectedCity !== '' && <InputComp type={'text'} id={'barrio'} value={personalObj.direccion.barrio} placeholder={'barrio'} funtions={handleCreate} required />
                                    }
                                </>
                            }
                            <br />
                            {ready && <button className="formInput-btn" onClick={(e) => { e.preventDefault; }}>
                                DIRECCION CORRECTA
                            </button>}
                        </form>
                    </>
            }

        </>
    )
}
export default AdressAdd

