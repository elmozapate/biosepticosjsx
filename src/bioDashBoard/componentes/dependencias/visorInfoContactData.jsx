import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import { UserObj } from "@/engine/content"
import { ArrayContactData, ArrayContactDataAdress, ArrayContactDataAdressStreet } from "@/bioApp/models/modelosSelector"
import ModeloUsuario from "@/bioApp/models/modelosUsuario"
import { useState } from "react"
import ContenedorMaps from "@/bioApp/componentes/contenedorMaps"
const usuarioDefault = ModeloUsuario()
const userStructure = UserObj()
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const VisorInfoContactData = (props) => {
    const { contact = false, adress = false, actualizeData = console.log, activeUser = { selectOp: '', userInfo: usuarioDefault }, setActiveUser = console.log, objStrings = objStringsInit, objCss = objCssInit, selectioned = { active: false, inSelection: 'default' }, usersAll = { array: [] } } = props
    const [inAdress, setInAdress] = useState({
        state: contact ? false : adress
    })
    const [confirmMyDirection, setconfirmMyDirection] = useState(false)

    const [inMaps, setinMaps] = useState(false)
    const [irPlace, setIrPlace] = useState({ state: false, go: false, coordenadas: { lat: 6.2476376, lng: -75.56581530000001 } })

    const llamarAl = (telefono) => {
        window.open(`tel:${telefono}`)
    }
    return (
        <>
            {!inAdress.state ? <>
                {!contact && <h1> INFORMACION DE CONTACTO</h1>}
                {activeUser.userInfo.app.dataRequired ?
                    <>
                        SIN INFORMACION
                        <button /* onClick={(e) => { e.preventDefault(); setInData({ ...inData, selected: 'contactData' }) }} */>LLENAR</button>

                    </>
                    :
                    <>
                        {ArrayContactData.map((key, i) => {
                            return (
                                <><p id={`pid-${i}`}>
                                    <span id={`pidspan-${i}`}>
                                        <span id={`pidspandos-${i}`}>   {key}  :</span>
                                        <span id={`pidspantres-${i}`}>   {activeUser.userInfo.datosContacto[key]}</span>
                                        {(key === 'telefonoPrincipal' || key === 'telefonoSecundario') && <span onClick={(e) => { e.preventDefault(); llamarAl(activeUser.userInfo.datosContacto[key]) }} className="pointer">llamar   </span>}
                                    </span>
                                </p></>
                            )
                        })}
                    </>
                }
                {!contact && <div onClick={(e) => { e.preventDefault(); setInAdress({ ...inAdress, state: true }) }}>
                    VER DIRECCION
                </div>}
            </>
                :
                <>
                    {!adress && <h1> INFORMACION DE CONTACTO-DIRECCION</h1>
                    }                    {activeUser.userInfo.app.dataRequired ?
                        <>
                            SIN INFORMACION
                            <button /* onClick={(e) => { e.preventDefault(); setInData({ ...inData, selected: 'contactData' }) }} */>LLENAR</button>

                        </>
                        :
                        <>
                            {
                                inMaps ? <>
                                    {!confirmMyDirection ?
                                        <>
                                            <ContenedorMaps setIrPlace={setIrPlace} irPlace={irPlace} inOperacion={{
                                                state: irPlace.state,
                                                inicio: irPlace.coordenadas,
                                                final: inAdress ? activeUser.userInfo.datosContacto.direccion.coordenadas : { lat: 6.2476376, lng: -75.56581530000001 }
                                            }} adressViewIn defaultLocation={activeUser.userInfo.datosContacto.direccion.coordenadas} />
                                            {adress && (irPlace.state) && irPlace.coordenadas !== { lat: 6.2476376, lng: -75.56581530000001 } && <>
                                                <span onClick={(e) => { e.preventDefault(); setconfirmMyDirection(true) }} className='pointer'>
                                                    CONFIRMAR MI UBICACION
                                                </span></>}
                                        </>
                                        :
                                        <>
                                            {adress && 
                                                <><ContenedorMaps adressViewIn defaultLocation={irPlace.coordenadas} />
                                                </>}
                                            <span onClick={(e) => { e.preventDefault(); setconfirmMyDirection(false) }} className='pointer'>
                                                AQUI ESTOY
                                            </span>
                                            <span onClick={(e) => { e.preventDefault(); setconfirmMyDirection(false) }} className='pointer'>
                                                AQUI NO ESTOY
                                            </span>
                                        </>}
                                    <br />
                                    <span onClick={(e) => { e.preventDefault(); setinMaps(false) }}> VOLVER</span>

                                </> :

                                    <>
                                        {ArrayContactDataAdress.map((key, i) => {
                                            return (
                                                <><p id={`pid-${i}`}>
                                                    <span id={`pidspan-${i}`}>
                                                        <span id={`pidspandos-${i}`}>   {key}  :</span>
                                                        <span id={`pidspantres-${i}`}>   {activeUser.userInfo.datosContacto.direccion[key]}</span>
                                                    </span>
                                                </p></>
                                            )
                                        })}
                                        <div className="flex-row">
                                            {ArrayContactDataAdressStreet.map((key, i) => {
                                                return (
                                                    <><p className="flex-row" id={`pid-${i}`}>
                                                        <span className="flex-row" id={`pidspan-${i}`}>
                                                            <span id={`pidspandos-${i}`}>   {key === 'numero' ? '# ' : key === 'viaSelecionada' ? '' : (key === 'numero' || key === 'letra' || key === 'primerLetra' || key === 'segundaLetra') ? ' ' : key === 'primerNumDireccion' ? ' # ' : ' - '}  </span>
                                                            <span id={`pidspantres-${i}`}>   {activeUser.userInfo.datosContacto.direccion[key]}</span>
                                                        </span>
                                                    </p></>
                                                )
                                            })}</div>
                                        <span onClick={(e) => { e.preventDefault(); setinMaps(true) }}>VER EN MAPS</span>
                                        <br />

                                    </>
                            }
                        </>
                    }


                    {!adress && <button onClick={(e) => { e.preventDefault(); setInAdress({ ...inAdress, state: false }) }}>REGRESAR</button>}

                </>}

        </>
    )
}
export default VisorInfoContactData