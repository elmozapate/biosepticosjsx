export const SetVehiculo = (socket, props, res) => {
    socket.emit('bioSepticos', {
        'dataIn': props.data,
        actionTodo: "setNewVehiculo",
        reqId: res
    });
}
