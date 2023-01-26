import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import { useEffect, useState } from "react"
import Selector from "./selector"
import { UserObj } from "@/engine/content"
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const AppContainer = (props) => {
    const { pedirEmpresas = console.log, empresas = { array: [] }, users = { array: [] }, userData = userStructure, objStrings = objStringsInit, objCss = objCssInit, inUse = 'app' } = props
    const [startTransition, setStartTransition] = useState(false)
    useEffect(() => {
        setTimeout(() => {
            setStartTransition(true)
        }, 2000);
    }, [])
    return (
        <>
            {inUse === 'app' ?
                <>
                    <div className={objCss.app.main}>
                        {
                            startTransition ? <><Selector userData={userData} objCss={objCss} objStrings={objStrings} /></> : <> {objStrings.app.intro}</>
                        }

                    </div>
                </> :
                <div className={objCss.dashBoard.main}>
                    {
                        startTransition ? <><Selector pedirEmpresas={pedirEmpresas} empresas={empresas} users={users} userData={userData} objCss={objCss} objStrings={objStrings} dashBoard /></> : <> {objStrings.dashBoard.intro}</>
                    }

                </div>
            }

        </>
    )
}

export default AppContainer