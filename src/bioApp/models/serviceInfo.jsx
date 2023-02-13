import ObjDireccion from "./modeloDireccion"
import ObraObj from "./modeloObra"
import ObjRutaIndividual from "./modeloRutaIndividual"
import ObjShedule from "./modeloShedule"
import ModeloUsuario from "./modelosUsuario"
import { ObjVendedor } from "./modeloVendedor"
const TarjetaDeServicio = () => {
    const ObjServicio = {
        cliente: '',
        obra: '',
        tipoDeServicio: { tipo: '', cantidad: Number(), valor: Number() },
        vendedor: ObjVendedor,
        ruta: '',
        empresa: '',
        shedule: ObjShedule(),
        encargadosDeRuta: ObjRutaIndividual(),
        novedades: [],
        historial: [],
        asignado: [],
        solicitudes: []
    }

    return ObjServicio
}
export const Interaccion = {
    horaDeLlegada: Date(),
    horaDeSalida: Date(),
    servicioEfectuado: '',
    servicioConpleto: false,
    responsableEnObra: {
        nombre: '',
        telefono: Number(),
        cargo: '',
        anotaciones: ''
    },
}
export default TarjetaDeServicio
