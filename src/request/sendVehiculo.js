export const SetVehiculo = (socket, props, res) => {
    socket.emit('bioSepticos', {
        'dataIn': props.data,
        actionTodo: "setNewVehiculo",
        reqId: res
    });
}
export const ActualizarEstadoVehiculo = (socket, props, res) => {
    socket.emit('bioSepticos', {
        'dataIn': props.data,
        actionTodo: "setVehiculo",
        reqId: res
    });
}
export const CrearRutaVehiculo = (socket, props, res) => {
    socket.emit('bioSepticos', {
        'dataIn': { rutas: props.data },
        actionTodo: "setNewVehiculoShedule",
        reqId: res
    });
}