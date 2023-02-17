export const ModeloBiosepticos = {
    users: [],
    historial: [],
    novedades: [],
    rutas: [],
    rutasIndividuales: [],
    calendario: { ano: [] }
}
export const crearMesPlaneado = (año, nuMes, mes, semana) => {
    return {
        año: año,
        mes: nuMes,
        mesObj: mes,
        serviciosActivos: Number(),
        serviciosPendientes: Number(),
        serviciosRealizados: Number(),
        totalServicios: Number(),
        servicios: [],
        historial: [],
        novedades: []

    }
}