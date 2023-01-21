import { UserObj } from "@/engine/content"
import ObjDireccion from "./modeloDireccion"
const userStructure = UserObj()

export const ObjContacto = {
    correoElectronico: '',
    telefonoPrincipal: Number(),
    telefonoSecundario: Number(),
    direccion: ObjDireccion(),
}
export const ObjDatosPersonales = {
    nombre: '',
    apellido: '',
    fechaDeNacimiento: Number(),
    genero: '',
    nacionalidad: '',
    tipoDeDocumento: '',
    numeroDeDocumento: Number(),
}
export const ObjPermisions = {
    console: false,
    logistica: false,
    empresas: false,
    vendedores: false
}
export const ObjAppUser = {
    user: '',
    email: '',
    password: '',
    fechaDeCreacion: '',
    creadoPor: '',
    data:{
        personal:false,
        contacto:false,
    },
    permisions: ObjPermisions,
}


const ModeloUsuario = () => {
    const userModel = {
        id: Number(),
        app: ObjAppUser,
        userObj: userStructure,
        datosPersonales: ObjDatosPersonales,
        datosContacto: ObjContacto,
        historial: []
    }
    return userModel
}
export default ModeloUsuario