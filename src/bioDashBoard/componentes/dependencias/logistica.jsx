import StringsObj from "@/engine/content"
import StylesObj from "@/styles/stylesObj"
import { useState } from "react"
import FuntionsSelected from "./funtionsSelected"
import ModeloDependencia from "./modeloDependencia"

const objCssInit = StylesObj()
const objStringsInit = StringsObj()

const Logistica = (props) => {
    const modeloDependencia = ModeloDependencia()

    const { objStrings = objStringsInit, objCss = objCssInit, showed = 'centro rapido' } = props
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
                                <h1 > {`${sectionFuntion.function} usuarios de ${showed}`} </h1>
                                <button onClick={(e) => { e.preventDefault(); setSectionFuntion({ ...sectionFuntion, state: false, function: '' }) }}  className={objCss.dashBoard.backButton} ><span> Volver </span> ↩</button>
                            </div>
                            <FuntionsSelected objCss={objCss} objStrings={objStrings} inSection={showed} showed={sectionFuntion}/>


                        </>
                        :
                        <>
                            <h1 className={objCss.dashBoard.sectionTitle}>{showed} </h1>
                            <div className={objCss.dashBoard.sectionOptionRow}>
                                {
                                    modeloDependencia.map((key, i) => {
                                        return (
                                            <>
                                                <div onClick={(e) => { e.preventDefault(); setSectionFuntion({ ...sectionFuntion, state: true, function: key }) }} className={objCss.dashBoard.sectionOption}>
                                                    {`${key}  ${showed}`}
                                                </div>
                                            </>
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