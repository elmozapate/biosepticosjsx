import StringsObj, { UserObj } from "@/engine/content"
import StylesObj from "@/styles/stylesObj"
import { useState } from "react"
import FuntionsSelected from "./funtionsSelected"
import ModeloDependencia from "./modeloDependencia"

const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const userStructure = UserObj()
const Empresas = (props) => {
    const modeloDependencia = ModeloDependencia()
    const {userData = userStructure, empresas = { array: [] },users = { array: [] }, pedirEmpresas = console.log, objStrings = objStringsInit, objCss = objCssInit, showed = 'centro rapido' } = props
    const [sectionFuntion, setSectionFuntion] = useState({
        state: false,
        function: ''
    })
    return (
        <>
            <div className={objCss.dashBoard.sectionOptionContainer}>
                {
                <>
                {
                    sectionFuntion.state ?
                        <>
                            <div className={objCss.dashBoard.sectionTitleLeft}>
                                <h1 > {`${sectionFuntion.function} ${showed}`} </h1>
                                <button onClick={(e) => { e.preventDefault(); setSectionFuntion({ ...sectionFuntion, state: false, function: '' }) }} className={objCss.dashBoard.backButton} ><span> Volver </span> ↩</button>
                            </div>
                            <FuntionsSelected empresas={empresas} users={users} objCss={objCss} objStrings={objStrings} showed={sectionFuntion} inShowed={showed} />


                        </>
                        :
                        <>
                            <h1 className={objCss.dashBoard.sectionTitle}>{showed} </h1>
                            <div className={objCss.dashBoard.sectionOptionRow}>
                                {
                                    modeloDependencia.map((key, i) => {
                                        return (
                                            <>
                                                <div onClick={(e) => { e.preventDefault(); pedirEmpresas(); setSectionFuntion({ ...sectionFuntion, state: true, function: key }) }} className={objCss.dashBoard.sectionOption}>
                                                    {`${key} ${showed}`}
                                                </div>
                                            </>
                                        )

                                    })
                                }

                            </div>
                        </>
                }
                </>
                }
            </div>
        </>
    )
}
export default Empresas