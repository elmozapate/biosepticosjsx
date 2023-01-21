const ObjSelector = () => {
    return ({
        inicio: true,
        clientes: false,
        servicios: false,
        vehiculos: false,
        personalLogistico: false,
        rutas: false,
        novedades: false,
        historial: false,
        requerimientos: false,
        vendedores: false,
    })
}
export const ArraySelector = [
    'inicio', 'clientes', 'servicios', 'vehiculos', 'personal logistico', 'rutas', 'novedades', 'historial', 'requerimientos', 'vendedores']
export const ArraySection = [
    'centro rapido', 'usuariosApp', 'empresas', 'bioSepticos', 'estadisticas']
export default ObjSelector