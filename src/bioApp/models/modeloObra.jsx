import { ObjDireccion } from "./modeloDireccion"

export const HorarioObj = {
    lunes: { state: false, horario: {} },
    martes: { state: false, horario: {} },
    miercoles: { state: false, horario: {} },
    jueves: { state: false, horario: {} },
    viernes: { state: false, horario: {} },
    sabado: { state: false, horario: {} },
    domingo: { state: false, horario: {} },
}
export const ObraObj = () => {
    return {
        type: 'obra',
        id: '',
        nombre: '',
        dataRequired: true,
        fechaDeCreacion: new Date(),
        empresa: '',
        contact: {
            obra: '',
            nombre: '',
            cargo: '',
            avatar: {
                withPhoto: false,
                url: ''
            },
            correoElectronico: '',
            telefonoPrincipal: Number(),
            telefonoSecundario: Number(),
        },
        direccion: ObjDireccion,
        horarios: HorarioObj,
        historial: [],
        novedades: [],
        servicios: [],
        requerimientos: []
    }
}
export default ObraObj