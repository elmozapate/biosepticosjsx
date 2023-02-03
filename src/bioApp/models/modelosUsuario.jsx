import { UserObj } from "@/engine/content"
import ObjDireccionFunt, { ObjDireccion } from "./modeloDireccion"
const userStructure = UserObj()

export const ObjContacto = {
    correoElectronico: '',
    telefonoPrincipal: Number(),
    telefonoSecundario: Number(),
    direccion: ObjDireccion,
}
export const ObjContactoFunt = (props = ObjContacto) => {
    return {
        correoElectronico: props.correoElectronico,
        telefonoPrincipal: props.telefonoPrincipal,
        telefonoSecundario: props.telefonoSecundario,
        direccion: ObjDireccionFunt(props.direccion),
    }
}
export const ObjDatosPersonales = {
    nombre: '',
    apellido: '',
    fechaDeNacimiento: new Date(),
    genero: '',
    nacionalidad: '',
    tipoDeDocumento: '',
    numeroDeDocumento: Number(),
}
export const ObjDatosPersonalesFunt = (props = ObjDatosPersonales) => {
    return {
        nombre: props.nombre,
        apellido: props.apellido,
        fechaDeNacimiento: props.fechaDeNacimiento,
        genero: props.genero,
        nacionalidad: props.nacionalidad,
        tipoDeDocumento: props.tipoDeDocumento,
        numeroDeDocumento: props.numeroDeDocumento
    }
}
export const ObjPermisions = {
    console: false,
    logistica: false,
    empresas: false,
    vendedores: false
}
export const ObjPermisionsFunt = (props = ObjPermisions) => {
    return {
        console: props.console,
        logistica: props.logistica,
        empresas: props.empresas,
        vendedores: props.vendedores
    }
}
export const ObjAppUser = {
    user: '',
    email: '',
    password: '',
    fechaDeCreacion: '',
    creadoPor: '',
    data: {
        personal: false,
        contacto: false,
    },
    permisions: ObjPermisions,
}
export const ObjAppUserFunt = (props = { nombre: '', email: '', password: '', creadoPor: '', permisions: ObjPermisions }) => {
    return {
        user: props.nombre,
        email: '',
        password: props.password,
        fechaDeCreacion: Date(),
        creadoPor: '',
        data: {
            personal: false,
            contacto: false,
        },
        permisions: props.permisions,
    }
}

const ModeloUsuario = (userStructureIn = userStructure) => {
    const userModel = {
        id: (userStructureIn.id).toString(),
        app: ObjAppUserFunt(userStructureIn),
        userObj: userStructureIn,
        datosPersonales: ObjDatosPersonales,
        datosContacto: ObjContacto,
        historial: []
    }
    return userModel
}
export default ModeloUsuario