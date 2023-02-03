import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import { UserObj } from "@/engine/content"
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()

const InteractiveTable = (props) => {

    const { users = { array: [] }, empresas = { array: [] }, userData = userStructure, objStrings = objStringsInit, objCss = objCssInit, willShow = console.log, inShowed = 'inicio' } = props
    return (
        <>
            {inShowed === 'usuariosApp' && users.array.map((key, i) => {
                return (<><li>{key.nombre}</li></>)
            })}
            {inShowed === 'empresas' && empresas.array.map((key, i) => {
                return (<><li>{key}</li></>)
            })}

        </>
    )
}
export default InteractiveTable