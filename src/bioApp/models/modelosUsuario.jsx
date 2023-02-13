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
    vendedores: false,
    bioseptico: false
}
export const ObjPermisionsFunt = (props = ObjPermisions) => {
    return {
        console: props.console,
        logistica: props.logistica,
        empresas: props.empresas,
        vendedores: props.vendedores,
        bioseptico: props.bioseptico
    }
}
export const ObjAppUser = {
    user: '',
    type: '',
    email: '',
    password: '',
    fechaDeCreacion: '',
    creadoPor: '',
    data: {
        personal: false,
        contacto: false,
    },
    relationed: {
        biosepticos: [],
        empresas: [],
        ventas: []
    },
    permisions: ObjPermisions,
}
export const ObjAppUserFunt = (props = { nombre: '', email: '', password: '', creadoPor: '', permisions: ObjPermisions }) => {
    return {
        user: props.nombre,
        email: '',
        type: '',
        password: props.password,
        fechaDeCreacion: Date(),
        creadoPor: '',
        data: {
            personal: false,
            contacto: false,
        },
        relationed: {
            biosepticos: [],
            empresas: [],
            ventas: [],
            obras: [],
            servicios: []
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
export const EmpresaObj = () => {
    return {
        type: 'empresa',
        id: '',
        dataRequired: true,
        contact: {
            nombre: '',
            sector: '',
            avatar: {
                withPhoto: false,
                url: ''
            },
            correoElectronico: '',
            telefonoPrincipal: Number(),
            telefonoSecundario: Number(),
            direccion: ObjDireccion,
        },
        legal: {
            fechaDeCreacion: new Date(),
            documento: '',
            representante: ModeloUsuario(),
            contratos: [],
            cartera: { maximo: 20000000, cartera: 0, historial: [] },
            vendedor: ''
        },
        servicios: [],
        obras: [],
        rutas: [],
        historial: [],
        novedades: [],
        personalLogistico: [],
        requerimientos: [],
        vendedores: []

    }
}
export default ModeloUsuario