import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import { useState } from "react"
import { ArraySelector, ArraySection } from "../models/modelosSelector"
import CardView from "./cardView"
import { UserObj } from "@/engine/content"
import SideBar from "./sideBar"
import AppSideContainer from "./contenedorDedicado"
import DashMenu from "@/bioDashBoard/componentes/menu"
import SectionContainer from "@/bioDashBoard/componentes/sectionContainer"
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const Selector = (props) => {
    const {users={array:[]} , userData = userStructure, objStrings = objStringsInit, objCss = objCssInit, dashBoard = false } = props

    const [selectioned, setSelectioned] = useState(dashBoard?'centro rapido':'inicio')
    const [sideOpen, setSideOpen] = useState(false)
    return (
        <>
            {
                dashBoard ?
                    <>
                        <div className={selectioned === 'inicio' || selectioned === 'centro rapido' ? objCss.dashBoard.sectionContainer : objCss.dashBoard.sectionContainerLarge}>
                            <DashMenu users={users} showed={selectioned} willShow={setSelectioned} sideOpen={sideOpen} objCss={objCss} objStrings={objStrings} />
                            {ArraySection.map((key, i) => {
                                return (<>
                                    {selectioned === key /* || (selectioned === 'inicio' && key === 'centro rapido') */ &&
                                        <>
                                            {

                                                <SectionContainer users={users} sideOpen={sideOpen} objCss={objCss} objStrings={objStrings} showed={key} willShow={setSelectioned} />

                                            }
                                        </>
                                    }
                                </>)
                            })}
                        </div>
                    </>
                    :
                    <>  {
                        selectioned === 'inicio' ?
                            <div className={objCss.app.cardContainer}>
                                {ArraySelector.map((key, i) => {
                                    return (<>
                                        {
                                            <>
                                                {
                                                    userData.appPermisions[key] && key !== 'inicio' &&
                                                    <CardView objCss={objCss} objStrings={objStrings} showed={key} willShow={setSelectioned} />

                                                }
                                            </>
                                        }
                                    </>)
                                })}
                            </div> :
                            <>
                                <SideBar userData={userData} setSideOpen={setSideOpen} sideOpen={sideOpen} objCss={objCss} objStrings={objStrings} showed={selectioned} willShow={setSelectioned} />
                                <AppSideContainer users={users} sideOpen={sideOpen} objCss={objCss} objStrings={objStrings} showed={selectioned} />
                            </>

                    }
                    </>
            }
        </>
    )
}
export default Selector