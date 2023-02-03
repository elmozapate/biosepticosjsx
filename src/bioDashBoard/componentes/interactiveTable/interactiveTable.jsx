import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import { UserObj } from "@/engine/content"
import { useState } from "react"
import ConfiguracionUsuario from "../dependencias/configuracionUsuario"
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()

const InteractiveTable = (props) => {

    const {usersAll={array:[]}, users = { array: [] }, empresas = { array: [] }, userData = userStructure, objStrings = objStringsInit, objCss = objCssInit, willShow = console.log, inShowed = 'inicio' } = props
    const [selectioned, setSelectioned] = useState({
        active: false,
        inSelection: ''
    })
    return (
        <>
            {selectioned.active ?
                <>
                <ConfiguracionUsuario usersAll={usersAll} selectioned={selectioned}/>
                <button onClick={(e) => {
                    e.preventDefault(); setSelectioned({
                        ...selectioned,
                        active: false, inSelection: ''
                    })
                }}>volver</button></> 
                :
                <>
                    {inShowed === 'usuariosApp' && users.array.map((key, i) => {
                        return (<><li onClick={(e) => {
                            e.preventDefault(); setSelectioned({
                                ...selectioned,
                                active: true, inSelection: key.id
                            })
                        }}>{key.nombre}</li></>)
                    })}
                    {inShowed === 'empresas' && empresas.array.map((key, i) => {
                        return (<><li>{key}</li></>)
                    })}

                </>
            }
        </>

    )
}
export default InteractiveTable