import { UserObj } from "@/engine/content"
import MiddlewareSelector from "@/middleware/askSelector"
import { Socket } from "@/middleware/routes/connect/socket/socketOn"
import { useEffect, useState } from "react"
import { EstadosServiciosObj } from "../models/selectores"
const socket = Socket
let resId = 0
const RevisarMisEmpresas = (props) => {
    const { userData = UserObj(), misServiciosSort = EstadosServiciosObj, sortBy = console.log, misServicios = { array: [] } } = props
    const [misEmpresas, setMisEmpresas] = useState({ array: [] })

    const resMisEmpresas = () => {
        const res = MiddlewareSelector({
            ask: 'getMisEmpresasVendedor', id: userData.id
        })
        resId = res
    }
    useEffect(() => {
        socket.on("bioApp", (msg) => {
            const actionTodo = msg.actionTodo
            const Data = msg.dataIn
            switch (actionTodo) {
                case 'dataRes-askEmpresasVendedor':
                    if (parseInt(msg.resId) === parseInt(resId)) {
                        setMisEmpresas({ ...misEmpresas, array: msg.empresas })
                    }
                    break;
                default:
                    break;
            }
        })
    }, [])
    useEffect(() => {
        resMisEmpresas()
    }, [])
    return (
        <>

            <div className="service-list">

                {
                    misEmpresas.array.length > 0 ? <>
                        {misEmpresas.array.map((key, i) => {
                            return (
                                <>
                                    <p id={`safe-${i}`}><p className="p">id:</p>  <span>{` ${key.id.split('-')[1]}`}</span>    <p className="p">Nombre:</p>  <span>{key.contact.nombre}</span>      <p className="p">correoElectronico:</p>  <span>{key.contact.correoElectronico}</span> <p className="p">Cartera:</p>  <span>{key.legal.cartera.cartera}</span>   </p>
                                </>
                            )
                        })}</> : <>SIN CLIENTES</>
                }
            </div>
        </>
    )
}
export default RevisarMisEmpresas
