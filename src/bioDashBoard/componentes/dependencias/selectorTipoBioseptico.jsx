import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import { UserObj } from "@/engine/content"
import { ArraySelectorBiosepticos } from "@/bioApp/models/modelosSelector"
import { useState } from "react"
import FormularioAppUser from "../formularios/formularioUserApp"
import CardView from "@/bioApp/componentes/cardView"
import FormularioVehiculo from "../formularios/formularioVehiculo"
import ModeloUsuario from "@/bioApp/models/modelosUsuario"
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()

const SelectorTipoBioseptico = (props) => {

    const { userModel = ModeloUsuario(), userData = userStructure, setReqState = console.log, reqState = { reqId: Number(), state: false, peticion: '', type: ''  ,inList: [] }, setPopUp = console.log, objStrings = objStringsInit, objCss = objCssInit, willShow = console.log, inSection = 'inicio' } = props
    const [willShows, setWillShow] = useState('')
    return (
        <>

            {
                willShows === '' && ArraySelectorBiosepticos.map((key, i) => {
                    return (
                        <div>
                            <CardView willShow={setWillShow} objCss={objCss} objStrings={objStrings} showed={key} />
                        </div>
                    )
                })
            }
            <div className="flex-column">

                {
                    willShows !== '' && <><h1>CREAR {willShows}</h1></>
                }
                {
                    willShows === 'vehiculos' && <><FormularioVehiculo setWillShow={setWillShow} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} objStrings={objStrings} objCss={objCss} />{/* <FormularioAppUser objStrings={objStrings} objCss={objCss} /> */}</>
                }
                {
                    willShows === 'conductores' ? <FormularioAppUser setWillShow={setWillShow} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} inAsk={'newUser-Bio'} willShows={willShows} onlyAccess={[{ type: 'bioseptico', perms: {} }]} objStrings={objStrings} objCss={objCss} /> : <></>
                }
                {
                    willShows === 'auxiliares' ? <FormularioAppUser setWillShow={setWillShow} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} inAsk={'newUser-Bio'} willShows={willShows} onlyAccess={[{ type: 'bioseptico', perms: {} }]} objStrings={objStrings} objCss={objCss} /> : <></>
                }
                {
                    willShows === 'operativo' ? <FormularioAppUser setWillShow={setWillShow} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} inAsk={'newUser-Bio'} willShows={willShows} onlyAccess={[{ type: 'console', perms: {} }, { type: 'bioseptico', perms: {} }]} objStrings={objStrings} objCss={objCss} /> : <></>
                }
                {
                    willShows === 'administrativo' ? <FormularioAppUser setWillShow={setWillShow} userData={userData} setReqState={setReqState} reqState={reqState} setPopUp={setPopUp} inAsk={'newUser-Bio'} willShows={willShows} onlyAccess={[{ type: 'console', perms: {} }, { type: 'bioseptico', perms: {} }]} objStrings={objStrings} objCss={objCss} /> : <></>
                }
                {
                    willShows !== '' && <><button onClick={(e) => { e.preventDefault(); setWillShow('') }}>VOLVER</button></>
                }
            </div>

        </>
    )
}
export default SelectorTipoBioseptico