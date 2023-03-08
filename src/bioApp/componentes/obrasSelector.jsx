import { useEffect, useState } from "react"

const ObrasSelector = (props) => {
    const { showedClon = { inMap: false, array: [], order: [], maped: [] }, activeUser = {
        selectOp: '',
        userInfo: ModeloUsuario()
    }, setActiveUser = console.log, setInObra = console.log, inObra = {
        selected: '',
        action: '',
        data: {}
    } } = props
    const [isRecharging, setIsRecharging] = useState(false)
    useEffect(() => {
        setIsRecharging(true)
        setTimeout(() => {
            setIsRecharging(false)
        }, 10);
    }, [showedClon.maped])
    return (
        <>
            {!isRecharging && showedClon.array.map((key, i) => {
                return (
                    <>
                        <p className={showedClon.maped[i] === true ?"centert flex-p-between relative isReady":"centert flex-p-between relative"}>
                            {showedClon.inMap && <> {showedClon.maped[i] === true ? <div className="absolute-map"><div className="maped-true">✔</div></div> : <div className="absolute-map"><div className="maped-false">X</div></div>}</>}
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
        </>
    )
}
export default ObrasSelector