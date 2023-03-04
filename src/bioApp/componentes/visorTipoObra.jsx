
import StylesObj from "@/styles/stylesObj"
import StringsObj from "@/engine/content"
import { useState } from "react"
import PersComp from "@/bioDashBoard/componentes/dependencias/persComp"
import ModeloUsuario from "../models/modelosUsuario"
const objCssInit = StylesObj()
const objStringsInit = StringsObj()
const VisorTipoObra = (props) => {
    const { userModel = ModeloUsuario, willShow = console.log, showed = [], objStrings = objStringsInit, objCss = objCssInit } = props
    const [inObra, setInObra] = useState({
        selected: '',
        action: '',
        data: {}
    })
    const [activeUser, setActiveUser] = useState({
        selectOp: '',
        userInfo: ModeloUsuario()
    })
    return (
        <>
            <div id={`idShow-${parseInt(Math.random() * 9999)}`} className='container-bio' onClick={(e) => {
                e.preventDefault(); willShow(showed)
            }}>

                {inObra.selected === '' ? <div className="dia">
                    <p className="centert flex-p-between">
                        <span className="treintraytres">{'Nombre'}</span>
                        <span className="treintraytres">{'contacto'}</span>
                        <span className="treintraytres">{'zona'}</span></p>

                    {showed.map((key, i) => {
                        return (
                            <>
                                <p className="centert flex-p-between ">
                                    <span className="treintraytres"><h2>{key.contact.obra}</h2> </span>
                                    <span className="treintraytres"  >
                                        <span>-{key.contact.nombre}</span>
                                        <span onClick={(e) => {
                                            e.preventDefault(); console.log(activeUser.userInfo.datosContacto.direccion, key);
                                            setActiveUser({
                                                ...activeUser,
                                                userInfo: {
                                                    ...activeUser.userInfo,
                                                    datosContacto: {
                                                        ...activeUser.userInfo.datosContacto,
                                                        ...key.contact,
                                                        direccion: {
                                                            ...activeUser.userInfo.datosContacto.direccion,
                                                            ...key.direccion
                                                        }
                                                    }
                                                }
                                            }); setInObra({
                                                ...inObra,
                                                selected: key.id, action: 'contact', data: key.contact
                                            })
                                        }} className="pointer">ver info</span>
                                    </span>
                                    <span className="treintraytres">
                                        <span>{key.direccion.ciudad}-{key.direccion.barrio}</span>
                                        <span onClick={(e) => {
                                            e.preventDefault();
                                            setActiveUser({
                                                ...activeUser,
                                                userInfo: {
                                                    ...activeUser.userInfo,
                                                    datosContacto: {
                                                        ...activeUser.userInfo.datosContacto,
                                                        direccion: {
                                                            ...activeUser.userInfo.datosContacto.direccion,
                                                            ...key.direccion

                                                        }
                                                    }
                                                }
                                            }); setInObra({
                                                ...inObra,
                                                selected: key.id, action: 'direccion', data: key.direccion
                                            })
                                        }} className="pointer">mas</span>
                                    </span>
                                </p>
                            </>
                        )
                    })}
                </div> : <>
                    {
                        inObra.action === 'contact' &&
                        <><h2> contacto obra {inObra.data.obra}</h2>
                            persona a cargo : {inObra.data.nombre}
                            <PersComp adress contact inselected={'contactData'} actualizeData={console.log} setActiveUser={console.log} activeUser={activeUser} permision={activeUser.userInfo.userObj.appPermisions} objCss={objCss} objStrings={objStrings} />
                        </>

                    }
                    {
                        inObra.action === 'direccion' &&
                        <><h2>direccion obra {inObra.data.obra}</h2>
                            <PersComp inselected={'contactData'} adress actualizeData={console.log} setActiveUser={console.log} activeUser={activeUser} permision={activeUser.userInfo.userObj.appPermisions} objCss={objCss} objStrings={objStrings} />
                        </>

                    }
                    <span onClick={(e) => {
                        e.preventDefault(), setInObra({
                            ...inObra,
                            selected: '', action: '', data: ''
                        })
                    }} className="pointer">volver</span>
                </>}

            </div>

        </>
    )
}
export default VisorTipoObra