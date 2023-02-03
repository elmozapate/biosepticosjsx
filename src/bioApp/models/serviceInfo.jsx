import ObjDireccion from "./modeloDireccion"
import ObjRutaIndividual from "./modeloRutaIndividual"
import ObjShedule from "./modeloShedule"
import { ObjVendedor } from "./modeloVendedor"
const TarjetaDeServicio = () => {
    const ObjServicio = {
        cliente: '',
        obra: '',
        tipoDeServicio: {},
        cantidaDeBanos: Number(),
        vendedor: ObjVendedor(),
        ruta: '',
        ubicacion: '',
        telefono: Number(),
        nombreContactoCliente: '',
        direccion: ObjDireccion(),
        shedule: ObjShedule(),
        encargadosDeRuta: ObjRutaIndividual(),
        novedades: [],
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
        asignado: {},
        solicitudes: []
    }

    return ObjServicio
}
export default TarjetaDeServicio
