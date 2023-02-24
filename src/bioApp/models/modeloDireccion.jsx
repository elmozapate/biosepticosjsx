export const ObjDireccion = {
    departamento: '',
    ciudad: '',
    barrio: '',
    primerNumDireccion: Number(),
    segundoNumDireccion: Number(),
    viaSelecionada: '',
    primerLetra: '',
    segundaLetra: '',
    numero: Number(),
    otros: '',
    tipoDeZona: '',
    telefono: Number(),
    letra: '',
    coordenadas: { lat: Number(), lng: Number() }

}
export const ObjDireccionFunt = (props = ObjDireccion) => {

    return ({
        departamento: props.departamento,
        ciudad: props.ciudad,
        barrio: props.barrio,
        primerNumDireccion: props.primerNumDireccion,
        segundoNumDireccion: props.segundoNumDireccion,
        viaSelecionada: props.viaSelecionada,
        primerLetra: props.primerLetra,
        segundaLetra: props.segundaLetra,
        numero: props.numero,
        otros: props.otros,
        tipoDeZona: props.tipoDeZona,
        telefono: props.telefono,
        letra: props.telefono,
        coordenadas: props.coordendas
    })
}
export default ObjDireccionFunt