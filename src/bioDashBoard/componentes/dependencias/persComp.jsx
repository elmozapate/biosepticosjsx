import { ObjPermisos } from "@/bioApp/models/modelosPermisos"
import { ArraySelector } from "@/bioApp/models/modelosSelector"
import ModeloUsuario from "@/bioApp/models/modelosUsuario"
import StringsObj from "@/engine/content"
import StylesObj from "@/styles/stylesObj"
import { useEffect, useState } from "react"
import VisorInfoContactData from "./visorInfoContactData"
import VisorInfoPersonalData from "./visorInfoPersonalData"

const usuarioDefault = ModeloUsuario()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const PersComp = (props) => {
    const { actualizeData = console.log, activeUser = { selectOp: '', userInfo: usuarioDefault }, setActiveUser = console.log, permision = ObjPermisos, permisionArray = ArraySelector, objStrings = objStringsInit, objCss = objCssInit, selectioned = { active: false, inSelection: 'default' }, usersAll = { array: [] } } = props
    const [editData, setEditData] = useState({
        active: true,
    })
    const [inData, setInData] = useState({
        selected: '',
    })
    return (
        <>
            <button onClick={(e) => {
                e.preventDefault();
                setEditData({
                    ...editData,
                    active: !editData.active
                });
                !editData.active && actualizeData('permision')

            }}>
                {!editData.active ? <>SALVAR</> : <>EDITAR</>}
            </button>
            {inData.selected === '' ?
                <>
                    <div onClick={(e) => { e.preventDefault(); setInData({ ...inData, selected: 'personalData' }) }}>DATOS PERSONALES</div>
                    <div onClick={(e) => { e.preventDefault(); setInData({ ...inData, selected: 'contactData' }) }}>DATOS DE CONTACTO</div>
                </> :

                <>
                    <button onClick={(e) => { e.preventDefault(); setInData({ ...inData, selected: '' }) }}>REGRESAR</button>

                    {
                        inData.selected === 'personalData' && <><VisorInfoPersonalData actualizeData={actualizeData} setActiveUser={setActiveUser} activeUser={activeUser} objCss={objCss} objStrings={objStrings} /></>
                    }
                    {
                        inData.selected === 'contactData' && <><VisorInfoContactData actualizeData={actualizeData} setActiveUser={setActiveUser} activeUser={activeUser} objCss={objCss} objStrings={objStrings} /></>

                    }
                </>

            }
        </>
    )
    return (
        <>
            personalInfo
        </>
    )
}
export default PersComp