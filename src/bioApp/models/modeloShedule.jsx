const ObjShedule = () => {
    return ({
        fechaDeInicio: '',
        fechaDeFinal: '',
        activo: false,
        estado: 'inactivo',
        diasPorSemana: 0,
        dias: ObjDias
    })
}
export const HorarioVehiculo = {
    lunes: { state: false, equipo: { conductor: '', auxiliar: '' }, ruta: '' },
    martes: { state: false, equipo: { conductor: '', auxiliar: '' }, ruta: '' },
    miercoles: { state: false, equipo: { conductor: '', auxiliar: '' }, ruta: '' },
    jueves: { state: false, equipo: { conductor: '', auxiliar: '' }, ruta: '' },
    viernes: { state: false, equipo: { conductor: '', auxiliar: '' }, ruta: '' },
    sabado: { state: false, equipo: { conductor: '', auxiliar: '' }, ruta: '' },
    domingo: { state: false, equipo: { conductor: '', auxiliar: '' }, ruta: '' },
}
export const ObjDias = {
    lunes: false,
    martes: false,
    miercoles: false,
    jueves: false,
    viernes: false,
    sabado: false
}
export default ObjShedule