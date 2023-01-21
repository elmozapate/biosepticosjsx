import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import { UserObj } from "@/engine/content"
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()

const InteractiveTable = (props) => {

    const { users = { array: [] }, userData = userStructure, objStrings = objStringsInit, objCss = objCssInit, willShow = console.log, showed = 'inicio' } = props
    console.log(users);
    return (
        <>
            {users.array.map((key, i) => {
                return (<><li>{key.nombre}</li></>)
            })}


        </>
    )
}
export default InteractiveTable