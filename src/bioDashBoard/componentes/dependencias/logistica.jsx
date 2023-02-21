import { ModeloBiosepticos } from "@/bioApp/models/modeloBiosepticos"
import StringsObj, { UserObj } from "@/engine/content"
import StylesObj from "@/styles/stylesObj"
import { useState } from "react"
import FuntionsSelected from "./funtionsSelected"
import ModeloDependencia from "./modeloDependencia"

const objCssInit = StylesObj()
const objStringsInit = StringsObj()

const Logistica = (props) => {
    const modeloDependencia = ModeloDependencia()

    const { setPopUp = console.log, actualizarEstado = console.log, modeloBiosepticos = ModeloBiosepticos , userData = UserObj(), objStrings = objStringsInit, vehiculos = { array: [] }, objCss = objCssInit, showed = 'centro rapido' } = props
    const [sectionFuntion, setSectionFuntion] = useState({
        state: false,
        function: ''
    })
    return (
        <>
            <div className={objCss.dashBoard.sectionOptionContainer}>
                {
                    sectionFuntion.state ?
                        <>
                            <div className={objCss.dashBoard.sectionTitleLeft}>
                                <h1 > {`${sectionFuntion.function} ${showed}`} </h1>
                                <button onClick={(e) => { e.preventDefault(); setSectionFuntion({ ...sectionFuntion, state: false, function: '' }) }} className={objCss.dashBoard.backButton} ><span> Volver </span> ↩</button>
                            </div>
                            <FuntionsSelected /* empresas={empresas} users={users} */ modeloBiosepticos={modeloBiosepticos} actualizarEstado={actualizarEstado} vehiculos={vehiculos} userData={userData} setPopUp={setPopUp} objCss={objCss} objStrings={objStrings} inShowed={showed} showed={sectionFuntion} />


                        </>
                        :
                        <>
                            <div className={objCss.dashBoard.sectionOptionRow}>
                                <h1 className={objCss.dashBoard.sectionTitle}>{showed} </h1>

                                {
                                    modeloDependencia.map((key, i) => {
                                        return (
                                            <div id={`idd-${i}`} onClick={(e) => { e.preventDefault(); setSectionFuntion({ ...sectionFuntion, state: true, function: key }) }} className={objCss.dashBoard.sectionOption}>
                                                {`${key}  ${showed}`}
                                            </div>
                                        )

                                    })
                                }

                            </div>
                        </>
                }
            </div>
        </>

    )
}
export default Logistica