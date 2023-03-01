import StylesObj from "@/styles/stylesObj"
import { PopUpObj, UserObj } from "@/engine/content";
import { useEffect } from "react";
import { Socket } from "@/middleware/routes/connect/socket/socketOn";
const socket = Socket
const objCssInit = StylesObj()
const ReqComponent = (props) => {
    const userStructure = UserObj()
    const { setReqState = console.log, reqState = { reqId: Number(), state: false, peticion: '', type: '', inList: [] }, objCss = objCssInit, userData = userStructure } = props
    useEffect(() => {

        socket.on("bioApp", (msg) => {
            const actionTodo = msg.actionTodo
            console.log(msg, reqState);
            switch (actionTodo) {
                case 'dataRes-peticion':
                    console.log(msg.resId, reqState);

                    if (parseInt(msg.resId) === parseInt(reqState.reqId)) {
                        let newValuesList = []
                        reqState.inList.map((key, i) => {
                            if (parseInt(msg.resId) === parseInt(key.id)) {
                            } else {
                                newValuesList.push(key)

                            }
                        })
                        setReqState({
                            ...reqState,
                            reqId: newValuesList.length > 0 ? newValuesList[0].id && newValuesList[0].id : Number(),
                            state: false,
                            peticion: newValuesList.length > 0 ? newValuesList[0].valor && newValuesList[0].valor : '',
                            inList: newValuesList
                        })
                    }
                    let newValuesList = []
                    reqState.inList.map((key, i) => {
                        if (parseInt(msg.resId) === parseInt(key.id) || msg.tipo === key.peticion || ((key.peticion === 'askEmpresas' || key.peticion === 'askCompanies') && (msg.tipo === 'askEmpresas' || msg.tipo === 'askCompanies')) || (key.peticion === 'askServicios' && parseInt(msg.resId) === 666)) {
                        } else {
                            newValuesList.push(key)

                        }
                    })
                    setReqState({
                        ...reqState,
                        reqId: newValuesList.length > 0 ? newValuesList[0].id && newValuesList[0].id : Number(),
                        state: newValuesList.length > 0 ? true : false,
                        peticion: newValuesList.length > 0 ? newValuesList[0].valor && newValuesList[0].valor : '',
                        inList: newValuesList
                    })
                    console.log(msg.resId, reqState);

                    break;
                case 'dataActualize':
                    setReqState({
                        ...reqState,
                        reqId: Number(),
                        state: false,
                        peticion: '',
                        inList: []
                    })
                    break;
                default:
                    break;
            }
        })
    }, [reqState])
    return (
        <>
            {
                reqState.state ?
                    <div /* onClick={(e) => { e.preventDefault(); const popNew = PopUpObj(); reqState.funtions.setPopUp(popNew) }} */
                        className={`${objCss.absoluteBox.main} zmayor`}>
                        <div className={objCss.absoluteBox.reqBox}>
                            <div className="flex-column">
                                <h1>
                                    CARGANDO INFORMACION
                                    <br />{reqState.peticion}
                                </h1>
                            </div>
                            {
                                reqState.type === 'acceptBox' &&
                                <>
                                    {
                                        reqState.peticion === 'newUser' &&
                                        <> <div className="no-transform">
                                            Este es el nombre de usuario : {reqState.data.nombre} <br />Esta es la clave temporal : {reqState.data.password} <br /> Porfavor guardar datos
                                        </div>
                                            <br />
                                            <button onClick={(e) => { e.preventDefault(); reqState.funtions.setPopUp(PopUpObj()) }}>ACEPTAR </button>
                                        </>
                                    }
                                    {
                                        reqState.peticion === 'permisionEdit' &&
                                        <>
                                            PERMISOS CAMBIADOOS CON EXITO
                                            <br />
                                            <button onClick={(e) => { e.preventDefault(); reqState.funtions.setPopUp(PopUpObj()) }}>ACEPTAR </button>
                                        </>
                                    }
                                </>
                            }
                        </div>

                    </div>
                    : <></>
            }
        </>
    )
}

export default ReqComponent