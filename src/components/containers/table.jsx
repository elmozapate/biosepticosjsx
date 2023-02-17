
import { ArrayHistorialTable } from "@/bioApp/models/modelosSelector"
import ModeloUsuario from "@/bioApp/models/modelosUsuario"
import StringsObj from "@/engine/content"
import StylesObj from "@/styles/stylesObj"
import { useEffect } from "react"

const usuarioDefault = ModeloUsuario()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const TableHistorialApp = (props) => {
    const { activeUser = { selectOp: '', userInfo: usuarioDefault }, objStrings = objStringsInit, objCss = objCssInit } = props
    useEffect(() => {

    }, [])
    return (
        <>
            <div className="row-table"> <table>
                <thead>
                    <tr id={`dataA1-${'1'}`}>
                        {
                            ArrayHistorialTable.map((key, i) => {
                                return (
                                    <th id={`dataA2-${i}`}>{key}</th>
                                )
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                    {activeUser.userInfo.historial.map((key, i) => {

                        return (
                            <>
                                {parseInt(key.id) === parseInt(activeUser.userInfo.id) && <tr id={`data1-${i}`}>
                                    <>
                                        {
                                            ArrayHistorialTable.map((keyHeader, iHeader) => {
                                                return (
                                                    <td id={`data2-${iHeader}-${i}`}>{(keyHeader === 'hora' ||keyHeader ==='pais')? key.appDate[keyHeader] : key[keyHeader]}</td>
                                                )
                                            })
                                        }
                                    </>
                                </tr>}
                            </>
                        )
                    })}
                </tbody>

            </table></div>
        </>
    )
}
export default TableHistorialApp