
import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import { UserObj } from "@/engine/content"
import { useState } from "react"
import ConfiguracionUsuario from "../dependencias/configuracionUsuario"
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const HistorialSearch = (props) => {


    const { usersAll = { array: [] }, users = { array: [] }, empresas = { array: [] }, userData = userStructure, setPopUp = console.log, objStrings = objStringsInit, objCss = objCssInit, willShow = console.log, inShowed = 'inicio' } = props
    const [selectioned, setSelectioned] = useState({
        active: false,
        inSelection: ''
    })
    return (
        <div className="flex-column">
            {selectioned.active ?
                <>
                    <ConfiguracionUsuario inHistorial objCss={objCss} objStrings={objStrings} usersAll={usersAll} selectioned={selectioned} />
                    <button onClick={(e) => {
                        e.preventDefault(); setSelectioned({
                            ...selectioned,
                            active: false, inSelection: ''
                        })
                    }}>volver2</button>
                </>

                :
                <>
                    {inShowed === 'usuariosApp' && users.array.map((key, i) => {
                        return (<li key={`key-${(parseInt(Math.random() * 9999999999)).toString()}`} id={`fid-${i}`} onClick={(e) => {
                            e.preventDefault(); setSelectioned({
                                ...selectioned,
                                active: true, inSelection: key.id
                            })
                        }}>{key.nombre}</li>
                        )
                    })}
                    {inShowed === 'empresas' && empresas.array.map((key, i) => {
                        return (<li key={`key-${(parseInt(Math.random() * 9999999999)).toString()}`} id={`iffd-${i}`}>{key}</li>)
                    })}

                </>
            }
        </div>

    )
}
export default HistorialSearch