export const AskBioseptico = (socket, props, res) => {
    socket.emit('bioSepticos', {
        'dataIn': props.data,
        actionTodo: "askBiosepticos",
        reqId: res
    });
}
export const CrearCalendarioReq = (socket, props, res) => {
    socket.emit('bioSepticos', {
        'dataIn': props.data,
        actionTodo: "crearAno",
        reqId: res
    });
}
export const CrearRutaDiariaReq = (socket, props, res) => {
    socket.emit('bioSepticos', {
        'dataIn': props.data,
        actionTodo: "crearRutasDiarias",
        reqId: res
    });
}
export const GetMisVehiculos = (socket, props, res) => {
    socket.emit('bioSepticos', {
        'dataIn': props.data,
        actionTodo: "askVehiculos",
        reqId: res
    });
}
