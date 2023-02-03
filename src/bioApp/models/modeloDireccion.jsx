export const ObjDireccion = {
    departamento: '',
    ciudad: '',
    barrio: '',
    calle: Number(),
    numeroCalle: Number(),
    carrera: Number(),
    numeroCarrera: Number(),
    transversal: Number(),
    numeroTransversal: Number(),
    diagonal: Number(),
    numeroDiagonal: Number(),
    otros: '',
    tipoDeZona: '',
    telefono: Number(),

}
export const ObjDireccionFunt = (props = ObjDireccion) => {

    return ({
        ciudad: props.ciudad,
        barrio: props.barrio,
        calle: props.calle,
        numeroCalle: props.numeroCalle,
        carrera: props.carrera,
        numeroCarrera: props.numeroCarrera,
        transversal: props.transversal,
        numeroTransversal: props.numeroTransversal,
        diagonal: props.diagonal,
        numeroDiagonal: props.numeroDiagonal,
        otros: props.otros,
        tipoDeZona: props.tipoDeZona,
        telefono: props.telefono

    })
}
export default ObjDireccionFunt