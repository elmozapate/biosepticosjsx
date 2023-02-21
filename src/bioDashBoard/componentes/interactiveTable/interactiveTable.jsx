import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import { UserObj } from "@/engine/content"
import { useState } from "react"
import ConfiguracionUsuario from "../dependencias/configuracionUsuario"
import { ModeloBiosepticos } from "@/bioApp/models/modeloBiosepticos"
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()

const InteractiveTable = (props) => {

    const { actualizarEstado = console.log, modeloBiosepticos = ModeloBiosepticos, usersAll = { array: [] }, users = { array: [] }, empresas = { array: [] }, userData = userStructure, setPopUp = console.log, objStrings = objStringsInit, objCss = objCssInit, willShow = console.log, inShowed = 'inicio' } = props
    const [selectioned, setSelectioned] = useState({
        active: false,
        inSelection: ''
    })
    return (
        <div className="flex-column">
            {selectioned.active ?
                <div id={`idd-${'as'}`}>
                    <ConfiguracionUsuario objCss={objCss} objStrings={objStrings} usersAll={usersAll} selectioned={selectioned} />
                    <button onClick={(e) => {
                        e.preventDefault(); setSelectioned({
                            ...selectioned,
                            active: false, inSelection: ''
                        })
                    }}>volver2</button></div>
                :
                <>
                    {inShowed === 'usuariosApp' && users.array.map((key, i) => {
                        return (<li id={`ifd-${i}`} onClick={(e) => {
                            e.preventDefault(); setSelectioned({
                                ...selectioned,
                                active: true, inSelection: key.id
                            })
                        }}>{key.nombre}</li>
                        )
                    })}
                    {inShowed === 'empresas' && empresas.array.map((key, i) => {
                        return (<li id={`ieed-${i}`}>{key.contact.nombre}</li>)
                    })}
                    {inShowed === 'bioSepticos' && modeloBiosepticos.vehiculos.map((key, i) => {
                        return (<li id={`ieevehiculos-${i}`}>{key.datosLegales.placa}</li>)
                    })}

                </>
            }
        </div>

    )
}
export default InteractiveTable