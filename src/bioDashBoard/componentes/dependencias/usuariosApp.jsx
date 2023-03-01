import StringsObj, { UserObj } from "@/engine/content"
import StylesObj from "@/styles/stylesObj"
import { useState } from "react"
import FuntionsSelected from "./funtionsSelected"
import ModeloDependencia from "./modeloDependencia"

const objCssInit = StylesObj()
const objStringsInit = StringsObj()

const UsuariosApp = (props) => {
    const modeloDependencia = ModeloDependencia()

    const { setPopUp = console.log, userData = UserObj(),setReqState = console.log, reqState = { reqId: Number(), state: false, peticion: '', type: '', inList: [] }, usersAll = { array: [] }, users = { array: [] }, objStrings = objStringsInit, objCss = objCssInit, showed = 'centro rapido' } = props
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
                            <FuntionsSelected userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} usersAll={usersAll} users={users} objCss={objCss} objStrings={objStrings} showed={sectionFuntion} inShowed={showed} />
                        </>
                        :
                        <>
                            <div className={objCss.dashBoard.sectionOptionRow}>
                                <h1 className={objCss.dashBoard.sectionTitle}>{showed} </h1>
                                {
                                    modeloDependencia.map((key, i) => {
                                        return (
                                            <>
                                                <div key={`key-${(parseInt(Math.random() * 9999999999)).toString()}`} id={`idd-${i}`} onClick={(e) => { e.preventDefault(); setSectionFuntion({ ...sectionFuntion, state: true, function: key }) }} className={objCss.dashBoard.sectionOption}>
                                                    {`${key} ${showed}`}
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
export default UsuariosApp  