import ModeloUsuario from "@/bioApp/models/modelosUsuario";
import { UserObj } from "@/engine/content";
import { useState } from "react";
import GooglMapsComp from "./googleMaps";
import SelectComp from "./selector";

const InputCompAdress = (props) => {
    const { setAdressView = console.log, adressView = {}, personalObj = ModeloUsuario().datosContacto, id = '', required = false, funtions = console.log, classN = '', } = props
    const [selectedItem, setSelectedItem] = useState('')
    const [userData, setuserData] = useState({
        primerNumDireccion: Number(),
        segundoNumDireccion: Number(),
        viaSelecionada: selectedItem,
        primerLetra: '',
        segundaLetra: '',
        numero: Number(),
        letra: ''
    })
    const ingresarDatos = (e) => {
        e.preventDefault()
        const value = e.target.value
        const id = e.target.id
        setuserData({
            ...userData,
            [id]: value
        })
    }
    return (
        <>
            {
                <>

                    <SelectComp item={'SELECCIONE LA VIA PRINCIPAL'} funtions={(e) => {
                        e.preventDefault(); setSelectedItem(e.target.value); setuserData({
                            ...userData,
                            viaSelecionada: e.target.value
                        })
                    }} items={['calle', 'carrera', 'transversal', 'diagonal', 'avenida', 'autopista']} />
                    {selectedItem !== '' &&
                        <div className="min-w flex-row">

                            <div className="min-w flex-row">
                                <div className="min-w flex-row">

                                    <div className="min-w flex-row">
                                        {selectedItem}
                                        :
                                        <input
                                            
                                            max={1000}
                                            min={1}
                                            id={'numero'}
                                            type={'number'}
                                            className={'numeroDireccion'}
                                            placeholder={'#'}
                                            value={userData[id]}
                                            required={required}
                                            onChange={(e) => {
                                                e.preventDefault();
                                                ingresarDatos(e)
                                            }} />
                                        <div className="min-w flex-row">
                                            <input
                                                
                                                max={3}
                                                min={0}
                                                id={'letra'}
                                                type={'text'}
                                                className={'letraDireccion'}
                                                placeholder={'Letra'}
                                                value={userData[id]}
                                                required={required}
                                                onChange={(e) => {
                                                    e.preventDefault();
                                                    ingresarDatos(e)
                                                }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="min-w flex-row">
                                    #
                                    <input
                                        
                                        max={1000}
                                        min={1}
                                        id={'primerNumDireccion'}
                                        type={'number'}
                                        className={'numeroDireccion'}
                                        placeholder={'#'}
                                        value={userData[id]}
                                        required={required}
                                        onChange={(e) => {
                                            e.preventDefault();
                                            ingresarDatos(e)
                                        }} />
                                </div>
                                <div className="min-w flex-row">
                                    <input
                                        
                                        max={3}
                                        min={0}
                                        id={'primerLetra'}
                                        type={'text'}
                                        className={'letraDireccion'}
                                        placeholder={'Letra'}
                                        value={userData[id]}
                                        required={required}
                                        onChange={(e) => {
                                            e.preventDefault();
                                            ingresarDatos(e)
                                        }} />
                                </div>
                            </div>
                            -----
                            <div className="min-w flex-row">
                                <div className="min-w flex-row">
                                    <input
                                        
                                        max={1000}
                                        min={1}
                                        id={'segundoNumDireccion'}
                                        type={'number'}
                                        className={'numeroDireccion'}
                                        placeholder={'#'}
                                        value={userData[id]}
                                        required={required}
                                        onChange={(e) => {
                                            e.preventDefault();
                                            ingresarDatos(e)
                                        }} />
                                </div>
                                <div>
                                    <input
                                        
                                        max={3}
                                        min={0}
                                        id={'segundaLetra'}
                                        type={'text'}
                                        className={'letraDireccion'}
                                        placeholder={'letra'}
                                        value={userData[id]}
                                        required={required}
                                        onChange={(e) => {
                                            e.preventDefault();
                                            ingresarDatos(e)
                                        }} />
                                </div>
                            </div>
                        </div>}

                </>

            }
            <button onClick={(e) => { e.preventDefault(); funtions(userData) }}>BUSCAR EN MAPS</button>
            <GooglMapsComp soloAdress fullAdressSearch setAdressView={setAdressView} adressView={adressView} adressData={personalObj.direccion}/* setMapCenter={setMapCenter} */ />

        </>
    )
}
export default InputCompAdress