const ObjRutaIndividual = (vehiculo, equipo = { conductor: '', auxiliar: '' }, fecha = '', creador = '') => {
    return ({
        id: `rDVeh-${parseInt(Math.random() * 99999)}`,
        rutaDia: '',
        programada: false,
        estado: true,
        porgamadoPor: '',
        creadaPor: creador,
        vehiculo: vehiculo,
        encargados: { conductor: equipo.conductor, auxiliar: equipo.auxiliar },
        servicios: [],
        novedades: [],
        historial: [],
        interacciones: [],
        fecha: fecha
    })
}
export const ObjRutaDia = (fecha, idCreador) => {
    let dateToIn = new Date()
    dateToIn.setFullYear(2023)
    dateToIn.setMonth(fecha.mes)
    dateToIn.setDate(fecha.dia)
    return ({
        id: `ruta-${parseInt(Math.random() * 999999999)}`,
        servicios: [],
        obras: [],
        porgamadoPor: idCreador,
        rutas: [],
        zonas: [],
        historial: [],
        novedades: [],
        fechaDeCreacion: new Date(),
        fecha: dateToIn
    })
}
export const ObjRutaDiaIndividual = () => {
    return ({
        numeroRuta: Number(),
        id: '',
        servicios: [],
        obras: [],
        porgamadoPor: '',
        vehiculo: '',
        conductor: '',
        auxiliar: '',
        zonas: [],
        historial: [],
        novedades: [],
        interacciones: [],
        fecha: new Date()
    })
}
export default ObjRutaIndividual